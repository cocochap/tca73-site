/* TCA73 — bureau.js — Espace Bureau */

/* Membres du bureau avec leurs rôles */
const BUREAU_DB = [
  { id:'BU01', prenom:'Corentin',  nom:'Chappelet', role:'Bureau',   email:'corentin.chappelet@icloud.com', password:'coco', initiales:'CC' },
];

/* Données de démo */
const BUREAU_ADHERENTS = [
  { id:'M001', prenom:'Pierre',   nom:'Dupont',    email:'pierre@tca73.fr',  tel:'06 12 34 56 78', categorie:'Compétition', licence:'73-2025-001', statut:'Valide',  cotisation:120, adhesion:'15/11/2024' },
  { id:'M002', prenom:'Sophie',   nom:'Martin',    email:'sophie@tca73.fr',  tel:'06 98 76 54 32', categorie:'Loisir',      licence:'73-2025-002', statut:'Valide',  cotisation:80,  adhesion:'20/11/2024' },
  { id:'M003', prenom:'Thomas',   nom:'Bernard',   email:'thomas@email.fr',  tel:'06 11 22 33 44', categorie:'Compétition', licence:'73-2025-003', statut:'Valide',  cotisation:120, adhesion:'01/12/2024' },
  { id:'M004', prenom:'Léa',      nom:'Moreau',    email:'lea@email.fr',     tel:'06 55 44 33 22', categorie:'Compétition', licence:'73-2025-004', statut:'Valide',  cotisation:120, adhesion:'10/12/2024' },
  { id:'M005', prenom:'Hugo',     nom:'Petit',     email:'hugo@email.fr',    tel:'06 77 88 99 00', categorie:'Compétition', licence:'73-2025-005', statut:'Valide',  cotisation:120, adhesion:'05/01/2025' },
  { id:'M006', prenom:'Julie',    nom:'Blanc',     email:'julie@email.fr',   tel:'06 33 44 55 66', categorie:'École',       licence:'73-2025-006', statut:'Valide',  cotisation:60,  adhesion:'10/01/2025' },
  { id:'M007', prenom:'Marc',     nom:'Dupré',     email:'marc@email.fr',    tel:'06 22 33 44 55', categorie:'Loisir',      licence:'73-2025-007', statut:'Expiré',  cotisation:80,  adhesion:'20/10/2024' },
  { id:'M008', prenom:'Chloé',    nom:'Simon',     email:'chloe@email.fr',   tel:'06 99 88 77 66', categorie:'École',       licence:'73-2025-008', statut:'Valide',  cotisation:60,  adhesion:'15/01/2025' },
  { id:'M009', prenom:'Antoine',  nom:'Laurent',   email:'antoine@email.fr', tel:'06 44 55 66 77', categorie:'Loisir',      licence:'73-2025-009', statut:'Valide',  cotisation:80,  adhesion:'20/01/2025' },
  { id:'M010', prenom:'Camille',  nom:'Rousseau',  email:'camille@email.fr', tel:'06 11 00 22 33', categorie:'Compétition', licence:'73-2025-010', statut:'Valide',  cotisation:120, adhesion:'01/02/2025' },
];

const BUREAU_TRESORERIE = [
  { date:'15/11/2024', libelle:'Cotisations adhérents — Nov.',  type:'recette',  montant:960,  categorie:'Cotisations' },
  { date:'01/12/2024', libelle:'Cotisations adhérents — Déc.',  type:'recette',  montant:480,  categorie:'Cotisations' },
  { date:'10/12/2024', libelle:'Matériel entretien terrain',     type:'depense',  montant:340,  categorie:'Terrain' },
  { date:'15/01/2025', libelle:'Cotisations adhérents — Jan.',   type:'recette',  montant:360,  categorie:'Cotisations' },
  { date:'20/01/2025', libelle:'Assurance responsabilité civile',type:'depense',  montant:220,  categorie:'Assurances' },
  { date:'01/02/2025', libelle:'Cotisations adhérents — Fév.',   type:'recette',  montant:480,  categorie:'Cotisations' },
  { date:'14/02/2025', libelle:'Achat plots signalisation',      type:'depense',  montant:185,  categorie:'Terrain' },
  { date:'01/03/2025', libelle:'Subvention Mairie Albertville',  type:'recette',  montant:800,  categorie:'Subventions' },
  { date:'15/03/2025', libelle:'Cotisations adhérents — Mars',   type:'recette',  montant:360,  categorie:'Cotisations' },
  { date:'22/03/2025', libelle:'Frais déplacement compétition',  type:'depense',  montant:280,  categorie:'Compétition' },
  { date:'01/04/2025', libelle:'Sponsoring Alpes Motos',         type:'recette',  montant:1200, categorie:'Sponsors' },
  { date:'15/04/2025', libelle:'Location sonorisation JPO',      type:'depense',  montant:150,  categorie:'Événements' },
  { date:'01/05/2025', libelle:'Sponsoring Mairie',              type:'recette',  montant:800,  categorie:'Subventions' },
  { date:'10/05/2025', libelle:'Achat trophées championnat',     type:'depense',  montant:320,  categorie:'Compétition' },
  { date:'20/05/2025', libelle:'Cotisations adhérents — Mai',    type:'recette',  montant:480,  categorie:'Cotisations' },
];

const BUREAU_COMMANDES = [
  { id:'CMD001', membre:'Pierre Dupont',   articles:'Maillot TCA73 MC (M)',               total:30,  statut:'Livré',     date:'10/03/2025' },
  { id:'CMD002', membre:'Sophie Martin',   articles:'Casquette TCA73 (Unique)',            total:10,  statut:'En attente',date:'25/03/2025' },
  { id:'CMD003', membre:'Thomas Bernard',  articles:'Pantalon TCA73 (L), Gants S3 (L)',   total:138, statut:'Préparé',   date:'01/04/2025' },
  { id:'CMD004', membre:'Léa Moreau',      articles:'Veste Hybrid TCA73 (S)',              total:85,  statut:'En attente',date:'05/04/2025' },
  { id:'CMD005', membre:'Hugo Petit',      articles:'Maillot HEBO ML (M)',                 total:38,  statut:'Livré',     date:'12/04/2025' },
  { id:'CMD006', membre:'Chloé Simon',     articles:'Bonnet TCA73 (Unique), Polo (XS)',    total:45,  statut:'En attente',date:'20/04/2025' },
];

const BUREAU_DOCS = [
  { nom:'Procès-verbal AG 2024',         icon:'📋', type:'PV AG',        taille:'340 Ko', date:'15/11/2024' },
  { nom:'Budget prévisionnel 2025',      icon:'💰', type:'Finance',      taille:'215 Ko', date:'01/01/2025' },
  { nom:'Statuts association TCA73',     icon:'📜', type:'Juridique',    taille:'180 Ko', date:'01/01/2020' },
  { nom:'Règlement intérieur 2025',      icon:'📄', type:'Règlement',    taille:'245 Ko', date:'01/01/2025' },
  { nom:'Convention terrain municipal', icon:'🏔️', type:'Juridique',    taille:'420 Ko', date:'01/03/2024' },
  { nom:'Liste adhérents 2025',         icon:'👥', type:'Adhérents',    taille:'95 Ko',  date:'01/06/2025' },
  { nom:'Calendrier compétitions 2025', icon:'📅', type:'Compétition',  taille:'120 Ko', date:'15/01/2025' },
  { nom:'Compte rendu bureau Mars 25',  icon:'📝', type:'CR Bureau',    taille:'85 Ko',  date:'12/03/2025' },
];

/* ---- Session bureau ---- */
let currentBureau = null;

function getBureauSession() {
  try { return JSON.parse(sessionStorage.getItem('tca73_bureau')); } catch { return null; }
}
function setBureauSession(m) {
  sessionStorage.setItem('tca73_bureau', JSON.stringify(m));
}
function clearBureauSession() {
  sessionStorage.removeItem('tca73_bureau');
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  currentBureau = getBureauSession();
  if (currentBureau) {
    showBureauDashboard(currentBureau);
  }

  const loginForm = document.getElementById('bureau-login-form');
  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('bureau-email').value.trim().toLowerCase();
    const pwd   = document.getElementById('bureau-password').value;
    const errEl = document.getElementById('bureau-login-error');

    const membre = BUREAU_DB.find(b => b.email === email && b.password === pwd);
    if (membre) {
      setBureauSession(membre);
      currentBureau = membre;
      showBureauDashboard(membre);
      return;
    }

    errEl.textContent = 'Identifiants incorrects. Accès réservé au bureau.';
    errEl.style.display = 'block';
    setTimeout(() => errEl.style.display = 'none', 4000);
  });

  document.getElementById('bureau-logout-btn')?.addEventListener('click', () => {
    clearBureauSession();
    currentBureau = null;
    document.getElementById('bureau-login-section').style.display = 'flex';
    document.getElementById('bureau-dashboard-section').style.display = 'none';
  });

  /* Tabs du dashboard */
  document.querySelectorAll('.bureau-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.bureau-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.bureau-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('bureau-panel-' + target)?.classList.add('active');
    });
  });

  /* Recherche adhérents */
  document.getElementById('search-adherents')?.addEventListener('input', function() {
    filterAdherents(this.value);
  });

  /* Filtre statut */
  document.getElementById('filter-statut')?.addEventListener('change', function() {
    filterAdherents(document.getElementById('search-adherents')?.value || '');
  });

  /* Filtre trésorerie */
  document.getElementById('filter-tresorerie')?.addEventListener('change', function() {
    renderTresorerie(this.value);
  });
});

function showBureauDashboard(membre) {
  document.getElementById('bureau-login-section').style.display = 'none';
  document.getElementById('bureau-dashboard-section').style.display = 'block';

  document.getElementById('bureau-role-display').textContent = membre.role;
  document.getElementById('bureau-initiales').textContent = membre.initiales || 'MB';

  renderStats();
  renderAdherents('');
  renderTresorerie('all');
  renderCommandes();
  renderDocuments();
}

/* ---- Stats overview ---- */
function renderStats() {
  const total   = BUREAU_ADHERENTS.length;
  const valides = BUREAU_ADHERENTS.filter(m => m.statut === 'Valide').length;
  const expires = BUREAU_ADHERENTS.filter(m => m.statut === 'Expiré').length;
  const recettes = BUREAU_TRESORERIE.filter(t => t.type === 'recette').reduce((s,t) => s + t.montant, 0);
  const depenses = BUREAU_TRESORERIE.filter(t => t.type === 'depense').reduce((s,t) => s + t.montant, 0);
  const solde    = recettes - depenses;
  const cmdEnAttente = BUREAU_COMMANDES.filter(c => c.statut === 'En attente').length;

  const el = id => document.getElementById(id);
  if (el('stat-adherents'))   el('stat-adherents').textContent   = total;
  if (el('stat-valides'))     el('stat-valides').textContent     = valides;
  if (el('stat-expires'))     el('stat-expires').textContent     = expires;
  if (el('stat-recettes'))    el('stat-recettes').textContent    = recettes.toLocaleString('fr-FR') + ' €';
  if (el('stat-depenses'))    el('stat-depenses').textContent    = depenses.toLocaleString('fr-FR') + ' €';
  if (el('stat-solde'))       el('stat-solde').textContent       = solde.toLocaleString('fr-FR') + ' €';
  if (el('stat-commandes'))   el('stat-commandes').textContent   = cmdEnAttente;
}

/* ---- Adhérents ---- */
function filterAdherents(search) {
  const statut = document.getElementById('filter-statut')?.value || 'all';
  const q = search.toLowerCase();
  const filtered = BUREAU_ADHERENTS.filter(m => {
    const matchSearch = !q || m.prenom.toLowerCase().includes(q) || m.nom.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    const matchStatut = statut === 'all' || m.statut === statut;
    return matchSearch && matchStatut;
  });
  renderAdherentsTable(filtered);
}

function renderAdherents(search) {
  filterAdherents(search);
}

function renderAdherentsTable(list) {
  const tbody = document.getElementById('adherents-tbody');
  if (!tbody) return;
  tbody.innerHTML = list.map(m => `
    <tr>
      <td><strong>${m.prenom} ${m.nom}</strong></td>
      <td>${m.email}</td>
      <td>${m.tel}</td>
      <td><span class="cat-badge cat-${m.categorie.toLowerCase().replace('é','e').replace('è','e')}">${m.categorie}</span></td>
      <td>${m.licence}</td>
      <td><span class="statut-badge statut-${m.statut.toLowerCase().replace('é','e')}">${m.statut}</span></td>
      <td>${m.cotisation} €</td>
      <td>${m.adhesion}</td>
    </tr>
  `).join('');
}

/* ---- Trésorerie ---- */
function renderTresorerie(filtre) {
  const list = filtre === 'all' ? BUREAU_TRESORERIE :
               BUREAU_TRESORERIE.filter(t => t.type === filtre);
  const tbody = document.getElementById('tresorerie-tbody');
  if (!tbody) return;
  tbody.innerHTML = list.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.libelle}</td>
      <td><span class="cat-badge">${t.categorie}</span></td>
      <td class="${t.type === 'recette' ? 'montant-recette' : 'montant-depense'}">
        ${t.type === 'recette' ? '+' : '-'}${t.montant.toLocaleString('fr-FR')} €
      </td>
    </tr>
  `).join('');
}

/* ---- Commandes ---- */
function renderCommandes() {
  const list = document.getElementById('commandes-list');
  if (!list) return;
  list.innerHTML = BUREAU_COMMANDES.map(c => {
    const statusClass = c.statut === 'Livré' ? 'cmd-livre' : c.statut === 'Préparé' ? 'cmd-prepare' : 'cmd-attente';
    return `
      <div class="commande-card">
        <div class="commande-header">
          <span class="commande-id">#${c.id}</span>
          <span class="cmd-badge ${statusClass}">${c.statut}</span>
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

/* ---- Documents ---- */
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
      <button class="doc-btn" onclick="alert('Fonctionnalité disponible après déploiement du serveur.')">
        <i class="fa-solid fa-download"></i>
      </button>
    </div>
  `).join('');
}
