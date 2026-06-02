/* TCA73 — ia.js — Assistants IA */

/* ============================================================
   CONFIGURATION — Renseignez votre clé API Anthropic ici.
   Pour la sécurité en production, utilisez un backend proxy.
   ============================================================ */
const IA_CONFIG = {
  apiKey:  localStorage.getItem('tca73_api_key') || '',
  model:   'claude-sonnet-4-6',
  baseURL: 'https://api.anthropic.com/v1/messages',
};

const TCA_CONTEXT = `Tu es l'assistant officiel du Trial Club Albertvillois 73 (TCA73), club de trial moto situé à Albertville en Savoie (73).
Le club a été fondé en 2019, compte plus de 100 adhérents, et dispose d'un terrain à Albertville.
Il est affilié à la Fédération Française de Motocyclisme (FFM) et propose trois sections : école de trial (dès 5 ans), loisir adulte et compétition.
Le trial est une discipline de franchissement d'obstacles (rochers, bûches, palettes) sans poser le pied à terre. Ce n'est pas du motocross, c'est une discipline de précision.
Adhésion : 50€ (jeune loisir), 80€ (adulte loisir), 90€ (jeune compétition), 130€ (adulte compétition). + Licence FFM obligatoire.
Contact : contact@tca73.fr. Terrain : Albertville (73). Sessions : week-ends toute l'année.
Réponds toujours en français, de façon professionnelle et chaleureuse.`;

/* ---- Appel API Anthropic ---- */
async function callClaude(userMessage, systemPrompt) {
  const key = IA_CONFIG.apiKey || localStorage.getItem('tca73_api_key');
  if (!key || key.length < 10) {
    return null; // Mode simulation
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: IA_CONFIG.model,
        max_tokens: 1024,
        system: systemPrompt || TCA_CONTEXT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text || '';
  } catch (err) {
    console.warn('IA API error:', err.message);
    return null;
  }
}

/* ---- Mode simulation (sans clé) ---- */
function simulateResponse(type, input) {
  const sims = {
    subvention: `📄 DEMANDE DE SUBVENTION — TCA73
━━━━━━━━━━━━━━━━━━━━━━━━━━━
À l'attention de : ${input.region || 'la collectivité'}

Objet : Demande de subvention sportive — Saison 2025
Montant demandé : ${input.montant || '2 000'} €
Projet : ${input.projet || 'développement de l\'école de trial'}

Le Trial Club Albertvillois 73 (TCA73), association loi 1901 fondée en 2019, sollicite votre soutien financier pour le développement de ${input.projet || 'notre école de trial jeunes'}.

Fort de ses 100+ adhérents et de sa section école accueillant les enfants dès 5 ans, le TCA73 contribue activement à l'offre sportive locale d'Albertville et du bassin savoyard...

[Document complet généré — Configuration de votre clé API pour un document personnalisé]`,

    reseaux: `📱 POSTS RÉSEAUX SOCIAUX — TCA73
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 FACEBOOK :
"${input.info || '3 podiums au championnat'} ! 🎉 Quelle belle performance de nos pilotes ! Bravo à toute l'équipe TCA73 pour ce résultat exceptionnel. Le trial savoyard a de beaux jours devant lui ! 🏔️ #TCA73 #TrialMoto #Savoie #AlbesMountains"

📸 INSTAGRAM :
"${input.info || '3 podiums'} 🏆🥇 Notre équipe au top ce week-end ! Rendez-vous au prochain événement 📅 #TCA73 #Trial #TrialMoto #Savoie #Albertville #Sport #Moto #Mountains 🏔️"

💼 LINKEDIN (partenaires) :
"Excellente nouvelle pour le Trial Club Albertvillois 73 : ${input.info || '3 podiums au championnat régional'} ! Ce résultat témoigne du travail de nos pilotes et de nos partenaires. Merci à tous nos sponsors pour leur soutien."`,

    partenaire: `✉️ EMAIL DE PROSPECTION PARTENARIAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Objet : Partenariat sportif — Trial Club Albertvillois 73

Madame, Monsieur,

Nous souhaitons vous présenter une opportunité de partenariat avec le Trial Club Albertvillois 73 (TCA73), club de motocyclisme de Savoie reconnu régionalement.

✅ 100+ adhérents actifs
✅ Présence dans les championnats régionaux
✅ Visibilité web, réseaux sociaux et tenues officielles
✅ Journées partenaires exclusives

Formules : Bronze (100€/an) | Argent (250€/an) | Or (500€+/an)

Nous serions ravis d'échanger avec vous.

Cordialement,
Le Bureau du TCA73
contact@tca73.fr`,
  };
  return sims[type] || 'Réponse générée (mode simulation — configurez votre clé API pour des réponses personnalisées)';
}

/* ---- Init IA (appelé par admin.js ou directement) ---- */
window.initIA = function() {
  const p = document.getElementById('admin-panel-ia');
  if (!p || p.dataset.rendered) return;
  p.dataset.rendered = '1';

  p.innerHTML = `
    <!-- Config clé API -->
    <div id="api-config-bar" style="background:rgba(26,107,200,0.07);border:1px solid var(--mountain);border-radius:var(--radius-sm);padding:14px 20px;margin-bottom:28px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <i class="fa-solid fa-key" style="color:var(--mountain);"></i>
      <span style="font-size:.9rem;color:var(--deep);flex:1;">Clé API Anthropic (facultative — mode simulation actif si vide) :</span>
      <input type="password" id="api-key-input" placeholder="sk-ant-..." style="flex:1;min-width:200px;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:.85rem;" value="${localStorage.getItem('tca73_api_key')||''}">
      <button class="btn btn--secondary btn--sm" onclick="saveApiKey()">Sauvegarder</button>
    </div>

    <div class="ia-grid">
      <!-- Subventions -->
      <div class="ia-card">
        <div class="ia-card-header">
          <div class="ia-icon">📄</div>
          <div><h3>Assistant Subventions</h3><div style="color:rgba(255,255,255,.7);font-size:.82rem;">Génère une demande de subvention complète</div></div>
        </div>
        <div class="ia-card-body">
          <div class="form-group"><label>Région / collectivité</label><input class="form-control" id="sub-region" placeholder="Ex : Conseil Départemental Savoie"></div>
          <div class="form-group"><label>Montant demandé (€)</label><input class="form-control" id="sub-montant" placeholder="Ex : 3000" type="number"></div>
          <div class="form-group"><label>Projet</label><input class="form-control" id="sub-projet" placeholder="Ex : développement école de trial jeunes"></div>
          <button class="btn btn--primary" onclick="genSubvention()"><i class="fa-solid fa-wand-magic-sparkles"></i> Générer le document</button>
          <div class="ia-loading" id="sub-loading"><div class="dot-flashing"></div><div class="dot-flashing"></div><div class="dot-flashing"></div><span>Génération en cours…</span></div>
          <textarea class="ia-output" id="sub-output" readonly placeholder="Le document apparaîtra ici…"></textarea>
          <button class="btn btn--outline-dark btn--sm" style="margin-top:8px;" onclick="copyOutput('sub-output')"><i class="fa-solid fa-copy"></i> Copier</button>
        </div>
      </div>

      <!-- Réseaux sociaux -->
      <div class="ia-card">
        <div class="ia-card-header">
          <div class="ia-icon">📱</div>
          <div><h3>Assistant Réseaux Sociaux</h3><div style="color:rgba(255,255,255,.7);font-size:.82rem;">Génère des posts Facebook, Instagram, LinkedIn</div></div>
        </div>
        <div class="ia-card-body">
          <div class="form-group"><label>Actualité à communiquer</label><textarea class="form-control" id="rs-info" placeholder="Ex : 3 podiums au championnat régional de Savoie ce week-end" style="min-height:80px;"></textarea></div>
          <div class="form-group"><label>Ton</label>
            <select class="form-control form-select" id="rs-ton">
              <option value="enthousiaste">🎉 Enthousiaste</option>
              <option value="professionnel">💼 Professionnel</option>
              <option value="convivial">🤝 Convivial</option>
            </select>
          </div>
          <button class="btn btn--primary" onclick="genReseaux()"><i class="fa-solid fa-wand-magic-sparkles"></i> Générer les posts</button>
          <div class="ia-loading" id="rs-loading"><div class="dot-flashing"></div><div class="dot-flashing"></div><div class="dot-flashing"></div><span>Génération en cours…</span></div>
          <textarea class="ia-output" id="rs-output" readonly placeholder="Les posts apparaîtront ici…"></textarea>
          <button class="btn btn--outline-dark btn--sm" style="margin-top:8px;" onclick="copyOutput('rs-output')"><i class="fa-solid fa-copy"></i> Copier</button>
        </div>
      </div>

      <!-- Partenaires -->
      <div class="ia-card">
        <div class="ia-card-header">
          <div class="ia-icon">🤝</div>
          <div><h3>Assistant Partenaires</h3><div style="color:rgba(255,255,255,.7);font-size:.82rem;">Email de prospection + dossier sponsor</div></div>
        </div>
        <div class="ia-card-body">
          <div class="form-group"><label>Nom de l'entreprise</label><input class="form-control" id="par-nom" placeholder="Ex : Garage des Alpes"></div>
          <div class="form-group"><label>Secteur d'activité</label><input class="form-control" id="par-secteur" placeholder="Ex : Mécanique automobile, Savoie"></div>
          <div class="form-group"><label>Type de document</label>
            <select class="form-control form-select" id="par-type">
              <option value="prospection">Email de prospection</option>
              <option value="dossier">Dossier sponsor complet</option>
              <option value="relance">Email de relance</option>
            </select>
          </div>
          <button class="btn btn--primary" onclick="genPartenaire()"><i class="fa-solid fa-wand-magic-sparkles"></i> Générer</button>
          <div class="ia-loading" id="par-loading"><div class="dot-flashing"></div><div class="dot-flashing"></div><div class="dot-flashing"></div><span>Génération en cours…</span></div>
          <textarea class="ia-output" id="par-output" readonly placeholder="Le document apparaîtra ici…"></textarea>
          <button class="btn btn--outline-dark btn--sm" style="margin-top:8px;" onclick="copyOutput('par-output')"><i class="fa-solid fa-copy"></i> Copier</button>
        </div>
      </div>

      <!-- Chatbot FAQ -->
      <div class="ia-card">
        <div class="ia-card-header">
          <div class="ia-icon">💬</div>
          <div><h3>Assistant FAQ Chatbot</h3><div style="color:rgba(255,255,255,.7);font-size:.82rem;">Test du chatbot club en temps réel</div></div>
        </div>
        <div class="ia-card-body" style="padding:0;">
          <div class="chatbot-messages" id="chat-messages"></div>
          <div class="chatbot-input">
            <input type="text" id="chat-input" placeholder="Posez une question sur le club…">
            <button class="btn btn--primary btn--sm" onclick="sendChat()"><i class="fa-solid fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
    </div>`;

  /* Init chat */
  addChatMsg('bot', 'Bonjour ! Je suis l\'assistant du TCA73. Comment puis-je vous aider ? (adhésion, terrain, tarifs, événements…)');
  document.getElementById('chat-input')?.addEventListener('keydown', e => { if (e.key==='Enter') sendChat(); });
};

function saveApiKey() {
  const val = document.getElementById('api-key-input')?.value.trim();
  if (val) { localStorage.setItem('tca73_api_key', val); alert('Clé API sauvegardée !'); }
  else { localStorage.removeItem('tca73_api_key'); alert('Clé supprimée — mode simulation actif.'); }
}

async function genSubvention() {
  const region  = document.getElementById('sub-region')?.value;
  const montant = document.getElementById('sub-montant')?.value;
  const projet  = document.getElementById('sub-projet')?.value;
  const out     = document.getElementById('sub-output');
  const loading = document.getElementById('sub-loading');
  if (!loading || !out) return;
  loading.classList.add('show'); out.value = '';
  const prompt = `Rédige une demande de subvention sportive complète pour le TCA73 à destination de "${region||'la collectivité'}". Montant demandé : ${montant||'2000'}€. Projet : "${projet||'développement club'}". Format : lettre officielle professionnelle avec toutes les sections (présentation, bilan, projet, budget, conclusion).`;
  const res = await callClaude(prompt) || simulateResponse('subvention', { region, montant, projet });
  loading.classList.remove('show'); out.value = res;
}

async function genReseaux() {
  const info    = document.getElementById('rs-info')?.value;
  const ton     = document.getElementById('rs-ton')?.value;
  const out     = document.getElementById('rs-output');
  const loading = document.getElementById('rs-loading');
  if (!loading || !out) return;
  loading.classList.add('show'); out.value = '';
  const prompt = `Génère 3 posts réseaux sociaux (Facebook, Instagram, LinkedIn) pour le TCA73 avec un ton "${ton}" concernant : "${info||'actualité du club'}". Inclure hashtags pertinents pour chaque plateforme.`;
  const res = await callClaude(prompt) || simulateResponse('reseaux', { info, ton });
  loading.classList.remove('show'); out.value = res;
}

async function genPartenaire() {
  const nom     = document.getElementById('par-nom')?.value;
  const secteur = document.getElementById('par-secteur')?.value;
  const type    = document.getElementById('par-type')?.value;
  const out     = document.getElementById('par-output');
  const loading = document.getElementById('par-loading');
  if (!loading || !out) return;
  loading.classList.add('show'); out.value = '';
  const prompt = `Rédige un "${type}" de partenariat pour le TCA73 adressé à "${nom||'l\'entreprise'}" (secteur : ${secteur||'non précisé'}). Sois professionnel, valorise les bénéfices du partenariat et inclus les formules Or/Argent/Bronze.`;
  const res = await callClaude(prompt) || simulateResponse('partenaire', { nom, secteur, type });
  loading.classList.remove('show'); out.value = res;
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg   = input?.value.trim();
  if (!msg) return;
  addChatMsg('user', msg);
  input.value = '';
  const typing = addChatMsg('bot', '…');

  const faqMap = {
    'adhésion|adherer|rejoindre|inscription': 'Pour adhérer au TCA73, deux étapes : 1) Cotisation club sur HelloAsso, 2) Licence FFM sur ffmoto.org. Tarifs : 50€ (jeune loisir), 80€ (adulte loisir), 90€ (jeune compétition), 130€ (adulte compétition).',
    'terrain|accès|situé|où': 'Notre terrain est situé à Albertville (73). Les coordonnées GPS précises sont communiquées aux membres lors de l\'adhésion. Ouvert les week-ends toute l\'année.',
    'tarif|prix|coût|combien': 'Les cotisations club 2025 : 50€ (moins de 15 ans, loisir), 80€ (plus de 15 ans, loisir), 90€ (moins de 15 ans, compétition), 130€ (plus de 15 ans, compétition). + Licence FFM à part.',
    'essayer|débutant|initiation|découverte': 'Oui ! Nous organisons des journées portes ouvertes régulièrement. Motos et équipements fournis pour les baptêmes. Contactez-nous via contact@tca73.fr',
    'licence|ffm|fédération': 'La licence FFM est obligatoire pour pratiquer. Elle s\'obtient en ligne sur ffmoto.org. Elle comprend l\'assurance RC. À renouveler chaque année (saison nov–oct).',
    'age|enfant|quel âge|minimum': 'L\'école de trial accueille les enfants dès 5 ans. La pratique adulte n\'a pas d\'âge limite. Venez en famille !',
    'équipement|moto|casque': 'Équipements obligatoires : casque homologué + bottes moto. Gants et protège-tibias fortement recommandés. Pour les premières séances, nous prêtons du matériel.',
    'contact|email|téléphone': 'Vous pouvez nous contacter par email : contact@tca73.fr ou via le formulaire de contact sur notre site.',
    'événement|championnat|calendrier': 'Consultez notre page Événements pour le calendrier complet. Prochain événement : Championnat Savoie Manche 4 le 14 juin 2025.',
  };

  let response = null;
  const q = msg.toLowerCase();
  for (const [pattern, ans] of Object.entries(faqMap)) {
    if (new RegExp(pattern).test(q)) { response = ans; break; }
  }

  if (!response) {
    response = await callClaude(msg, TCA_CONTEXT);
    if (!response) response = 'Je ne suis pas sûr de la réponse à cette question. Pour toute information précise, contactez-nous à contact@tca73.fr ou via notre formulaire de contact.';
  }

  setTimeout(() => {
    typing.textContent = response;
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }, 600);
}

function addChatMsg(type, text) {
  const container = document.getElementById('chat-messages');
  if (!container) return null;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

function copyOutput(id) {
  const el = document.getElementById(id);
  if (el?.value) { navigator.clipboard.writeText(el.value); alert('Copié dans le presse-papier !'); }
}

/* ---- Chatbot public (page contact/accueil) ---- */
window.initPublicChatbot = function() {
  const wrap = document.getElementById('public-chatbot');
  if (!wrap) return;
  addPublicMsg('bot', 'Bonjour ! Je suis l\'assistant TCA73. Une question sur le club, les tarifs ou les événements ?');
  document.getElementById('public-chat-input')?.addEventListener('keydown', e => { if (e.key==='Enter') sendPublicChat(); });
};

async function sendPublicChat() {
  const input = document.getElementById('public-chat-input');
  const msg   = input?.value.trim();
  if (!msg) return;
  addPublicMsg('user', msg);
  input.value = '';

  const faqMap = {
    'bonjour|salut|bonsoir': 'Bonjour ! Comment puis-je vous aider ? Je peux répondre à vos questions sur le TCA73 : adhésion, tarifs, terrain, événements…',
    'adhésion|rejoindre|inscription': 'Pour rejoindre le TCA73 : 1) Adhésion via HelloAsso, 2) Licence FFM. Tarifs de 50 à 130€/an selon profil.',
    'tarif|prix': 'Jeune loisir : 50€ · Adulte loisir : 80€ · Jeune compétition : 90€ · Adulte compétition : 130€. + Licence FFM obligatoire.',
    'terrain|où|accès|situé': 'Le terrain est à Albertville (73). Coordonnées GPS communiquées aux membres. Sessions week-ends toute l\'année.',
    'essayer|découverte|baptême': 'Oui ! Journées portes ouvertes régulières avec motos et équipements fournis. Consultez la page Événements.',
    'enfant|âge|école': 'École de trial dès 5 ans avec moniteurs diplômés FFM. Ambiance familiale garantie !',
    'contact': 'Écrivez-nous à contact@tca73.fr ou utilisez notre formulaire de contact. Réponse sous 48h.',
  };

  let response = null;
  const q = msg.toLowerCase();
  for (const [pattern, ans] of Object.entries(faqMap)) {
    if (new RegExp(pattern).test(q)) { response = ans; break; }
  }
  if (!response) response = await callClaude(msg, TCA_CONTEXT);
  if (!response) response = 'Bonne question ! Pour une réponse précise, contactez-nous à contact@tca73.fr — nous répondons sous 48h.';

  addPublicMsg('bot', response);
}

function addPublicMsg(type, text) {
  const container = document.getElementById('public-chat-messages');
  if (!container) return;
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}
