// Shared helpers for rendering worksheet pages.
import Icon from '../components/Icon.jsx';

// Standard worksheet page shell with title, subtitle, and optional name/date band.
export function PageShell({ title, subtitle, instructions, children, compact, answerKeyLabel }) {
  return (
    <div className="ws-page">
      <div className="ws-header">
        <div>
          <h2 className="ws-title">{title}</h2>
          {subtitle && <p className="ws-subtitle">{subtitle}</p>}
        </div>
        <div className="ws-meta">
          <span className="ws-name">Name:</span>
        </div>
      </div>
      {!compact && (
        <div className="ws-band">
          <span>Score:</span>
          <span>Date:</span>
          <span>Teacher/Parent:</span>
        </div>
      )}
      {instructions && <p className="ws-instructions">{instructions}</p>}
      {answerKeyLabel && <p className="ws-answerkey">ANSWER KEY</p>}
      <div className="ws-body">{children}</div>
    </div>
  );
}

// Column layout helper
export function Columns({ cols, gap = 20 }) {
  return <div className="ws-columns" style={{ gap }}>{cols}</div>;
}

export function Field({ label, children }) {
  return (
    <div className="ws-field">
      <span className="ws-field-label">{label}</span>
      {children}
    </div>
  );
}

export function AnswerLine({ width = '100%', height = 2 }) {
  return <div className="ws-answerline" style={{ height: `${height}px`, flex: 1 }} />;
}

export function Equations({ items, type, rng, seeded }) {
  return (
    <div className="ws-equations">
      {items.map((item, i) => {
        const left = [];
        const { left: L, right: R } = item;
        left.push(L, String(type === 'x' ? '×' : type === '÷' ? '÷' : type), R);
        return (
          <div className="ws-eq" key={i}>
            <span className="ws-eq-text">
              {L} {type === 'x' ? '×' : type === '÷' ? '÷' : type === '-' ? '–' : '+'} {R} ={' '}
            </span>
            <AnswerLine />
            <span className="ws-eq-num">{i + 1}.</span>
          </div>
        );
      })}
    </div>
  );
}

// A simple themed corner doodle to make pages child-friendly
export function CornerDoodle({ color }) {
  return (
    <svg className="ws-corner" width="70" height="70" viewBox="0 0 70 70">
      <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
        <path d="M10 30 Q10 10 30 10" />
        <circle cx="20" cy="20" r="4" />
        <circle cx="14" cy="14" r="2" />
        <circle cx="26" cy="26" r="2" />
      </g>
    </svg>
  );
}

export function MiniTitle({ text }) {
  return <div className="ws-mini-title">{text}</div>;
}

// Render a fraction stack
export function Fraction({ num, den, size = 26 }) {
  return (
    <span className="ws-fraction">
      <span className="ws-frac-num">{num}</span>
      <span className="ws-frac-line"></span>
      <span className="ws-frac-den">{den}</span>
    </span>
  );
}
