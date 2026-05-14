// ============================================
// Admin Dashboard JavaScript
// ============================================

'use strict';

// ── Session Check ─────────────────────────────
async function checkAuth() {
  try {
    const res  = await fetch('php/auth.php?action=check');
    const data = await res.json();
    if (!data.logged_in) {
      window.location.href = 'admin-login.html';
    } else {
      document.getElementById('adminUsername').textContent = data.username;
      loadStats();
      loadMessages();
      loadAdminProjects();
    }
  } catch {
    window.location.href = 'admin-login.html';
  }
}

// ── Logout ────────────────────────────────────
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await fetch('php/auth.php?action=logout', { method: 'POST' });
  window.location.href = 'admin-login.html';
});

// ── Sidebar Navigation ────────────────────────
document.querySelectorAll('.sidebar-link[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-link').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('page-' + btn.dataset.page)?.classList.add('active');
  });
});

// ── Stats ─────────────────────────────────────
async function loadStats() {
  try {
    const res  = await fetch('php/messages.php?action=stats');
    const data = await res.json();
    document.getElementById('statMessages').textContent = data.total_messages || 0;
    document.getElementById('statUnread').textContent   = data.unread || 0;
    document.getElementById('statProjects').textContent = data.total_projects || 0;
    const badge = document.getElementById('msgBadge');
    if (badge) badge.textContent = data.unread || '';
    if (badge) badge.style.display = data.unread > 0 ? 'inline' : 'none';
  } catch { /* fallback values stay */ }
}

// ── Messages ──────────────────────────────────
async function loadMessages() {
  const tbody = document.getElementById('messagesBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="color:var(--text-muted);font-family:var(--font-mono)">Loading…</td></tr>';

  try {
    const res  = await fetch('php/messages.php?action=list');
    const msgs = await res.json();

    if (!msgs.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="color:var(--text-muted)">No messages yet.</td></tr>';
      return;
    }

    tbody.innerHTML = msgs.map(m => `
      <tr style="${!m.is_read ? 'background:var(--accent-glow)' : ''}">
        <td><strong>${escapeHtml(m.name)}</strong></td>
        <td>${escapeHtml(m.email)}</td>
        <td>${escapeHtml(m.subject)}</td>
        <td style="font-family:var(--font-mono);font-size:.75rem">${new Date(m.created_at).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-outline" style="padding:.3rem .75rem;font-size:.78rem" onclick="viewMessage(${m.id})">View</button>
          <button class="btn btn-outline" style="padding:.3rem .75rem;font-size:.78rem;color:var(--red);border-color:var(--red)" onclick="deleteMessage(${m.id})">✕</button>
        </td>
      </tr>`).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="5" style="color:var(--red)">Could not load messages (PHP required).</td></tr>';
  }
}

async function viewMessage(id) {
  try {
    const res  = await fetch('php/messages.php?action=mark_read&id=' + id, { method: 'POST' });
    await res.json();
    loadMessages();
    loadStats();
  } catch {}
}

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  try {
    await fetch('php/messages.php?action=delete&id=' + id, { method: 'POST' });
    loadMessages();
    loadStats();
  } catch {}
}

// ── Admin Projects ────────────────────────────
let editingProjectId = null;

async function loadAdminProjects() {
  const tbody = document.getElementById('projectsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" style="color:var(--text-muted)">Loading…</td></tr>';

  try {
    const res  = await fetch('php/projects.php');
    const data = await res.json();
    tbody.innerHTML = data.map(p => `
      <tr>
        <td><strong>${escapeHtml(p.title)}</strong></td>
        <td style="font-family:var(--font-mono);font-size:.8rem">${escapeHtml(p.tech_stack)}</td>
        <td>${p.category}</td>
        <td>
          <button class="btn btn-outline" style="padding:.3rem .75rem;font-size:.78rem" onclick="editProject(${p.id})">Edit</button>
          <button class="btn btn-outline" style="padding:.3rem .75rem;font-size:.78rem;color:var(--red);border-color:var(--red)" onclick="deleteProject(${p.id})">✕</button>
        </td>
      </tr>`).join('');
  } catch {
    tbody.innerHTML = '<tr><td colspan="4" style="color:var(--red)">PHP required to manage projects.</td></tr>';
  }
}

// Open modal for new project
document.getElementById('addProjectBtn')?.addEventListener('click', () => {
  editingProjectId = null;
  document.getElementById('projectForm').reset();
  document.getElementById('modalTitle').textContent = 'Add Project';
  document.getElementById('projectModal').classList.add('open');
});

// Close modal
document.querySelectorAll('.modal-close, #cancelProject').forEach(el => {
  el.addEventListener('click', () => {
    document.getElementById('projectModal').classList.remove('open');
  });
});

// Edit project
async function editProject(id) {
  try {
    const res  = await fetch('php/projects.php?id=' + id);
    const data = await res.json();
    editingProjectId = id;
    const form = document.getElementById('projectForm');
    form.title.value       = data.title;
    form.description.value = data.description;
    form.tech_stack.value  = data.tech_stack;
    form.github_url.value  = data.github_url || '';
    form.live_url.value    = data.live_url || '';
    form.category.value    = data.category;
    form.featured.checked  = !!data.featured;
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectModal').classList.add('open');
  } catch {}
}

// Save project (create or update)
document.getElementById('projectForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    title:       form.title.value,
    description: form.description.value,
    tech_stack:  form.tech_stack.value,
    github_url:  form.github_url.value,
    live_url:    form.live_url.value,
    category:    form.category.value,
    featured:    form.featured.checked ? 1 : 0,
  };

  const url = editingProjectId
    ? `php/projects.php?_method=PUT&id=${editingProjectId}`
    : 'php/projects.php';

  try {
    const res  = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.success || data.id) {
      document.getElementById('projectModal').classList.remove('open');
      loadAdminProjects();
      loadStats();
    }
  } catch { alert('PHP server required.'); }
});

// Delete project
async function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  try {
    await fetch(`php/projects.php?_method=DELETE&id=${id}`, { method: 'POST' });
    loadAdminProjects();
    loadStats();
  } catch {}
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

// ── Init ──────────────────────────────────────
checkAuth();
