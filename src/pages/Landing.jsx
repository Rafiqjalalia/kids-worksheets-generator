import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function Landing() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <Workflow />
      <Possibilities />
      <Examples />
      <Compare />
      <Steps />
      <BookBuilder />
      <Output />
      <UseCases />
      <Payoff />
      <Pricing />
      <Objections />
      <Faq />
      <Ready />
    </main>
  );
}

function Hero() {
  return (
    <section className="hero" style={{ paddingTop: 56 }}>
      <div className="container">
        <span className="hero-badge">🎉 Special Launch Offer — Get Started for Just $9</span>
        <h1>
          Create Kids Worksheets &amp; Activity Books <span className="grad">in Minutes</span>
        </h1>
        <p className="lead">
          Turn your ideas into ready-to-print educational activities without spending hours designing
          worksheets from scratch.
        </p>
        <p style={{ color: 'var(--slate-600)', fontSize: 17, maxWidth: 720, margin: '0 auto 28px' }}>
          Create math worksheets, puzzles, tracing activities, coloring pages, educational games, and
          complete activity books — ready to export and print.
        </p>
        <div className="hero-actions">
          <Link to="/checkout" className="btn btn-primary btn-lg">
            Get Started for $9 <Icon name="arrowRight" size={18} />
          </Link>
          <Link to="/create" className="btn btn-ghost btn-lg">
            <Icon name="sparkles" /> See What You Can Create
          </Link>
        </div>
        <div className="hero-checks">
          <span><Icon name="check" size={17} /> Activities</span>
          <span><Icon name="check" size={17} /> Printable resources</span>
          <span><Icon name="check" size={17} /> Activity books</span>
        </div>
        <p style={{ color: 'var(--slate-400)', fontSize: 13, marginTop: 10 }}>
          Simple setup • Instant access • Start creating right away
        </p>
        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="hero-mock">
      <div className="mock-top"><span /><span /><span /></div>
      <div className="mock-body">
        <div className="mock-side">
          <div className="mi on">✏️ Worksheet Generator</div>
          <div className="mi">📁 Activities</div>
          <div className="mi">📓 Book Builder</div>
          <div className="mi">🗂️ My Projects</div>
          <div className="mi">📤 Export</div>
        </div>
        <div className="mock-main">
          <h4>Create an activity — Addition · Grade 2 · 20 questions</h4>
          <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 16 }}>ADDITION PRACTICE</div>
          <div className="mock-eqs">
            {['7 + 5 =', '4 + 8 =', '9 + 3 =', '6 + 7 =', '8 + 4 =', '5 + 9 ='].map((e, i) => (
              <div className="mock-eq" key={i}>{e} <em>____</em></div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="btn btn-primary btn-sm">✦ Ready to generate</span>
            <span style={{ fontSize: 13, color: 'var(--slate-500)' }}>Printable · Answer page · Activity book</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ children }) {
  return <section className="container" style={{ paddingTop: 64, paddingBottom: 64 }}>{children}</section>;
}

function Capabilities() {
  return (
    <section className="container" style={{ padding: '34px 22px' }}>
      <div className="grid3">
        {[
          { icon: 'sparkles', color: '#6366f1', title: 'Activities', text: 'Generate engaging worksheets and activities without building every page manually.' },
          { icon: 'print', color: '#f59e0b', title: 'Printable resources', text: 'Ready-to-print layouts designed for classroom, homeschool, tutoring and activity use.' },
          { icon: 'book', color: '#10b981', title: 'Activity books', text: 'Combine activities into polished, multi-page activity books with one click.' },
        ].map((c) => (
          <div className="card" key={c.title}>
            <div className="ico" style={{ background: `${c.color}1f`, color: c.color }}><Icon name={c.icon} size={26} /></div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Workflow() {
  const items = [
    ['⚡', 'Create Activities Fast', 'Generate engaging worksheets and activities without building every page manually.'],
    ['📚', 'Build Complete Activity Books', 'Combine activities into polished activity books instead of creating every page one by one.'],
    ['🖨️', 'Ready to Print', 'Create clean printable layouts designed for practical classroom, homeschool, tutoring and activity use.'],
    ['🎨', 'Create Your Way', 'Choose different activity types, themes, difficulty levels and formats to match what you need.'],
  ];
  return (
    <Section>
      <div className="section-head">
        <span className="eyebrow">The Workflow</span>
        <h2>Everything You Need to Create Better Printables</h2>
        <p>Less repetitive setup. More time to create useful learning resources.</p>
      </div>
      <div className="grid4">
        {items.map(([icon, t, d], i) => (
          <div className="card" key={t} style={{ textAlign: 'left' }}>
            <div className="ico" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)' }}><span style={{ fontSize: 26 }}>{icon}</span></div>
            <div style={{ fontWeight: 700, color: 'var(--indigo-500)', fontFamily: 'var(--font-display)', fontSize: 18 }}>0{i + 1}</div>
            <h3 style={{ fontSize: 17 }}>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const POSS = [
  { title: 'Math', icon: '➕', items: ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Number sequences', 'Counting'] },
  { title: 'Puzzles', icon: '🧩', items: ['Word searches', 'Word scrambles', 'Mazes', 'Sudoku', 'Dot-to-dot', 'Spot the difference'] },
  { title: 'Logic & Games', icon: '🧠', items: ['Matching', 'Tic-tac-toe', 'Hangman', 'Logic activities', 'Pattern challenges'] },
  { title: 'Educational', icon: '🎓', items: ['Coloring activities', 'Alphabet practice', 'Letter tracing', 'Handwriting', 'Phonics', 'Grid drawing', 'Symmetry'] },
];

function Possibilities() {
  return (
    <div style={{ background: 'var(--slate-50)' }}>
      <Section>
        <div className="section-head">
          <span className="eyebrow">Possibilities</span>
          <h2>One Tool. Dozens of Printable Possibilities.</h2>
          <p>Create practical activities across math, puzzles, logic, games and educational practice.</p>
        </div>
        <div className="grid4" style={{ gap: 16 }}>
          {POSS.map((p) => (
            <div className="card" key={p.title}>
              <div className="ico" style={{ background: 'var(--indigo-50)', fontSize: 24 }}>{p.icon}</div>
              <h3 style={{ marginTop: 0 }}>{p.title}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.items.map((it) => <span key={it} className="pill" style={{ fontSize: 12.5 }}>{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

const EXAMPLE_COPY = {
  wordsearch: ['Themed Word Search', '15×15 letter search grid with themed word bank and full solutions'],
  maze: ['Safari Adventure Maze', 'Guaranteed single-path labyrinth puzzle with start and goal markers'],
  sudoku: ['Kids 4×4 & 9×9 Sudoku', 'Four 4×4 mini puzzles per page or standard 9×9 challenge'],
  dotdot: ['Ocean Dot-to-Dot', 'Numbered dot connect puzzle revealing an object'],
  scramble: ['Space Word Scramble', '10 anagram unscramble boxes with letter length clues'],
  addition: ['Object Addition (1–20)', '20 structured addition problems with answer lines and solution keys'],
  subtraction: ['Space Subtraction Practice', 'Positive subtraction equations formatted with clean answer lines'],
  multiplication: ['Shape Multiplication Practice', 'Multiplication times table problem grids with customized difficulty'],
  division: ['Object Division Practice', 'Integer quotient problems formatted for clean division practice'],
  sequences: ['Counting & Sequences', '8 framed sequence rows with missing number challenge tiles'],
  fractions: ['Visual Fractions Practice', '6 framed fraction strips and stacked fraction number challenges'],
  matching: ['Matching Pairs Challenge', '8 two-column pairing cards with icons and answer bubble inputs'],
  tictactoe: ['Tic-Tac-Toe Championship', '6 championship match game boards with player score trackers'],
  hangman: ['Hangman (Word Guessing)', '6 framed word guessing games with letter tracking board'],
  coloring: ['Object Coloring Page', 'Bold outline coloring scene using everyday objects'],
  lettertrace: ['Letter Tracing & Phonics', 'Letter spotlight card, 4 handwriting lines and letter search'],
  handwriting: ['Word Handwriting & Tracing', '5 dotted handwriting guideline rows fitted to a single page'],
  griddraw: ['Grid Drawing & Symmetry', 'Symmetrical copy grid for drawing accuracy and spatial skills'],
  pattern: ['Number Sequence Patterns', '8 arithmetic and skip counting pattern detection cards'],
};

const EXAMPLE_META = {
  wordsearch: 'Puzzles', maze: 'Puzzles', sudoku: 'Puzzles', dotdot: 'Puzzles', scramble: 'Puzzles',
  addition: 'Math', subtraction: 'Math', multiplication: 'Math', division: 'Math', sequences: 'Math', fractions: 'Math',
  matching: 'Logic', tictactoe: 'Logic', hangman: 'Logic', pattern: 'Logic',
  coloring: 'Educational', lettertrace: 'Educational', handwriting: 'Educational', griddraw: 'Educational',
};

function Examples() {
  const [filter, setFilter] = useState('All');
  const list = Object.entries(EXAMPLE_COPY);
  const filtered = list.filter(([id]) => filter === 'All' || EXAMPLE_META[id] === filter);
  return (
    <Section>
      <div className="section-head">
        <span className="eyebrow">Real Activity Examples</span>
        <h2>See What You Can Create</h2>
        <p>Browse real printable activity examples across Math, Puzzles, Logic and Educational resources.</p>
      </div>
      <div className="cat-tabs" style={{ justifyContent: 'center' }}>
        {['All', 'Math', 'Puzzles', 'Logic', 'Educational'].map((c) => (
          <button key={c} className={`cat-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="grid3">
        {filtered.map(([id, [title, desc]]) => (
          <Link to="/create" key={id} state={{ activity: id }} className="card" style={{ display: 'block' }}>
            <div className="ico" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)', fontSize: 22 }}>
              {id === 'wordsearch' ? '🔍' : id === 'sudoku' ? '🧩' : id === 'coloring' ? '🎨' : '📄'}
            </div>
            <h3 style={{ fontSize: 16 }}>{title}</h3>
            <p>{desc}</p>
            <div style={{ marginTop: 12 }}>
              <span className="pill" style={{ fontSize: 12 }}>{EXAMPLE_META[id]}</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function Compare() {
  return (
    <div style={{ background: 'var(--slate-50)' }}>
      <Section>
        <div className="section-head">
          <span className="eyebrow">Less Repetitive Work</span>
          <h2>Still Creating Every Worksheet From Scratch?</h2>
          <p>Less repetitive work. More time for teaching, creating, and selling.</p>
        </div>
        <div className="compare">
          <div className="comp-box">
            <h3>The Old Way</h3>
            <ul>
              <li>Search for ideas</li>
              <li>Build layouts manually</li>
              <li>Format every page</li>
              <li>Create answer keys</li>
              <li>Repeat the same work</li>
              <li>Spend hours preparing activities</li>
            </ul>
          </div>
          <div className="comp-box good">
            <h3>With Kids Worksheets Generator</h3>
            <ul>
              <li>Choose what you want</li>
              <li>Generate activities</li>
              <li>Customize your content</li>
              <li>Create complete books</li>
              <li>Export your work</li>
              <li>Move on to the next task</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Steps() {
  const steps = [
    ['01', 'Choose an Activity', 'Pick the type of worksheet, puzzle, educational activity, or printable you want to create.'],
    ['02', 'Generate & Customize', 'Set your topic, difficulty, content, and preferences.'],
    ['03', 'Export & Use', 'Download your finished printable or build it into a complete activity book.'],
  ];
  return (
    <Section>
      <div className="section-head">
        <span className="eyebrow">Simple by Design</span>
        <h2>From Idea to Printable in 3 Simple Steps</h2>
      </div>
      <div className="steps">
        {steps.map(([n, t, d]) => (
          <div className="step" key={n}>
            <div className="num">{n}</div>
            <h3>{t}</h3>
            <p style={{ color: 'var(--slate-500)' }}>{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BookBuilder() {
  return (
    <div style={{ background: 'var(--slate-900)', color: '#fff' }}>
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center' }} className="bb-grid">
          <div>
            <span className="eyebrow" style={{ background: 'rgba(99,102,241,.2)', color: '#c7d2fe', borderColor: 'rgba(99,102,241,.4)' }}>Book Builder</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,38px)', margin: '14px 0 14px' }}>Turn Individual Activities Into Complete Activity Books</h2>
            <p style={{ color: '#cbd5e1', fontSize: 17 }}>Why stop at one worksheet? Combine activities into a polished activity book with multiple pages.</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 10, color: '#e2e8f0', fontWeight: 600 }}>
              {['Combine multiple activities', 'Create themed books', 'Organize pages', 'Build longer printable resources', 'Export your finished book'].map((x) => (
                <li key={x} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name="check" size={18} style={{ color: '#6ee7b7' }} /> {x}</li>
              ))}
            </ul>
            <Link to="/build" className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>Start Building Books →</Link>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {['PRACTICE PAGE — 1 + 2 = ?', 'ACTIVITY', 'ADVENTURE', 'OUTPUT'].map((l, i) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14, padding: '14px 18px' }}>
                <div className="ico" style={{ background: 'rgba(255,255,255,.1)', color: '#c7d2fe', fontSize: 20 }}>{['📄','🧩','🎨','📤'][i]}</div>
                <span style={{ fontWeight: 700 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

function Output() {
  return (
    <Section>
      <div className="section-head">
        <span className="eyebrow">Create It. Export It. Use It.</span>
        <h2>Turn generated content into practical printable resources</h2>
      </div>
      <div className="grid3">
        {[
          ['🖨️', 'Printable Pages', 'Export clean, ready-to-print single worksheets.'],
          ['📚', 'Activity Book', 'Assemble many pages into a finished, organized book.'],
          ['✅', 'Answer Pages', 'Generate matching answer keys for every activity.'],
        ].map(([i, t, d]) => (
          <div className="card" key={t} style={{ textAlign: 'center' }}>
            <div className="ico" style={{ margin: '0 auto 16px', background: 'var(--indigo-50)', fontSize: 26 }}>{i}</div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const USECASES = [
  ['👩‍🏫', 'Teachers', 'Prepare fresh classroom activities without spending your evening formatting worksheets.'],
  ['🏠', 'Homeschool Parents', 'Create new activities around the subjects your child is learning.'],
  ['👨‍🎓', 'Tutors', 'Prepare additional practice materials for different students and skill levels.'],
  ['🖨️', 'Printable Creators', 'Generate ideas and printable resources faster.'],
  ['📚', 'Activity Book Creators', 'Build collections of activities into complete books.'],
];

function UseCases() {
  return (
    <div style={{ background: 'var(--slate-50)' }}>
      <Section>
        <div className="section-head">
          <span className="eyebrow">Use Cases</span>
          <h2>Built for People Who Create Learning Resources</h2>
        </div>
        <div className="grid3">
          {USECASES.map(([i, t, d]) => (
            <div className="usecase" key={t}>
              <div className="u-ico" style={{ fontSize: 22 }}>{i}</div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 18 }}>{t}</h3>
                <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: 14.5 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Payoff() {
  return (
    <Section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }} className="pp-grid">
        <div>
          <div className="section-head" style={{ textAlign: 'left', margin: '0 0 20px' }}>
            <span className="eyebrow">The Payoff</span>
            <h2 style={{ margin: '10px 0' }}>Spend Less Time Designing. More Time Creating.</h2>
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: 16 }}>Instead of repeatedly searching for worksheets, formatting documents, creating answer pages, and assembling books manually, use one streamlined workflow.</p>
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            ['⏱', 'Save time', 'Reduce repetitive worksheet creation.'],
            ['🌟', 'Create more', 'Turn one idea into many different printable activities.'],
            ['🗂', 'Stay organized', 'Keep activity creation and book building in one place.'],
          ].map(([i, t, d]) => (
            <div className="card" key={t} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '18px 20px' }}>
              <div className="ico" style={{ background: 'var(--indigo-50)', fontSize: 22, margin: 0 }}>{i}</div>
              <div><h3 style={{ margin: 0, fontSize: 17 }}>{t}</h3><p style={{ margin: 0, fontSize: 14 }}>{d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Pricing() {
  return (
    <Section>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="price-card">
          <div style={{ fontFamily: 'var(--display-font)', fontWeight: 700, letterSpacing: '.05em', fontSize: 13, opacity: .9 }}>STARTER OFFER</div>
          <h2>$9</h2>
          <div className="per">One-time · Instant access</div>
          <p style={{ opacity: .92 }}>Get access to Kids Worksheets Generator and the tools for creating printable activities and activity books.</p>
          <Link to="/checkout" className="btn btn-white btn-lg btn-block" style={{ position: 'relative', zIndex: 2 }}>Get Instant Access for $9 →</Link>
          <div style={{ fontSize: 13, opacity: .85, marginTop: 12 }}>Secure checkout • Start creating right away</div>
        </div>
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginTop: 0 }}>You get</h3>
          <ul className="price-list">
            {['Kids Printable Generator', 'Activity Creation Tools', 'Puzzle & Educational Activities', 'Book Builder', 'Export Tools', '500 credits'].map((x) => (
              <li key={x}><Icon name="check" size={18} style={{ color: 'var(--emerald-500)' }} /> {x}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Objections() {
  const faqs = [
    ['Do I need design skills?', 'No. The generator lays out everything for you. You pick the activity, choose your options, and it formats a clean, ready-to-print page automatically.'],
    ['What can I create?', 'Math worksheets, puzzles (word search, mazes, sudoku, dot-to-dot), logic games, educational pages like tracing, handwriting, phonics, coloring and more.'],
    ['Can I create complete books?', 'Yes. The Book Builder lets you combine multiple activities into a multi-page activity book and export the whole thing together.'],
    ['Is this useful for teachers and homeschool?', 'Absolutely. It was designed for teachers, homeschool parents, tutors and printable/activity book creators.'],
    ['How do I get started?', 'Just pick the $9 starter offer, and you get instant access to start creating right away. No design skills needed.'],
  ];
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div style={{ background: 'var(--slate-50)' }}>
      <Section>
        <div className="section-head">
          <span className="eyebrow">Questions Before You Start?</span>
          <h2>Common questions, quick answers</h2>
        </div>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {faqs.map(([q, a], i) => (
            <div className={`faq-item ${openIdx === i ? 'open' : ''}`} key={q}>
              <button className="faq-q" onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
                {q} <span className="plus">{openIdx === i ? '–' : '+'}</span>
              </button>
              <div className="faq-a">{a}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Faq() {
  const items = [
    ['What is Kids Worksheets Generator?', 'A tool that creates kids worksheets, printables and activity books in minutes. You choose an activity, customize it, and export ready-to-print pages.'],
    ['Who is it for?', 'Teachers, homeschool parents, tutors, printable creators and anyone who builds activity books for kids.'],
    ['What types of activities can I create?', 'Math (addition, subtraction, multiplication, division, fractions, sequences, counting), puzzles, logic & games, and educational pages like tracing, handwriting and coloring.'],
    ['Can I build activity books?', 'Yes. Add multiple activities to a book, organize the pages, and export them all together.'],
    ['How does the $9 offer work?', 'A one-time starter offer. You get the generator, activity tools, book builder, export tools and 500 credits for a single payment of $9.'],
    ['What are credits used for?', 'Credits power your exports. Each activity you export uses a small number of credits.'],
    ['How do I access the platform?', 'Right after checkout you get instant access to the app — no waiting, no installation.'],
  ];
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <Section>
      <div className="section-head">
        <span className="eyebrow">FAQ</span>
        <h2>Quick Answers</h2>
      </div>
      <div className="grid2" style={{ gap: 14 }}>
        {items.map(([q, a], i) => (
          <div className={`faq-item ${openIdx === i ? 'open' : ''}`} key={q}>
            <button className="faq-q" onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
              {q} <span className="plus">{openIdx === i ? '–' : '+'}</span>
            </button>
            <div className="faq-a">{a}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Ready() {
  return (
    <Section>
      <div className="cta-strip">
        <span style={{ background: 'rgba(251,191,36,.15)', color: '#fbbf24', padding: '6px 14px', borderRadius: 999, fontWeight: 700, fontSize: 13 }}>$9 Starter Offer</span>
        <h2>Ready to Stop Creating Worksheets the Hard Way?</h2>
        <p style={{ color: '#cbd5e1', fontSize: 17, maxWidth: 560, margin: '0 auto 26px' }}>
          Create activities, worksheets, and books in minutes instead of starting from scratch every time.
        </p>
        <Link to="/checkout" className="btn btn-primary btn-lg">Get Started for $9 →</Link>
        <div style={{ marginTop: 14, color: '#94a3b8', fontSize: 14 }}>Start creating today.</div>
      </div>
    </Section>
  );
}
