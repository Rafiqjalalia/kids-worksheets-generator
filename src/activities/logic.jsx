// Logic & Games activity generators + renderers
import { makeRng, shuffle, pick, randInt } from '../lib/rng.js';
import { getThemeWords, COMMON_WORDS } from '../data/themes.js';
import { PageShell } from '../components/WorksheetShell.jsx';

const CATEGORY = 'Logic';

// ---------------- Matching Pairs ----------------
const MATCH_PAIRS = [
  { type: 'colors', prompt: 'Match the word to its color', pairs: [['Red', '❤'], ['Blue', '💙'], ['Green', '💚'], ['Yellow', '💛'], ['Orange', '🧡'], ['Purple', '💜'], ['Pink', '🩷'], ['Brown', '🤎']] },
  { type: 'numbers', prompt: 'Match the number to its word', pairs: [['One', '1'], ['Two', '2'], ['Three', '3'], ['Four', '4'], ['Five', '5'], ['Six', '6'], ['Seven', '7'], ['Eight', '8']] },
  { type: 'animals', prompt: 'Match the animal to its name', pairs: [['🐶', 'Dog'], ['🐱', 'Cat'], ['🐮', 'Cow'], ['🦊', 'Fox'], ['🐸', 'Frog'], ['🐵', 'Monkey'], ['🦁', 'Lion'], ['🐘', 'Elephant']] },
  { type: 'shapes', prompt: 'Match the shape to its name', pairs: [['●', 'Circle'], ['▲', 'Triangle'], ['■', 'Square'], ['⬟', 'Pentagon'], ['⬠', 'Hexagon'], ['◆', 'Diamond'], ['⬭', 'Oval'], ['✦', 'Star']] },
];

function makeMatching() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const mode = config.mode;
    const bank = MATCH_PAIRS.find((m) => m.type === mode) || MATCH_PAIRS[0];
    const left = shuffle(bank.pairs.map((p) => p[0]), rng);
    const right = shuffle(bank.pairs.map((p) => p[1]), rng);
    const prompt = bank.prompt;
    return { data: { left, right, prompt, mode }, answers: bank.pairs.map((p) => `${p[0]} ↔ ${p[1]}`), title: 'Matching Pairs Challenge' };
  };
  return { generator, configSchema: [
    { key: 'mode', label: 'Category', type: 'select', default: 'animals', options: MATCH_PAIRS.map((m) => ({ value: m.type, label: m.type[0].toUpperCase() + m.type.slice(1) })) },
  ]};
}

function MatchingWorksheet({ data, showAnswers }) {
  const { left, right } = data;
  return (
    <PageShell title={data.title} instructions={data.prompt + ". Draw a line to connect each pair."}>
      <div className="ws-match">
        <div className="ws-match-col">
          {left.map((l, i) => <div className="ws-match-card" key={i}>{l}</div>)}
        </div>
        <div className="ws-match-col">
          {right.map((r, i) => <div className="ws-match-card" key={i}>{r}</div>)}
        </div>
      </div>
    </PageShell>
  );
}

// ---------------- Tic-Tac-Toe ----------------
function makeTicTacToe() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const games = Number(config.rounds) || 6;
    const boards = [];
    for (let i = 0; i < games; i++) {
      boards.push(Array.from({ length: 9 }, () => ''));
    }
    return { data: { boards }, answers: [], title: 'Tic-Tac-Toe Championship' };
  };
  return { generator, configSchema: [
    { key: 'rounds', label: 'Number of boards', type: 'range', default: 6, min: 2, max: 12, step: 1 },
  ]};
}

function TicTacToeWorksheet({ data }) {
  return (
    <PageShell title="Tic-Tac-Toe Championship" instructions="Take turns marking X and O. Three in a row wins!">
      <div className="ws-ttt-grid">
        {data.boards.map((board, bi) => (
          <div className="ws-ttt-board" key={bi}>
            {board.map((cell, ci) => (
              <div className="ws-ttt-cell" key={ci}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Hangman ----------------
function makeHangman() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || 'animals';
    const count = Number(config.words) || 6;
    let words;
    if (theme === 'common') {
      words = shuffle([...COMMON_WORDS], rng).slice(0, count);
    } else {
      words = getThemeWords(theme, rng, count);
    }
    return { data: { words: words.map((w) => w.toUpperCase()) }, answers: words.map((w) => w.toUpperCase()), title: 'Hangman (Word Guessing)' };
  };
  return { generator, configSchema: [
    { key: 'theme', label: 'Word list', type: 'select', default: 'animals', options: [
      { value: 'common', label: 'Common words' }, { value: 'animals', label: 'Animals' }, { value: 'space', label: 'Space' }, { value: 'food', label: 'Food' },
    ]},
    { key: 'words', label: 'Number of words', type: 'range', default: 6, min: 3, max: 10, step: 1 },
  ]};
}

function HangmanWorksheet({ data, answers, showAnswers }) {
  return (
    <PageShell title="Hangman (Word Guessing)" instructions="Guess the hidden word one letter at a time.">
      <div className="ws-hangman-grid">
        {data.words.map((word, wi) => (
          <div className="ws-hangman-card" key={wi}>
            <div className="ws-hangman-word">
              {word.split('').map((l, li) => (
                <div className="ws-hangman-let" key={li}>
                  {showAnswers ? l : ''}
                </div>
              ))}
            </div>
            <div className="ws-hangman-alphabet">A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Pattern Challenges ----------------
function makePattern() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const items = [];
    const answers = [];
    const shapes = ['▲', '■', '●', '★', '♥', '✦'];
    for (let i = 0; i < count; i++) {
      const mode = pick(['abab', 'aabb', 'abc', 'shape'], rng);
      let seq = [];
      let missingIdx;
      let ans;
      if (mode === 'abab') {
        const a = pick(shapes, rng), b = pick(shapes.filter((s) => s !== a), rng);
        seq = [a, b, a, b, a, b];
        missingIdx = pick([1, 3, 5, 2, 4], rng);
        ans = seq[missingIdx] || '';
      } else if (mode === 'aabb') {
        const a = pick(shapes, rng), b = pick(shapes.filter((s) => s !== a), rng);
        seq = [a, a, b, b, a, a, b, b];
        missingIdx = pick([2, 3, 6, 7], rng);
        ans = seq[missingIdx];
      } else if (mode === 'abc') {
        const a = pick(shapes, rng), b = pick(shapes.filter((s) => s !== a), rng), c = pick(shapes.filter((s) => s !== a && s !== b), rng);
        seq = [a, b, c, a, b, c];
        missingIdx = pick([1, 4, 2, 5], rng);
        ans = seq[missingIdx];
      } else {
        // numbers growing
        const step = pick([2, 3, 5, 10], rng);
        const start = randInt(rng, 1, 10);
        seq = [0, 1, 2, 3, 4, 5].map((k) => start + k * step);
        missingIdx = pick([1, 2, 3, 4], rng);
        ans = seq[missingIdx];
      }
      items.push({ seq, missingIdx, isNum: mode === 'shape' ? false : seq.every((s) => typeof s === 'number') });
      answers.push(ans);
    }
    return { data: { items }, answers, title: 'Pattern Challenges' };
  };
  return { generator, configSchema: [
    { key: 'count', label: 'Number of patterns', type: 'range', default: 8, min: 4, max: 12, step: 1 },
  ]};
}

function PatternWorksheet({ data, answers, showAnswers }) {
  return (
    <PageShell title="Pattern Challenges" instructions="What comes next? Draw or write the missing part of each pattern.">
      <div className="ws-pattern-grid">
        {data.items.map((it, i) => (
          <div className="ws-pattern-row" key={i}>
            <span className="ws-seq-num">{i + 1}.</span>
            {it.seq.map((s, k) => (
              <span className={`ws-seq-tile ${k === it.missingIdx ? 'ws-seq-missing' : ''}`} key={k}>
                {k === it.missingIdx ? (showAnswers ? <b>{it.isNum ? ansOf(s) : s}</b> : <span className="ws-question-mark">?</span>) : s}
              </span>
            ))}
            {showAnswers && <span className="ws-answer-inline">{answers[i]}</span>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}
function ansOf(v) { return typeof v === 'number' ? String(v) : String(v); }

export const logicActivities = {
  matching: { name: 'Matching Pairs', category: CATEGORY, icon: '🔗', generator: makeMatching().generator, configSchema: makeMatching().configSchema, render: MatchingWorksheet },
  tictactoe: { name: 'Tic-Tac-Toe', category: CATEGORY, icon: '⭕', generator: makeTicTacToe().generator, configSchema: makeTicTacToe().configSchema, render: TicTacToeWorksheet },
  hangman: { name: 'Hangman', category: CATEGORY, icon: '😵', generator: makeHangman().generator, configSchema: makeHangman().configSchema, render: HangmanWorksheet },
  pattern: { name: 'Pattern Challenges', category: CATEGORY, icon: '🔁', generator: makePattern().generator, configSchema: makePattern().configSchema, render: PatternWorksheet },
};
