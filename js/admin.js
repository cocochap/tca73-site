/* TCA73 — admin.js — Panel administrateur */

const ADMIN_CREDS = { email: 'admin@tca73.fr', password: 'admin73' };

const ADHERENTS_DB = [
  { id:'M001', prenom:'Pierre',   nom:'Dupont',    email:'pierre@tca73.fr',  tel:'06 12 34 56 78', categorie:'Compétition', licence:'73-2025-001', statut:'Valide',  adhesion:'15/11/2024' },
  { id:'M002', prenom:'Sophie',   nom:'Martin',    email:'sophie@tca73.fr',  tel:'06 98 76 54 32', categorie:'Loisir',      licence:'73-2025-002', statut:'Valide',  adhesion:'20/11/2024' },
  { id:'M003', prenom:'Thomas',   nom:'Bernard',   email:'thomas@email.fr',  tel:'06 11 22 33 44', categorie:'Compétition', licence:'73-2025-003', statut:'Valide',  adhesion:'01/12/2024' },
  { id:'M004', prenom:'Léa',      nom:'Moreau',    email:'lea@email.fr',     tel:'06 55 44 33 22', categorie:'Compétition', licence:'73-2025-004', statut:'Valide',  adhesion:'10/12/2024' },
  { id:'M005', prenom:'Hugo',     nom:'Petit',     email:'hugo@email.fr',    tel:'06 77 88 99 00', categorie:'Compétition', licence:'73-2025-005', statut:'Valide',  adhesion:'05/01/2025' },
  { id:'M006', prenom:'Julie',    nom:'Blanc',     email:'julie@email.fr',   tel:'06 33 44 55 66', categorie:'École',       licence:'73-2025-006', statut:'Valide',  adhesion:'10/01/2025' },
  { id:'M007', prenom:'Marc',     nom:'Dupré',     email:'marc@email.fr',    tel:'06 22 33 44 55', categorie:'Loisir',      licence:'73-2025-007', statut:'Expiré',  adhesion:'20/10/2024' },
  { id:'M008', prenom:'Chloé',    nom:'Simon',     email:'chloe@email.fr',   tel:'06 99 88 77 66', categorie:'École',       licence:'73-2025-008', statut:'Valide',  adhesion:'15/01/2025' },
  { id:'M009', prenom:'Antoine',  nom:'Laurent',   email:'antoine@email.fr', tel:'06 44 55 66 77', categorie:'Loisir',      licence:'73-2025-009', statut:'Valide',  adhesion:'20/01/2025' },
  { id:'M010', prenom:'Camille',  nom:'Rousseau',  email:'camille@email.fr', tel:'06 11 00 22 33', categorie:'Compétition', licence:'73-2025-010', statut:'Valide',  adhesion:'01/02/2025' },
];

const SPONSORS_DB = [
  { id:'S01', entreprise:'Alpes Motos',        contact:'Jean Favre',    email:'jf@alpesmotos.fr',  montant:1200, niveau:'Or',     renouvellement:'31/12/2025', statut:'Actif' },
  { id:'S02', entreprise:'Mairie Albertville', contact:'M. le Maire',   email:'mairie@albertville.fr', montant:800, niveau:'Or',    renouvellement:'31/12/2025', statut:'Actif' },
  { id:'S03', entreprise:'Savoie Équipement',  contact:'Paul Martin',   email:'pm@savoie-eq.fr',   montant:500, niveau:'Or',     renouvellement:'30/06/2025', statut:'Actif' },
  { id:'S04', entreprise:'Garage Savoyard',    contact:'Luc Renard',    email:'lr@garage-sav.fr',  montant:250, niveau:'Argent', renouvellement:'31/12/2025', statut:'Actif' },
  { id:'S05', entreprise:'Sport 73',           contact:'Eric Blanc',    email:'eb@sport73.fr',     montant:250, niveau:'Argent', renouvellement:'31/10/2025', statut:'Actif' },
  { id:'S06', entreprise:'Alpi Pneus',         contact:'Marc Dupont',   email:'md@alpi.fr',        montant:100, niveau:'Bronze', renouvellement:'31/12/2025', statut:'Actif' },
  { id:'S07', entreprise:'Hôtel Beaulieu',     contact:'Anne Durand',   email:'ad@beaulieu.fr',    montant:100, niveau:'Bronze', renouvellement:'30/09/2025', statut:'À relancer' },
];

const BENEVOLES_DB = [
  { prenom:'Marc',   nom:'Dupré',    role:'Responsable terrain',  dispo:['Sam','Dim'],    tel:'06 22 33 44 55' },
  { prenom:'Julie',  nom:'Blanc',    role:'Monitrice école trial', dispo:['Sam','Dim'],   tel:'06 33 44 55 66' },
  { prenom:'Pierre', nom:'Dupont',   role:'Commissaire compét.',  dispo:['Dim'],          tel:'06 12 34 56 78' },
  { prenom:'Sophie', nom:'Martin',   role:'Secrétariat',          dispo:['Sam'],          tel:'06 98 76 54 32' },
  { prenom:'Hugo',   nom:'Petit',    role:'Sécurité terrain',     dispo:['Sam','Dim'],    tel:'06 77 88 99 00' },
];

const EVENTS_DB = [
  { id:'E01', titre:'Championnat Savoie — Manche 4',    date:'14/06/2025', lieu:'Terrain TCA73', type:'Championnat',  responsable:'Marc Dupré',   statut:'Confirmé' },
  { id:'E02', titre:'Journée Portes Ouvertes',           date:'28/06/2025', lieu:'Terrain TCA73', type:'Découverte',   responsable:'Julie Blanc',  statut:'Confirmé' },
  { id:'E03', titre:'Journée Partenaires',               date:'12/07/2025', lieu:'Terrain TCA73', type:'Partenaire',   responsable:'Pierre Dupont',statut:'Confirmé' },
  { id:'E04', titre:'Démonstration Fête Nationale',      date:'20/07/2025', lieu:'Place Albertville',type:'Démo',      responsable:'Marc Dupré',   statut:'Confirmé' },
  { id:'E05', titre:'Inter-régional Rhône-Alpes',        date:'07/09/2025', lieu:'Annecy (74)',    type:'Championnat',  responsable:'Pierre Dupont',statut:'En attente' },
];

/* ---- Session admin ---- */
function getAdminSession() {
  try { return JSON.parse(sessionStorage.getItem('tca73_admin')); } catch { return null; }
}
function setAdminSession(a) { sessionStorage.setItem('tca73_admin', JSON.stringify(a)); }

document.addEventListener('DOMContentLoaded', () => {
  const loginSec  = document.getElementById('admin-login-section');
  if (!loginSec) return;

  if (getAdminSession()) showAdminPanel();

  const form = document.getElementById('admin-login-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('[name=email]').value.trim();
    const pass  = form.querySelector('[name=password]').value;
    if (email === ADMIN_CREDS.email && pass === ADMIN_CREDS.password) {
      setAdminSession({ email, role: 'admin' });
      showAdminPanel();
    } else {
      let err = document.getElementById('admin-error');
      if (!err) { err = document.createElement('div'); err.id='admin-error'; err.style.cssText='background:rgba(230,42,42,0.1);border:1px solid var(--tca-red);color:var(--tca-red);padding:12px 16px;border-radius:8px;margin-top:12px;font-size:.9rem;'; form.appendChild(err); }
      err.textContent = 'Identifiants incorrects. (Démo : admin@tca73.fr / admin73)';
    }
  });
});

function showAdminPanel() {
  const loginSec  = document.getElementById('admin-login-section');
  const panelSec  = document.getElementById('admin-panel-section');
  if (loginSec) loginSec.style.display = 'none';
  if (panelSec) panelSec.style.display = 'flex';

  /* Nav items */
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      const panel = document.getElementById('admin-panel-' + item.dataset.panel);
      if (panel) { panel.classList.add('active'); }
      const title = document.getElementById('admin-panel-title');
      if (title) title.textContent = item.querySelector('span')?.textContent || '';
      renderPanel(item.dataset.panel);
    });
  });

  /* Déco */
  document.querySelectorAll('.btn-admin-logout').forEach(btn => {
    btn.addEventListener('click', () => { sessionStorage.removeItem('tca73_admin'); location.reload(); });
  });

  /* Panel défaut */
  renderPanel('dashboard');
}

function renderPanel(name) {
  const fns = { dashboard: renderDashboard, adherents: renderAdherents, sponsors: renderSponsors, benevoles: renderBenevoles, evenements: renderEvenements, ia: renderIA };
  fns[name]?.();
}

/* ---- Dashboard ---- */
function renderDashboard() {
  const p = document.getElementById('admin-panel-dashboard');
  if (!p || p.dataset.rendered) return;
  p.dataset.rendered = '1';

  const stats = [
    { label:'Adhérents',   val: ADHERENTS_DB.length,                   icon:'👥', color:'#0E3D91', trend:'+8%', up:true },
    { label:'Compétiteurs',val: ADHERENTS_DB.filter(m=>m.categorie==='Compétition').length, icon:'🏆', color:'#E62A2A', trend:'+2', up:true },
    { label:'Sponsors',    val: SPONSORS_DB.length,                    icon:'🤝', color:'#D4A017', trend:'+1',  up:true },
    { label:'Licences actives', val: ADHERENTS_DB.filter(m=>m.statut==='Valide').length, icon:'🪪', color:'#27ae60', trend:'-1', up:false },
  ];

  p.innerHTML = `
    <div class="admin-stats">
      ${stats.map(s => `
        <div class="admin-stat-card">
          <div class="admin-stat-icon" style="background:${s.color}18;">${s.icon}</div>
          <div class="admin-stat-body">
            <strong>${s.val}</strong>
            <span>${s.label}</span>
          </div>
          <div class="admin-stat-trend ${s.up?'trend-up':'trend-down'}">${s.up?'▲':'▼'} ${s.trend}</div>
        </div>`).join('')}
    </div>

    <div class="grid-2" style="gap:24px;">
      <div style="background:white;border-radius:var(--radius-md);border:1px solid var(--border);padding:24px;box-shadow:var(--shadow-sm);">
        <h4 style="margin-bottom:16px;">Répartition des adhérents</h4>
        ${[['Compétition','#E62A2A'],['Loisir','#1A6BC8'],['École','#27ae60']].map(([cat,col]) => {
          const n = ADHERENTS_DB.filter(m=>m.categorie===cat).length;
          const pct = Math.round(n/ADHERENTS_DB.length*100);
          return `<div style="margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.9rem;">
              <span>${cat}</span><strong>${n} adhérents (${pct}%)</strong>
            </div>
            <div style="height:8px;background:var(--light-bg);border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:${col};border-radius:4px;transition:width 1s ease;"></div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="background:white;border-radius:var(--radius-md);border:1px solid var(--border);padding:24px;box-shadow:var(--shadow-sm);">
        <h4 style="margin-bottom:16px;">Sponsors — Revenus annuels</h4>
        ${[['Or',SPONSORS_DB.filter(s=>s.niveau==='Or').reduce((a,s)=>a+s.montant,0),'#D4A017'],
           ['Argent',SPONSORS_DB.filter(s=>s.niveau==='Argent').reduce((a,s)=>a+s.montant,0),'#7B8FA6'],
           ['Bronze',SPONSORS_DB.filter(s=>s.niveau==='Bronze').reduce((a,s)=>a+s.montant,0),'#A0522D']].map(([n,v,c])=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:8px;margin-bottom:8px;background:${c}12;">
            <span style="font-family:var(--font-heading);color:${c};">${n}</span>
            <strong style="color:${c};">${v.toLocaleString('fr-FR')} €</strong>
          </div>`).join('')}
        <div style="border-top:2px solid var(--border);margin-top:8px;padding-top:10px;display:flex;justify-content:space-between;font-family:var(--font-heading);">
          <span>TOTAL</span>
          <strong style="color:var(--deep);">${SPONSORS_DB.reduce((a,s)=>a+s.montant,0).toLocaleString('fr-FR')} €</strong>
        </div>
      </div>
    </div>

    <div style="background:white;border-radius:var(--radius-md);border:1px solid var(--border);padding:24px;box-shadow:var(--shadow-sm);margin-top:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h4>Alertes & actions requises</h4>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(230,42,42,.05);border-left:4px solid var(--tca-red);border-radius:0 8px 8px 0;">
          <span style="color:var(--tca-red);">🔴</span>
          <div><strong style="font-size:.93rem;">${ADHERENTS_DB.filter(m=>m.statut==='Expiré').length} licence(s) expirée(s)</strong><div style="color:var(--text-muted);font-size:.85rem;">Envoyer email de renouvellement</div></div>
          <button class="btn btn--primary btn--sm" style="margin-left:auto;">Relancer</button>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(212,160,23,.05);border-left:4px solid var(--color-gold);border-radius:0 8px 8px 0;">
          <span>🟡</span>
          <div><strong style="font-size:.93rem;">${SPONSORS_DB.filter(s=>s.statut==='À relancer').length} sponsor(s) à relancer</strong><div style="color:var(--text-muted);font-size:.85rem;">Renouvellement avant le 30/09/2025</div></div>
          <button class="btn btn--secondary btn--sm" style="margin-left:auto;">Relancer</button>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:rgba(39,174,96,.05);border-left:4px solid #27ae60;border-radius:0 8px 8px 0;">
          <span>🟢</span>
          <div><strong style="font-size:.93rem;">Prochain événement dans 12 jours</strong><div style="color:var(--text-muted);font-size:.85rem;">Championnat Savoie Manche 4 — 14/06/2025</div></div>
          <button class="btn btn--outline-dark btn--sm" style="margin-left:auto;">Voir</button>
        </div>
      </div>
    </div>`;
}

/* ---- Adhérents ---- */
function renderAdherents() {
  const p = document.getElementById('admin-panel-adherents');
  if (!p || p.dataset.rendered) return;
  p.dataset.rendered = '1';
  p.innerHTML = `
    <div class="crm-table-wrap">
      <div class="crm-toolbar">
        <div class="crm-search"><input type="text" id="search-adherents" placeholder="🔍 Rechercher un adhérent…"></div>
        <button class="btn btn--primary btn--sm" onclick="alert('Fonctionnalité en cours de développement')"><i class="fa-solid fa-plus"></i> Ajouter</button>
        <button class="btn btn--outline-dark btn--sm" onclick="exportCSV()"><i class="fa-solid fa-file-csv"></i> Exporter CSV</button>
      </div>
      <div style="overflow-x:auto;">
        <table class="crm-table" id="adherents-table">
          <thead>
            <tr>
              <th>ID</th><th>Prénom</th><th>Nom</th><th>Email</th><th>Téléphone</th>
              <th>Catégorie</th><th>Licence</th><th>Statut</th><th>Adhésion</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${ADHERENTS_DB.map(m => `
              <tr>
                <td style="font-family:monospace;font-size:.82rem;color:var(--text-muted);">${m.id}</td>
                <td>${m.prenom}</td>
                <td><strong>${m.nom}</strong></td>
                <td style="font-size:.88rem;">${m.email}</td>
                <td style="font-size:.88rem;">${m.tel}</td>
                <td><span class="badge ${m.categorie==='Compétition'?'badge-red':m.categorie==='Loisir'?'badge-blue':'badge-green'}">${m.categorie}</span></td>
                <td style="font-family:monospace;font-size:.82rem;">${m.licence}</td>
                <td><span class="badge ${m.statut==='Valide'?'badge-green':'badge-red'}">${m.statut}</span></td>
                <td style="font-size:.85rem;">${m.adhesion}</td>
                <td><button class="btn btn--outline-dark btn--sm" onclick="alert('Fiche de ${m.prenom} ${m.nom}')"><i class="fa-solid fa-eye"></i></button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  document.getElementById('search-adherents')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('#adherents-table tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

function exportCSV() {
  const headers = ['ID','Prénom','Nom','Email','Téléphone','Catégorie','Licence','Statut','Adhésion'];
  const rows = ADHERENTS_DB.map(m => [m.id,m.prenom,m.nom,m.email,m.tel,m.categorie,m.licence,m.statut,m.adhesion].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='adherents-tca73.csv'; a.click();
}

/* ---- Sponsors ---- */
function renderSponsors() {
  const p = document.getElementById('admin-panel-sponsors');
  if (!p || p.dataset.rendered) return;
  p.dataset.rendered = '1';
  p.innerHTML = `
    <div class="crm-table-wrap">
      <div class="crm-toolbar">
        <div class="crm-search"><input type="text" id="search-sponsors" placeholder="🔍 Rechercher un partenaire…"></div>
        <button class="btn btn--primary btn--sm" onclick="alert('Ajouter un partenaire')"><i class="fa-solid fa-plus"></i> Ajouter</button>
      </div>
      <div style="overflow-x:auto;">
        <table class="crm-table" id="sponsors-table">
          <thead><tr><th>ID</th><th>Entreprise</th><th>Contact</th><th>Email</th><th>Montant/an</th><th>Niveau</th><th>Renouvellement</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            ${SPONSORS_DB.map(s => `
              <tr>
                <td style="font-family:monospace;font-size:.82rem;color:var(--text-muted);">${s.id}</td>
                <td><strong>${s.entreprise}</strong></td>
                <td>${s.contact}</td>
                <td style="font-size:.88rem;">${s.email}</td>
                <td><strong>${s.montant} €</strong></td>
                <td><span class="badge ${s.niveau==='Or'?'badge-gold':s.niveau==='Argent'?'badge-gray':'badge-gray'}">${s.niveau}</span></td>
                <td style="font-size:.85rem;">${s.renouvellement}</td>
                <td><span class="badge ${s.statut==='Actif'?'badge-green':'badge-red'}">${s.statut}</span></td>
                <td style="display:flex;gap:4px;">
                  <button class="btn btn--outline-dark btn--sm" onclick="alert('Fiche ${s.entreprise}')"><i class="fa-solid fa-eye"></i></button>
                  <button class="btn btn--primary btn--sm" onclick="alert('Email envoyé à ${s.contact}')"><i class="fa-solid fa-envelope"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  document.getElementById('search-sponsors')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('#sponsors-table tbody tr').forEach(row => { row.style.display = row.textContent.toLowerCase().includes(q)?'':'none'; });
  });
}

/* ---- Bénévoles ---- */
function renderBenevoles() {
  const p = document.getElementById('admin-panel-benevoles');
  if (!p || p.dataset.rendered) return;
  p.dataset.rendered = '1';
  p.innerHTML = `
    <div class="grid-3" style="gap:20px;">
      ${BENEVOLES_DB.map(b => `
        <div style="background:white;border:1px solid var(--border);border-radius:var(--radius-md);padding:24px;box-shadow:var(--shadow-sm);">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:var(--gradient-card);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">👤</div>
            <div>
              <strong>${b.prenom} ${b.nom}</strong>
              <div style="color:var(--tca-red);font-family:var(--font-heading);font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;">${b.role}</div>
            </div>
          </div>
          <div style="font-size:.85rem;color:var(--text-muted);margin-bottom:8px;"><i class="fa-solid fa-phone" style="color:var(--mountain);margin-right:6px;"></i>${b.tel}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${b.dispo.map(d=>`<span class="badge badge-blue">${d}</span>`).join('')}
          </div>
        </div>`).join('')}
    </div>`;
}

/* ---- Événements ---- */
function renderEvenements() {
  const p = document.getElementById('admin-panel-evenements');
  if (!p || p.dataset.rendered) return;
  p.dataset.rendered = '1';
  p.innerHTML = `
    <div style="display:flex;justify-content:flex-end;margin-bottom:20px;">
      <button class="btn btn--primary" onclick="alert('Formulaire de création d\\'événement')"><i class="fa-solid fa-plus"></i> Créer un événement</button>
    </div>
    <div class="crm-table-wrap">
      <div style="overflow-x:auto;">
        <table class="crm-table">
          <thead><tr><th>ID</th><th>Titre</th><th>Date</th><th>Lieu</th><th>Type</th><th>Responsable</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            ${EVENTS_DB.map(e => `
              <tr>
                <td style="font-family:monospace;font-size:.82rem;color:var(--text-muted);">${e.id}</td>
                <td><strong>${e.titre}</strong></td>
                <td style="font-size:.88rem;">${e.date}</td>
                <td style="font-size:.85rem;">${e.lieu}</td>
                <td><span class="badge badge-blue">${e.type}</span></td>
                <td style="font-size:.88rem;">${e.responsable}</td>
                <td><span class="badge ${e.statut==='Confirmé'?'badge-green':'badge-gray'}">${e.statut}</span></td>
                <td style="display:flex;gap:4px;">
                  <button class="btn btn--outline-dark btn--sm" onclick="alert('Modifier ${e.titre}')"><i class="fa-solid fa-pen"></i></button>
                  <button class="btn btn--sm" style="background:rgba(230,42,42,.1);color:var(--tca-red);border:none;" onclick="if(confirm('Supprimer ?'))alert('Supprimé')"><i class="fa-solid fa-trash"></i></button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* ---- IA (panel admin) ---- */
function renderIA() {
  /* géré par ia.js */
  if (window.initIA) window.initIA();
}
