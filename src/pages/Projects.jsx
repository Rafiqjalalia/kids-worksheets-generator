import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import AppShell from '../components/AppShell.jsx';
import { loadProjects, deleteProject } from '../lib/storage.js';
import { getActivity, renderActivityToElement } from '../activities/registry.js';
import { openPrintWindow } from '../lib/export.js';
import { uid } from '../lib/rng.js';
import { upsertProject } from '../lib/storage.js';

export default function Projects() {
  const [projects, setProjects] = useState(loadProjects());

  const refresh = () => setProjects(loadProjects());

  const doDelete = (id) => { deleteProject(id); refresh(); };

  const doPrint = (proj) => {
    const elems = proj.type === 'book'
      ? proj.pages.map((p) => renderActivityToElement(p.activityId, p.config, { showAnswers: false }))
      : [renderActivityToElement(proj.activityId, proj.config, { showAnswers: false })];
    openPrintWindow(elems, { title: proj.name });
  };

  const doPrintAnswers = (proj) => {
    const elems = proj.type === 'book'
      ? proj.pages.map((p) => renderActivityToElement(p.activityId, p.config, { showAnswers: true }))
      : [renderActivityToElement(proj.activityId, proj.config, { showAnswers: true })];
    openPrintWindow(elems, { title: proj.name + ' — Answers' });
  };

  const duplicate = (proj) => {
    const copy = { ...proj, id: uid(), name: proj.name + ' (copy)', createdAt: Date.now(), updatedAt: Date.now() };
    if (copy.type !== 'book') copy.config = { ...copy.config, seed: String(Math.floor(Math.random() * 1e9)) };
    upsertProject(copy);
    refresh();
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>My Projects</h1>
        <span className="pill">{projects.length} saved</span>
        {projects.length > 0 && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={refresh}><Icon name="refresh" size={15} /> Refresh</button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="empty">
          <div className="e-ico">🗂️</div>
          <h3 style={{ color: 'var(--slate-600)', margin: '0 0 6px' }}>No projects yet</h3>
          <p>Create an activity or book and save it to see it here.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((proj) => {
            const pagesData = proj.type === 'book' ? proj.pages : [{ activityId: proj.activityId, config: proj.config }];
            const name = proj.type === 'book' ? proj.name : (() => { const a = getActivity(proj.activityId); return a ? a.name : 'Activity'; })();
            return (
              <div className="proj-card" key={proj.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="ico" style={{ background: 'var(--indigo-50)', color: 'var(--indigo-600)', fontSize: 20, width: 42, height: 42, margin: 0 }}>
                    {proj.type === 'book' ? '📓' : '📄'}
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => doDelete(proj.id)}><Icon name="trash" size={15} /></button>
                </div>
                <h4>{name}</h4>
                <div className="proj-meta">{proj.type === 'book' ? `${proj.pages.length} pages` : `${(proj.config?.count || '')} questions`}</div>
                <div className="proj-page-thumb">
                  {pagesData.map((p, i) => {
                    const act = getActivity(p.activityId);
                    return <div className="proj-thumb" key={i} title={act?.name}>{act?.icon || '📄'}</div>;
                  })}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <button className="btn btn-sm btn-primary" onClick={() => doPrint(proj)}><Icon name="print" size={15} /> Print</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => doPrintAnswers(proj)}>Answers</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => duplicate(proj)}>Duplicate</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
