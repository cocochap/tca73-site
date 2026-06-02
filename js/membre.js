/* TCA73 — membre.js — Espace adhérent */

const MEMBRES_DB = [
  { id:'M001', prenom:'Pierre', nom:'Dupont', email:'pierre@tca73.fr', password:'trial73', categorie:'Compétition', licence:'73-2025-001', licenceExpiry:'31/10/2025', tel:'06 12 34 56 78', dateAdhesion:'15/11/2024', validUntil:'31/10/2025' },
  { id:'M002', prenom:'Sophie', nom:'Martin', email:'sophie@tca73.fr', password:'trial73', categorie:'Loisir',      licence:'73-2025-002', licenceExpiry:'31/10/2025', tel:'06 98 76 54 32', dateAdhesion:'20/11/2024', validUntil:'31/10/2025' },
];

const HISTORIQUE = [
  { date:'14 avril 2025', heure:'09h12', duree:'3h45', type:'Entraînement' },
  { date:'21 avril 2025', heure:'08h58', duree:'4h10', type:'Entraînement' },
  { date:'27 avril 2025', heure:'10h30', duree:'2h20', type:'Journée club' },
  { date:'05 mai 2025',   heure:'09h05', duree:'5h00', type:'Entraînement' },
  { date:'12 mai 2025',   heure:'09h20', duree:'3h30', type:'Compétition' },
];

const BOUTIQUE = [
  { id:'B1', nom:'Maillot TCA73',    prix:'49,90', emoji:'👕', couleur:'#0E3D91', tailles:['S','M','L','XL'] },
  { id:'B2', nom:'Casquette TCA73',  prix:'24,90', emoji:'🧢', couleur:'#E62A2A', tailles:['Unique'] },
  { id:'B3', nom:'Sweat à capuche',  prix:'64,90', emoji:'🧥', couleur:'#1A6BC8', tailles:['S','M','L','XL','XXL'] },
  { id:'B4', nom:'Sticker Pack x10', prix:'9,90',  emoji:'✨', couleur:'#57D4E6', tailles:['Unique'] },
  { id:'B5', nom:'Gourde TCA73',     prix:'19,90', emoji:'🥤', couleur:'#0E3D91', tailles:['500ml'] },
  { id:'B6', nom:'Bonnet hiver',     prix:'22,90', emoji:'🎿', couleur:'#1A6BC8', tailles:['Unique'] },
];

const DOCUMENTS = [
  { nom:'Règlement intérieur 2025',   icon:'📋', couleur:'#0E3D91', taille:'245 Ko', date:'01/01/2025' },
  { nom:'Attestation assurance FFM',  icon:'🛡️', couleur:'#27ae60', taille:'180 Ko', date:'01/11/2024' },
  { nom:'Calendrier saison 2025',     icon:'📅', couleur:'#E62A2A', taille:'320 Ko', date:'15/11/2024' },
  { nom:'Charte terrain TCA73',       icon:'📄', couleur:'#1A6BC8', taille:'95 Ko',  date:'01/01/2025' },
  { nom:'Guide débutant trial',       icon:'📗', couleur:'#57D4E6', taille:'1.2 Mo', date:'01/03/2025' },
];

/* Session */
let currentMembre = null;

function getSession() {
  try { return JSON.parse(sessionStorage.getItem('tca73_membre')); } catch { return null; }
}
function setSession(m) {
  sessionStorage.setItem('tca73_membre', JSON.stringify(m));
}
function clearSession() {
  sessionStorage.removeItem('tca73_membre');
}

/* ---- Init page ---- */
document.addEventListener('DOMContentLoaded', () => {
  const loginSection     = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  if (!loginSection) return;

  currentMembre = getSession();
  if (currentMembre) {
    showDashboard(currentMembre);
  }

  /* Formulaire connexion */
  const loginForm = document.getElementById('login-form');
  loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email    = loginForm.querySelector('[name=email]').value.trim();
    const password = loginForm.querySelector('[name=password]').value;
    const m = MEMBRES_DB.find(m => m.email === email && m.password === password);
    if (m) {
      setSession(m);
      currentMembre = m;
      showDashboard(m);
    } else {
      showLoginError('Email ou mot de passe incorrect. (Démo : pierre@tca73.fr / trial73)');
    }
  });

  /* Tabs démo */
  const loginTabBtns = document.querySelectorAll('.login-tab');
  loginTabBtns.forEach(btn => btn.addEventListener('click', () => {
    loginTabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const type = btn.dataset.type;
    const emailField = loginForm?.querySelector('[name=email]');
    const passField  = loginForm?.querySelector('[name=password]');
    if (emailField && passField) {
      emailField.value = type === 'admin' ? 'admin@tca73.fr' : 'pierre@tca73.fr';
      passField.value  = type === 'admin' ? 'admin73' : 'trial73';
    }
  }));
});

function showLoginError(msg) {
  let err = document.getElementById('login-error');
  if (!err) {
    err = document.createElement('div');
    err.id = 'login-error';
    err.style.cssText = 'background:rgba(230,42,42,0.1);border:1px solid var(--tca-red);color:var(--tca-red);padding:12px 16px;border-radius:8px;margin-top:12px;font-size:0.9rem;';
    document.getElementById('login-form').appendChild(err);
  }
  err.textContent = msg;
}

function showDashboard(m) {
  const loginSection     = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  if (loginSection)     loginSection.style.display     = 'none';
  if (dashboardSection) dashboardSection.style.display = 'block';
  document.body.style.overflow = '';

  /* Welcome */
  const welcomeName = document.getElementById('welcome-name');
  if (welcomeName) welcomeName.textContent = m.prenom;

  /* Tabs */
  document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.panel);
      if (panel) panel.classList.add('active');
      if (tab.dataset.panel === 'carte')      renderCarte(m);
      if (tab.dataset.panel === 'documents')  renderDocuments();
      if (tab.dataset.panel === 'acces')      renderAcces(m);
      if (tab.dataset.panel === 'boutique')   renderBoutique();
    });
  });

  /* Panel accueil par défaut */
  renderAccueil(m);

  /* Déconnexion */
  document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', () => {
      clearSession(); location.reload();
    });
  });
}

/* ---- Panels ---- */
function renderAccueil(m) {
  const p = document.getElementById('panel-accueil');
  if (!p) return;
  const isValid = true; // Simulated
  p.innerHTML = `
    <div class="grid-3" style="gap:20px; margin-bottom:32px;">
      <div style="background:var(--gradient-card);border-radius:var(--radius-md);padding:28px;color:white;">
        <div style="font-size:0.82rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:8px;">Statut licence</div>
        <div style="font-family:var(--font-heading);font-size:1.3rem;color:white;display:flex;align-items:center;gap:8px;">
          <span style="width:10px;height:10px;background:#4ade80;border-radius:50%;flex-shrink:0;box-shadow:0 0 6px #4ade80;"></span>
          Valide
        </div>
        <div style="color:var(--glacier);font-size:0.88rem;margin-top:4px;">Jusqu'au ${m.licenceExpiry}</div>
      </div>
      <div style="background:white;border:1px solid var(--border);border-radius:var(--radius-md);padding:28px;">
        <div style="font-size:0.82rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;">Catégorie</div>
        <div style="font-family:var(--font-heading);font-size:1.3rem;color:var(--deep);">${m.categorie}</div>
        <div style="color:var(--text-muted);font-size:0.88rem;margin-top:4px;">Saison 2025</div>
      </div>
      <div style="background:white;border:1px solid var(--border);border-radius:var(--radius-md);padding:28px;">
        <div style="font-size:0.82rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px;">Sessions cette saison</div>
        <div style="font-family:var(--font-heading);font-size:2rem;color:var(--deep);">${HISTORIQUE.length}</div>
        <div style="color:var(--text-muted);font-size:0.88rem;margin-top:4px;">Dernière : ${HISTORIQUE[HISTORIQUE.length-1].date}</div>
      </div>
    </div>
    <div style="background:white;border:1px solid var(--border);border-radius:var(--radius-md);padding:28px;">
      <h3 style="margin-bottom:20px;">Mes prochains événements</h3>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid var(--border);">
          <div style="background:var(--tca-red);color:white;border-radius:8px;padding:8px 12px;text-align:center;min-width:52px;"><div style="font-family:var(--font-heading);font-size:1.4rem;line-height:1;">14</div><div style="font-size:0.7rem;">JUIN</div></div>
          <div><strong>Championnat Savoie — Manche 4</strong><div style="color:var(--text-muted);font-size:0.85rem;">Terrain TCA73 · Départ 9h00</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;padding:12px 0;">
          <div style="background:var(--mountain);color:white;border-radius:8px;padding:8px 12px;text-align:center;min-width:52px;"><div style="font-family:var(--font-heading);font-size:1.4rem;line-height:1;">28</div><div style="font-size:0.7rem;">JUIN</div></div>
          <div><strong>Journée Portes Ouvertes</strong><div style="color:var(--text-muted);font-size:0.85rem;">Terrain TCA73 · 10h00–17h00</div></div>
        </div>
      </div>
    </div>`;
}

function renderCarte(m) {
  const p = document.getElementById('panel-carte');
  if (!p) return;
  p.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;">
      <div>
        <h3 style="margin-bottom:20px;">Carte membre numérique</h3>
        <div class="membre-card">
          <div class="membre-card-logo"><div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;background:var(--tca-red);border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:var(--font-heading);font-size:0.9rem;color:white;">TCA</div><div style="font-family:var(--font-heading);color:white;font-size:1rem;letter-spacing:0.06em;">TCA73 • TRIAL CLUB ALBERTVILLOIS</div></div></div>
          <div class="membre-card-name">${m.prenom} ${m.nom}</div>
          <div class="membre-card-cat">${m.categorie} · Saison 2025</div>
          <div class="membre-card-info">
            <div class="membre-card-field"><small>N° licence</small><span>${m.licence}</span></div>
            <div class="membre-card-field"><small>Valide jusqu'au</small><span>${m.licenceExpiry}</span></div>
            <div class="membre-card-field"><small>Adhésion</small><span>${m.dateAdhesion}</span></div>
            <div class="membre-card-field"><small>Club</small><span>TCA73</span></div>
          </div>
          <div class="membre-card-qr" id="qr-container"></div>
          <div class="membre-card-num">${m.id} • FFM AFFILIÉ</div>
        </div>
        <button class="btn btn--outline-dark" style="margin-top:16px;width:100%;justify-content:center;" onclick="window.print()"><i class="fa-solid fa-print"></i> Imprimer la carte</button>
      </div>
      <div>
        <h3 style="margin-bottom:20px;">Mes informations</h3>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${[['Prénom',m.prenom],['Nom',m.nom],['Email',m.email],['Téléphone',m.tel],['Catégorie',m.categorie],['Licence FFM',m.licence]].map(([k,v])=>`
          <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;background:white;border-radius:var(--radius-sm);border:1px solid var(--border);">
            <span style="color:var(--text-muted);font-size:0.88rem;">${k}</span>
            <strong style="font-size:0.95rem;">${v}</strong>
          </div>`).join('')}
        </div>
        <button class="btn btn--outline-dark btn--sm" style="margin-top:16px;"><i class="fa-solid fa-pen"></i> Modifier mes informations</button>
      </div>
    </div>`;

  /* QR code */
  if (typeof QRCode !== 'undefined') {
    new QRCode(document.getElementById('qr-container'), {
      text: `TCA73|${m.id}|${m.prenom} ${m.nom}|${m.licence}`,
      width: 90, height: 90,
      colorDark: '#0E3D91', colorLight: '#ffffff',
    });
  } else {
    const qr = document.getElementById('qr-container');
    if (qr) qr.innerHTML = `<div style="width:90px;height:90px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:0.65rem;color:#666;text-align:center;border-radius:4px;">QR Code<br>${m.id}</div>`;
  }
}

function renderDocuments() {
  const p = document.getElementById('panel-documents');
  if (!p) return;
  p.innerHTML = `
    <h3 style="margin-bottom:24px;">Mes documents</h3>
    <div>${DOCUMENTS.map(d => `
      <div class="doc-item">
        <div class="doc-icon" style="background:${d.couleur}22;">${d.icon}</div>
        <div class="doc-info">
          <strong>${d.nom}</strong>
          <span>Mis à jour le ${d.date} · ${d.taille}</span>
        </div>
        <button class="btn btn--outline-dark btn--sm"><i class="fa-solid fa-download"></i> Télécharger</button>
      </div>`).join('')}</div>`;
}

function renderAcces(m) {
  const p = document.getElementById('panel-acces');
  if (!p) return;
  const code = Math.floor(1000 + Math.random() * 9000);
  p.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
      <div>
        <h3 style="margin-bottom:20px;">Générer un accès terrain</h3>
        <div class="acces-badge">
          <div style="font-size:0.85rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:4px;">Code d'accès du jour</div>
          <div class="code">${code}</div>
          <div style="color:rgba(255,255,255,.65);font-size:0.82rem;">Valide aujourd'hui uniquement</div>
          <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <div style="text-align:center;">
              <div style="font-family:var(--font-heading);font-size:0.82rem;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:4px;">Date</div>
              <div style="color:white;">${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
            <div style="width:1px;background:rgba(255,255,255,.15);"></div>
            <div style="text-align:center;">
              <div style="font-family:var(--font-heading);font-size:0.82rem;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:4px;">Titulaire</div>
              <div style="color:white;">${m.prenom} ${m.nom}</div>
            </div>
          </div>
        </div>
        <div class="alert alert-info"><i class="fa-solid fa-circle-info" style="margin-right:8px;"></i>Le code change chaque jour. En cas de problème, contactez le bureau.</div>
      </div>
      <div>
        <h3 style="margin-bottom:20px;">Historique des accès</h3>
        <div>${HISTORIQUE.map(h => `
          <div class="historique-item">
            <div class="hist-date">${h.date}</div>
            <div>
              <div style="font-size:0.88rem;color:var(--text);font-weight:500;">${h.type}</div>
              <div class="hist-detail">${h.heure} · ${h.duree}</div>
            </div>
            <div style="margin-left:auto;"><span class="badge badge-green">✓ OK</span></div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function renderBoutique() {
  const p = document.getElementById('panel-boutique');
  if (!p) return;
  p.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px;">
      <h3>Boutique TCA73</h3>
      <div class="alert alert-info" style="margin:0;font-size:0.85rem;padding:8px 14px;"><i class="fa-solid fa-circle-info"></i> Commandes à retirer sur le terrain</div>
    </div>
    <div class="boutique-grid">
      ${BOUTIQUE.map(item => `
        <div class="boutique-card">
          <div class="boutique-img" style="background:${item.couleur}22;">${item.emoji}</div>
          <div class="boutique-body">
            <h4>${item.nom}</h4>
            <div class="price">${item.prix} €</div>
            ${item.tailles.length > 1 ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">${item.tailles.map(t=>`<span style="padding:3px 10px;border:1px solid var(--border);border-radius:4px;font-size:0.8rem;">${t}</span>`).join('')}</div>` : ''}
            <button class="btn btn--primary btn--sm" style="width:100%;justify-content:center;" onclick="addToCart('${item.nom}')"><i class="fa-solid fa-cart-plus"></i> Commander</button>
          </div>
        </div>`).join('')}
    </div>`;
}

function addToCart(nom) {
  alert(`"${nom}" ajouté à votre commande !\nLes commandes sont à retirer au prochain entraînement.`);
}
