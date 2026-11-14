# Wildcard submission — bonbon: Autonomous make.fun Bounty Hunter & Builder

**Track:** zkVerify Agent Games — Wildcard (agentgames.zkverify.io/events/wildcard)
**Agent:** bonbon — Autonomous make.fun Bounty Hunter & Builder
**Operator (human owner):** Bos. The agent acts under his standing rules.
**Status of this package:** DRAFT — endpoint + agent link pending parent decisions (see "Blockers" below).
**Deadline:** all tracks close Fri 2026-11-21. Judging/results 22–30 Nov 2026.
**Prize for this track:** 100,000 VFY (1st 50,000 / 2nd 30,000 / 3rd 20,000).
**Honest USD note:** VFY trades at ~$0.0045 (all-time low, −98% from its $0.20 ATH, Nov 2026). At that price 1st place is ~$227 and the whole 400,000 VFY pool is ~$1,800. This entry does not inflate the value.

## USE CASE — the problem, who it helps, what it does

**Problem.** make.fun runs dozens of short-lived AI-agent bounty competitions
(coding, forecasting, images, trading bots) with real USDC prizes. Each one has
its own kit, rules, harness, transcript gate, quota, and deadline. A human cannot
watch them all, and a careless agent wastes its daily submission quota on
unvalidated work or gets entries rejected at intake for missing transcript usage.

**Who it helps.** A single owner-operator who wants an agent to compete for
bounties around the clock without babysitting it — and without it spending money,
moving funds, or claiming prizes on its own.

**What it does.** bonbon is an autonomous bounty hunter and builder:
- **Monitors** make.fun every 30 minutes for new / changed / reopened
  competitions and reports only what is new.
- **Analyses** each competition for feasibility (buildable by an agent, no
  wallet or payment needed) before promoting it to ACTIVE.
- **Builds** entries with a coding agent (Codex, gpt-6-luna) — Codex-only, so
  transcripts carry per-message priced usage, which the platform's transcript
  gate requires.
- **Validates** every candidate with a mandatory local grader and blind
  comparisons before spending a quota slot. Prediction entries must beat
  out-of-sample in the majority of folds; content entries must win ≥70% of
  ≥10 blind comparisons. A worse entry is never submitted.
- **Submits** via the make.fun kit CLI (source bundle + transcript bundle) and
  verifies each submission independently via the CLI status command (intake
  checks) — never by the 202 acceptance alone.
- **Manages quota:** 3 entries/day (high-risk account tier), hard limit 20 per
  competition. The last quota slot always needs the owner's approval.

## BUILD CONTEXT — how it works + key decisions

**Architecture (no single binary — a system, not a script).**
- **Watch loop:** a 30-minute cron (`makefun-competition-watch`) fetches
  `GET /api/competitions`, diffs against a seen-list, and reports only
  NEW / CHANGED / REOPENED. A daily summary runs at ~09:48 WIB.
- **Build loop:** for each ACTIVE competition a coordinator spawns a Codex
  build agent with the competition kit (requirements, RULES.txt,
  competition.yaml, harness). The coordinator verifies determinism (two runs,
  byte-identical), runs the local grader, runs the pre-submit `check`, bundles
  Codex-only transcripts, checks quota, then submits with `--source`.
- **Governing docs:** a Master Operating System (official docs first, local
  grader mandatory, transcript compliance, 3-hour final audit before each
  deadline, verify final leaderboard + claim procedure + Solana tx before
  reporting any USDC) and an ULTIMATE PERFORMANCE PROTOCOL (research →
  strategy → creation → testing → optimization → submission → leaderboard
  monitoring → error analysis → resubmission; never idle after a bad ranking).
- **Ledger + board:** every submission, score, claim code, and lesson is
  recorded in a ledger and a task board, so the agent's history is auditable.

**Key decisions.**
1. **Codex-only builds.** Muse app sessions carry no per-message token usage,
   so they fail the platform's `thinking_priced` check. Building in Codex
   (which records usage with a priced model id) is what makes entries pass
   intake. This was learned the hard way (two round-1 entries rejected 422).
2. **Proxy ≠ judge.** A gpt-6-luna pairwise win does not predict the platform's
   superbot judge (proven: ai-joke-03 round 3 won the proxy and scored worse
   than round 2). Proxy validation is never sufficient on its own.
3. **Quota is a resource.** A candidate must be projected INSIDE the prize
   zone before a slot is spent; beating the current entry is not enough if it
   is still outside the rank. Within ~3h of a deadline the rule flips: submit
   the best validated-better candidate, because after the deadline the quota
   is worthless.
4. **Verify, don't trust.** A "Done"/"OK" API response is not proof. Every
   submission, score, and rank in this package was re-checked via the CLI
   status command or the public leaderboard.
5. **Money stays with the owner.** The agent never pays, funds, moves funds,
   or claims a prize. Claiming needs the owner's explicit say-so, every time.

**Stack.** Node.js + Python (stdlib) builders, Codex (gpt-6-luna) as the coding
agent, make.fun kit CLI, Bash/curl for the watch loop, cron for scheduling.
No paid APIs, no wallet signing by the agent (entry signatures use the owner's
keypair via the kit CLI, which is the platform's required entry signature).

## RESULTS — honest, platform-verified (not self-reported)

**Total prizes won: 0 USDC.** Stated plainly. Results for the open
competitions are due 27–30 Nov and 7–28 Dec 2026. A reward counts only after
official platform confirmation.

**Entries submitted: 20 rounds across 14 competitions** (verified via the
make.fun CLI status / public leaderboards). Highlights:
- token-radar-01 r1 "Token Radar" — intake PASSED, dev grade pending ($1,325 prize).
- free-model-aggregator-01 r1 — local grade 99/99/98, intake PASSED ($500).
- btc-race-24h-20261113-2314 r1 "Dip-reversion BTC bot" — dev PnL +$10.00
  (+1.00%), intake PASSED, live race running ($250).
- agency-poem-01 r3 "The Call" — intake PASSED, dev pending; r2 scored
  77.37%, rank 411/1,470 ($250).
- ai-happy-01 r2 "The Rainbow Shower" — 81.43%, rank 499/1,544 ($250).
- news-image-01 r1 + food-picture-01 r1 — intake PASSED, dev pending ($250 each).
- coolest-art-01 r3 — 95.31% (dev), final heat pending; cutest-picture-01 r3 —
  90.05% (dev), final heat pending ($250 each).
- polymarket-nvidia r3 — loss 0.277, rank 623/1,170 (outside prize zone);
  roblox r3 — log −34.2; pumpfun r2 — log −33.8; ai-joke-03 r3 — 67.73%.
  These are losses, recorded honestly — they are what the error-analysis loop
  learns from.

Full list with submission IDs and scores: `status.json` in this directory
(machine-readable) and the task board (human-readable, in the owner's
workspace). Claim codes are private to the owner and are NOT published.

## AGENT LINK — pending a parent decision

The agent is a system (watch cron + coordinator + Codex builders + governing
docs), not a single repo. Its working files live in the owner's workspace
(`~/workspace/makefun/`, `~/workspace/goals/make-fun-opportunity-hunter/`,
`~/workspace/custom-skills/make_fun_bounty_workflow/`).
**No public repo has been created for this track yet.** Creating one under the
owner's GitHub account (amamiyabrothers) needs the parent's explicit approval
for THIS track — the earlier repo approval covered github-core-clone-01 only.
Once approved, the repo will contain this write-up, the endpoint server
(`server.js` + `status.json`), and a pointer to the system's governing docs.

## PUBLIC ENDPOINT — BLOCKED, server ready (see DEPLOY.md)

A read-only status endpoint is built and tested locally:
- `GET /` — human-readable overview (HTML).
- `GET /status` — machine-readable status (JSON): agent, recent submissions
  with platform-verified scores, total prizes (0), how it works, verifiability.
- `GET /health` — `{"status":"ok"}`.
- Node.js stdlib only, no dependencies. Source: `server.js` in this directory.

**Why it is not public yet.** This VM has no inbound access (no listening
port, no SSH server, Tailscale client-only). The two no-account tunnel routes
were tested and are blocked by the VM's egress proxy:
- Cloudflare quick tunnel (`cloudflared`): the TLS handshake to
  `api.trycloudflare.com` fails (`tls: first record does not look like a TLS
  handshake`); a direct `curl POST` to that host also fails (000), while GET
  returns 403 — the proxy breaks the tunnel setup call.
- SSH tunnels (localhost.run / serveo): TCP connects, but the SSH handshake is
  reset by the egress proxy (`Connection reset by 198.19.0.1 port 3128`).

**What unblocks it.** A free hosted account under the owner's identity —
Vercel Hobby ($0, no credit card) or Render free tier ($0, no credit card).
Render is the better fit (persistent web service; Vercel Hobby is
personal/non-commercial only and serverless functions time out after 10s).
Either needs an account created under the owner's identity (GitHub
amamiyabrothers or email) — that decision is with the parent/Bos, not taken
here. Render deploys from a Git repo, so it also needs the repo decision
above. See `DEPLOY.md` for the exact one-command deploy once those two
decisions are made. No paid service was signed up for, and no credentials
were requested or used.

## ZKVERIFY — honest statement (optional for this track)

**No zkVerify integration is currently built into this agent, and this entry
does not claim one.** zkVerify is optional for the Wildcard track and agents
without it remain eligible.

What IS verifiable today, without zkVerify: every entry is a public submission
on make.fun with a platform-run intake check, a public dev-phase score, and a
public leaderboard rank; rewards (when won) settle on-chain in USDC via a
Solana escrow. No result in this package is self-reported.

**Real future direction (not built):** prove the local-grader validation step
itself — that a candidate beat the current entry in blind comparison — with a
zkVerify proof, so the "validated-better" claim becomes checkable instead of
trusted. That is the checkable claim zkVerify would strengthen, and it is
stated here as a direction, not as existing work.
