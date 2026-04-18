const BASE = "https://api.github.com"

function assertEnv() {
  const missing = ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO"].filter(
    (k) => !process.env[k]
  )
  if (missing.length) {
    throw new Error(
      `Missing GitHub env vars: ${missing.join(", ")} — fill them in .env.local`
    )
  }
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  }
}

function branch() {
  return process.env.GITHUB_BRANCH ?? "main"
}

function repoUrl(path?: string) {
  const base = `${BASE}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents`
  return path ? `${base}/${path}` : base
}

function friendlyError(status: number, body: { message?: string }, url: string): string {
  const msg = body.message ?? "unknown"
  if (status === 404) {
    return (
      `Not found (404) — check that:\n` +
      `  • GITHUB_OWNER="${process.env.GITHUB_OWNER}" is correct\n` +
      `  • GITHUB_REPO="${process.env.GITHUB_REPO}" is correct\n` +
      `  • GITHUB_BRANCH="${branch()}" exists in the repo\n` +
      `  • GITHUB_TOKEN has "repo" scope\n` +
      `  URL tried: ${url}`
    )
  }
  if (status === 401 || status === 403) {
    return `Auth error (${status}) — GITHUB_TOKEN is invalid or lacks "repo" scope. GitHub says: ${msg}`
  }
  if (status === 422) {
    return `Validation error (422) — ${msg}. The branch "${branch()}" may not exist yet.`
  }
  return `GitHub ${status}: ${msg} — URL: ${url}`
}

async function getFileSha(path: string): Promise<string | null> {
  const url = `${repoUrl(path)}?ref=${branch()}`
  const res = await fetch(url, { headers: ghHeaders(), cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(friendlyError(res.status, body, url))
  }
  const data = await res.json()
  return data.sha as string
}

export async function readTextFile(path: string): Promise<string | null> {
  assertEnv()
  const url = `${repoUrl(path)}?ref=${branch()}`
  const res = await fetch(url, { headers: ghHeaders(), cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(friendlyError(res.status, body, url))
  }
  const data = await res.json()
  return Buffer.from(data.content as string, "base64").toString("utf-8")
}

async function putFile(path: string, content: string, message: string): Promise<void> {
  assertEnv()
  const sha = await getFileSha(path)
  const url = repoUrl(path)
  const body: Record<string, string> = { message, content, branch: branch() }
  if (sha) body.sha = sha

  const res = await fetch(url, {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(friendlyError(res.status, errBody, url))
  }
}

export async function pushTextFile(path: string, text: string, message: string): Promise<void> {
  const content = Buffer.from(text, "utf-8").toString("base64")
  await putFile(path, content, message)
}

export async function pushBinaryFile(path: string, base64: string, message: string): Promise<void> {
  await putFile(path, base64.replace(/\s/g, ""), message)
}
