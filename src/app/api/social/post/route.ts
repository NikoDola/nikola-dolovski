import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
type PlatformResult = {
  success: boolean;
  url?: string;
  error?: string;
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
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, imageUrl, platforms, subreddit } = body as {
    title: string;
    description: string;
    imageUrl?: string;
    platforms: string[];
    subreddit?: string;
  };

  if (!title || !platforms?.length) {
    return NextResponse.json({ error: "Title and at least one platform required" }, { status: 400 });
  }

  const results: Record<string, PlatformResult> = {};

  const tasks: Promise<void>[] = [];

  if (platforms.includes("reddit")) {
    tasks.push(
      postToReddit(title, description, imageUrl, subreddit).then((r) => { results.reddit = r; })
    );
  }
  if (platforms.includes("linkedin")) {
    tasks.push(
      postToLinkedIn(title, description, imageUrl).then((r) => { results.linkedin = r; })
    );
  }
  if (platforms.includes("instagram")) {
    tasks.push(
      postToInstagram(title, description, imageUrl).then((r) => { results.instagram = r; })
    );
  }

  await Promise.allSettled(tasks);

  return NextResponse.json(results);
}

/* ─────────────────────────────────────────────────────
   Reddit
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
  if (!data.access_token) throw new Error(`Reddit auth failed: ${data.error || "unknown"}`);
  return data.access_token;
}

async function postToReddit(
  title: string,
  description: string,
  imageUrl?: string,
  subreddit?: string
): Promise<PlatformResult> {
  try {
    const token = await getRedditToken();
    const sr = subreddit || process.env.REDDIT_DEFAULT_SUBREDDIT;
    if (!sr) throw new Error("No subreddit specified");

    const params: Record<string, string> = {
      sr,
      title,
      api_type: "json",
      resubmit: "true",
      nsfw: "false",
      spoiler: "false",
    };

    if (imageUrl) {
      // Post as link — Reddit auto-renders image thumbnails for direct image URLs
      params.kind = "link";
      params.url = imageUrl;
    } else {
      params.kind = "self";
      params.text = description;
    }

    const res = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "User-Agent": "NikolaAdmin/1.0",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    const data = await res.json();
    const errors = data?.json?.errors;
    if (errors?.length) throw new Error(errors.map((e: string[]) => e[1]).join(", "));

    const postUrl = data?.json?.data?.url;
    if (!postUrl) throw new Error("No post URL returned");

    return { success: true, url: postUrl };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to post to Reddit" };
  }
}

/* ─────────────────────────────────────────────────────
   LinkedIn
───────────────────────────────────────────────────── */
async function postToLinkedIn(
  title: string,
  description: string,
  imageUrl?: string
): Promise<PlatformResult> {
  try {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    const personId = process.env.LINKEDIN_PERSON_ID;
    if (!token || !personId) throw new Error("LinkedIn credentials not configured");

    const personUrn = `urn:li:person:${personId}`;
    const text = description ? `${title}\n\n${description}` : title;
    let postBody: Record<string, unknown>;

    if (imageUrl) {
      // Step 1: Register upload
      const registerRes = await fetch(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
              owner: personUrn,
              serviceRelationships: [
                {
                  relationshipType: "OWNER",
                  identifier: "urn:li:userGeneratedContent",
                },
              ],
            },
          }),
        }
      );

      if (!registerRes.ok) throw new Error("LinkedIn image registration failed");
      const registerData = await registerRes.json();

      const uploadUrl =
        registerData?.value?.uploadMechanism?.[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ]?.uploadUrl;
      const assetUrn = registerData?.value?.asset;

      if (!uploadUrl || !assetUrn) throw new Error("LinkedIn upload URL not returned");

      // Step 2: Fetch image and upload to LinkedIn
      const imgFetch = await fetch(imageUrl);
      if (!imgFetch.ok) throw new Error("Could not fetch image from storage URL");
      const imgBuffer = await imgFetch.arrayBuffer();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: imgBuffer,
      });

      postBody = {
        author: personUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                description: { text: title },
                media: assetUrn,
                title: { text: title },
              },
            ],
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      };
    } else {
      postBody = {
        author: personUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      };
    }

    const postRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postBody),
    });

    if (!postRes.ok) {
      const err = await postRes.json();
      throw new Error(err?.message || `LinkedIn API error ${postRes.status}`);
    }

    const postUrn = postRes.headers.get("x-restli-id") || "";
    const url = postUrn
      ? `https://www.linkedin.com/feed/update/${encodeURIComponent(postUrn)}`
      : "https://www.linkedin.com/feed/";

    return { success: true, url };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to post to LinkedIn" };
  }
}

/* ─────────────────────────────────────────────────────
   Instagram
───────────────────────────────────────────────────── */
async function postToInstagram(
  title: string,
  description: string,
  imageUrl?: string
): Promise<PlatformResult> {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = process.env.INSTAGRAM_USER_ID;
    if (!token || !userId) throw new Error("Instagram credentials not configured");

    if (!imageUrl) {
      return {
        success: false,
        error: "Instagram requires an image. Upload a media file and try again.",
      };
    }

    const caption = description ? `${title}\n\n${description}` : title;

    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.instagram.com/v19.0/${userId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          image_url: imageUrl,
          caption,
          access_token: token,
        }),
      }
    );

    const containerData = await containerRes.json();
    if (!containerData.id) {
      throw new Error(containerData?.error?.message || "Failed to create Instagram media container");
    }

    // Step 2: Give Instagram a moment to process
    await new Promise((r) => setTimeout(r, 4000));

    // Step 3: Publish
    const publishRes = await fetch(
      `https://graph.instagram.com/v19.0/${userId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          creation_id: containerData.id,
          access_token: token,
        }),
      }
    );

    const publishData = await publishRes.json();
    if (!publishData.id) {
      throw new Error(publishData?.error?.message || "Failed to publish to Instagram");
    }

    return {
      success: true,
      url: `https://www.instagram.com/p/${publishData.id}/`,
    };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to post to Instagram" };
  }
}
