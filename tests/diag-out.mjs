// <stdin>
import { renderToStaticMarkup } from "react-dom/server";

// src/activities/registry.js
import React from "react";

// src/lib/rng.js
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function makeRng(seedString) {
  return mulberry32(hashString(seedString || "seed"));
}
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}
function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

// src/components/Icon.jsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

// src/components/WorksheetShell.jsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function PageShell({ title, subtitle, instructions, children, compact, answerKeyLabel }) {
  return /* @__PURE__ */ jsxs2("div", { className: "ws-page", children: [
    /* @__PURE__ */ jsxs2("div", { className: "ws-header", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("h2", { className: "ws-title", children: title }),
        subtitle && /* @__PURE__ */ jsx2("p", { className: "ws-subtitle", children: subtitle })
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "ws-meta", children: /* @__PURE__ */ jsx2("span", { className: "ws-name", children: "Name:" }) })
    ] }),
    !compact && /* @__PURE__ */ jsxs2("div", { className: "ws-band", children: [
      /* @__PURE__ */ jsx2("span", { children: "Score:" }),
      /* @__PURE__ */ jsx2("span", { children: "Date:" }),
      /* @__PURE__ */ jsx2("span", { children: "Teacher/Parent:" })
    ] }),
    instructions && /* @__PURE__ */ jsx2("p", { className: "ws-instructions", children: instructions }),
    answerKeyLabel && /* @__PURE__ */ jsx2("p", { className: "ws-answerkey", children: "ANSWER KEY" }),
    /* @__PURE__ */ jsx2("div", { className: "ws-body", children })
  ] });
}
function AnswerLine({ width = "100%", height = 2 }) {
  return /* @__PURE__ */ jsx2("div", { className: "ws-answerline", style: { height: `${height}px`, flex: 1 } });
}

// src/activities/math.jsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var CATEGORY = "Math";
function baseConfig(op) {
  return {
    op,
    category: CATEGORY,
    name: op[0].toUpperCase() + op.slice(1) + " Worksheet",
    icon: "plus"
  };
}
function makeBasicMath(op, symbol) {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 20;
    const grade = config.grade;
    let max;
    if (grade === "grade1") max = 10;
    else if (grade === "grade2") max = 20;
    else if (grade === "grade3") max = 50;
    else max = 100;
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      let a, b, ans;
      if (op === "sub") {
        a = randInt(rng, 1, max);
        b = randInt(rng, 1, a);
        ans = a - b;
      } else if (op === "mul") {
        let m = grade === "grade1" ? 5 : grade === "grade2" ? 10 : 12;
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
    return { data: { items, symbol }, answers, title: `${op[0].toUpperCase()}${op.slice(1)} Practice` };
  };
  return { generator, configSchema: basicMathSchema(op) };
}
function basicMathSchema(op) {
  const isMul = op === "mul";
  return [
    { key: "grade", label: "Grade level", type: "select", default: "grade2", options: [
      { value: "grade1", label: "Grade 1" },
      { value: "grade2", label: "Grade 2" },
      { value: "grade3", label: "Grade 3" },
      { value: "grade4", label: "Grade 4+" }
    ] },
    { key: "count", label: "Question count", type: "range", default: 20, min: 6, max: 40, step: 1 }
  ];
}
function BasicMathWorksheet({ data, title, answers, showAnswers }) {
  const sym = data.symbol;
  const word = sym === "+" ? "addition" : sym === "\u2013" ? "subtraction" : "multiplication";
  return /* @__PURE__ */ jsx3(PageShell, { title, instructions: `Solve each ${word} problem. Write your answer on the line below.`, children: /* @__PURE__ */ jsx3("div", { className: "ws-vgrid", children: data.items.map((it, i) => /* @__PURE__ */ jsxs3("div", { className: "ws-v", children: [
    /* @__PURE__ */ jsxs3("span", { className: "ws-v-num", children: [
      i + 1,
      "."
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "ws-v-op", children: [
      /* @__PURE__ */ jsx3("div", { className: "ws-v-line top", children: it.left }),
      /* @__PURE__ */ jsxs3("div", { className: "ws-v-line mid", children: [
        /* @__PURE__ */ jsx3("span", { className: "ws-v-sym", children: sym }),
        /* @__PURE__ */ jsx3("span", { className: "ws-v-operand", children: it.right })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "ws-v-rule" }),
      showAnswers ? /* @__PURE__ */ jsx3("span", { className: "ws-v-answer ws-v-answer-solved", children: answers[i] }) : /* @__PURE__ */ jsx3("div", { className: "ws-v-answer-line" })
    ] })
  ] }, i)) }) });
}
function makeDivision() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 16;
    const grade = config.grade;
    let m = grade === "grade1" ? 10 : grade === "grade2" ? 12 : grade === "grade3" ? 20 : 30;
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      const divisor = randInt(rng, 2, Math.min(m, 12));
      const quotient = randInt(rng, 1, Math.max(2, m / divisor));
      const dividend = divisor * quotient;
      items.push({ left: dividend, right: divisor });
      answers.push(quotient);
    }
    return { data: { items }, answers, title: "Division Practice" };
  };
  return { generator, configSchema: [
    { key: "grade", label: "Grade level", type: "select", default: "grade2", options: [
      { value: "grade1", label: "Grade 1" },
      { value: "grade2", label: "Grade 2" },
      { value: "grade3", label: "Grade 3" },
      { value: "grade4", label: "Grade 4+" }
    ] },
    { key: "count", label: "Question count", type: "range", default: 16, min: 6, max: 30, step: 1 }
  ] };
}
function MathDivisionWorksheet({ data, answers, showAnswers }) {
  return /* @__PURE__ */ jsx3(PageShell, { title: "Division Practice", instructions: "Solve each division problem.", children: /* @__PURE__ */ jsx3("div", { className: "ws-equations ws-div", children: data.items.map((it, i) => /* @__PURE__ */ jsxs3("div", { className: "ws-eq", children: [
    /* @__PURE__ */ jsxs3("span", { className: "ws-eq-num", children: [
      i + 1,
      "."
    ] }),
    /* @__PURE__ */ jsxs3("span", { className: "ws-eq-text", children: [
      it.left,
      " \xF7 ",
      it.right,
      " = "
    ] }),
    /* @__PURE__ */ jsx3(AnswerLine, {}),
    showAnswers && /* @__PURE__ */ jsx3("span", { className: "ws-answer-inline", children: answers[i] })
  ] }, i)) }) });
}
function makeFractions() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const maxDen = config.mode === "simple" ? 10 : 12;
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      const den = randInt(rng, 2, maxDen);
      const num = randInt(rng, 1, den - 1);
      const a = den;
      const b = num;
      items.push({ num, den });
      answers.push(`${num}/${den}`);
    }
    return { data: { items, mode: config.mode }, answers, title: "Visual Fractions Practice" };
  };
  return { generator, configSchema: [
    { key: "mode", label: "Mode", type: "select", default: "simple", options: [
      { value: "simple", label: "Simple fractions" },
      { value: "equivalent", label: "Equivalent fractions" }
    ] },
    { key: "count", label: "Problem count", type: "range", default: 8, min: 4, max: 16, step: 1 }
  ] };
}
function FractionBar({ num, den, color }) {
  const cells = [];
  for (let i = 0; i < den; i++) cells.push(/* @__PURE__ */ jsx3("div", { className: i < num ? "frac-cell on" : "frac-cell", style: i < num ? { background: color } : {} }, i));
  return /* @__PURE__ */ jsx3("div", { className: "frac-bar", children: cells });
}
function MathFractionsWorksheet({ data, answers, showAnswers }) {
  const colors = ["#818cf8", "#f472b6", "#34d399", "#fbbf24", "#60a5fa"];
  return /* @__PURE__ */ jsx3(PageShell, { title: "Visual Fractions Practice", instructions: "Write the fraction that shows the colored part.", children: /* @__PURE__ */ jsx3("div", { className: "ws-frac-grid", children: data.items.map((it, i) => /* @__PURE__ */ jsxs3("div", { className: "ws-frac-card", children: [
    /* @__PURE__ */ jsxs3("span", { className: "ws-frac-qnum", children: [
      i + 1,
      "."
    ] }),
    /* @__PURE__ */ jsx3("div", { className: "ws-frac-swatch", children: /* @__PURE__ */ jsx3(FractionBar, { num: it.num, den: it.den, color: colors[i % colors.length] }) }),
    /* @__PURE__ */ jsxs3("span", { className: "ws-frac-answer", children: [
      "= ",
      /* @__PURE__ */ jsx3(AnswerLine, { width: 60 })
    ] }),
    showAnswers && /* @__PURE__ */ jsx3("span", { className: "ws-answer-inline", children: answers[i] })
  ] }, i)) }) });
}
function makeSequences() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const type = config.mode;
    const rows = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      let step, start, missing;
      if (type === "count" || type === "skip") {
        step = type === "skip" ? rng() < 0.5 ? 2 : rng() < 0.5 ? 5 : 10 : 1;
        start = step === 1 ? randInt(rng, 1, 30) : randInt(rng, step, step * 5);
        missing = i % 2 === 0 ? 3 : 1;
      } else {
        const modes = [2, 5, 3, 10, -2];
        step = pick(modes, rng);
        if (Math.abs(step) === 2) start = randInt(rng, 1, 20);
        else if (Math.abs(step) === 3) start = randInt(rng, 1, 30);
        else if (Math.abs(step) === 10) start = randInt(rng, 10, 60);
        else start = randInt(rng, 1, 100);
        missing = i * 2 % 5;
      }
      const seq = [start];
      for (let k = 1; k < 5; k++) seq.push(seq[k - 1] + step);
      const ans = seq[missing];
      answers.push(ans);
      rows.push({ seq, missing });
    }
    return { data: { rows, mode: type }, answers, title: "Number Sequences" };
  };
  return { generator, configSchema: [
    { key: "mode", label: "Pattern type", type: "select", default: "skip", options: [
      { value: "count", label: "Counting (by 1s)" },
      { value: "skip", label: "Skip counting (2s, 5s, 10s)" },
      { value: "pattern", label: "Arithmetic patterns" }
    ] },
    { key: "count", label: "Number of rows", type: "range", default: 8, min: 4, max: 12, step: 1 }
  ] };
}
function MathSequencesWorksheet({ data, answers, showAnswers }) {
  return /* @__PURE__ */ jsx3(PageShell, { title: "Number Sequences", instructions: "Fill in the missing number in each sequence.", children: /* @__PURE__ */ jsx3("div", { className: "ws-seq-grid", children: data.rows.map((row, i) => /* @__PURE__ */ jsxs3("div", { className: "ws-seq-row", children: [
    /* @__PURE__ */ jsxs3("span", { className: "ws-seq-num", children: [
      i + 1,
      "."
    ] }),
    row.seq.map((n, k) => /* @__PURE__ */ jsx3("span", { className: `ws-seq-tile ${k === row.missing ? "ws-seq-missing" : ""}`, children: k === row.missing ? showAnswers ? /* @__PURE__ */ jsx3("b", { children: n }) : "?" : n }, k))
  ] }, i)) }) });
}
function makeCounting() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const maxCount = config.mode === "easy" ? 10 : config.mode === "medium" ? 20 : 50;
    const emojis = ["\u2605", "\u25CF", "\u25B2", "\u25A0", "\u2665", "\u2726"];
    const items = [];
    const answers = [];
    for (let i = 0; i < count; i++) {
      const n = randInt(rng, 3, maxCount);
      const sym = pick(emojis, rng);
      items.push({ n, sym });
      answers.push(n);
    }
    return { data: { items }, answers, title: "Counting Practice" };
  };
  return { generator, configSchema: [
    { key: "mode", label: "Difficulty", type: "select", default: "medium", options: [
      { value: "easy", label: "Easy (up to 10)" },
      { value: "medium", label: "Medium (up to 20)" },
      { value: "hard", label: "Hard (up to 50)" }
    ] },
    { key: "count", label: "Row count", type: "range", default: 8, min: 4, max: 12, step: 1 }
  ] };
}
function MathCountingWorksheet({ data, answers, showAnswers }) {
  return /* @__PURE__ */ jsx3(PageShell, { title: "Counting Practice", instructions: "Count the objects and write how many there are.", children: /* @__PURE__ */ jsx3("div", { className: "ws-count-grid", children: data.items.map((it, i) => /* @__PURE__ */ jsxs3("div", { className: "ws-count-cell", children: [
    /* @__PURE__ */ jsx3("div", { className: "ws-count-objects", children: it.sym.repeat(it.n) }),
    /* @__PURE__ */ jsx3("div", { className: "ws-count-answer", children: showAnswers ? /* @__PURE__ */ jsx3("span", { className: "ws-answer-inline", children: answers[i] }) : /* @__PURE__ */ jsx3(AnswerLine, { width: 50 }) })
  ] }, i)) }) });
}
var mathActivities = {
  addition: { ...baseConfig("add"), name: "Addition", icon: "plus", generator: makeBasicMath("add", "+").generator, configSchema: makeBasicMath("add", "+").configSchema, render: BasicMathWorksheet },
  subtraction: { ...baseConfig("sub"), name: "Subtraction", icon: "minus", generator: makeBasicMath("sub", "\u2013").generator, configSchema: makeBasicMath("sub", "\u2013").configSchema, render: BasicMathWorksheet, iconSvg: "minus" },
  multiplication: { ...baseConfig("mul"), name: "Multiplication", icon: "x", generator: makeBasicMath("mul", "\xD7").generator, configSchema: makeBasicMath("mul", "\xD7").configSchema, render: BasicMathWorksheet },
  division: { ...baseConfig("div"), name: "Division", icon: "\xF7", generator: makeDivision().generator, configSchema: makeDivision().configSchema, render: MathDivisionWorksheet },
  fractions: { name: "Fractions", category: CATEGORY, icon: "\xBD", generator: makeFractions().generator, configSchema: makeFractions().configSchema, render: MathFractionsWorksheet },
  sequences: { name: "Number Sequences", category: CATEGORY, icon: "123", generator: makeSequences().generator, configSchema: makeSequences().configSchema, render: MathSequencesWorksheet },
  counting: { name: "Counting", category: CATEGORY, icon: "\u2600", generator: makeCounting().generator, configSchema: makeCounting().configSchema, render: MathCountingWorksheet }
};

// src/data/themes.js
var THEMES = {
  animals: {
    label: "Animals",
    words: "cat, dog, bird, fish, lion, tiger, bear, panda, rabbit, horse, sheep, duck, frog, snake, zebra".split(", ")
  },
  space: {
    label: "Space",
    words: "sun, moon, star, planet, rocket, comet, galaxy, orbit, astronaut, telescope, mars, venus".split(", ")
  },
  food: {
    label: "Food",
    words: "apple, bread, cake, milk, egg, cheese, pasta, rice, salad, pizza, mango, orange".split(", ")
  },
  colors: {
    label: "Colors",
    words: "red, blue, green, yellow, orange, purple, pink, brown, black, white, gray, gold".split(", ")
  },
  ocean: {
    label: "Ocean",
    words: "fish, wave, shell, coral, shark, whale, dolphin, crab, starfish, jellyfish, octopus, squid".split(", ")
  },
  weather: {
    label: "Weather",
    words: "sun, rain, snow, wind, cloud, storm, thunder, rainbow, fog, hail, sunny, stormy".split(", ")
  },
  sports: {
    label: "Sports",
    words: "ball, goal, team, swim, run, jump, kick, score, tennis, soccer, basket, cricket".split(", ")
  },
  school: {
    label: "School",
    words: "book, pen, desk, ruler, pencil, eraser, school, table, chair, teacher, crayon, paper".split(", ")
  },
  mybody: {
    label: "My Body",
    words: "hand, foot, eyes, nose, ears, mouth, hair, head, teeth, arm, leg, knee".split(", ")
  },
  farm: {
    label: "Farm",
    words: "cow, pig, hen, goat, horse, sheep, duck, barn, field, tractor, farm, chick".split(", ")
  },
  vehicles: {
    label: "Vehicles",
    words: "car, bus, train, bike, boat, plane, truck, van, scooter, ship, taxi, tram".split(", ")
  }
};
function getThemeWords(theme, rng, count) {
  const list = THEMES[theme] ? [...THEMES[theme].words] : [...THEMES.animals.words];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, Math.min(count, list.length));
}
var COMMON_WORDS = [
  "cat",
  "dog",
  "sun",
  "hat",
  "car",
  "bus",
  "pen",
  "cup",
  "box",
  "ball",
  "fish",
  "bird",
  "tree",
  "star",
  "moon",
  "book",
  "cake",
  "mile",
  "jump",
  "happy",
  "apple",
  "water",
  "smile",
  "friend",
  "school",
  "yellow",
  "purple"
];

// src/activities/puzzles.jsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var CATEGORY2 = "Puzzles";
function makeWordSearch() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || "animals";
    const size = Number(config.size) || 12;
    let words = getThemeWords(theme, rng, config.wordCount ? Number(config.wordCount) : 10);
    words = words.filter((w) => w.length <= size).slice(0, Math.min(words.length, Number(config.wordCount) || 10));
    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    const placed = [];
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [0, -1],
      [-1, 0],
      [1, -1],
      [-1, 1],
      [-1, -1]
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
          if (grid[cr][cc] !== "" && grid[cr][cc] !== upper[k]) {
            ok = false;
            break;
          }
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
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === "") grid[r][c] = letters[Math.floor(rng() * letters.length)];
      }
    }
    return { data: { grid, words, size, placed }, answers: words.map((w) => w), title: `${THEME_LABELS[theme] || "Themed"} Word Search` };
  };
  return { generator, configSchema: themeSchema("size", 12) };
}
var THEME_LABELS = {
  animals: "Animal",
  space: "Space",
  food: "Food",
  colors: "Colors",
  ocean: "Ocean",
  weather: "Weather",
  sports: "Sports",
  school: "School",
  mybody: "My Body",
  farm: "Farm",
  vehicles: "Vehicles"
};
function themeSchema(sizeKey, sizeDefault) {
  return [
    { key: "theme", label: "Theme", type: "theme", default: "animals" },
    { key: "wordCount", label: "Number of words", type: "range", default: 10, min: 6, max: 16, step: 1 },
    { key: sizeKey, label: "Grid size", type: "select", default: String(sizeDefault), options: [
      { value: "10", label: "10 \xD7 10" },
      { value: "12", label: "12 \xD7 12" },
      { value: "15", label: "15 \xD7 15" }
    ] }
  ];
}
function WordSearchWorksheet({ data, showAnswers }) {
  const size = data.size;
  return /* @__PURE__ */ jsx4(PageShell, { title: data.title, instructions: `Find and circle all ${data.words.length} hidden words.`, children: /* @__PURE__ */ jsxs4("div", { className: "ws-search-layout", children: [
    /* @__PURE__ */ jsx4("div", { className: "ws-search-grid", style: { gridTemplateColumns: `repeat(${size}, var(--ws-cell))` }, children: data.grid.map((row) => row.map((cell, c) => /* @__PURE__ */ jsx4("div", { className: "ws-search-cell", children: cell }, c))) }),
    /* @__PURE__ */ jsx4("div", { className: "ws-wordbank", children: data.words.map((w, i) => /* @__PURE__ */ jsx4("span", { className: "ws-bank-word", children: w }, i)) })
  ] }) });
}
function makeScramble() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || "space";
    const count = Number(config.count) || 10;
    let words = getThemeWords(theme, rng, count);
    const items = words.map((w) => ({
      original: w.toUpperCase(),
      scrambled: shuffle(w.toUpperCase().split(""), rng).join(""),
      len: w.length
    }));
    return { data: { items }, answers: words.map((w) => w.toUpperCase()), title: `${THEME_LABELS[theme] || "Themed"} Word Scramble` };
  };
  return { generator, configSchema: [
    { key: "theme", label: "Theme", type: "theme", default: "space" },
    { key: "count", label: "Number of words", type: "range", default: 10, min: 6, max: 14, step: 1 }
  ] };
}
function ScrambleWorksheet({ data, answers, showAnswers }) {
  return /* @__PURE__ */ jsx4(PageShell, { title: data.title, instructions: "Unscramble each word and write the correct spelling.", children: /* @__PURE__ */ jsx4("div", { className: "ws-scramble-grid", children: data.items.map((it, i) => /* @__PURE__ */ jsxs4("div", { className: "ws-scramble-item", children: [
    /* @__PURE__ */ jsx4("div", { className: "ws-scramble-boxes", children: it.scrambled.split("").map((l, k) => /* @__PURE__ */ jsx4("span", { className: "ws-scr-box", children: l }, k)) }),
    /* @__PURE__ */ jsxs4("div", { className: "ws-scramble-len", children: [
      it.len,
      " letters"
    ] }),
    /* @__PURE__ */ jsx4("div", { className: "ws-scramble-answer", children: showAnswers ? /* @__PURE__ */ jsx4("span", { className: "ws-answer-inline", children: answers[i] }) : /* @__PURE__ */ jsx4("div", { className: "ws-line", style: { width: it.len * 18 } }) })
  ] }, i)) }) });
}
function makeMaze() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const w = Number(config.cols) || 10, h = Number(config.rows) || 10;
    const grid = Array.from({ length: h }, () => Array.from({ length: w }, () => ({ n: true, e: true, s: true, w: true, visited: false })));
    const stack = [[0, 0]];
    grid[0][0].visited = true;
    while (stack.length) {
      const [cr, cc] = stack[stack.length - 1];
      const neighbors = [];
      if (cr > 0 && !grid[cr - 1][cc].visited) neighbors.push([cr - 1, cc, "n"]);
      if (cr < h - 1 && !grid[cr + 1][cc].visited) neighbors.push([cr + 1, cc, "s"]);
      if (cc > 0 && !grid[cr][cc - 1].visited) neighbors.push([cr, cc - 1, "w"]);
      if (cc < w - 1 && !grid[cr][cc + 1].visited) neighbors.push([cr, cc + 1, "e"]);
      if (neighbors.length) {
        const [nr, nc, dir] = pick(neighbors, rng);
        if (dir === "n") {
          grid[cr][cc].n = false;
          grid[nr][nc].s = false;
        }
        if (dir === "s") {
          grid[cr][cc].s = false;
          grid[nr][nc].n = false;
        }
        if (dir === "e") {
          grid[cr][cc].e = false;
          grid[nr][nc].w = false;
        }
        if (dir === "w") {
          grid[cr][cc].w = false;
          grid[nr][nc].e = false;
        }
        grid[nr][nc].visited = true;
        stack.push([nr, nc]);
      } else stack.pop();
    }
    grid[0][0].n = false;
    grid[h - 1][w - 1].s = false;
    return { data: { grid, w, h }, answers: [], title: "Adventure Maze" };
  };
  return { generator, configSchema: [
    { key: "rows", label: "Rows", type: "select", default: "10", options: [{ value: "8", label: "8" }, { value: "10", label: "10" }, { value: "12", label: "12" }] },
    { key: "cols", label: "Columns", type: "select", default: "10", options: [{ value: "8", label: "8" }, { value: "10", label: "10" }, { value: "12", label: "12" }] }
  ] };
}
function MazeWorksheet({ data }) {
  const { grid, w, h } = data;
  const cell = 36;
  return /* @__PURE__ */ jsx4(PageShell, { title: "Adventure Maze", instructions: "Guide the character from the START to the GOAL marker.", children: /* @__PURE__ */ jsx4("div", { className: "ws-maze-wrap", children: /* @__PURE__ */ jsxs4("svg", { className: "ws-maze", width: w * cell, height: h * cell, viewBox: `0 0 ${w * cell} ${h * cell}`, children: [
    grid.map((row, r) => row.map((cellData, c) => {
      const x = c * cell, y = r * cell;
      const segs = [];
      if (cellData.n) segs.push(/* @__PURE__ */ jsx4("line", { x1: x, y1: y, x2: x + cell, y2: y, className: "mz-wall" }, "n"));
      if (cellData.s) segs.push(/* @__PURE__ */ jsx4("line", { x1: x, y1: y + cell, x2: x + cell, y2: y + cell, className: "mz-wall" }, "s"));
      if (cellData.w) segs.push(/* @__PURE__ */ jsx4("line", { x1: x, y1: y, x2: x, y2: y + cell, className: "mz-wall" }, "w"));
      if (cellData.e) segs.push(/* @__PURE__ */ jsx4("line", { x1: x + cell, y1: y, x2: x + cell, y2: y + cell, className: "mz-wall" }, "e"));
      return /* @__PURE__ */ jsx4("g", { children: segs }, `${r}-${c}`);
    })),
    /* @__PURE__ */ jsx4("circle", { cx: cell / 2, cy: cell / 2, r: cell / 3, className: "mz-start" }),
    /* @__PURE__ */ jsxs4("g", { transform: `translate(${w * cell - cell}, ${h * cell - cell})`, children: [
      /* @__PURE__ */ jsx4("rect", { x: 4, y: 4, width: cell - 8, height: cell - 8, rx: 8, className: "mz-goal" }),
      /* @__PURE__ */ jsx4("text", { x: cell / 2, y: cell / 2 + 5, textAnchor: "middle", className: "mz-goal-text", children: "GOAL" })
    ] })
  ] }) }) });
}
function makeSudoku() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const size = Number(config.size) || 4;
    const difficulty = config.difficulty || "medium";
    const clueRatios = { easy: 0.55, medium: 0.4, hard: 0.25 };
    const targetClues = Math.max(size === 4 ? 5 : 18, Math.round(size * size * clueRatios[difficulty]));
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
    return { data: { puzzle, solved, size }, answers: solved.map((row) => row.join(" ")), title: `Kids ${size}\xD7${size} Sudoku` };
  };
  return { generator, configSchema: [
    { key: "size", label: "Grid size", type: "select", default: "4", options: [{ value: "4", label: "4 \xD7 4 (easy)" }, { value: "9", label: "9 \xD7 9 (hard)" }] },
    { key: "difficulty", label: "Difficulty", type: "select", default: "medium", options: [{ value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }] }
  ] };
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
  return /* @__PURE__ */ jsx4(PageShell, { title: `Kids ${size}\xD7${size} Sudoku`, instructions: `Fill the grid so every row, column and ${n}\xD7${n} box contains 1\u2013${size}.`, children: /* @__PURE__ */ jsx4("div", { className: "ws-sudoku", children: /* @__PURE__ */ jsx4("div", { className: `su-grid su-${size}`, children: puzzle.map((row, r) => row.map((cell, c) => /* @__PURE__ */ jsx4("div", { className: `su-cell ${(Math.floor(r / n) + Math.floor(c / n)) % 2 ? "su-shade" : ""}`, children: cell !== null ? cell : showAnswers ? /* @__PURE__ */ jsx4("span", { className: "su-solved", children: solved[r][c] }) : "" }, `${r}-${c}`))) }) }) });
}
function makeDotToDot() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.points) || 20;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const ang = i / Math.max(1, count) * Math.PI * 2;
      const rad = 60 + i % 3 * 10;
      const x = 120 + Math.cos(ang) * rad;
      const y = 120 + Math.sin(ang) * rad;
      pts.push({ x: Math.round(x), y: Math.round(y), n: i + 1 });
    }
    return { data: { pts }, answers: [], title: "Dot-to-Dot Adventure" };
  };
  return { generator, configSchema: [
    { key: "points", label: "Number of dots", type: "range", default: 20, min: 10, max: 40, step: 1 }
  ] };
}
function DotToDotWorksheet({ data }) {
  const { pts } = data;
  const W = 260, H = 260;
  return /* @__PURE__ */ jsx4(PageShell, { title: "Dot-to-Dot Adventure", instructions: "Connect the dots in order from 1 to reveal the picture.", children: /* @__PURE__ */ jsxs4("svg", { className: "ws-dots", width: W, height: H, viewBox: `0 0 ${W} ${H}`, children: [
    pts.map((p, i) => /* @__PURE__ */ jsx4("circle", { cx: p.x, cy: p.y, r: 4, className: "dot-dot" }, i)),
    pts.map((p, i) => /* @__PURE__ */ jsx4("text", { x: p.x, y: p.y - 8, textAnchor: "middle", className: "dot-label", children: p.n }, i))
  ] }) });
}
var puzzleActivities = {
  wordsearch: { name: "Word Search", category: CATEGORY2, icon: "\u{1F50D}", generator: makeWordSearch().generator, configSchema: makeWordSearch().configSchema, render: WordSearchWorksheet },
  scramble: { name: "Word Scramble", category: CATEGORY2, icon: "\u{1F500}", generator: makeScramble().generator, configSchema: makeScramble().configSchema, render: ScrambleWorksheet },
  maze: { name: "Maze", category: CATEGORY2, icon: "\u{1F300}", generator: makeMaze().generator, configSchema: makeMaze().configSchema, render: MazeWorksheet },
  sudoku: { name: "Sudoku", category: CATEGORY2, icon: "\u{1F9E9}", generator: makeSudoku().generator, configSchema: makeSudoku().configSchema, render: SudokuWorksheet },
  dotdot: { name: "Dot-to-Dot", category: CATEGORY2, icon: "\u{1F534}", generator: makeDotToDot().generator, configSchema: makeDotToDot().configSchema, render: DotToDotWorksheet }
};

// src/activities/logic.jsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var CATEGORY3 = "Logic";
var MATCH_PAIRS = [
  { type: "colors", prompt: "Match the word to its color", pairs: [["Red", "\u2764"], ["Blue", "\u{1F499}"], ["Green", "\u{1F49A}"], ["Yellow", "\u{1F49B}"], ["Orange", "\u{1F9E1}"], ["Purple", "\u{1F49C}"], ["Pink", "\u{1FA77}"], ["Brown", "\u{1F90E}"]] },
  { type: "numbers", prompt: "Match the number to its word", pairs: [["One", "1"], ["Two", "2"], ["Three", "3"], ["Four", "4"], ["Five", "5"], ["Six", "6"], ["Seven", "7"], ["Eight", "8"]] },
  { type: "animals", prompt: "Match the animal to its name", pairs: [["\u{1F436}", "Dog"], ["\u{1F431}", "Cat"], ["\u{1F42E}", "Cow"], ["\u{1F98A}", "Fox"], ["\u{1F438}", "Frog"], ["\u{1F435}", "Monkey"], ["\u{1F981}", "Lion"], ["\u{1F418}", "Elephant"]] },
  { type: "shapes", prompt: "Match the shape to its name", pairs: [["\u25CF", "Circle"], ["\u25B2", "Triangle"], ["\u25A0", "Square"], ["\u2B1F", "Pentagon"], ["\u2B20", "Hexagon"], ["\u25C6", "Diamond"], ["\u2B2D", "Oval"], ["\u2726", "Star"]] }
];
function makeMatching() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const mode = config.mode;
    const bank = MATCH_PAIRS.find((m) => m.type === mode) || MATCH_PAIRS[0];
    const left = shuffle(bank.pairs.map((p) => p[0]), rng);
    const right = shuffle(bank.pairs.map((p) => p[1]), rng);
    const prompt = bank.prompt;
    return { data: { left, right, prompt, mode }, answers: bank.pairs.map((p) => `${p[0]} \u2194 ${p[1]}`), title: "Matching Pairs Challenge" };
  };
  return { generator, configSchema: [
    { key: "mode", label: "Category", type: "select", default: "animals", options: MATCH_PAIRS.map((m) => ({ value: m.type, label: m.type[0].toUpperCase() + m.type.slice(1) })) }
  ] };
}
function MatchingWorksheet({ data, showAnswers }) {
  const { left, right } = data;
  return /* @__PURE__ */ jsx5(PageShell, { title: data.title, instructions: data.prompt + ". Draw a line to connect each pair.", children: /* @__PURE__ */ jsxs5("div", { className: "ws-match", children: [
    /* @__PURE__ */ jsx5("div", { className: "ws-match-col", children: left.map((l, i) => /* @__PURE__ */ jsx5("div", { className: "ws-match-card", children: l }, i)) }),
    /* @__PURE__ */ jsx5("div", { className: "ws-match-col", children: right.map((r, i) => /* @__PURE__ */ jsx5("div", { className: "ws-match-card", children: r }, i)) })
  ] }) });
}
function makeTicTacToe() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const games = Number(config.rounds) || 6;
    const boards = [];
    for (let i = 0; i < games; i++) {
      boards.push(Array.from({ length: 9 }, () => ""));
    }
    return { data: { boards }, answers: [], title: "Tic-Tac-Toe Championship" };
  };
  return { generator, configSchema: [
    { key: "rounds", label: "Number of boards", type: "range", default: 6, min: 2, max: 12, step: 1 }
  ] };
}
function TicTacToeWorksheet({ data }) {
  return /* @__PURE__ */ jsx5(PageShell, { title: "Tic-Tac-Toe Championship", instructions: "Take turns marking X and O. Three in a row wins!", children: /* @__PURE__ */ jsx5("div", { className: "ws-ttt-grid", children: data.boards.map((board, bi) => /* @__PURE__ */ jsx5("div", { className: "ws-ttt-board", children: board.map((cell, ci) => /* @__PURE__ */ jsx5("div", { className: "ws-ttt-cell", children: cell }, ci)) }, bi)) }) });
}
function makeHangman() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || "animals";
    const count = Number(config.words) || 6;
    let words;
    if (theme === "common") {
      words = shuffle([...COMMON_WORDS], rng).slice(0, count);
    } else {
      words = getThemeWords(theme, rng, count);
    }
    return { data: { words: words.map((w) => w.toUpperCase()) }, answers: words.map((w) => w.toUpperCase()), title: "Hangman (Word Guessing)" };
  };
  return { generator, configSchema: [
    { key: "theme", label: "Word list", type: "select", default: "animals", options: [
      { value: "common", label: "Common words" },
      { value: "animals", label: "Animals" },
      { value: "space", label: "Space" },
      { value: "food", label: "Food" }
    ] },
    { key: "words", label: "Number of words", type: "range", default: 6, min: 3, max: 10, step: 1 }
  ] };
}
function HangmanWorksheet({ data, answers, showAnswers }) {
  return /* @__PURE__ */ jsx5(PageShell, { title: "Hangman (Word Guessing)", instructions: "Guess the hidden word one letter at a time.", children: /* @__PURE__ */ jsx5("div", { className: "ws-hangman-grid", children: data.words.map((word, wi) => /* @__PURE__ */ jsxs5("div", { className: "ws-hangman-card", children: [
    /* @__PURE__ */ jsx5("div", { className: "ws-hangman-word", children: word.split("").map((l, li) => /* @__PURE__ */ jsx5("div", { className: "ws-hangman-let", children: showAnswers ? l : "" }, li)) }),
    /* @__PURE__ */ jsx5("div", { className: "ws-hangman-alphabet", children: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z" })
  ] }, wi)) }) });
}
function makePattern() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const count = Number(config.count) || 8;
    const items = [];
    const answers = [];
    const shapes = ["\u25B2", "\u25A0", "\u25CF", "\u2605", "\u2665", "\u2726"];
    for (let i = 0; i < count; i++) {
      const mode = pick(["abab", "aabb", "abc", "shape"], rng);
      let seq = [];
      let missingIdx;
      let ans;
      if (mode === "abab") {
        const a = pick(shapes, rng), b = pick(shapes.filter((s2) => s2 !== a), rng);
        seq = [a, b, a, b, a, b];
        missingIdx = pick([1, 3, 5, 2, 4], rng);
        ans = seq[missingIdx] || "";
      } else if (mode === "aabb") {
        const a = pick(shapes, rng), b = pick(shapes.filter((s2) => s2 !== a), rng);
        seq = [a, a, b, b, a, a, b, b];
        missingIdx = pick([2, 3, 6, 7], rng);
        ans = seq[missingIdx];
      } else if (mode === "abc") {
        const a = pick(shapes, rng), b = pick(shapes.filter((s2) => s2 !== a), rng), c = pick(shapes.filter((s2) => s2 !== a && s2 !== b), rng);
        seq = [a, b, c, a, b, c];
        missingIdx = pick([1, 4, 2, 5], rng);
        ans = seq[missingIdx];
      } else {
        const step = pick([2, 3, 5, 10], rng);
        const start = randInt(rng, 1, 10);
        seq = [0, 1, 2, 3, 4, 5].map((k) => start + k * step);
        missingIdx = pick([1, 2, 3, 4], rng);
        ans = seq[missingIdx];
      }
      items.push({ seq, missingIdx, isNum: mode === "shape" ? false : seq.every((s2) => typeof s2 === "number") });
      answers.push(ans);
    }
    return { data: { items }, answers, title: "Pattern Challenges" };
  };
  return { generator, configSchema: [
    { key: "count", label: "Number of patterns", type: "range", default: 8, min: 4, max: 12, step: 1 }
  ] };
}
function PatternWorksheet({ data, answers, showAnswers }) {
  return /* @__PURE__ */ jsx5(PageShell, { title: "Pattern Challenges", instructions: "What comes next? Draw or write the missing part of each pattern.", children: /* @__PURE__ */ jsx5("div", { className: "ws-pattern-grid", children: data.items.map((it, i) => /* @__PURE__ */ jsxs5("div", { className: "ws-pattern-row", children: [
    /* @__PURE__ */ jsxs5("span", { className: "ws-seq-num", children: [
      i + 1,
      "."
    ] }),
    it.seq.map((s2, k) => /* @__PURE__ */ jsx5("span", { className: `ws-seq-tile ${k === it.missingIdx ? "ws-seq-missing" : ""}`, children: k === it.missingIdx ? showAnswers ? /* @__PURE__ */ jsx5("b", { children: it.isNum ? ansOf(s2) : s2 }) : /* @__PURE__ */ jsx5("span", { className: "ws-question-mark", children: "?" }) : s2 }, k)),
    showAnswers && /* @__PURE__ */ jsx5("span", { className: "ws-answer-inline", children: answers[i] })
  ] }, i)) }) });
}
function ansOf(v) {
  return typeof v === "number" ? String(v) : String(v);
}
var logicActivities = {
  matching: { name: "Matching Pairs", category: CATEGORY3, icon: "\u{1F517}", generator: makeMatching().generator, configSchema: makeMatching().configSchema, render: MatchingWorksheet },
  tictactoe: { name: "Tic-Tac-Toe", category: CATEGORY3, icon: "\u2B55", generator: makeTicTacToe().generator, configSchema: makeTicTacToe().configSchema, render: TicTacToeWorksheet },
  hangman: { name: "Hangman", category: CATEGORY3, icon: "\u{1F635}", generator: makeHangman().generator, configSchema: makeHangman().configSchema, render: HangmanWorksheet },
  pattern: { name: "Pattern Challenges", category: CATEGORY3, icon: "\u{1F501}", generator: makePattern().generator, configSchema: makePattern().configSchema, render: PatternWorksheet }
};

// src/activities/educational.jsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var CATEGORY4 = "Educational";
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var COLOR_OBJECTS = {
  apple: { name: "Apple", path: "M100 60 a28 28 0 1 0 0 56 a28 28 0 1 0 0 -56 Z M100 70 l6 12", shape: "apple" },
  house: { name: "House", path: "M60 120 V70 L100 40 L140 70 V120 Z M78 120 V92 h44 v28", shape: "house" },
  sun: { name: "Sun", path: "M100 55 a25 25 0 1 1 -25 25 a25 25 0 0 1 25 -25 Z", shape: "sun" },
  star: { name: "Star", path: "M100 30 L115 72 L160 72 L125 97 L137 143 L100 117 L63 143 L75 97 L40 72 L85 72 Z", shape: "star" },
  fish: { name: "Fish", path: "M50 90 Q70 55 120 75 Q90 78 90 90 Q90 102 120 105 Q70 125 50 90 Z", shape: "fish" },
  butterfly: { name: "Butterfly", path: "M95 100 q-20 -35 -45 -20 q-5 25 20 30 q-20 10 -10 25 q20 15 35 -10 Z M105 100 q20 -35 45 -20 q5 25 -20 30 q20 10 10 25 q-20 15 -35 -10 Z", shape: "butterfly" },
  tree: { name: "Tree", path: "M100 140 h-15 v-30 h-10 l28 -35 l28 35 h-10 v30 Z", shape: "tree" },
  icecream: { name: "Ice cream", path: "M85 70 q15 -22 30 0 Z M78 70 a22 22 0 1 0 44 0 Z M90 98 h20 l-5 38 h-10 Z", shape: "icecream" },
  rocket: { name: "Rocket", path: "M100 20 q15 25 5 55 l-5 40 h0 l-5 -40 q-10 -30 5 -55 Z M78 100 h44 l-5 30 h-34 Z", shape: "rocket" },
  flower: { name: "Flower", path: "M100 100 m0 -22 a22 22 0 1 1 0 44 a22 22 0 1 1 0 -44 Z", shape: "flower" }
};
function makeColoring() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const objKey = config.object || "house";
    const objects = Object.entries(COLOR_OBJECTS).map(([k, v]) => ({ key: k, ...v }));
    const count = Number(config.count) || 4;
    const selected = [];
    for (let i = 0; i < count; i++) {
      const o = objects[Math.floor(rng() * objects.length)];
      selected.push({ ...o, scene: i });
    }
    return { data: { objects: selected }, answers: [], title: "Coloring Page" };
  };
  return { generator, configSchema: [
    { key: "count", label: "Images per page", type: "range", default: 4, min: 1, max: 8, step: 1 }
  ] };
}
function ColoringWorksheet({ data }) {
  return /* @__PURE__ */ jsx6(PageShell, { title: "Coloring Page", instructions: "Use your favorite colors to decorate each picture. Be creative!", compact: true, children: /* @__PURE__ */ jsx6("div", { className: "ws-color-grid", children: data.objects.map((o, i) => /* @__PURE__ */ jsxs6("div", { className: "ws-color-item", children: [
    /* @__PURE__ */ jsx6("div", { className: "ws-color-name", children: o.name }),
    /* @__PURE__ */ jsx6("svg", { viewBox: "0 0 200 200", className: "ws-color-svg", children: /* @__PURE__ */ jsx6("g", { fill: "none", stroke: "#333", strokeWidth: 5, strokeLinejoin: "round", children: /* @__PURE__ */ jsx6("path", { d: o.path }) }) }),
    /* @__PURE__ */ jsx6("div", { className: "ws-color-line" })
  ] }, i)) }) });
}
function makeLetterTrace() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const letters = (config.letters || "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("").filter((l) => l.trim());
    let selected = shuffle(letters, rng);
    const count = Number(config.count) || 4;
    selected = selected.slice(0, count);
    return { data: { letters: selected }, answers: [], title: "Letter Tracing & Phonics" };
  };
  return { generator, configSchema: [
    { key: "count", label: "Letters per page", type: "range", default: 4, min: 1, max: 8, step: 1 },
    { key: "letters", label: "Letters (comma separated)", type: "text", default: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z" }
  ] };
}
function LetterTraceWorksheet({ data }) {
  return /* @__PURE__ */ jsx6(PageShell, { title: "Letter Tracing & Phonics", instructions: "Trace each letter, say its sound, then write it yourself.", children: /* @__PURE__ */ jsx6("div", { className: "ws-letter-grid", children: data.letters.map((letter, i) => /* @__PURE__ */ jsxs6("div", { className: "ws-letter-card", children: [
    /* @__PURE__ */ jsx6("div", { className: "ws-letter-big", children: letter }),
    /* @__PURE__ */ jsxs6("div", { className: "ws-letter-lines", children: [
      /* @__PURE__ */ jsx6("div", { className: "ws-hand-line-line" }),
      /* @__PURE__ */ jsxs6("div", { className: "ws-hand-line-line dashed", children: [
        letter.toLowerCase(),
        " ",
        letter.toLowerCase(),
        " ",
        letter.toLowerCase(),
        " ",
        letter.toLowerCase()
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "ws-hand-line-line" }),
      /* @__PURE__ */ jsx6("div", { className: "ws-hand-line-line" })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "ws-letter-search", children: [
      "Find the letter: ",
      /* @__PURE__ */ jsx6("span", { className: "ws-letter-pool", children: ALPHABET.split("").map((l) => /* @__PURE__ */ jsx6("span", { className: l === letter.toLowerCase() || l === letter.toUpperCase() ? "hit" : "", children: l }, l)) })
    ] })
  ] }, i)) }) });
}
function makeWordHandwriting() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const theme = config.theme || "common";
    let words;
    if (theme === "common") words = shuffle([...COMMON_WORDS], rng);
    else words = shuffle(["cat", "dog", "sun", "hat", "car", "bus", "pen", "cup", "box"], rng);
    const count = Number(config.count) || 5;
    words = words.filter((w) => w.length <= 8).slice(0, count);
    return { data: { words }, answers: [], title: "Word Handwriting & Tracing" };
  };
  return { generator, configSchema: [
    { key: "theme", label: "Word list", type: "select", default: "common", options: [{ value: "common", label: "Common words" }, { value: "sight", label: "Sight words" }] },
    { key: "count", label: "Words per page", type: "range", default: 5, min: 2, max: 8, step: 1 }
  ] };
}
function WordHandwritingWorksheet({ data }) {
  return /* @__PURE__ */ jsx6(PageShell, { title: "Word Handwriting & Tracing", instructions: "Trace each word, then write it neatly on your own.", children: /* @__PURE__ */ jsx6("div", { className: "ws-hand-rows", children: data.words.map((word, i) => /* @__PURE__ */ jsxs6("div", { className: "ws-hand-row", children: [
    /* @__PURE__ */ jsx6("div", { className: "ws-hand-word model", children: word }),
    /* @__PURE__ */ jsxs6("div", { className: "ws-hand-traces", children: [
      /* @__PURE__ */ jsx6("div", { className: "ws-hand-line-line dashed", children: word }),
      /* @__PURE__ */ jsx6("div", { className: "ws-hand-line-line" }),
      /* @__PURE__ */ jsx6("div", { className: "ws-hand-line-line" })
    ] })
  ] }, i)) }) });
}
function makeGridDraw() {
  const generator = (config) => {
    const rng = makeRng(config.seed);
    const cols = Number(config.cols) || 12, rows = Number(config.rows) || 8;
    const cell = 30;
    const mask = [];
    for (let r = 0; r < rows; r++) {
      const row2 = [];
      for (let c = 0; c < Math.floor(cols / 2); c++) {
        const on = rng() < Math.min(0.5, 1 - Math.abs(r - rows / 2) / rows);
        row2.push(on);
      }
      mask.push(row2);
    }
    return { data: { cols, rows, cell, mask }, answers: [], title: "Grid Drawing & Symmetry" };
  };
  return { generator, configSchema: [
    { key: "cols", label: "Columns", type: "select", default: "12", options: [{ value: "10", label: "10" }, { value: "12", label: "12" }, { value: "16", label: "16" }] },
    { key: "rows", label: "Rows", type: "select", default: "8", options: [{ value: "6", label: "6" }, { value: "8", label: "8" }, { value: "10", label: "10" }] }
  ] };
}
function GridDrawWorksheet({ data }) {
  const { cols, rows, cell, mask } = data;
  const W = cols / 2 * cell, H = rows * cell;
  return /* @__PURE__ */ jsx6(PageShell, { title: "Grid Drawing & Symmetry", instructions: "The left half is drawn. Copy the pattern to the right half to make it symmetrical.", children: /* @__PURE__ */ jsx6("div", { className: "ws-grid-draw", children: /* @__PURE__ */ jsxs6("svg", { width: cols * cell, height: H, viewBox: `0 0 ${cols * cell} ${H}`, children: [
    mask.map((row, r) => row.map((on, c) => {
      if (on) {
        const x = c * cell, y = r * cell;
        const rx = (cols - 1 - c) * cell;
        return /* @__PURE__ */ jsxs6("g", { children: [
          /* @__PURE__ */ jsx6("rect", { x, y, width: cell, height: cell, fill: "#818cf8", opacity: "0.35" }),
          /* @__PURE__ */ jsx6("rect", { x: rx, y, width: cell, height: cell, fill: "none", stroke: "#94a3b8", strokeDasharray: "3 3" })
        ] }, `${r}-${c}`);
      }
      return null;
    })),
    Array.from({ length: cols + 1 }, (_, i) => /* @__PURE__ */ jsx6("line", { x1: i * cell, y1: 0, x2: i * cell, y2: H, stroke: "#cbd5e1", strokeWidth: i === cols / 2 ? 2.5 : 0.6 }, `v${i}`)),
    Array.from({ length: rows + 1 }, (_, i) => /* @__PURE__ */ jsx6("line", { x1: 0, y1: i * cell, x2: cols * cell, y2: i * cell, stroke: "#cbd5e1", strokeWidth: 0.6 }, `h${i}`))
  ] }) }) });
}
var educationalActivities = {
  coloring: { name: "Coloring Page", category: CATEGORY4, icon: "\u{1F3A8}", generator: makeColoring().generator, configSchema: makeColoring().configSchema, render: ColoringWorksheet },
  lettertrace: { name: "Letter Tracing & Phonics", category: CATEGORY4, icon: "\u{1F524}", generator: makeLetterTrace().generator, configSchema: makeLetterTrace().configSchema, render: LetterTraceWorksheet },
  handwriting: { name: "Word Handwriting & Tracing", category: CATEGORY4, icon: "\u270D\uFE0F", generator: makeWordHandwriting().generator, configSchema: makeWordHandwriting().configSchema, render: WordHandwritingWorksheet },
  griddraw: { name: "Grid Drawing & Symmetry", category: CATEGORY4, icon: "\u{1F7E6}", generator: makeGridDraw().generator, configSchema: makeGridDraw().configSchema, render: GridDrawWorksheet }
};

// src/activities/registry.js
var ACTIVITIES = {
  ...mathActivities,
  ...puzzleActivities,
  ...logicActivities,
  ...educationalActivities
};
var ACTIVITY_LIST = Object.entries(ACTIVITIES).map(([id, a]) => ({ id, ...a }));
var CATEGORY_ACTIVITIES = {
  Math: ACTIVITY_LIST.filter((a) => a.category === "Math"),
  Puzzles: ACTIVITY_LIST.filter((a) => a.category === "Puzzles"),
  Logic: ACTIVITY_LIST.filter((a) => a.category === "Logic"),
  Educational: ACTIVITY_LIST.filter((a) => a.category === "Educational")
};
function getActivity(id) {
  return ACTIVITIES[id] || null;
}
function generateActivity(activityId, config) {
  const act = getActivity(activityId);
  if (!act) return null;
  return act.generator(config);
}
function renderActivityToElement(activityId, config, { showAnswers = false } = {}) {
  const act = getActivity(activityId);
  if (!act) return null;
  const result = act.generator(config);
  if (!result) return null;
  const Comp = act.render;
  return React.createElement(Comp, {
    key: activityId + (config.seed || ""),
    data: result.data,
    answers: result.answers,
    title: result.title,
    showAnswers
  });
}

// <stdin>
var cfg = { grade: "grade2", count: 4, seed: "diag" };
var res = generateActivity("addition", cfg);
console.log("OPERANDS:", res.data.items.map((i) => i.left + "+" + i.right).join(", "));
var el = renderActivityToElement("addition", cfg, { showAnswers: true });
var html = renderToStaticMarkup(el);
var s = html.indexOf("ws-vgrid");
console.log("HAS ws-vgrid:", s > -1);
console.log(html.slice(Math.max(0, html.indexOf("ws-v-op") - 120), html.indexOf("ws-v-op") + 620));
