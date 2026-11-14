// bonbon — Autonomous make.fun Bounty Hunter & Builder
// Public status endpoint for the zkVerify Agent Games Wildcard track.
// Read-only: serves the agent's live tracked state. No payments, no
// transactions, no state changes. Node.js stdlib only, no dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '8787', 10);
const HOST = process.env.HOST || '0.0.0.0';
const STATUS_FILE = path.join(__dirname, 'status.json');

function readStatus() {
  try {
    return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
  } catch (e) {
    return { error: 'status unavailable', detail: String(e && e.message || e) };
  }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function landingPage(d) {
  const a = (d && d.agent) || {};
  const r = (d && d.results) || {};
  const subs = Array.isArray(r.recent_submissions) ? r.recent_submissions : [];
  const rows = subs.map(s =>
    `<tr><td>${esc(s.competition)}</td><td>${esc(s.title)}</td><td>${esc(s.round)}</td>` +
    `<td>${esc(s.intake)}</td><td>${esc(s.dev_score)}</td><td>$${esc(s.prize_usd)}</td></tr>`
  ).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(a.name || 'bonbon')}</title>
<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:40px auto;padding:0 20px;color:#111}h1{font-size:26px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px 8px;text-align:left;font-size:14px}code{background:#f2f2f2;padding:2px 4px}</style></head>
<body><h1>${esc(a.name || 'bonbon')}</h1>
<p>${esc(a.description || '')}</p>
<p><b>Handle:</b> ${esc(a.handle || '')} on make.fun &nbsp;|&nbsp; <b>Status:</b> ${esc(a.status || '')} &nbsp;|&nbsp; <b>Data:</b> ${esc(a.data_source || '')}</p>
<p><b>Total prizes won (USDC):</b> ${esc(r.total_prizes_usdc)} — ${esc(r.total_prizes_note || '')}</p>
<p><b>Entries submitted:</b> ${esc(r.entries_submitted)} &nbsp;|&nbsp; <b>Verification:</b> ${esc(r.verification || '')}</p>
<h2>Recent submissions (platform-verified)</h2>
<table><tr><th>Competition</th><th>Title</th><th>Round</th><th>Intake</th><th>Dev score</th><th>Prize</th></tr>${rows}</table>
<h2>How it works</h2><pre>${esc(JSON.stringify(d.how_it_works || {}, null, 2))}</pre>
<p><b>Verifiability:</b> ${esc((d.verifiability && d.verifiability.note) || '')}</p>
<p><b>zkVerify:</b> ${esc((d.verifiability && d.verifiability.zkverify) || '')}</p>
<p>Machine-readable: <a href="/status">/status</a> (JSON) &middot; <a href="/health">/health</a></p>
<p><small>Generated: ${esc(a.generated_at || '')}. Read-only endpoint — no payments, no transactions, no state changes.</small></p>
</body></html>`;
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  console.log(new Date().toISOString(), req.method, url);
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', agent: 'bonbon', time: new Date().toISOString() }));
    return;
  }
  if (url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(readStatus()));
    return;
  }
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(landingPage(readStatus()));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found', routes: ['/', '/status', '/health'] }));
});

server.listen(PORT, HOST, () => {
  console.log(`bonbon status endpoint listening on http://${HOST}:${PORT}`);
});
