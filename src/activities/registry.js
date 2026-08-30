// Central registry of all activity types.
import React from 'react';
import { mathActivities } from './math.jsx';
import { puzzleActivities } from './puzzles.jsx';
import { logicActivities } from './logic.jsx';
import { educationalActivities } from './educational.jsx';
import { THEMES } from '../data/themes.js';

export const CATEGORIES = [
  { id: 'Math', label: 'Math', icon: 'plus' },
  { id: 'Puzzles', label: 'Puzzles', icon: 'puzzle' },
  { id: 'Logic', label: 'Logic', icon: 'grid' },
  { id: 'Educational', label: 'Educational', icon: 'pencil' },
];

export const ACTIVITIES = {
  ...mathActivities,
  ...puzzleActivities,
  ...logicActivities,
  ...educationalActivities,
};

export const ACTIVITY_LIST = Object.entries(ACTIVITIES).map(([id, a]) => ({ id, ...a }));

export const CATEGORY_ACTIVITIES = {
  Math: ACTIVITY_LIST.filter((a) => a.category === 'Math'),
  Puzzles: ACTIVITY_LIST.filter((a) => a.category === 'Puzzles'),
  Logic: ACTIVITY_LIST.filter((a) => a.category === 'Logic'),
  Educational: ACTIVITY_LIST.filter((a) => a.category === 'Educational'),
};

export function getActivity(id) {
  return ACTIVITIES[id] || null;
}

// Build default config from schema
export function buildDefaultConfig(activityId) {
  const act = getActivity(activityId);
  if (!act) return { type: activityId };
  const cfg = {};
  for (const f of act.configSchema) cfg[f.key] = f.default;
  return cfg;
}

// Get a human-readable list for display
export function resolveConfigDisplay(activityId, config) {
  const act = getActivity(activityId);
  if (!act) return [];
  return act.configSchema.map((f) => {
    let val = config[f.key] ?? f.default;
    if (f.type === 'select' || f.type === 'theme') {
      const opt = f.options && f.options.find((o) => o.value === String(val));
      if (opt) val = opt.label;
      else if (f.type === 'theme' && THEMES[val]) val = THEMES[val].label;
    }
    if (f.key === 'count') val = val + ' questions';
    if (f.key === 'wordCount') val = 'Words: ' + val;
    return { label: f.label, value: String(val) };
  });
}

// Generate a deterministic result for an activity
export function generateActivity(activityId, config) {
  const act = getActivity(activityId);
  if (!act) return null;
  return act.generator(config);
}

// Produce a renderable React element for an activity (for preview + export)
export function renderActivityToElement(activityId, config, { showAnswers = false } = {}) {
  const act = getActivity(activityId);
  if (!act) return null;
  const result = act.generator(config);
  if (!result) return null;
  const Comp = act.render;
  return React.createElement(Comp, {
    key: activityId + (config.seed || ''),
    data: result.data,
    answers: result.answers,
    title: result.title,
    showAnswers,
  });
}
