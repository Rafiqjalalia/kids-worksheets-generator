// Export utilities: open a print window with rendered worksheet(s) and trigger print/PDF.

// Build a printable HTML document from rendered activity elements and open a print dialog.
export async function openPrintWindow(renderedElements, { title = 'Kids Worksheets Generator' } = {}) {
  // Open the window synchronously so the browser still counts this as a user gesture
  // (opening after an await can be blocked by popup blockers).
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) {
    alert('Please allow pop-ups to print. Or use the on-screen Print button.');
    return null;
  }

  const { renderToStaticMarkup } = await import('react-dom/server');
  const htmlBody = renderedElements.map((el) => renderToStaticMarkup(el)).join('\n');

  const doc = w.document;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <style>${PRINT_CSS}</style></head><body>${htmlBody}</body></html>`);
  doc.close();

  // Trigger print once assets are loaded, with a fallback.
  const doPrint = () => { w.focus(); w.print(); };
  setTimeout(doPrint, 550);
  return w;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const PRINT_CSS = `
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{background:#fff}
  .ws-page{font-family:'Inter',system-ui,sans-serif;color:#111;background:#fff;padding:1mm 0;page-break-after:always}
  .ws-header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:8px}
  .ws-title{font-family:'Fredoka','Inter';font-size:26px;color:#111;margin:0}
  .ws-subtitle{margin:2px 0 0;color:#475569;font-size:14px}
.ws-meta{text-align:right}.ws-name{display:inline-block;border-bottom:1.5px solid #64748b;min-width:64px;max-width:150px;padding-bottom:2px;font-size:13px;color:#64748b;white-space:nowrap}
.ws-band{display:flex;gap:24px;font-size:13px;color:#64748b;margin:8px 0 14px;padding:6px 2px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0}
.ws-band span{display:inline-block;min-width:70px;border-bottom:1px solid #cbd5e1;padding-bottom:2px}
  .ws-instructions{font-size:14px;color:#334155;margin:4px 0 16px;font-weight:500}
  .ws-answerkey{font-weight:800;letter-spacing:.1em;color:#b91c1c;margin:2px 0 10px;font-size:13px;text-transform:uppercase}
  .ws-body{position:relative}
  .ws-equations{display:grid;grid-template-columns:1fr 1fr;gap:12px 26px}
  .ws-eq{display:flex;align-items:center;gap:10px;border-bottom:1px solid #e9eef5;padding:6px 2px}
  .ws-eq-num{color:#94a3b8;font-size:13px;width:22px;flex-shrink:0}
  .ws-eq-text{font-size:17px;font-weight:600;white-space:nowrap}
  .ws-answerline{border-bottom:1.5px solid #94a3b8;flex:1}
  .ws-answer-inline{color:#15803d;font-weight:800;font-size:15px;margin-left:6px}
  .ws-line{border-bottom:1.5px solid #94a3b8;height:1.5px}
  .ws-vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px 20px}
  .ws-v{display:flex;align-items:flex-start;gap:8px}
  .ws-v-num{color:#94a3b8;font-size:14px;width:24px;flex-shrink:0;padding-top:12px}
  .ws-v-op{display:flex;flex-direction:column;flex:1;min-width:120px}
  .ws-v-line{text-align:right;font-size:24px;font-weight:700;line-height:1.25;font-family:'Fredoka','Inter'}
  .ws-v-line.mid{display:flex;align-items:baseline;justify-content:flex-end}
  .ws-v-sym{margin-right:8px;font-weight:700;font-size:17px;color:#334155}
  .ws-v-rule{border-top:2.5px solid #111;margin-top:2px}
  .ws-v-answer-line{height:30px;border-bottom:2px solid #94a3b8;margin-top:3px}
  .ws-v-answer{height:30px;line-height:30px;margin-top:3px;text-align:center;font-weight:800;font-size:20px;color:#15803d}
  .ws-section{margin-bottom:4px}
  .ws-section-title{font-family:'Fredoka','Inter';font-size:16px;font-weight:700;color:#334155;border-bottom:2px solid #cbd5e1;padding-bottom:3px;margin:6px 0 10px}
  .ws-fraction{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px}
  .ws-frac-line{border-top:2px solid #111;width:100%}
  .ws-frac-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  .ws-frac-card{border:1.5px solid #e2e8f0;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;align-items:center}
  .ws-frac-qnum{align-self:flex-start;color:#94a3b8;font-size:13px}
  .frac-bar{display:flex;width:100%;height:26px;border:1.5px solid #94a3b8;border-radius:5px;overflow:hidden}
  .frac-cell{flex:1}
  .ws-frac-answer{display:flex;align-items:center;gap:6px;width:100%}
  .ws-seq-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 22px}
  .ws-seq-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .ws-seq-num{color:#94a3b8;font-size:13px;width:22px}
  .ws-seq-tile{width:40px;height:40px;display:grid;place-items:center;border:1.5px solid #cbd5e1;border-radius:8px;font-weight:700;font-size:17px;background:#fff;min-width:40px}
  .ws-seq-tile.ws-seq-missing{background:#fefce8;border-style:dashed;color:#a16207}
  .ws-count-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 24px}
  .ws-count-cell{border:1.5px solid #e2e8f0;border-radius:10px;padding:10px}
  .ws-count-objects{font-size:20px;letter-spacing:4px;margin-bottom:6px;text-align:center}
  .ws-count-answer{display:flex;justify-content:center;margin-top:4px}
  .ws-count-answer .ws-answerline{width:60px}
  .ws-search-layout{display:flex;gap:24px;align-items:flex-start}
  .ws-search-grid{display:grid;gap:0;border:1.5px solid #334155}
  .ws-search-cell{width:28px;height:28px;display:grid;place-items:center;font-weight:700;font-size:15px;border:0.5px solid #e2e8f0;text-transform:uppercase}
  .ws-wordbank{display:flex;flex-direction:column;gap:6px}
  .ws-bank-word{font-weight:700;letter-spacing:.05em;text-transform:uppercase;border-bottom:1px dashed #cbd5e1;padding-bottom:3px}
  .ws-scramble-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .ws-scramble-item{border:1.5px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center}
  .ws-scramble-boxes{display:flex;gap:6px;justify-content:center}
  .ws-scr-box{width:30px;height:34px;border:1.5px solid #94a3b8;border-radius:6px;display:grid;place-items:center;font-weight:800;font-size:16px;text-transform:uppercase}
  .ws-scramble-len{color:#64748b;font-size:12px;margin:6px 0 8px}
  .ws-scramble-answer{display:flex;justify-content:center}
  .ws-maze-wrap{display:flex;justify-content:center}
  .mz-wall{stroke:#111;stroke-width:2.5;stroke-linecap:round}
  .mz-start{fill:#fbbf24;stroke:#b45309;stroke-width:2.5}
  .mz-goal{fill:#34d399}
  .mz-goal-text{fill:#fff;font-weight:800;font-size:8px}
  .ws-sudoku{display:flex;justify-content:center}
  .su-grid{display:grid;border:2px solid #111}
  .su-grid.su-4{grid-template-columns:repeat(4,44px);grid-auto-rows:44px}
  .su-grid.su-9{grid-template-columns:repeat(9,34px);grid-auto-rows:34px}
  .su-cell{border:1px solid #94a3b8;display:grid;place-items:center;font-weight:700;font-size:18px;background:#fff}
  .su-cell.su-shade{background:#f1f5f9}
  .su-solved{color:#15803d;font-size:.8em}
  .dot-dot{fill:#0f172a}
  .dot-label{font-size:8px;fill:#334155;font-weight:600}
  .ws-match{display:flex;gap:60px;justify-content:space-between;padding:0 20px}
  .ws-match-col{display:flex;flex-direction:column;gap:18px;width:120px}
  .ws-match-card{border:1.5px solid #94a3b8;border-radius:8px;padding:10px;text-align:center;font-weight:700;font-size:15px;height:44px;display:grid;place-items:center}
  .ws-ttt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .ws-ttt-board{display:grid;grid-template-columns:repeat(3,1fr);width:150px;margin:0 auto}
  .ws-ttt-cell{width:50px;height:50px;border:1.5px solid #334155;display:grid;place-items:center;font-size:22px;font-weight:800}
  .ws-hangman-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .ws-hangman-card{border:1.5px solid #e2e8f0;border-radius:10px;padding:14px}
  .ws-hangman-word{display:flex;gap:8px;justify-content:center;margin-bottom:8px}
  .ws-hangman-let{width:28px;height:30px;border-bottom:2px solid #334155;display:grid;place-items:center;font-weight:800;text-transform:uppercase}
  .ws-hangman-alphabet{text-align:center;font-size:11px;color:#64748b;letter-spacing:2px}
  .ws-pattern-grid{display:grid;gap:12px}
  .ws-pattern-row{display:flex;align-items:center;gap:8px;border:1.5px solid #e2e8f0;border-radius:10px;padding:10px 14px;flex-wrap:wrap}
  .ws-question-mark{color:#a16207}
  .ws-color-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
  .ws-color-item{text-align:center}
  .ws-color-name{font-family:'Fredoka';font-size:18px;margin-bottom:4px}
  .ws-color-svg{max-width:160px;height:auto}
  .ws-color-line{border-bottom:1.5px solid #cbd5e1;width:80%;margin:8px auto 0}
  .ws-letter-grid{display:grid;gap:18px}
  .ws-letter-card{border:1.5px solid #e2e8f0;border-radius:10px;padding:16px;display:flex;gap:18px;align-items:flex-start;flex-wrap:wrap}
  .ws-letter-big{font-family:'Fredoka';font-size:58px;width:70px;text-align:center;color:#6366f1;line-height:1}
  .ws-letter-lines{flex:1;min-width:220px;display:flex;flex-direction:column;gap:8px}
  .ws-letter-search{width:100%;font-size:12px;color:#64748b}
  .ws-letter-pool{letter-spacing:3px}
  .ws-letter-pool .hit{color:#15803d;font-weight:800}
  .ws-hand-rows{display:flex;flex-direction:column;gap:22px}
  .ws-hand-row{display:flex;gap:20px;align-items:flex-start}
  .ws-hand-word.model{font-family:'Comic Sans MS','Segoe Print',cursive;font-size:34px;width:180px;color:#334155}
  .ws-hand-traces{flex:1;display:flex;flex-direction:column;gap:10px}
  .ws-hand-line-line{height:22px;border-bottom:1.5px solid #94a3b8;font-family:'Comic Sans MS','Segoe Print',cursive;font-size:20px;color:#94a3b8}
  .ws-hand-line-line.dashed{letter-spacing:4px}
  .ws-grid-draw{display:flex;justify-content:center}
  .ws-dots{display:block;margin:0 auto;max-width:100%}
  @page{size:A4;margin:9mm}
`;
