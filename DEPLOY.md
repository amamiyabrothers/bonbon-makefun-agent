# DEPLOY.md — putting the bonbon status endpoint on a public HTTPS URL

**Current state:** the endpoint server is built and tested locally
(`server.js`, Node.js stdlib only, port 8787). It is NOT public yet — see
README.md "PUBLIC ENDPOINT — BLOCKED" for why (VM has no inbound access;
no-account tunnels are blocked by the egress proxy).

**This guide needs two decisions first (parent/Bos):**
1. **Hosting account** — a free account under the owner's identity.
   Recommended: **Render free tier** ($0, no credit card; persistent web
   service; 750 instance hours/month; spins down after 15 min idle, ~1 min
   wake-up). Alternative: Vercel Hobby ($0, no credit card; but restricted to
   personal/non-commercial use and serverless functions time out after 10s).
   No paid service, no card — the free tier physically cannot charge anything
   because no payment method is attached.
2. **GitHub repo** — a public repo under amamiyabrothers to hold this code
   (Render deploys from a Git repo; the repo also serves as the Wildcard
   "AGENT LINK"). Suggested name: `bonbon-makefun-agent`. This needs a
   separate approval — the earlier repo approval covered github-core-clone-01
   only.

## Option A — Render (recommended)

1. Create the public repo `amamiyabrothers/bonbon-makefun-agent` and push
   this directory's contents (`server.js`, `status.json`, `README.md`,
   `DEPLOY.md`, `package.json` below) to it.
2. Sign up at render.com with the owner's GitHub account (or email).
3. Dashboard → New → Web Service → connect the repo.
4. Settings: Runtime **Node**, Build Command empty (no dependencies),
   Start Command `node server.js`, Environment variable `PORT=10000`
   (Render sets `PORT` itself; the server reads `process.env.PORT`).
   Instance type **Free**.
5. Deploy. Render gives a public URL like
   `https://bonbon-makefun-agent.onrender.com` (HTTPS).
6. Verify: `curl https://<url>/health` → `{"status":"ok",...}` and
   `curl https://<url>/status` → the agent JSON.
7. Put that URL in the Wildcard submission form as the PUBLIC ENDPOINT and
   the repo URL as the AGENT LINK.
8. Note: the free service sleeps after 15 min idle; the first request after a
   quiet spell takes ~1 min to wake. That is acceptable for a judged demo
   (the judges' check is a single visit, not a latency benchmark). Keep
   `status.json` fresh by re-generating it from the board/ledger before
   judging (22–30 Nov).

## Option B — Vercel Hobby

1. Same repo as above.
2. Sign up at vercel.com with the owner's GitHub account (or email).
3. Import the repo; Vercel detects Node. The server must be adapted to a
   serverless function (`api/index.js` wrapping `server.js`) because Hobby
   serves functions, not a long-running process — a small, mechanical change.
   (Prefer Option A; only use B if Render is unavailable.)
4. Deploy; Vercel gives `https://<project>.vercel.app`.
5. Verify `/health` and `/status` as above.
6. Caveat: Hobby is personal/non-commercial only. This endpoint is a demo
   for a competition entry, not a commercial service — but flag the
   restriction to the owner before choosing this route.

## package.json (for the repo — no dependencies)

```json
{
  "name": "bonbon-makefun-agent-status",
  "version": "1.0.0",
  "description": "Public read-only status endpoint for bonbon, the autonomous make.fun bounty hunter & builder. zkVerify Agent Games — Wildcard track.",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "engines": { "node": ">=20" },
  "license": "MIT"
}
```

## Keeping status.json fresh

`status.json` is a snapshot generated 2026-11-14 ~15:45 UTC from the
competition board + ledger, cross-checked against the live make.fun API/CLI.
Regenerate it before judging (22 Nov) by re-reading the board
(`~/workspace/goals/make-fun-opportunity-hunter/BOARD.md`) and the ledger
(`~/workspace/makefun/ledger.md`) and updating: recent submissions, scores,
ranks, total prizes, and `generated_at`. Scores must always be the platform's
own figures — never self-reported, never inflated.

## What NOT to do

- Do not add a credit card to any host. The free tiers need none; if a host
  asks for one at signup, stop and report it instead of entering it.
- Do not put the make.fun API key, the Solana keypair, or any claim code in
  the repo or the endpoint. `status.json` contains only public submission IDs
  and platform scores — no secrets.
- Do not make the endpoint writable. It is read-only by design (`GET` only);
  it must never submit entries, move funds, or change state.
