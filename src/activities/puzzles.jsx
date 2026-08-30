// Puzzle activity generators + renderers
import { makeRng, shuffle, pick, randInt, range } from '../lib/rng.js';
import { getThemeWords } from '../data/themes.js';
import { PageShell } from '../components/WorksheetShell.jsx';

const CATEGORY = 'Puzzles';

// ---------------- Word Search ----------------
function makeWordSearch() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || 'animals';
    const size = Number(config.size) || 12;
    let words = getThemeWords(theme, rng, config.wordCount ? Number(config.wordCount) : 10);
    // filter words that fit
    words = words.filter((w) => w.length <= size).slice(0, Math.min(words.length, Number(config.wordCount) || 10));
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const placed = [];
    const dirs = [
      [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [1, -1], [-1, 1], [-1, -1],
    ];
    for (const word of words) {
      const upper = word.toUpperCase();
      let placedWord = false;
      for (let attempt = 0; attempt < 200 && !placedWord; attempt++) {
        const d = pick(dirs, rng);
        const row = randInt(rng, 0, size - 1);
        const col = randInt(rng, 0, size - 1);
        const er = row + d[0] * (upper.length - 1);
        const ec = col + d[1] * (upper.length - 1);
        if (er < 0 || ec < 0 || er >= size || ec >= size) continue;
        let ok = true;
        for (let k = 0; k < upper.length; k++) {
          const cr = row + d[0] * k, cc = col + d[1] * k;
          if (grid[cr][cc] !== '' && grid[cr][cc] !== upper[k]) { ok = false; break; }
        }
        if (!ok) continue;
        for (let k = 0; k < upper.length; k++) {
          grid[row + d[0] * k][col + d[1] * k] = upper[k];
        }
        placedWord = true;
        placed.push({ word: upper, start: [row, col], dir: d });
      }
      if (!placedWord) words = words.filter((w) => w !== word);
    }
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === '') grid[r][c] = letters[Math.floor(rng() * letters.length)];
      }
    }
    return { data: { grid, words, size, placed }, answers: words.map((w) => w), title: `${THEME_LABELS[theme] || 'Themed'} Word Search` };
  };
  return { generator, configSchema: themeSchema('size', 12) };
}

const THEME_LABELS = {
  animals: 'Animal', space: 'Space', food: 'Food', colors: 'Colors', ocean: 'Ocean',
  weather: 'Weather', sports: 'Sports', school: 'School', mybody: 'My Body', farm: 'Farm', vehicles: 'Vehicles',
};

function themeSchema(sizeKey, sizeDefault) {
  return [
    { key: 'theme', label: 'Theme', type: 'theme', default: 'animals' },
    { key: 'wordCount', label: 'Number of words', type: 'range', default: 10, min: 6, max: 16, step: 1 },
    { key: sizeKey, label: 'Grid size', type: 'select', default: String(sizeDefault), options: [
      { value: '10', label: '10 × 10' }, { value: '12', label: '12 × 12' }, { value: '15', label: '15 × 15' },
    ]},
  ];
}

function WordSearchWorksheet({ data, showAnswers }) {
  const size = data.size;
  return (
    <PageShell title={data.title} instructions={`Find and circle all ${data.words.length} hidden words.`}>
      <div className="ws-search-layout">
        <div className="ws-search-grid" style={{ gridTemplateColumns: `repeat(${size}, var(--ws-cell))` }}>
          {data.grid.map((row) => row.map((cell, c) => (
            <div className="ws-search-cell" key={c}>{cell}</div>
          )))}
        </div>
        <div className="ws-wordbank">
          {data.words.map((w, i) => (
            <span className="ws-bank-word" key={i}>{w}</span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ---------------- Word Scramble ----------------
function makeScramble() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || 'space';
    const count = Number(config.count) || 10;
    let words = getThemeWords(theme, rng, count);
    const items = words.map((w) => ({
      original: w.toUpperCase(),
      scrambled: shuffle(w.toUpperCase().split(''), rng).join(''),
      len: w.length,
    }));
    return { data: { items }, answers: words.map((w) => w.toUpperCase()), title: `${THEME_LABELS[theme] || 'Themed'} Word Scramble` };
  };
  return { generator, configSchema: [
    { key: 'theme', label: 'Theme', type: 'theme', default: 'space' },
    { key: 'count', label: 'Number of words', type: 'range', default: 10, min: 6, max: 14, step: 1 },
  ]};
}

function ScrambleWorksheet({ data, answers, showAnswers }) {
  return (
    <PageShell title={data.title} instructions="Unscramble each word and write the correct spelling.">
      <div className="ws-scramble-grid">
        {data.items.map((it, i) => (
          <div className="ws-scramble-item" key={i}>
            <div className="ws-scramble-boxes">
              {it.scrambled.split('').map((l, k) => (
                <span className="ws-scr-box" key={k}>{l}</span>
              ))}
            </div>
            <div className="ws-scramble-len">{it.len} letters</div>
            <div className="ws-scramble-answer">
              {showAnswers ? <span className="ws-answer-inline">{answers[i]}</span> : <div className="ws-line" style={{ width: it.len * 18 }} />}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Maze ----------------
function makeMaze() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const w = Number(config.cols) || 10, h = Number(config.rows) || 10;
    // randomized DFS maze
    const grid = Array.from({ length: h }, () => Array.from({ length: w }, () => ({ n: true, e: true, s: true, w: true, visited: false })));
    const stack = [[0, 0]];
    grid[0][0].visited = true;
    while (stack.length) {
      const [cr, cc] = stack[stack.length - 1];
      const neighbors = [];
      if (cr > 0 && !grid[cr - 1][cc].visited) neighbors.push([cr - 1, cc, 'n']);
      if (cr < h - 1 && !grid[cr + 1][cc].visited) neighbors.push([cr + 1, cc, 's']);
      if (cc > 0 && !grid[cr][cc - 1].visited) neighbors.push([cr, cc - 1, 'w']);
      if (cc < w - 1 && !grid[cr][cc + 1].visited) neighbors.push([cr, cc + 1, 'e']);
      if (neighbors.length) {
        const [nr, nc, dir] = pick(neighbors, rng);
        if (dir === 'n') { grid[cr][cc].n = false; grid[nr][nc].s = false; }
        if (dir === 's') { grid[cr][cc].s = false; grid[nr][nc].n = false; }
        if (dir === 'e') { grid[cr][cc].e = false; grid[nr][nc].w = false; }
        if (dir === 'w') { grid[cr][cc].w = false; grid[nr][nc].e = false; }
        grid[nr][nc].visited = true;
        stack.push([nr, nc]);
      } else stack.pop();
    }
    // entrance top-left, exit bottom-right
    grid[0][0].n = false;
    grid[h - 1][w - 1].s = false;
    return { data: { grid, w, h }, answers: [], title: 'Adventure Maze' };
  };
  return { generator, configSchema: [
    { key: 'rows', label: 'Rows', type: 'select', default: '10', options: [ {value:'8',label:'8'},{value:'10',label:'10'},{value:'12',label:'12'} ] },
    { key: 'cols', label: 'Columns', type: 'select', default: '10', options: [ {value:'8',label:'8'},{value:'10',label:'10'},{value:'12',label:'12'} ] },
  ]};
}

function MazeWorksheet({ data }) {
  const { grid, w, h } = data;
  const cell = 36;
  return (
    <PageShell title="Adventure Maze" instructions="Guide the character from the START to the GOAL marker.">
      <div className="ws-maze-wrap">
        <svg className="ws-maze" width={w * cell} height={h * cell} viewBox={`0 0 ${w * cell} ${h * cell}`}>
          {grid.map((row, r) => row.map((cellData, c) => {
            const x = c * cell, y = r * cell;
            const segs = [];
            if (cellData.n) segs.push(<line key="n" x1={x} y1={y} x2={x + cell} y2={y} className="mz-wall" />);
            if (cellData.s) segs.push(<line key="s" x1={x} y1={y + cell} x2={x + cell} y2={y + cell} className="mz-wall" />);
            if (cellData.w) segs.push(<line key="w" x1={x} y1={y} x2={x} y2={y + cell} className="mz-wall" />);
            if (cellData.e) segs.push(<line key="e" x1={x + cell} y1={y} x2={x + cell} y2={y + cell} className="mz-wall" />);
            return <g key={`${r}-${c}`}>{segs}</g>;
          }))}
          <circle cx={cell / 2} cy={cell / 2} r={cell / 3} className="mz-start" />
          <g transform={`translate(${w * cell - cell}, ${h * cell - cell})`}>
            <rect x={4} y={4} width={cell - 8} height={cell - 8} rx={8} className="mz-goal" />
            <text x={cell / 2} y={cell / 2 + 5} textAnchor="middle" className="mz-goal-text">GOAL</text>
          </g>
        </svg>
      </div>
    </PageShell>
  );
}

// ---------------- Sudoku ----------------
function makeSudoku() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const size = Number(config.size) || 4; // 4 or 9
    const difficulty = config.difficulty || 'medium';
    // Auto-scale clue count with grid size and difficulty.
    const clueRatios = { easy: 0.55, medium: 0.4, hard: 0.25 };
    const targetClues = Math.max(size === 4 ? 5 : 18, Math.round(size * size * clueRatios[difficulty]));
    // Generate a solved grid then remove clues
    const solved = generateSolved(size, rng);
    const puzzle = solved.map((row) => row.slice());
    const positions = [];
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) positions.push([r, c]);
    const shuffled = shuffle(positions, rng);
    let removed = 0;
    const total = size * size;
    for (const [r, c] of shuffled) {
      if (removed >= total - targetClues) break;
      puzzle[r][c] = null;
      removed++;
    }
    return { data: { puzzle, solved, size }, answers: solved.map((row) => row.join(' ')), title: `Kids ${size}×${size} Sudoku` };
  };
  return { generator, configSchema: [
    { key: 'size', label: 'Grid size', type: 'select', default: '4', options: [ { value: '4', label: '4 × 4 (easy)' }, { value: '9', label: '9 × 9 (hard)' } ] },
    { key: 'difficulty', label: 'Difficulty', type: 'select', default: 'medium', options: [ { value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' } ] },
  ]};
}

function generateSolved(size, rng) {
  const n = Math.sqrt(size);
  const grid = Array.from({ length: size }, () => Array(size).fill(0));
  const vals = size === 4 ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
  function fill() {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] !== 0) continue;
        const options = shuffle(vals, rng);
        for (const v of options) {
          if (isSafe(grid, r, c, v, n)) {
            grid[r][c] = v;
            if (fill()) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
    return true;
  }
  fill();
  return grid;
}
function isSafe(grid, r, c, v, n) {
  const size = grid.length;
  for (let i = 0; i < size; i++) if (grid[r][i] === v || grid[i][c] === v) return false;
  const br = Math.floor(r / n) * n, bc = Math.floor(c / n) * n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (grid[br + i][bc + j] === v) return false;
  return true;
}

function SudokuWorksheet({ data, showAnswers }) {
  const { puzzle, solved, size } = data;
  const n = Math.sqrt(size);
  return (
    <PageShell title={`Kids ${size}×${size} Sudoku`} instructions={`Fill the grid so every row, column and ${n}×${n} box contains 1–${size}.`}>
      <div className="ws-sudoku">
        <div className={`su-grid su-${size}`}>
          {puzzle.map((row, r) => row.map((cell, c) => (
            <div className={`su-cell ${(Math.floor(r / n) + Math.floor(c / n)) % 2 ? 'su-shade' : ''}`} key={`${r}-${c}`}>
              {cell !== null ? cell : (showAnswers ? <span className="su-solved">{solved[r][c]}</span> : '')}
            </div>
          )))}
        </div>
      </div>
    </PageShell>
  );
}

// ---------------- Dot-to-Dot ----------------
function makeDotToDot() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.points) || 20;
    // generate a simple star-like or spiral path
    const pts = [];
    for (let i = 0; i < count; i++) {
      const ang = (i / Math.max(1, count)) * Math.PI * 2;
      const rad = 60 + (i % 3) * 10;
      const x = 120 + Math.cos(ang) * rad;
      const y = 120 + Math.sin(ang) * rad;
      pts.push({ x: Math.round(x), y: Math.round(y), n: i + 1 });
    }
    return { data: { pts }, answers: [], title: 'Dot-to-Dot Adventure' };
  };
  return { generator, configSchema: [
    { key: 'points', label: 'Number of dots', type: 'range', default: 20, min: 10, max: 40, step: 1 },
  ]};
}

function DotToDotWorksheet({ data }) {
  const { pts } = data;
  const W = 260, H = 260;
  return (
    <PageShell title="Dot-to-Dot Adventure" instructions="Connect the dots in order from 1 to reveal the picture.">
      <svg className="ws-dots" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} className="dot-dot" />
        ))}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={p.y - 8} textAnchor="middle" className="dot-label">{p.n}</text>
        ))}
      </svg>
    </PageShell>
  );
}

// Registry
export const puzzleActivities = {
  wordsearch: { name: 'Word Search', category: CATEGORY, icon: '🔍', generator: makeWordSearch().generator, configSchema: makeWordSearch().configSchema, render: WordSearchWorksheet },
  scramble: { name: 'Word Scramble', category: CATEGORY, icon: '🔀', generator: makeScramble().generator, configSchema: makeScramble().configSchema, render: ScrambleWorksheet },
  maze: { name: 'Maze', category: CATEGORY, icon: '🌀', generator: makeMaze().generator, configSchema: makeMaze().configSchema, render: MazeWorksheet },
  sudoku: { name: 'Sudoku', category: CATEGORY, icon: '🧩', generator: makeSudoku().generator, configSchema: makeSudoku().configSchema, render: SudokuWorksheet },
  dotdot: { name: 'Dot-to-Dot', category: CATEGORY, icon: '🔴', generator: makeDotToDot().generator, configSchema: makeDotToDot().configSchema, render: DotToDotWorksheet },
};
