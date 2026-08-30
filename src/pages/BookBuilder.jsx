import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import AppShell from '../components/AppShell.jsx';
import Generator from '../components/Generator.jsx';
import { CATEGORIES, CATEGORY_ACTIVITIES, buildDefaultConfig, renderActivityToElement } from '../activities/registry.js';
import { openPrintWindow } from '../lib/export.js';
import { upsertProject } from '../lib/storage.js';
import { uid } from '../lib/rng.js';

export default function BookBuilder() {
  const [pages, setPages] = useState([]); // { key, activityId, config }
  const [pickerOpen, setPickerOpen] = useState(false);
  const [category, setCategory] = useState('Math');
  const [editing, setEditing] = useState(null); // active page config
  const [toast, setToast] = useState('');

  const addPage = (activityId) => {
    setPages((p) => [...p, { key: uid(), activityId, config: buildDefaultConfig(activityId), name: activityId }]);
    setPickerOpen(false);
    setCategory('Math');
  };

  const updatePage = (key, config) => {
    setPages((p) => p.map((pg) => (pg.key === key ? { ...pg, config } : pg)));
  };

  const removePage = (key) => setPages((p) => p.filter((pg) => pg.key !== key));
  const move = (idx, dir) => {
    setPages((p) => {
      const next = [...p];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return next;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const printBook = () => {
    const elements = pages.map((pg) => renderActivityToElement(pg.activityId, pg.config, { showAnswers: false }));
    openPrintWindow(elements, { title: 'My Activity Book' });
  };

  const printAnswers = () => {
    const elements = pages.map((pg) => renderActivityToElement(pg.activityId, pg.config, { showAnswers: true }));
    openPrintWindow(elements, { title: 'My Activity Book — Answers' });
  };

  const saveBook = () => {
    upsertProject({
      id: uid(), name: 'My Activity Book', type: 'book',
      pages: pages.map((pg) => ({ activityId: pg.activityId, config: pg.config })),
      createdAt: Date.now(), updatedAt: Date.now(),
    });
    setToast('Book saved to My Projects');
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>Book Builder</h1>
        <span className="pill">{pages.length} pages</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" disabled={pages.length === 0} onClick={printAnswers}><Icon name="check" size={16} /> Answer pages</button>
          <button className="btn btn-primary btn-sm" disabled={pages.length === 0} onClick={printBook}><Icon name="print" size={16} /> Print book / PDF</button>
          <button className="btn btn-ghost btn-sm" disabled={pages.length === 0} onClick={saveBook}><Icon name="folder" size={16} /> Save book</button>
        </div>
      </div>

      {pages.length === 0 && !pickerOpen && (
        <div className="empty" style={{ border: '1.5px dashed var(--slate-300)', borderRadius: 16, marginTop: 20 }}>
          <div className="e-ico">📓</div>
          <h3 style={{ color: 'var(--slate-600)', margin: '0 0 6px' }}>Build a complete activity book</h3>
          <p style={{ margin: '0 0 18px' }}>Combine multiple activities into a polished, multi-page activity book.</p>
          <button className="btn btn-primary" onClick={() => setPickerOpen(true)}><Icon name="plus" size={17} /> Add activity</button>
        </div>
      )}

      {pickerOpen && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Add an activity to your book</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setPickerOpen(false)}>Close</button>
          </div>
          <div className="cat-tabs">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={`cat-tab ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>{c.label}</button>
            ))}
          </div>
          <div className="act-grid">
            {CATEGORY_ACTIVITIES[category]?.map((a) => (
              <button key={a.id} className="act-card" onClick={() => addPage(a.id)}>
                <div className="a-ico">{a.icon}</div>
                <h4>{a.name}</h4>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="book-list">
        {pages.map((pg, i) => (
          <div className="book-card" key={pg.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>Page {i + 1}</h4>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-ghost btn-sm" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                <button className="btn btn-ghost btn-sm" disabled={i === pages.length - 1} onClick={() => move(i, 1)}>↓</button>
                <button className="btn btn-ghost btn-sm" onClick={() => removePage(pg.key)}><Icon name="trash" size={15} /></button>
              </div>
            </div>
            <div style={{ color: 'var(--slate-500)', fontSize: 14, margin: '6px 0 10px' }}>{pg.name}</div>
            <button className="btn btn-ghost btn-sm btn-block" onClick={() => setEditing(editing === pg.key ? null : pg.key)}>
              <Icon name="settings" size={15} /> {editing === pg.key ? 'Close settings' : 'Customize'}
            </button>
          </div>
        ))}
      </div>

      {pages.length > 0 && (
        <button className="btn btn-primary" style={{ marginTop: 22 }} onClick={() => setPickerOpen(true)}><Icon name="plus" size={17} /> Add another activity</button>
      )}

      {/* Live editor modal for the selected page */}
      {editing && (() => {
        const pg = pages.find((p) => p.key === editing);
        if (!pg) return null;
        return (
          <div className="modal-overlay" onClick={() => setEditing(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="close" onClick={() => setEditing(null)}>✕</button>
              <Generator
                key={pg.key}
                activityId={pg.activityId}
                initialConfig={pg.config}
                onSaved={(proj) => updatePage(pg.key, proj.config)}
                saveLabel="Update page"
              />
            </div>
          </div>
        );
      })()}

      {toast && <div className="toast">{toast}</div>}
    </AppShell>
  );
}
