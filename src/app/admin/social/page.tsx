"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import "./Social.css";

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
type Platform = "reddit" | "linkedin" | "instagram";

type PostResult = {
  success: boolean;
  url?: string;
  error?: string;
};

type Notification = {
  id: string;
  platform: Platform;
  type: "comment" | "message" | "mention" | "reply";
  author: string;
  text: string;
  link: string;
  timestamp: string;
  unread: boolean;
};

type NotifFilter = "all" | Platform;

/* ─────────────────────────────────────────────────────
   Platform config
───────────────────────────────────────────────────── */
const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "reddit", label: "Reddit" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
];

const PLATFORM_INITIALS: Record<Platform, string> = {
  reddit: "R",
  linkedin: "in",
  instagram: "IG",
};

/* ─────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ─────────────────────────────────────────────────────
   Post Form
───────────────────────────────────────────────────── */
function PostForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["reddit", "linkedin"]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState<Record<string, PostResult> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const removeFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadToFirebase = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("No file selected"));
      setUploading(true);
      const storageRef = ref(storage, `social-posts/${Date.now()}-${file.name}`);
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        "state_changed",
        (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        (err) => { setUploading(false); reject(err); },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setUploading(false);
          resolve(url);
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedPlatforms.length) return;

    setPosting(true);
    setResults(null);

    let imageUrl: string | undefined;

    try {
      if (file) {
        imageUrl = await uploadToFirebase();
      }

      const res = await fetch("/api/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl,
          platforms: selectedPlatforms,
          subreddit: subreddit.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResults(data);
    } catch (err) {
      setResults({ error: { success: false, error: err instanceof Error ? err.message : "Failed" } });
    } finally {
      setPosting(false);
    }
  };

  const isLoading = uploading || posting;
  const canSubmit = !!title.trim() && selectedPlatforms.length > 0 && !isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <div className="sf-field">
        <label className="sf-label">Title</label>
        <input
          className="sf-input"
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="sf-field">
        <label className="sf-label">Description</label>
        <textarea
          className="sf-textarea"
          placeholder="What do you want to share?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="sf-field">
        <label className="sf-label">Platforms</label>
        <div className="sf-platforms">
          {PLATFORMS.map((p) => {
            const checked = selectedPlatforms.includes(p.id);
            return (
              <label
                key={p.id}
                className={`sf-platform sf-platform--${p.id}${checked ? " sf-platform--checked" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePlatform(p.id)}
                />
                <span className="sf-platform__dot" />
                <span className="sf-platform__name">{p.label}</span>
                <span className="sf-platform__check" />
              </label>
            );
          })}
        </div>
      </div>

      {selectedPlatforms.includes("reddit") && (
        <div className="sf-field">
          <label className="sf-label">Subreddit</label>
          <input
            className="sf-input"
            type="text"
            placeholder="e.g. design (no r/)"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
          />
          <p className="sf-sub-note">Leave blank to use the default from your .env</p>
        </div>
      )}

      <div className="sf-field">
        <label className="sf-label">Media</label>
        {!preview ? (
          <div className="sf-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="sf-upload-icon">+</div>
            <p className="sf-upload-text">
              <strong>Click to upload</strong> or drag and drop
            </p>
          </div>
        ) : (
          <div className="sf-upload-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" />
            <button type="button" className="sf-upload-preview__remove" onClick={removeFile}>
              x
            </button>
          </div>
        )}
        {uploading && (
          <div className="sf-upload-progress">
            Uploading... {uploadProgress}%
            <div className="sf-upload-bar">
              <div className="sf-upload-bar__fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
        <p className="sf-note">
          Required for Instagram. Optional for Reddit and LinkedIn.
        </p>
      </div>

      <button type="submit" className="sf-submit" disabled={!canSubmit}>
        {uploading ? `Uploading... ${uploadProgress}%` : posting ? "Posting..." : "Post to selected platforms"}
      </button>

      {results && (
        <div className="sf-results">
          {Object.entries(results).map(([platform, result]) => (
            <div
              key={platform}
              className={`sf-result sf-result--${result.success ? "success" : "error"}`}
            >
              <span className="sf-result__icon">{result.success ? "✓" : "✕"}</span>
              <div className="sf-result__body">
                <span className="sf-result__platform">{platform}</span>
                {result.success ? (
                  <>
                    <p className="sf-result__msg">Posted successfully</p>
                    {result.url && (
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="sf-result__link">
                        View post
                      </a>
                    )}
                  </>
                ) : (
                  <p className="sf-result__msg">{result.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

/* ─────────────────────────────────────────────────────
   Notifications Panel
───────────────────────────────────────────────────── */
function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NotifFilter>("all");
  const [loaded, setLoaded] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/social/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setErrors(data.errors || {});
      setLoaded(true);
    } catch {
      setErrors({ fetch: "Could not reach notifications API" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const visible =
    filter === "all" ? notifications : notifications.filter((n) => n.platform === filter);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const TABS: { id: NotifFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "reddit", label: "Reddit" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
  ];

  return (
    <>
      <div className="social-card__head">
        <p className="social-card__title">
          Notifications
          {unreadCount > 0 && (
            <span className="sn-unread-badge">{unreadCount}</span>
          )}
        </p>
        <div className="sn-controls">
          <div className="sn-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`sn-tab${filter === t.id ? " sn-tab--active" : ""}`}
                onClick={() => setFilter(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button className="sn-refresh" onClick={fetchNotifications} disabled={loading}>
            {loading ? "..." : "Refresh"}
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="sn-error-list">
          {Object.entries(errors).map(([platform, msg]) => (
            <div key={platform} className="sn-error-item">
              <span>{platform}:</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      )}

      <div className="sn-list">
        {!loaded && loading && (
          <div className="sn-state">
            <div className="sn-state__icon">...</div>
            <p className="sn-state__title">Loading notifications</p>
          </div>
        )}

        {loaded && visible.length === 0 && (
          <div className="sn-state">
            <div className="sn-state__icon">0</div>
            <p className="sn-state__title">No notifications</p>
            <p className="sn-state__sub">
              {filter === "all"
                ? "Nothing in your inboxes right now."
                : `No activity on ${filter} yet.`}
            </p>
          </div>
        )}

        {visible.map((n) => (
          <a
            key={n.id}
            href={n.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`sn-item${n.unread ? " sn-item--unread" : ""}`}
          >
            <div className={`sn-item__avatar sn-item__avatar--${n.platform}`}>
              {PLATFORM_INITIALS[n.platform]}
            </div>
            <div className="sn-item__content">
              <div className="sn-item__meta">
                <span className="sn-item__author">{n.author}</span>
                <span className={`sn-item__type sn-item__type--${n.platform}`}>{n.type}</span>
                <span className="sn-item__time">{timeAgo(n.timestamp)}</span>
              </div>
              <p className="sn-item__text">{n.text}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────── */
export default function SocialAdminPage() {
  return (
    <div className="social-admin">
      <div className="social-admin__header">
        <h1 className="social-admin__title">Social Media</h1>
        <p className="social-admin__subtitle">
          Post to Reddit, LinkedIn, and Instagram from one place. View comments and messages below.
        </p>
      </div>

      <div className="social-admin__grid">
        <div className="social-card">
          <div className="social-card__head">
            <p className="social-card__title">New Post</p>
          </div>
          <div className="social-card__body">
            <PostForm />
          </div>
        </div>

        <div className="social-card">
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
}
