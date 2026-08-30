import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import AppShell from '../components/AppShell.jsx';
import Generator from '../components/Generator.jsx';
import { CATEGORIES, CATEGORY_ACTIVITIES, buildDefaultConfig } from '../activities/registry.js';
import { upsertProject, creditBalance } from '../lib/storage.js';
import { uid } from '../lib/rng.js';

export default function Create() {
  const location = useLocation();
  const initialActivity = location.state?.activity || null;
  const [activity, setActivity] = useState(initialActivity);
  const [category, setCategory] = useState('Math');

  const handleSaved = (proj) => {
    const name = `${proj.activityId} worksheet`;
    upsertProject({
      id: uid(),
      name,
      type: 'activity',
      activityId: proj.activityId,
      config: proj.config,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  if (activity) {
    const actDefault = buildDefaultConfig(activity);
    return (
      <AppShell>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setActivity(null)}><Icon name="arrowLeft" size={16} /> Activities</button>
          <h1 style={{ margin: 0, fontSize: 24 }}>Create an activity</h1>
          <span className="pill" style={{ marginLeft: 'auto' }}>Credits left: {creditBalance()}</span>
        </div>
        <Generator
          key={activity}
          activityId={activity}
          initialConfig={actDefault}
          onSaved={handleSaved}
          saveLabel="Save to My Projects"
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 style={{ marginTop: 0, fontSize: 26 }}>Create an activity</h1>
      <p style={{ color: 'var(--slate-500)', marginTop: -8 }}>Ready to create. Choose an activity type to begin.</p>

      <div className="cat-tabs">
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`cat-tab ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="act-grid">
        {CATEGORY_ACTIVITIES[category]?.map((a) => (
          <button key={a.id} className={`act-card cat-${a.category}`} onClick={() => setActivity(a.id)}>
            <div className="a-ico">{a.icon}</div>
            <h4>{a.name}</h4>
            <p>{a.description || `${a.category} activity.`}</p>
          </button>
        )) || <div className="empty">No activities in this category yet.</div>}
      </div>
    </AppShell>
  );
}
