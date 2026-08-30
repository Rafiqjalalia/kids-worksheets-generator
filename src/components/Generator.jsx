import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { getActivity, generateActivity, renderActivityToElement } from '../activities/registry.js';
import { openPrintWindow } from '../lib/export.js';
import { THEMES } from '../data/themes.js';

// A self-contained activity generator: controls + live preview + export.
export default function Generator({ activityId, initialConfig, onSaved, saveLabel }) {
  const act = getActivity(activityId);
  const [config, setConfig] = useState(() => {
    const base = {};
    if (act) for (const f of act.configSchema) base[f.key] = f.default;
    return { ...(initialConfig || {}), ...base, seed: initialConfig?.seed || String(Math.floor(Math.random() * 1e9)) };
  });
  const [showAnswers, setShowAnswers] = useState(false);
  const [showAnswerPage, setShowAnswerPage] = useState(true);
  const [toast, setToast] = useState('');

  const generated = useMemo(() => (act ? generateActivity(activityId, config) : null), [activityId, config]);
  const previewEl = useMemo(
    () => (act ? renderActivityToElement(activityId, config, { showAnswers }) : null),
    [activityId, config, showAnswers]
  );

  if (!act) return <div className="empty">Please select an activity.</div>;

  const regenerate = () => setConfig({ ...config, seed: String(Math.floor(Math.random() * 1e9)) });

  const setField = (key, value) => setConfig({ ...config, [key]: value });

  const printSingle = () => {
    openPrintWindow([previewEl], { title: act.name });
  };

  const printWithAnswers = () => {
    openPrintWindow([renderActivityToElement(activityId, config, { showAnswers: true })], { title: act.name + ' — Answers' });
  };

  const doSave = () => {
    if (onSaved) {
      onSaved({ type: 'activity', activityId, config });
      setToast('Saved to projects');
      setTimeout(() => setToast(''), 1800);
    }
  };

  return (
    <div className="gen-layout">
      {/* Controls */}
      <div className="controls">
        <h3><Icon name="settings" size={18} /> Customize</h3>
        {act.configSchema.map((f) => (
          <Field key={f.key} field={f} value={config[f.key]} onChange={(v) => setField(f.key, v)} />
        ))}
        <div className="gen-actions">
          <button className="btn btn-primary btn-block" onClick={regenerate}>
            <Icon name="refresh" size={17} /> {act.render ? 'Regenerate' : 'Generate'}
          </button>
          {saveLabel && (
            <button className="btn btn-ghost btn-block" onClick={doSave}>
              <Icon name="book" size={17} /> {saveLabel}
            </button>
          )}
        </div>
      </div>

      {/* Preview + export */}
      <div className="preview-box">
        <div className="preview-toolbar">
          <div className="l">
            <button className="btn btn-primary btn-sm" onClick={printSingle}><Icon name="print" size={16} /> Print / Save PDF</button>
            <label className="toggle-row"><input type="checkbox" checked={showAnswerPage} onChange={() => setShowAnswerPage(!showAnswerPage)} /> Answer page</label>
            <label className="toggle-row"><input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /> Show answers on page</label>
          </div>
          <div className="r">
            {showAnswerPage && (
              <button className="btn btn-ghost btn-sm" onClick={printWithAnswers}><Icon name="check" size={16} /> Print answers</button>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="preview-page">
          {generated && <>{previewEl}</>}
        </div>
        {generated?.answers?.length > 0 && (
          <details style={{ marginTop: 16 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--slate-600)' }}>Answer key</summary>
            <div style={{ marginTop: 8, padding: 12, background: 'var(--slate-50)', borderRadius: 10, fontSize: 14 }}>{generated.answers.join(' · ')}</div>
          </details>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Field({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <select value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }
  if (field.type === 'theme') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <div className="theme-chips">
          {Object.entries(THEMES).map(([k, t]) => (
            <button key={k} className={`theme-chip ${value === k ? 'active' : ''}`} onClick={() => onChange(k)}>{t.label}</button>
          ))}
        </div>
      </div>
    );
  }
  if (field.type === 'range') {
    const num = Number(value ?? field.default);
    return (
      <div className="field">
        <label>{field.label}</label>
        <div className="range-row">
          <input type="range" min={field.min} max={field.max} step={field.step || 1} value={value ?? field.default} onChange={(e) => onChange(Number(e.target.value))} />
          <span className="range-val">{num}</span>
        </div>
      </div>
    );
  }
  if (field.type === 'text') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <input type="text" value={value ?? field.default} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  return null;
}
