// localStorage-backed persistence for projects and books.

const KEY = 'kwg_projects';

export function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveProjects(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore quota errors */
  }
}

export function upsertProject(project) {
  const list = loadProjects();
  const idx = list.findIndex((p) => p.id === project.id);
  if (idx >= 0) list[idx] = project;
  else list.unshift(project);
  saveProjects(list);
  return project;
}

export function getProject(id) {
  return loadProjects().find((p) => p.id === id) || null;
}

export function deleteProject(id) {
  saveProjects(loadProjects().filter((p) => p.id !== id));
}

export function creditBalance() {
  try {
    return Number(localStorage.getItem('kwg_credits')) || 500;
  } catch {
    return 500;
  }
}
