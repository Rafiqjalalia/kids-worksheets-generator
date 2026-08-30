// Math activity generators + renderers
import { makeRng, randInt, shuffle, pick, range } from '../lib/rng.js';
import { PageShell, AnswerLine, CornerDoodle, MiniTitle, Fraction } from '../components/WorksheetShell.jsx';

const CATEGORY = 'Math';

function baseConfig(op) {
  return {
    op,
    category: CATEGORY,
    name: op[0].toUpperCase() + op.slice(1) + ' Worksheet',
    icon: 'plus',
  };
}

// ---------------- Addition / Subtraction / Multiplication ----------------
function makeBasicMath(op, symbol) {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 20;
    const grade = config.grade;
    // ranges per grade
    let max;
    if (grade === 'grade1') max = 10;
    else if (grade === 'grade2') max = 20;
    else if (grade === 'grade3') max = 50;
    else max = 100;
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      let a, b, ans;
      if (op === 'sub') {
        a = randInt(rng, 1, max);
        b = randInt(rng, 1, a);
        ans = a - b;
      } else if (op === 'mul') {
        let m = grade === 'grade1' ? 5 : grade === 'grade2' ? 10 : 12;
        a = randInt(rng, 2, m);
        b = randInt(rng, 1, m);
        ans = a * b;
      } else {
        a = randInt(rng, 1, max);
        b = randInt(rng, 1, max);
        ans = a + b;
      }
      items.push({ left: a, right: b });
      answers.push(ans);
    }
    return { data: { items, symbol: symbol }, answers, title: `${op[0].toUpperCase()}${op.slice(1)} Practice` };
  };
  return { generator, configSchema: basicMathSchema(op) };
}

function basicMathSchema(op) {
  const isMul = op === 'mul';
  return [
    { key: 'grade', label: 'Grade level', type: 'select', default: 'grade2', options: [
      { value: 'grade1', label: 'Grade 1' }, { value: 'grade2', label: 'Grade 2' },
      { value: 'grade3', label: 'Grade 3' }, { value: 'grade4', label: 'Grade 4+' },
    ]},
    { key: 'count', label: 'Question count', type: 'range', default: 20, min: 6, max: 40, step: 1 },
  ];
}

function BasicMathWorksheet({ data, title, answers, showAnswers }) {
  const sym = data.symbol;
  return (
    <PageShell title={title} instructions={`Solve each ${sym === '+' ? 'addition' : sym === '–' ? 'subtraction' : 'multiplication'} problem.`}>
      <div className="ws-equations">
        {data.items.map((it, i) => (
          <div className="ws-eq" key={i}>
            <span className="ws-eq-num">{i + 1}.</span>
            <span className="ws-eq-text">{it.left} {sym} {it.right} = </span>
            <AnswerLine />
            {showAnswers && <span className="ws-answer-inline">{answers[i]}</span>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Division ----------------
function makeDivision() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 16;
    const grade = config.grade;
    let m = grade === 'grade1' ? 10 : grade === 'grade2' ? 12 : grade === 'grade3' ? 20 : 30;
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      const divisor = randInt(rng, 2, Math.min(m, 12));
      const quotient = randInt(rng, 1, Math.max(2, m / divisor));
      const dividend = divisor * quotient;
      items.push({ left: dividend, right: divisor });
      answers.push(quotient);
    }
    return { data: { items }, answers, title: 'Division Practice' };
  };
  return { generator, configSchema: [
    { key: 'grade', label: 'Grade level', type: 'select', default: 'grade2', options: [
      { value: 'grade1', label: 'Grade 1' }, { value: 'grade2', label: 'Grade 2' },
      { value: 'grade3', label: 'Grade 3' }, { value: 'grade4', label: 'Grade 4+' },
    ]},
    { key: 'count', label: 'Question count', type: 'range', default: 16, min: 6, max: 30, step: 1 },
  ]};
}

function MathDivisionWorksheet({ data, answers, showAnswers }) {
  return (
    <PageShell title="Division Practice" instructions="Solve each division problem.">
      <div className="ws-equations ws-div">
        {data.items.map((it, i) => (
          <div className="ws-eq" key={i}>
            <span className="ws-eq-num">{i + 1}.</span>
            <span className="ws-eq-text">{it.left} ÷ {it.right} = </span>
            <AnswerLine />
            {showAnswers && <span className="ws-answer-inline">{answers[i]}</span>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Fractions ----------------
function makeFractions() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const maxDen = config.mode === 'simple' ? 10 : 12;
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      const den = randInt(rng, 2, maxDen);
      const num = randInt(rng, 1, den - 1);
      const a = den;
      const b = num; // equivalent fraction prompt: num/den
      // question: "what fraction of the whole is shaded?" -> represent num/den
      items.push({ num: num, den: den });
      answers.push(`${num}/${den}`);
    }
    return { data: { items, mode: config.mode }, answers, title: 'Visual Fractions Practice' };
  };
  return { generator, configSchema: [
    { key: 'mode', label: 'Mode', type: 'select', default: 'simple', options: [
      { value: 'simple', label: 'Simple fractions' }, { value: 'equivalent', label: 'Equivalent fractions' },
    ]},
    { key: 'count', label: 'Problem count', type: 'range', default: 8, min: 4, max: 16, step: 1 },
  ]};
}

function FractionBar({ num, den, color }) {
  const cells = [];
  for (let i = 0; i < den; i++) cells.push(<div key={i} className={i < num ? 'frac-cell on' : 'frac-cell'} style={i < num ? { background: color } : {}} />);
  return <div className="frac-bar">{cells}</div>;
}

function MathFractionsWorksheet({ data, answers, showAnswers }) {
  const colors = ['#818cf8', '#f472b6', '#34d399', '#fbbf24', '#60a5fa'];
  return (
    <PageShell title="Visual Fractions Practice" instructions="Write the fraction that shows the colored part.">
      <div className="ws-frac-grid">
        {data.items.map((it, i) => (
          <div className="ws-frac-card" key={i}>
            <span className="ws-frac-qnum">{i + 1}.</span>
            <div className="ws-frac-swatch">
              <FractionBar num={it.num} den={it.den} color={colors[i % colors.length]} />
            </div>
            <span className="ws-frac-answer">= <AnswerLine width={60} /></span>
            {showAnswers && <span className="ws-answer-inline">{answers[i]}</span>}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Number Sequences ----------------
function makeSequences() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const type = config.mode; // count | skip | pattern
    const rows = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      let step, start, missing;
      if (type === 'count' || type === 'skip') {
        step = type === 'skip' ? (rng() < 0.5 ? 2 : rng() < 0.5 ? 5 : 10) : 1;
        start = step === 1 ? randInt(rng, 1, 30) : randInt(rng, step, step * 5);
        missing = i % 2 === 0 ? 3 : 1; // position (0-indexed) of missing
      } else {
        const modes = [2, 5, 3, 10, -2];
        step = pick(modes, rng);
        if (Math.abs(step) === 2) start = randInt(rng, 1, 20);
        else if (Math.abs(step) === 3) start = randInt(rng, 1, 30);
        else if (Math.abs(step) === 10) start = randInt(rng, 10, 60);
        else start = randInt(rng, 1, 100);
        missing = (i * 2) % 5;
      }
      const seq = [start];
      for (let k = 1; k < 5; k++) seq.push(seq[k - 1] + step);
      const ans = seq[missing];
      answers.push(ans);
      rows.push({ seq, missing });
    }
    return { data: { rows, mode: type }, answers, title: 'Number Sequences' };
  };
  return { generator, configSchema: [
    { key: 'mode', label: 'Pattern type', type: 'select', default: 'skip', options: [
      { value: 'count', label: 'Counting (by 1s)' }, { value: 'skip', label: 'Skip counting (2s, 5s, 10s)' },
      { value: 'pattern', label: 'Arithmetic patterns' },
    ]},
    { key: 'count', label: 'Number of rows', type: 'range', default: 8, min: 4, max: 12, step: 1 },
  ]};
}

function MathSequencesWorksheet({ data, answers, showAnswers }) {
  return (
    <PageShell title="Number Sequences" instructions="Fill in the missing number in each sequence.">
      <div className="ws-seq-grid">
        {data.rows.map((row, i) => (
          <div className="ws-seq-row" key={i}>
            <span className="ws-seq-num">{i + 1}.</span>
            {row.seq.map((n, k) => (
              <span className={`ws-seq-tile ${k === row.missing ? 'ws-seq-missing' : ''}`} key={k}>
                {k === row.missing ? (
                  showAnswers ? <b>{n}</b> : '?'
                ) : n}
              </span>
            ))}
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Counting (object counting) ----------------
function makeCounting() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const maxCount = config.mode === 'easy' ? 10 : config.mode === 'medium' ? 20 : 50;
    const emojis = ['★', '●', '▲', '■', '♥', '✦'];
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      const n = randInt(rng, 3, maxCount);
      const sym = pick(emojis, rng);
      items.push({ n, sym });
      answers.push(n);
    }
    return { data: { items }, answers, title: 'Counting Practice' };
  };
  return { generator, configSchema: [
    { key: 'mode', label: 'Difficulty', type: 'select', default: 'medium', options: [
      { value: 'easy', label: 'Easy (up to 10)' }, { value: 'medium', label: 'Medium (up to 20)' },
      { value: 'hard', label: 'Hard (up to 50)' },
    ]},
    { key: 'count', label: 'Row count', type: 'range', default: 8, min: 4, max: 12, step: 1 },
  ]};
}

function MathCountingWorksheet({ data, answers, showAnswers }) {
  return (
    <PageShell title="Counting Practice" instructions="Count the objects and write how many there are.">
      <div className="ws-count-grid">
        {data.items.map((it, i) => (
          <div className="ws-count-cell" key={i}>
            <div className="ws-count-objects">{it.sym.repeat(it.n)}</div>
            <div className="ws-count-answer">
              {showAnswers ? <span className="ws-answer-inline">{answers[i]}</span> : <AnswerLine width={50} />}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

// ---------------- Registry export ----------------
export const mathActivities = {
  addition: { ...baseConfig('add'), name: 'Addition', icon: 'plus', generator: makeBasicMath('add', '+').generator, configSchema: makeBasicMath('add', '+').configSchema, render: BasicMathWorksheet },
  subtraction: { ...baseConfig('sub'), name: 'Subtraction', icon: 'minus', generator: makeBasicMath('sub', '–').generator, configSchema: makeBasicMath('sub', '–').configSchema, render: BasicMathWorksheet, iconSvg: 'minus' },
  multiplication: { ...baseConfig('mul'), name: 'Multiplication', icon: 'x', generator: makeBasicMath('mul', '×').generator, configSchema: makeBasicMath('mul', '×').configSchema, render: BasicMathWorksheet },
  division: { ...baseConfig('div'), name: 'Division', icon: '÷', generator: makeDivision().generator, configSchema: makeDivision().configSchema, render: MathDivisionWorksheet },
  fractions: { name: 'Fractions', category: CATEGORY, icon: '½', generator: makeFractions().generator, configSchema: makeFractions().configSchema, render: MathFractionsWorksheet },
  sequences: { name: 'Number Sequences', category: CATEGORY, icon: '123', generator: makeSequences().generator, configSchema: makeSequences().configSchema, render: MathSequencesWorksheet },
  counting: { name: 'Counting', category: CATEGORY, icon: '☀', generator: makeCounting().generator, configSchema: makeCounting().configSchema, render: MathCountingWorksheet },
};
