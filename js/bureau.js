/* TCA73 — bureau.js — Espace Bureau (Airtable live) */

const AIRTABLE_TOKEN = 'patz4YaJ4KFn3dhUG.1375501d872923eee7b84ae706718379fcedc7611637800b3db327f307cf2245';
const AIRTABLE_BASE  = 'appseYjUUMY1Fyo8R';
const AIRTABLE_TABLE = 'tbl4jxGSvVjBCUL6n';

const BUREAU_DB = [
  { id:'BU01', prenom:'Corentin', nom:'Chappelet', role:'Bureau', email:'corentin.chappelet@icloud.com', password:'coco', initiales:'CC' },
];

/* Cache données live */
let MEMBRES_LIVE = [];

/* ---- Airtable fetch ---- */
async function fetchMembers() {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?maxRecords=200`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
  });
  if (!res.ok) throw new Error('Erreur Airtable ' + res.status);
  const data = await res.json();
  return data.records.map(r => {
    const f = r.fields;
    return {
      id:            r.id,
      nom:           f['Nom complet']                    || '—',
      email:         f['Email']                          || '',
      tel:           f['Téléphone']                      || '—',
      adresse:       f['Adresse']                        || '—',
      statut:        f['Statut adhésion']                || '—',
      typeLicence:   f['Type licence FFM']               || '—',
      categorie:     f['Catégorie (Compétition/Loisir)'] || '—',
      licence:       f['Numéro de licence']              || '—',
      dateAdhesion:  f['Date d’adhésion']      || '—',
      dateExpiration:f['Date expiration licence']        || '—',
      anciennete:    f['Ancienneté (en années)']|| 0,
      notes:         f['Notes administratives']          || '',
    };
  });
}

/* ---- Session bureau ---- */
let currentBureau = null;

function getBureauSession() {
  try { return JSON.parse(sessionStorage.getItem('tca73_bureau')); } catch { return null; }
}
function setBureauSession(m) { sessionStorage.setItem('tca73_bureau', JSON.stringify(m)); }
function clearBureauSession() { sessionStorage.removeItem('tca73_bureau'); }

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  currentBureau = getBureauSession();
  if (currentBureau) showBureauDashboard(currentBureau);

  document.getElementById('bureau-login-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('bureau-email').value.trim().toLowerCase();
    const pwd   = document.getElementById('bureau-password').value;
    const errEl = document.getElementById('bureau-login-error');
    const membre = BUREAU_DB.find(b => b.email === email && b.password === pwd);
    if (membre) {
      setBureauSession(membre);
      currentBureau = membre;
      showBureauDashboard(membre);
    } else {
      errEl.textContent = 'Identifiants incorrects. Accès réservé au bureau.';
      errEl.style.display = 'block';
      setTimeout(() => errEl.style.display = 'none', 4000);
    }
  });

  document.getElementById('bureau-logout-btn')?.addEventListener('click', () => {
    clearBureauSession();
    currentBureau = null;
    MEMBRES_LIVE = [];
    document.getElementById('bureau-dashboard-section').style.display = 'none';
    const loginSec = document.getElementById('login-section') || document.getElementById('bureau-login-section');
    if (loginSec) loginSec.style.display = 'flex';
  });

  /* Tabs dashboard */
  document.querySelectorAll('.bureau-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.bureau-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.bureau-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('bureau-panel-' + tab.dataset.tab)?.classList.add('active');
    });
  });

  /* Filtres adhérents */
  document.getElementById('search-adherents')?.addEventListener('input', function() { applyAdherentsFilter(); });
  document.getElementById('filter-statut')?.addEventListener('change', () => applyAdherentsFilter());
  document.getElementById('filter-type')?.addEventListener('change', () => applyAdherentsFilter());

  /* Filtre contact */
  document.getElementById('contact-filter-statut')?.addEventListener('change', () => renderContactList());
  document.getElementById('contact-filter-type')?.addEventListener('change', () => renderContactList());
  document.getElementById('contact-select-all')?.addEventListener('click', () => toggleSelectAll(true));
  document.getElementById('contact-deselect-all')?.addEventListener('click', () => toggleSelectAll(false));
  document.getElementById('contact-copy-emails')?.addEventListener('click', copySelectedEmails);
  document.getElementById('contact-mailto')?.addEventListener('click', openMailto);

  /* Filtre trésorerie */
  document.getElementById('filter-tresorerie')?.addEventListener('change', function() {
    renderTresorerie(this.value);
  });

  /* Notes */
  const saved = localStorage.getItem('tca73_bureau_notes');
  const ta = document.getElementById('bureau-notes');
  if (saved && ta) ta.value = saved;
});

/* ---- Show dashboard ---- */
async function showBureauDashboard(membre) {
  /* Fonctionne dans bureau.html ET dans espace-membre.html */
  const loginSec = document.getElementById('login-section') || document.getElementById('bureau-login-section');
  if (loginSec) loginSec.style.display = 'none';
  document.getElementById('bureau-dashboard-section').style.display = 'block';
  document.getElementById('bureau-role-display').textContent = membre.role || 'Bureau';
  document.getElementById('bureau-initiales').textContent   = membre.initiales || 'MB';
  const footer = document.getElementById('bureau-footer');
  if (footer) footer.style.display = 'block';

  showLoader(true);
  try {
    MEMBRES_LIVE = await fetchMembers();
  } catch(e) {
    showLoader(false);
    showAirtableError(e.message);
    return;
  }
  showLoader(false);

  renderStats();
  applyAdherentsFilter();
  renderTresorerie('all');
  renderCommandes();
  renderDocuments();
  renderContactList();
}

function showLoader(on) {
  const el = document.getElementById('bureau-loader');
  if (el) el.style.display = on ? 'flex' : 'none';
}

function showAirtableError(msg) {
  const el = document.getElementById('airtable-error');
  if (el) { el.textContent = 'Erreur de connexion Airtable : ' + msg; el.style.display = 'block'; }
}

/* ---- Stats ---- */
function renderStats() {
  const total    = 102; /* chiffre réel du club */
  const actifs   = MEMBRES_LIVE.filter(m => m.statut === 'Active').length;
  const attente  = MEMBRES_LIVE.filter(m => m.statut === 'En attente').length;
  const comp     = MEMBRES_LIVE.filter(m => m.typeLicence === 'Compétition').length;
  const loisir   = MEMBRES_LIVE.filter(m => m.typeLicence === 'Loisir').length;

  const today = new Date();
  const expires = MEMBRES_LIVE.filter(m => {
    if (!m.dateExpiration || m.dateExpiration === '—') return false;
    return new Date(m.dateExpiration) < today;
  }).length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-total',      total);
  set('stat-actifs',     actifs);
  set('stat-attente',    attente);
  set('stat-competition',comp);
  set('stat-loisir',     loisir);
  set('stat-expires',    expires);
}

/* ---- Adhérents ---- */
function applyAdherentsFilter() {
  const q      = (document.getElementById('search-adherents')?.value || '').toLowerCase();
  const statut = document.getElementById('filter-statut')?.value || 'all';
  const type   = document.getElementById('filter-type')?.value || 'all';

  const filtered = MEMBRES_LIVE.filter(m => {
    const matchQ = !q || m.nom.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.licence.toLowerCase().includes(q);
    const matchS = statut === 'all' || m.statut === statut;
    const matchT = type   === 'all' || m.typeLicence === type;
    return matchQ && matchS && matchT;
  });

  const countEl = document.getElementById('adherents-count');
  if (countEl) countEl.textContent = filtered.length + ' membre' + (filtered.length > 1 ? 's' : '');

  renderAdherentsTable(filtered);
}

function renderAdherentsTable(list) {
  const tbody = document.getElementById('adherents-tbody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:30px;color:#94a3b8;">Aucun résultat</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(m => {
    const statutClass = m.statut === 'Active' ? 'statut-active' : 'statut-attente';
    const today = new Date();
    const expDate = m.dateExpiration !== '—' ? new Date(m.dateExpiration) : null;
    const expClass = expDate && expDate < today ? 'statut-expire' : '';
    return `<tr>
      <td><strong>${m.nom}</strong></td>
      <td><a href="mailto:${m.email}" style="color:var(--mountain)">${m.email || '—'}</a></td>
      <td>${m.tel}</td>
      <td><span class="type-badge type-${m.typeLicence.toLowerCase()}">${m.typeLicence}</span></td>
      <td>${m.licence}</td>
      <td><span class="statut-badge ${statutClass}">${m.statut}</span></td>
      <td class="${expClass}">${m.dateExpiration}</td>
      <td>${m.anciennete} an${m.anciennete > 1 ? 's' : ''}</td>
    </tr>`;
  }).join('');
}

/* ---- Trésorerie (données statiques) ---- */
const BUREAU_TRESORERIE = [
  { date:'15/11/2024', libelle:'Cotisations adhérents — Nov.',  type:'recette', montant:960,  categorie:'Cotisations' },
  { date:'01/12/2024', libelle:'Cotisations adhérents — Déc.',  type:'recette', montant:480,  categorie:'Cotisations' },
  { date:'10/12/2024', libelle:'Matériel entretien terrain',     type:'depense', montant:340,  categorie:'Terrain' },
  { date:'15/01/2025', libelle:'Cotisations adhérents — Jan.',   type:'recette', montant:360,  categorie:'Cotisations' },
  { date:'20/01/2025', libelle:'Assurance responsabilité civile',type:'depense', montant:220,  categorie:'Assurances' },
  { date:'01/02/2025', libelle:'Cotisations adhérents — Fév.',   type:'recette', montant:480,  categorie:'Cotisations' },
  { date:'14/02/2025', libelle:'Achat plots signalisation',      type:'depense', montant:185,  categorie:'Terrain' },
  { date:'01/03/2025', libelle:'Subvention Mairie Albertville',  type:'recette', montant:800,  categorie:'Subventions' },
  { date:'15/03/2025', libelle:'Cotisations adhérents — Mars',   type:'recette', montant:360,  categorie:'Cotisations' },
  { date:'22/03/2025', libelle:'Frais déplacement compétition',  type:'depense', montant:280,  categorie:'Compétition' },
  { date:'01/04/2025', libelle:'Sponsoring Alpes Motos',         type:'recette', montant:1200, categorie:'Sponsors' },
  { date:'15/04/2025', libelle:'Location sonorisation JPO',      type:'depense', montant:150,  categorie:'Événements' },
  { date:'01/05/2025', libelle:'Sponsoring Mairie',              type:'recette', montant:800,  categorie:'Subventions' },
  { date:'10/05/2025', libelle:'Achat trophées championnat',     type:'depense', montant:320,  categorie:'Compétition' },
  { date:'20/05/2025', libelle:'Cotisations adhérents — Mai',    type:'recette', montant:480,  categorie:'Cotisations' },
];

function renderTresorerie(filtre) {
  const list   = filtre === 'all' ? BUREAU_TRESORERIE : BUREAU_TRESORERIE.filter(t => t.type === filtre);
  const tbody  = document.getElementById('tresorerie-tbody');
  if (!tbody) return;
  tbody.innerHTML = list.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.libelle}</td>
      <td><span class="cat-badge">${t.categorie}</span></td>
      <td class="${t.type === 'recette' ? 'montant-recette' : 'montant-depense'}">
        ${t.type === 'recette' ? '+' : '-'}${t.montant.toLocaleString('fr-FR')} €
      </td>
    </tr>`).join('');

  const rec = BUREAU_TRESORERIE.filter(t => t.type === 'recette').reduce((s,t) => s+t.montant, 0);
  const dep = BUREAU_TRESORERIE.filter(t => t.type === 'depense').reduce((s,t) => s+t.montant, 0);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('treso-recettes', rec.toLocaleString('fr-FR') + ' €');
  set('treso-depenses', dep.toLocaleString('fr-FR') + ' €');
  set('treso-solde',    (rec - dep).toLocaleString('fr-FR') + ' €');
}

/* ---- Commandes (statiques) ---- */
const BUREAU_COMMANDES = [
  { id:'CMD001', membre:'Pierre Dupont',  articles:'Maillot TCA73 MC (M)',             total:30,  statut:'Livré',      date:'10/03/2025' },
  { id:'CMD002', membre:'Sophie Martin',  articles:'Casquette TCA73 (Unique)',          total:10,  statut:'En attente', date:'25/03/2025' },
  { id:'CMD003', membre:'Thomas Bernard', articles:'Pantalon TCA73 (L), Gants S3 (L)', total:138, statut:'Préparé',    date:'01/04/2025' },
  { id:'CMD004', membre:'Léa Moreau',     articles:'Veste Hybrid TCA73 (S)',            total:85,  statut:'En attente', date:'05/04/2025' },
  { id:'CMD005', membre:'Hugo Petit',     articles:'Maillot HEBO ML (M)',               total:38,  statut:'Livré',      date:'12/04/2025' },
  { id:'CMD006', membre:'Chloé Simon',    articles:'Bonnet TCA73, Polo (XS)',           total:45,  statut:'En attente', date:'20/04/2025' },
];

function renderCommandes() {
  const list = document.getElementById('commandes-list');
  if (!list) return;
  list.innerHTML = BUREAU_COMMANDES.map(c => {
    const cls = c.statut === 'Livré' ? 'cmd-livre' : c.statut === 'Préparé' ? 'cmd-prepare' : 'cmd-attente';
    return `<div class="commande-card">
      <div class="commande-header">
        <span class="commande-id">#${c.id}</span>
        <span class="cmd-badge ${cls}">${c.statut}</span>
      </div>
      <div class="commande-membre">${c.membre}</div>
      <div class="commande-articles">${c.articles}</div>
      <div class="commande-footer">
        <span class="commande-date">${c.date}</span>
        <strong class="commande-total">${c.total} €</strong>
      </div>
    </div>`;
  }).join('');
}

/* ---- Documents (statiques) ---- */
const BUREAU_DOCS = [
  { nom:'Procès-verbal AG 2024',         icon:'📋', type:'PV AG',       taille:'340 Ko', date:'15/11/2024' },
  { nom:'Budget prévisionnel 2025',      icon:'💰', type:'Finance',     taille:'215 Ko', date:'01/01/2025' },
  { nom:'Statuts association TCA73',     icon:'📜', type:'Juridique',   taille:'180 Ko', date:'01/01/2020' },
  { nom:'Règlement intérieur 2025',      icon:'📄', type:'Règlement',   taille:'245 Ko', date:'01/01/2025' },
  { nom:'Convention terrain municipal', icon:'🏔️', type:'Juridique',   taille:'420 Ko', date:'01/03/2024' },
  { nom:'Liste adhérents 2025',         icon:'👥', type:'Adhérents',   taille:'95 Ko',  date:'01/06/2025' },
  { nom:'Calendrier compétitions 2025', icon:'📅', type:'Compétition', taille:'120 Ko', date:'15/01/2025' },
  { nom:'Compte rendu bureau Mars 25',  icon:'📝', type:'CR Bureau',   taille:'85 Ko',  date:'12/03/2025' },
];

function renderDocuments() {
  const grid = document.getElementById('docs-grid');
  if (!grid) return;
  grid.innerHTML = BUREAU_DOCS.map(d => `
    <div class="doc-card">
      <div class="doc-icon">${d.icon}</div>
      <div class="doc-info">
        <div class="doc-nom">${d.nom}</div>
        <div class="doc-meta"><span class="doc-type">${d.type}</span> · ${d.taille} · ${d.date}</div>
      </div>
      <button class="doc-btn" onclick="alert('Disponible après déploiement serveur.')">
        <i class="fa-solid fa-download"></i>
      </button>
    </div>`).join('');
}

/* ---- Contact membres (live Airtable) ---- */
function renderContactList() {
  const statut = document.getElementById('contact-filter-statut')?.value || 'all';
  const type   = document.getElementById('contact-filter-type')?.value   || 'all';

  const filtered = MEMBRES_LIVE.filter(m => {
    const matchS = statut === 'all' || m.statut === statut;
    const matchT = type   === 'all' || m.typeLicence === type;
    return matchS && matchT && m.email;
  });

  const list = document.getElementById('contact-members-list');
  if (!list) return;

  if (!filtered.length) {
    list.innerHTML = '<p style="text-align:center;color:#94a3b8;padding:30px 0;">Aucun membre correspondant</p>';
    updateContactCount();
    return;
  }

  list.innerHTML = filtered.map(m => {
    const statutClass = m.statut === 'Active' ? 'statut-active' : 'statut-attente';
    return `<label class="contact-member-row" data-email="${m.email}">
      <input type="checkbox" class="contact-checkbox" value="${m.email}" onchange="updateContactCount()">
      <div class="contact-member-info">
        <span class="contact-member-nom">${m.nom}</span>
        <span class="contact-member-email">${m.email}</span>
      </div>
      <div class="contact-member-badges">
        <span class="statut-badge ${statutClass}">${m.statut}</span>
        <span class="type-badge type-${m.typeLicence.toLowerCase()}">${m.typeLicence}</span>
      </div>
    </label>`;
  }).join('');

  updateContactCount();
}

function toggleSelectAll(select) {
  document.querySelectorAll('.contact-checkbox').forEach(cb => cb.checked = select);
  updateContactCount();
}

function updateContactCount() {
  const selected = document.querySelectorAll('.contact-checkbox:checked').length;
  const total    = document.querySelectorAll('.contact-checkbox').length;
  const el = document.getElementById('contact-count');
  if (el) el.textContent = `${selected} / ${total} membre${total > 1 ? 's' : ''} sélectionné${selected > 1 ? 's' : ''}`;
  const btn1 = document.getElementById('contact-copy-emails');
  const btn2 = document.getElementById('contact-mailto');
  if (btn1) btn1.disabled = selected === 0;
  if (btn2) btn2.disabled = selected === 0;
}

function getSelectedEmails() {
  return [...document.querySelectorAll('.contact-checkbox:checked')].map(cb => cb.value);
}

function copySelectedEmails() {
  const emails = getSelectedEmails().join(', ');
  if (!emails) return;
  navigator.clipboard.writeText(emails).then(() => {
    const btn = document.getElementById('contact-copy-emails');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copié !';
    btn.style.background = '#16a34a';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2500);
  });
}

function openMailto() {
  const emails = getSelectedEmails();
  if (!emails.length) return;
  const bcc = emails.join(',');
  window.location.href = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent('TCA73 — Information aux membres')}`;
}

/* ---- Notes ---- */
function saveNotes() {
  const val = document.getElementById('bureau-notes')?.value || '';
  localStorage.setItem('tca73_bureau_notes', val);
  const msg = document.getElementById('notes-saved-msg');
  if (msg) { msg.style.display = 'inline'; setTimeout(() => msg.style.display = 'none', 2500); }
}

function copyNotes() {
  const val = document.getElementById('bureau-notes')?.value || '';
  navigator.clipboard.writeText(val).then(() => {
    const msg = document.getElementById('notes-saved-msg');
    if (msg) {
      const orig = msg.innerHTML;
      msg.innerHTML = '<i class="fa-solid fa-check"></i> Copié !';
      msg.style.display = 'inline';
      setTimeout(() => { msg.style.display = 'none'; msg.innerHTML = orig; }, 2500);
    }
  });
}
