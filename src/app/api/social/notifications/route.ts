import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
export type SocialNotification = {
  id: string;
  platform: "reddit" | "linkedin" | "instagram";
  type: "comment" | "message" | "mention" | "reply";
  author: string;
  text: string;
  link: string;
  timestamp: string;
  unread: boolean;
};

/* ─────────────────────────────────────────────────────
   Auth guard
───────────────────────────────────────────────────── */
async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get("admin_session")?.value;
}

/* ─────────────────────────────────────────────────────
   Main handler
───────────────────────────────────────────────────── */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const errors: Record<string, string> = {};
  const notifications: SocialNotification[] = [];

  const [reddit, linkedin, instagram] = await Promise.allSettled([
    fetchRedditInbox(),
    fetchLinkedInComments(),
    fetchInstagramComments(),
  ]);

  if (reddit.status === "fulfilled") {
    notifications.push(...reddit.value);
  } else {
    errors.reddit = reddit.reason?.message || "Reddit fetch failed";
  }

  if (linkedin.status === "fulfilled") {
    notifications.push(...linkedin.value);
  } else {
    errors.linkedin = linkedin.reason?.message || "LinkedIn fetch failed";
  }

  if (instagram.status === "fulfilled") {
    notifications.push(...instagram.value);
  } else {
    errors.instagram = instagram.reason?.message || "Instagram fetch failed";
  }

  // Sort newest first
  notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return NextResponse.json({ notifications, errors });
}

/* ─────────────────────────────────────────────────────
   Reddit inbox
───────────────────────────────────────────────────── */
async function getRedditToken(): Promise<string> {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  const user = process.env.REDDIT_USERNAME;
  const pass = process.env.REDDIT_PASSWORD;

  if (!id || !secret || !user || !pass) throw new Error("Reddit credentials not configured");

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "NikolaAdmin/1.0",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: user,
      password: pass,
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Reddit auth failed");
  return data.access_token;
}

async function fetchRedditInbox(): Promise<SocialNotification[]> {
  const token = await getRedditToken();

  const res = await fetch("https://oauth.reddit.com/message/inbox?limit=30", {
    headers: {
      Authorization: `bearer ${token}`,
      "User-Agent": "NikolaAdmin/1.0",
    },
  });

  if (!res.ok) throw new Error(`Reddit inbox error: ${res.status}`);
  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.data?.children || []).map((item: any): SocialNotification => {
    const msg = item.data;
    const kind = item.kind; // t1 = comment, t4 = message

    let type: SocialNotification["type"] = "message";
    if (kind === "t1") type = msg.subject === "username mention" ? "mention" : "comment";

    const link =
      kind === "t1"
        ? `https://reddit.com${msg.context || ""}`
        : `https://reddit.com/message/messages/${msg.id}`;

    return {
      id: `reddit-${msg.id}`,
      platform: "reddit",
      type,
      author: msg.author || "[deleted]",
      text: (msg.body || "").slice(0, 300),
      link,
      timestamp: new Date(msg.created_utc * 1000).toISOString(),
      unread: !!msg.new,
    };
  });
}

/* ─────────────────────────────────────────────────────
   LinkedIn comments on recent posts
───────────────────────────────────────────────────── */
async function fetchLinkedInComments(): Promise<SocialNotification[]> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const personId = process.env.LINKEDIN_PERSON_ID;
  if (!token || !personId) throw new Error("LinkedIn credentials not configured");

  const author = encodeURIComponent(`urn:li:person:${personId}`);

  // Fetch recent posts by this person
  const postsRes = await fetch(
    `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${author})&count=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }
  );

  if (!postsRes.ok) throw new Error(`LinkedIn posts error: ${postsRes.status}`);
  const postsData = await postsRes.json();
  const posts: { id: string }[] = postsData?.elements || [];

  const notifications: SocialNotification[] = [];

  for (const post of posts.slice(0, 3)) {
    const postUrn = encodeURIComponent(post.id);
    const commentsRes = await fetch(
      `https://api.linkedin.com/v2/socialActions/${postUrn}/comments?count=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );
    if (!commentsRes.ok) continue;
    const commentsData = await commentsRes.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const comment of commentsData?.elements || [] as any[]) {
      notifications.push({
        id: `linkedin-${comment.id}`,
        platform: "linkedin",
        type: "comment",
        author: comment.actor ? comment.actor.split(":").pop() : "LinkedIn User",
        text: (comment.message?.text || "").slice(0, 300),
        link: `https://www.linkedin.com/feed/update/${post.id}`,
        timestamp: new Date(comment.created?.time || Date.now()).toISOString(),
        unread: false,
      });
    }
  }

  return notifications;
}

/* ─────────────────────────────────────────────────────
   Instagram comments on recent media
───────────────────────────────────────────────────── */
async function fetchInstagramComments(): Promise<SocialNotification[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) throw new Error("Instagram credentials not configured");

  const res = await fetch(
    `https://graph.instagram.com/v19.0/${userId}/media` +
      `?fields=id,permalink,timestamp,comments{id,text,username,timestamp}` +
      `&limit=10&access_token=${token}`
  );

  if (!res.ok) throw new Error(`Instagram media error: ${res.status}`);
  const data = await res.json();
  const notifications: SocialNotification[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const media of data?.data || [] as any[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const comment of media?.comments?.data || [] as any[]) {
      notifications.push({
        id: `instagram-${comment.id}`,
        platform: "instagram",
        type: "comment",
        author: comment.username || "Instagram User",
        text: (comment.text || "").slice(0, 300),
        link: media.permalink || `https://instagram.com`,
        timestamp: comment.timestamp || media.timestamp,
        unread: false,
      });
    }
  }

  return notifications;
}
