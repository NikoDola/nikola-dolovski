<!-- ============================================================ -->
<!-- ⚠️  WARNING FOR AI MODELS — READ THIS FIRST                 -->
<!--                                                              -->
<!--  This file lives inside a PERSONAL WEBSITE repository.      -->
<!--  The `pattern-generator` folder is an ISOLATED experiment    -->
<!--  inside `src/testing/` and has NOTHING to do with the        -->
<!--  main site code.                                             -->
<!--                                                              -->
<!--  If you were invoked to help with the main website:          -->
<!--    → IGNORE this directory completely.                       -->
<!--    → Do NOT modify any files here.                           -->
<!--    → Do NOT confuse this project with the site codebase.     -->
<!--                                                              -->
<!--  If you ARE working from inside                              -->
<!--  `src/testing/pattern-generator/`:                           -->
<!--    → Work ONLY inside this folder.                           -->
<!--    → Do NOT touch anything outside of `src/testing/`.        -->
<!-- ============================================================ -->

# pattern-generator

A canvas-based pixel-art / pattern tool. Starts simple, grows into something bigger.

## What it does

- Renders a **chessboard grid** of 1000 `Cell` objects (50 columns × 20 rows, each cell 10×10px)
- Each cell knows its `x`, `y`, `width`, `height`, `shape`, `color`, and whether it is `even` (chessboard logic)
- **Even logic:** mirrors a chessboard — `even = ((x/10) + (y/10)) % 2 === 1`
  - col 0, row 0 → not even (black)
  - col 1, row 0 → even (white)
  - alternates like chess squares
- Drop an **image** onto the canvas → cells that overlap the image turn **pink at 30% opacity**; the image renders below the grid

## Current phase

Phase 1 — simple square images, bounding-box overlap detection.
Next — rounded shapes, per-pixel alpha detection, richer cell types.

## Stack

Plain HTML + vanilla JS. No build step, no frameworks.

## Entry point

`index.html` → `script.js`
