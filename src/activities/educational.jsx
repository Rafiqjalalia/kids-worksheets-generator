// Educational activity generators + renderers
import { makeRng, shuffle, pick, randInt } from '../lib/rng.js';
import { COLORING_OBJECTS, COMMON_WORDS } from '../data/themes.js';
import { PageShell } from '../components/WorksheetShell.jsx';

const CATEGORY = 'Educational';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz';

// ---------------- Object Coloring Page ----------------
const COLOR_OBJECTS = {
  apple: { name: 'Apple', path: 'M100 60 a28 28 0 1 0 0 56 a28 28 0 1 0 0 -56 Z M100 70 l6 12', shape: 'apple' },
  house: { name: 'House', path: 'M60 120 V70 L100 40 L140 70 V120 Z M78 120 V92 h44 v28', shape: 'house' },
  sun: { name: 'Sun', path: 'M100 55 a25 25 0 1 1 -25 25 a25 25 0 0 1 25 -25 Z', shape: 'sun' },
  star: { name: 'Star', path: 'M100 30 L115 72 L160 72 L125 97 L137 143 L100 117 L63 143 L75 97 L40 72 L85 72 Z', shape: 'star' },
  fish: { name: 'Fish', path: 'M50 90 Q70 55 120 75 Q90 78 90 90 Q90 102 120 105 Q70 125 50 90 Z', shape: 'fish' },
  butterfly: { name: 'Butterfly', path: 'M95 100 q-20 -35 -45 -20 q-5 25 20 30 q-20 10 -10 25 q20 15 35 -10 Z M105 100 q20 -35 45 -20 q5 25 -20 30 q20 10 10 25 q-20 15 -35 -10 Z', shape: 'butterfly' },
  tree: { name: 'Tree', path: 'M100 140 h-15 v-30 h-10 l28 -35 l28 35 h-10 v30 Z', shape: 'tree' },
  icecream: { name: 'Ice cream', path: 'M85 70 q15 -22 30 0 Z M78 70 a22 22 0 1 0 44 0 Z M90 98 h20 l-5 38 h-10 Z', shape: 'icecream' },
  rocket: { name: 'Rocket', path: 'M100 20 q15 25 5 55 l-5 40 h0 l-5 -40 q-10 -30 5 -55 Z M78 100 h44 l-5 30 h-34 Z', shape: 'rocket' },
  flower: { name: 'Flower', path: 'M100 100 m0 -22 a22 22 0 1 1 0 44 a22 22 0 1 1 0 -44 Z', shape: 'flower' },
};

function makeColoring() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const objKey = config.object || 'house';
    const objects = Object.entries(COLOR_OBJECTS).map(([k, v]) => ({ key: k, ...v }));
    const count = Number(config.count) || 4;
    const selected = [];
    for (let i = 0; i < count; i++) {
      const o = objects[Math.floor(rng() * objects.length)];
      selected.push({ ...o, scene: i });
    }
    return { data: { objects: selected }, answers: [], title: 'Coloring Page' };
  };
  return { generator, configSchema: [
    { key: 'count', label: 'Images per page', type: 'range', default: 4, min: 1, max: 8, step: 1 },
  ]};
}

function ColoringWorksheet({ data }) {
  return (
    <PageShell title="Coloring Page" instructions="Use your favorite colors to decorate each picture. Be creative!" compact>
      <div className="ws-color-grid">
        {data.objects.map((o, i) => (
          <div className="ws-color-item" key={i}>
            <div className="ws-color-name">{o.name}</div>
            <svg viewBox="0 0 200 200" className="ws-color-svg">
              <g fill="none" stroke="#333" strokeWidth={5} strokeLinejoin="round">
                <path d={o.path} />
              </g>
            </svg>
            <div className="ws-color-line" />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Letter Tracing & Phonics ----------------
function makeLetterTrace() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const letters = (config.letters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('').filter((l) => l.trim());
    let selected = shuffle(letters, rng);
    const count = Number(config.count) || 4;
    selected = selected.slice(0, count);
    return { data: { letters: selected }, answers: [], title: 'Letter Tracing & Phonics' };
  };
  return { generator, configSchema: [
    { key: 'count', label: 'Letters per page', type: 'range', default: 4, min: 1, max: 8, step: 1 },
    { key: 'letters', label: 'Letters (comma separated)', type: 'text', default: 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z' },
  ]};
}

function LetterTraceWorksheet({ data }) {
  return (
    <PageShell title="Letter Tracing & Phonics" instructions="Trace each letter, say its sound, then write it yourself.">
      <div className="ws-letter-grid">
        {data.letters.map((letter, i) => (
          <div className="ws-letter-card" key={i}>
            <div className="ws-letter-big">{letter}</div>
            <div className="ws-letter-lines">
              <div className="ws-hand-line-line"></div>
              <div className="ws-hand-line-line dashed">{letter.toLowerCase()} {letter.toLowerCase()} {letter.toLowerCase()} {letter.toLowerCase()}</div>
              <div className="ws-hand-line-line"></div>
              <div className="ws-hand-line-line"></div>
            </div>
            <div className="ws-letter-search">Find the letter: <span className="ws-letter-pool">{ALPHABET.split('').map((l) => <span className={l === letter.toLowerCase() || l === letter.toUpperCase() ? 'hit' : ''} key={l}>{l}</span>)}</span></div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Word Handwriting & Tracing ----------------
function makeWordHandwriting() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || 'common';
    let words;
    if (theme === 'common') words = shuffle([...COMMON_WORDS], rng);
    else words = shuffle(['cat','dog','sun','hat','car','bus','pen','cup','box'], rng);
    const count = Number(config.count) || 5;
    words = words.filter((w) => w.length <= 8).slice(0, count);
    return { data: { words }, answers: [], title: 'Word Handwriting & Tracing' };
  };
  return { generator, configSchema: [
    { key: 'theme', label: 'Word list', type: 'select', default: 'common', options: [{ value: 'common', label: 'Common words' }, { value: 'sight', label: 'Sight words' }] },
    { key: 'count', label: 'Words per page', type: 'range', default: 5, min: 2, max: 8, step: 1 },
  ]};
}

function WordHandwritingWorksheet({ data }) {
  return (
    <PageShell title="Word Handwriting & Tracing" instructions="Trace each word, then write it neatly on your own.">
      <div className="ws-hand-rows">
        {data.words.map((word, i) => (
          <div className="ws-hand-row" key={i}>
            <div className="ws-hand-word model">{word}</div>
            <div className="ws-hand-traces">
              <div className="ws-hand-line-line dashed">{word}</div>
              <div className="ws-hand-line-line"></div>
              <div className="ws-hand-line-line"></div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Grid Drawing & Symmetry ----------------
function makeGridDraw() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const cols = Number(config.cols) || 12, rows = Number(config.rows) || 8;
    const cell = 30;
    // Generate a simple symmetrical shape mask
    const mask = [];
    for (let r = 0; r < rows; r++) {
      const row2 = [];
      for (let c = 0; c < Math.floor(cols / 2); c++) {
        const on = rng() < Math.min(0.5, 1 - Math.abs(r - rows / 2) / rows);
        row2.push(on);
      }
      mask.push(row2);
    }
    return { data: { cols, rows, cell, mask }, answers: [], title: 'Grid Drawing & Symmetry' };
  };
  return { generator, configSchema: [
    { key: 'cols', label: 'Columns', type: 'select', default: '12', options: [{ value: '10', label: '10' }, { value: '12', label: '12' }, { value: '16', label: '16' }] },
    { key: 'rows', label: 'Rows', type: 'select', default: '8', options: [{ value: '6', label: '6' }, { value: '8', label: '8' }, { value: '10', label: '10' }] },
  ]};
}

function GridDrawWorksheet({ data }) {
  const { cols, rows, cell, mask } = data;
  const W = (cols / 2) * cell, H = rows * cell;
  return (
    <PageShell title="Grid Drawing & Symmetry" instructions="The left half is drawn. Copy the pattern to the right half to make it symmetrical.">
      <div className="ws-grid-draw">
        <svg width={cols * cell} height={H} viewBox={`0 0 ${cols * cell} ${H}`}>
          {mask.map((row, r) => row.map((on, c) => {
            if (on) {
              const x = c * cell, y = r * cell;
              const rx = (cols - 1 - c) * cell;
              return <g key={`${r}-${c}`}><rect x={x} y={y} width={cell} height={cell} fill="#818cf8" opacity="0.35" /><rect x={rx} y={y} width={cell} height={cell} fill="none" stroke="#94a3b8" strokeDasharray="3 3" /></g>;
            }
            return null;
          }))}
          {/* grid lines */}
          {Array.from({ length: cols + 1 }, (_, i) => <line key={`v${i}`} x1={i * cell} y1={0} x2={i * cell} y2={H} stroke="#cbd5e1" strokeWidth={i === cols / 2 ? 2.5 : 0.6} />)}
          {Array.from({ length: rows + 1 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * cell} x2={cols * cell} y2={i * cell} stroke="#cbd5e1" strokeWidth={0.6} />)}
        </svg>
      </div>
    </PageShell>
  );
}

export const educationalActivities = {
  coloring: { name: 'Coloring Page', category: CATEGORY, icon: '🎨', generator: makeColoring().generator, configSchema: makeColoring().configSchema, render: ColoringWorksheet },
  lettertrace: { name: 'Letter Tracing & Phonics', category: CATEGORY, icon: '🔤', generator: makeLetterTrace().generator, configSchema: makeLetterTrace().configSchema, render: LetterTraceWorksheet },
  handwriting: { name: 'Word Handwriting & Tracing', category: CATEGORY, icon: '✍️', generator: makeWordHandwriting().generator, configSchema: makeWordHandwriting().configSchema, render: WordHandwritingWorksheet },
  griddraw: { name: 'Grid Drawing & Symmetry', category: CATEGORY, icon: '🟦', generator: makeGridDraw().generator, configSchema: makeGridDraw().configSchema, render: GridDrawWorksheet },
};
