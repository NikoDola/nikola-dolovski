// ─────────────────────────────────────────────────────────────────────────────
// Transform helpers
// ─────────────────────────────────────────────────────────────────────────────

// Local space → world space (rotate around cx, cy)
function toWorld(lx, ly, cx, cy, rot) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return { x: cx + lx * c - ly * s, y: cy + lx * s + ly * c };
}

// World space → local space (inverse rotate around cx, cy)
function toLocal(wx, wy, cx, cy, rot) {
  const dx = wx - cx, dy = wy - cy;
  const c = Math.cos(rot), s = Math.sin(rot);
  return { x: dx * c + dy * s, y: -dx * s + dy * c };
}


// ─────────────────────────────────────────────────────────────────────────────
// Cell
// One square on the chessboard grid.
// ─────────────────────────────────────────────────────────────────────────────
class Cell {
  constructor(x, y) {
    this.x      = x;
    this.y      = y;
    this.width  = 10;
    this.height = 10;
    this.shape  = 'square';

    // Chessboard even / not-even rule:
    //   col index = x / 10,  row index = y / 10
    //   even = (col + row) % 2 === 1
    //   → x=0  y=0  : col 0 + row 0 = 0  → not even (black)
    //   → x=10 y=0  : col 1 + row 0 = 1  → even     (white)
    //   → x=0  y=10 : col 0 + row 1 = 1  → even     (white)
    this.even  = ((x / 10) + (y / 10)) % 2 === 1;
    this.color = this.even ? '#ffffff' : '#000000';

    this.active = false; // true when a dropped image overlaps this cell
  }

  // Axis-aligned bounding box overlap (used for phase-1 square images)
  overlaps(rx, ry, rw, rh) {
    return (
      this.x < rx + rw && this.x + this.width  > rx &&
      this.y < ry + rh && this.y + this.height > ry
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// Handle definitions
//   mx, my : multipliers in [-1, 0, 1] — local half-size coordinates
// ─────────────────────────────────────────────────────────────────────────────
const HANDLE_DEFS = [
  { id: 'nw', mx: -1, my: -1, type: 'corner' },
  { id: 'ne', mx:  1, my: -1, type: 'corner' },
  { id: 'se', mx:  1, my:  1, type: 'corner' },
  { id: 'sw', mx: -1, my:  1, type: 'corner' },
  { id: 'n',  mx:  0, my: -1, type: 'edge'   },
  { id: 's',  mx:  0, my:  1, type: 'edge'   },
  { id: 'e',  mx:  1, my:  0, type: 'edge'   },
  { id: 'w',  mx: -1, my:  0, type: 'edge'   },
];

// Which handle is anchored (fixed) when stretching an edge
const STRETCH_ANCHOR = { n: 's', s: 'n', e: 'w', w: 'e' };

const HANDLE_SIZE = 8;       // visual square size (px)
const HANDLE_HIT  = 7;       // hit radius (px)


// ─────────────────────────────────────────────────────────────────────────────
// PatternGrid
// ─────────────────────────────────────────────────────────────────────────────
class PatternGrid {
  constructor(canvasId, cols = 50, rows = 20) {
    this.cols = cols;           // 50 × 20 = 1000 cells
    this.rows = rows;

    this.canvas = document.getElementById(canvasId);
    this.ctx    = this.canvas.getContext('2d');

    this.cells          = [];
    this.droppedImage   = null;
    this.imageTransform = null;  // { cx, cy, width, height, rotation }
    this.selected       = false;
    this.interaction    = null;  // active drag state

    // Track modifier keys manually — e.altKey is unreliable on Windows
    // because pressing Alt alone can steal browser focus before mousedown.
    this.keys = { alt: false, shift: false };

    this._buildCells();
    this._initDrop();
    this._initMouse();
    this._initKeyboard();
    this.render();

    console.log(`PatternGrid ready — ${this.cells.length} cells (${cols}×${rows})`);
  }


  // ── Build cells ─────────────────────────────────────────────────────────────

  _buildCells() {
    for (let row = 0; row < this.rows; row++)
      for (let col = 0; col < this.cols; col++)
        this.cells.push(new Cell(col * 10, row * 10));
  }


  // ── Image drop ──────────────────────────────────────────────────────────────

  _initDrop() {
    const wrapper = this.canvas.parentElement;

    wrapper.addEventListener('dragover', e => {
      e.preventDefault();
      wrapper.classList.add('drag-over');
    });

    wrapper.addEventListener('dragleave', () => {
      wrapper.classList.remove('drag-over');
    });

    wrapper.addEventListener('drop', e => {
      e.preventDefault();
      wrapper.classList.remove('drag-over');

      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;

      const cr    = this.canvas.getBoundingClientRect();
      const dropX = e.clientX - cr.left;
      const dropY = e.clientY - cr.top;

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        // Auto-fit: scale down to 80% of canvas if the image is too large.
        // This keeps handles reachable within the canvas viewport.
        const maxW = this.canvas.width  * 0.8;
        const maxH = this.canvas.height * 0.8;
        let w = img.naturalWidth  || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxW || h > maxH) {
          const scale = Math.min(maxW / w, maxH / h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        this.droppedImage   = img;
        this.imageTransform = {
          cx:       dropX,
          cy:       dropY,
          width:    w,
          height:   h,
          rotation: 0,
        };
        this.selected = true;
        this._detectOverlap();
        this.render();
        URL.revokeObjectURL(url);
      };

      img.src = url;
    });
  }


  // ── Mouse ───────────────────────────────────────────────────────────────────
  // Uses Pointer Events + setPointerCapture so that pointermove/pointerup
  // are always delivered to the canvas for the full duration of a drag,
  // even when the pointer moves outside the canvas bounds.

  _initMouse() {
    this.canvas.addEventListener('pointerdown', e => {
      e.preventDefault();
      this.canvas.setPointerCapture(e.pointerId); // guarantee we receive all move/up
      this._onMouseDown(e);
    });

    this.canvas.addEventListener('pointermove', e => {
      if (this.interaction) {
        this._onMouseMove(e);
      } else {
        this._updateCursor(e);
      }
    });

    this.canvas.addEventListener('pointerup', e => {
      this.canvas.releasePointerCapture(e.pointerId);
      this._onMouseUp(e);
    });

    this.canvas.addEventListener('pointercancel', () => {
      this.interaction = null;
    });
  }

  // Coordinates relative to canvas top-left
  _mouse(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // ── Handle positions (world space) ──────────────────────────────────────────

  _handlePositions() {
    if (!this.imageTransform) return [];
    const { cx, cy, width: w, height: h, rotation: rot } = this.imageTransform;
    return HANDLE_DEFS.map(def => {
      const p = toWorld(def.mx * w / 2, def.my * h / 2, cx, cy, rot);
      return { ...def, x: p.x, y: p.y };
    });
  }

  _hitHandle(mx, my) {
    return this._handlePositions().find(
      h => Math.abs(mx - h.x) <= HANDLE_HIT && Math.abs(my - h.y) <= HANDLE_HIT
    ) ?? null;
  }

  _hitImage(mx, my) {
    if (!this.imageTransform) return false;
    const { cx, cy, width: w, height: h, rotation } = this.imageTransform;
    const l = toLocal(mx, my, cx, cy, rotation);
    return l.x >= -w / 2 && l.x <= w / 2 && l.y >= -h / 2 && l.y <= h / 2;
  }


  // ── mousedown ───────────────────────────────────────────────────────────────

  _onMouseDown(e) {
    if (!this.imageTransform) return;
    e.preventDefault(); // stop Alt from triggering browser menu
    const { x: mx, y: my } = this._mouse(e);
    const t    = this.imageTransform;
    const snap = { ...t };

    // ── Handles — only when image is already selected (handles are visible) ──
    // Bug fix: without this guard, clicking on an unselected image near a
    // theoretical handle position would start rotate/stretch instead of move.
    if (this.selected) {
      const handle = this._hitHandle(mx, my);

      if (handle) {
        if (handle.type === 'corner' && this.keys.alt && this.keys.shift) {
          // ── Scale proportionally from center (Alt + Shift + corner) ────────
          // Compute the handle's outward direction from center so we can
          // project mouse movement onto it — gives Illustrator-like feel.
          const hw = toWorld(handle.mx * t.width / 2, handle.my * t.height / 2, t.cx, t.cy, t.rotation);
          const dx = hw.x - t.cx, dy = hw.y - t.cy;
          const startDist = Math.hypot(dx, dy);
          this.interaction = {
            type:           'scale-center',
            startTransform: snap,
            startDist,
            dirX: startDist > 0 ? dx / startDist : 1,  // normalized outward dir
            dirY: startDist > 0 ? dy / startDist : 0,
          };

        } else if (handle.type === 'corner') {
          // ── Rotate ─────────────────────────────────────────────────────────
          this.interaction = {
            type:           'rotate',
            startTransform: snap,
            startAngle:     Math.atan2(my - t.cy, mx - t.cx),
          };

        } else {
          // ── Stretch edge ───────────────────────────────────────────────────
          const anchorDef = HANDLE_DEFS.find(d => d.id === STRETCH_ANCHOR[handle.id]);
          const anchor    = toWorld(
            anchorDef.mx * t.width  / 2,
            anchorDef.my * t.height / 2,
            t.cx, t.cy, t.rotation
          );
          this.interaction = {
            type:           'stretch',
            handle,
            startTransform: snap,
            anchor,
          };
        }
        return;
      }
    }

    // ── Move — click anywhere on the image body ──────────────────────────────
    // Works whether selected or not; also selects the image on first click.
    if (this._hitImage(mx, my)) {
      this.interaction = {
        type:    'move',
        startMx: mx, startMy: my,
        startCx: t.cx, startCy: t.cy,
      };
      this.selected = true;
      return;
    }

    // Click outside → deselect
    this.selected = false;
    this.render();
  }


  // ── mousemove ───────────────────────────────────────────────────────────────

  _onMouseMove(e) {
    if (!this.interaction || !this.imageTransform) return;
    const { x: mx, y: my } = this._mouse(e);
    const ia = this.interaction;
    const t  = this.imageTransform;
    const s  = ia.startTransform;

    switch (ia.type) {

      // ── Move ─────────────────────────────────────────────────────────────
      case 'move':
        t.cx = s.cx + (mx - ia.startMx);
        t.cy = s.cy + (my - ia.startMy);
        break;

      // ── Rotate ───────────────────────────────────────────────────────────
      case 'rotate': {
        const angle = Math.atan2(my - s.cy, mx - s.cx);
        t.rotation  = s.rotation + (angle - ia.startAngle);
        break;
      }

      // ── Scale from center (Alt + Shift) ──────────────────────────────────
      // Project mouse onto the handle's outward direction from center.
      // This means only movement away-from/toward the center matters,
      // not sideways drift — matches Illustrator behaviour.
      case 'scale-center': {
        const projected = (mx - s.cx) * ia.dirX + (my - s.cy) * ia.dirY;
        const factor    = ia.startDist > 0 ? projected / ia.startDist : 1;
        if (factor <= 0) break;  // don't allow zero or negative size
        t.width    = Math.max(10, s.width  * factor);
        t.height   = Math.max(10, s.height * factor);
        t.cx       = s.cx;   // center is pinned — this is the "in place" part
        t.cy       = s.cy;
        t.rotation = s.rotation;
        break;
      }

      // ── Stretch edge ─────────────────────────────────────────────────────
      // Maths:
      //   anchor = fixed opposite edge center (world space, recorded on mousedown)
      //   mouse  = new moving edge position
      //   project (mouse - anchor) onto the relevant local axis to get edge distance
      //   new size = |projection|, new center = midpoint(anchor, new_edge_world)
      //   rotation is preserved from start — only size & center change
      case 'stretch': {
        const { handle, anchor } = ia;
        const rot = s.rotation;
        const c   = Math.cos(rot), sn = Math.sin(rot);
        const dx  = mx - anchor.x,  dy = my - anchor.y;

        if (handle.id === 'n' || handle.id === 's') {
          // Project onto local Y axis direction in world: (-sin, cos)
          const proj = -dx * sn + dy * c;
          t.height   = Math.max(10, Math.abs(proj));
          // World position of the moving edge: anchor + localY_dir * proj
          const ex   = anchor.x - sn * proj;
          const ey   = anchor.y + c  * proj;
          t.cx       = (anchor.x + ex) / 2;
          t.cy       = (anchor.y + ey) / 2;

        } else {
          // Project onto local X axis direction in world: (cos, sin)
          const proj = dx * c + dy * sn;
          t.width    = Math.max(10, Math.abs(proj));
          const ex   = anchor.x + c  * proj;
          const ey   = anchor.y + sn * proj;
          t.cx       = (anchor.x + ex) / 2;
          t.cy       = (anchor.y + ey) / 2;
        }

        t.rotation = rot;  // stretch never changes rotation
        break;
      }
    }

    this._detectOverlap();
    this.render();
  }


  // ── mouseup ─────────────────────────────────────────────────────────────────

  _onMouseUp() {
    this.interaction = null;
  }


  // ── Cursor ──────────────────────────────────────────────────────────────────

  _updateCursor(e) {
    if (!this.selected || this.interaction) return;
    const { x: mx, y: my } = this._mouse(e);
    const handle = this._hitHandle(mx, my);

    if (handle) {
      const edgeCursors = { n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize' };
      this.canvas.style.cursor = handle.type === 'corner'
        ? 'crosshair'               // rotate cursor (closest CSS option)
        : edgeCursors[handle.id];
    } else if (this._hitImage(mx, my)) {
      this.canvas.style.cursor = 'move';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }


  // ── Keyboard ────────────────────────────────────────────────────────────────

  _initKeyboard() {
    window.addEventListener('keydown', e => {
      // Track modifiers manually so mousedown always sees the right state
      if (e.key === 'Alt')   { this.keys.alt   = true; e.preventDefault(); }
      if (e.key === 'Shift') { this.keys.shift  = true; }

      if (e.key.toLowerCase() === 'v') {
        this.selected = !!this.imageTransform;
        this.render();
      }
      if (e.key === 'Escape') {
        this.selected = false;
        this.canvas.style.cursor = 'default';
        this.render();
      }
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Alt')   this.keys.alt   = false;
      if (e.key === 'Shift') this.keys.shift  = false;
    });

    // Safety: clear modifiers if window loses focus (e.g. alt-tab)
    window.addEventListener('blur', () => {
      this.keys.alt   = false;
      this.keys.shift = false;
    });
  }


  // ── Overlap detection ───────────────────────────────────────────────────────

  _detectOverlap() {
    if (!this.imageTransform) return;
    const { x, y, w, h } = this._imageAABB();
    for (const cell of this.cells) cell.active = cell.overlaps(x, y, w, h);
  }

  // Axis-aligned bounding box of the (possibly rotated) image rect
  // Used for cell overlap — good enough for phase 1 square images
  _imageAABB() {
    const { cx, cy, width, height, rotation } = this.imageTransform;
    const c  = Math.abs(Math.cos(rotation));
    const s  = Math.abs(Math.sin(rotation));
    const hw = (width * c + height * s) / 2;
    const hh = (width * s + height * c) / 2;
    return { x: cx - hw, y: cy - hh, w: hw * 2, h: hh * 2 };
  }


  // ── Render ──────────────────────────────────────────────────────────────────

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Layer 1 — image (bottom)
    if (this.droppedImage && this.imageTransform) {
      const { cx, cy, width, height, rotation } = this.imageTransform;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.drawImage(this.droppedImage, -width / 2, -height / 2, width, height);
      ctx.restore();
    }

    // Layer 2 — cells
    //   active cells → pink 30% (image shows through)
    //   inactive     → solid black / white
    for (const cell of this.cells) {
      ctx.fillStyle = cell.active ? 'rgba(255,105,180,0.3)' : cell.color;
      ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
    }

    // Layer 3 — transform handles (top)
    if (this.selected && this.imageTransform) {
      this._drawHandles();
    }
  }

  _drawHandles() {
    const ctx     = this.ctx;
    const handles = this._handlePositions();
    const corners = handles.filter(h => h.type === 'corner');

    // Dashed bounding box
    ctx.beginPath();
    corners.forEach((h, i) => i === 0 ? ctx.moveTo(h.x, h.y) : ctx.lineTo(h.x, h.y));
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Handle squares
    const hs = HANDLE_SIZE / 2;
    for (const h of handles) {
      ctx.fillStyle   = '#ffffff';
      ctx.strokeStyle = '#444';
      ctx.lineWidth   = 1;
      ctx.fillRect(  h.x - hs, h.y - hs, HANDLE_SIZE, HANDLE_SIZE);
      ctx.strokeRect(h.x - hs, h.y - hs, HANDLE_SIZE, HANDLE_SIZE);
    }
  }
}


// ── Init ──────────────────────────────────────────────────────────────────────
const grid = new PatternGrid('grid');
