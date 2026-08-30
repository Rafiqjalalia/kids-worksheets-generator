import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import Icon from '../components/Icon.jsx';
import { CATEGORIES, CATEGORY_ACTIVITIES } from '../activities/registry.js';

export default function Activities() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');

  const list = CATEGORIES.flatMap((c) => CATEGORY_ACTIVITIES[c.id].map((a) => ({ ...a, category: c.id }))).filter(
    (a) => category === 'All' || a.category === category
  );

  return (
    <AppShell>
      <h1 style={{ marginTop: 0, fontSize: 26 }}>Activity Library</h1>
      <p style={{ color: 'var(--slate-500)', marginTop: -8 }}>Browse all available activity types across Math, Puzzles, Logic and Educational.</p>

      <div className="cat-tabs">
        {['All', ...CATEGORIES.map((c) => c.id)].map((c) => (
          <button key={c} className={`cat-tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="act-grid">
        {list.map((a) => (
          <button key={a.id} className={`act-card cat-${a.category}`} onClick={() => navigate('/create', { state: { activity: a.id } })}>
            <div className="a-ico">{a.icon}</div>
            <h4>{a.name}</h4>
            <p>{a.category} activity</p>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
