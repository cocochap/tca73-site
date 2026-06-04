/* ============================================================
   TCA73 — Floating Chat Widget
   Widget IA autonome, injecté sur toutes les pages
   ============================================================ */

(function () {

  /* ---- CSS ---- */
  const style = document.createElement('style');
  style.textContent = `
    #tca-chat-widget {
      position: fixed;
      z-index: 450;
      bottom: 32px;
      right: 32px;
    }
    #tca-chat-widget.above-cart {
      bottom: 104px;
    }

    /* Bouton bulle */
    .tcw-btn {
      width: 54px; height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1A6BC8 0%, #0E3D91 100%);
      border: none; color: white;
      font-size: 1.25rem;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(14,61,145,0.45);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      animation: tcw-pulse 3.5s ease-in-out infinite;
    }
    .tcw-btn:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(14,61,145,0.55); }
    .tcw-btn.open  { animation: none; background: linear-gradient(135deg, #0E3D91 0%, #07234f 100%); }
    @keyframes tcw-pulse {
      0%,100% { box-shadow: 0 4px 18px rgba(14,61,145,0.45); }
      50%      { box-shadow: 0 4px 28px rgba(14,61,145,0.65), 0 0 0 8px rgba(26,107,200,0.1); }
    }

    /* Badge notif */
    .tcw-badge {
      position: absolute; top: -4px; right: -4px;
      background: #E62A2A; color: white;
      width: 20px; height: 20px; border-radius: 50%;
      font-size: 0.72rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid white;
      animation: tcw-badge-in 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .tcw-badge.hidden { display: none; }
    @keyframes tcw-badge-in { from { transform: scale(0); } to { transform: scale(1); } }

    /* Panel */
    .tcw-panel {
      position: absolute;
      bottom: 66px; right: 0;
      width: 320px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(14,61,145,0.22), 0 2px 8px rgba(0,0,0,0.08);
      display: flex; flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      transform: scale(0.9) translateY(12px);
      opacity: 0; pointer-events: none;
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s;
      max-height: calc(100vh - 140px);
    }
    .tcw-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1; pointer-events: all;
    }

    /* Header */
    .tcw-header {
      background: linear-gradient(135deg, #0E3D91 0%, #1A6BC8 100%);
      padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
      flex-shrink: 0;
    }
    .tcw-header-dot {
      width: 9px; height: 9px;
      background: #27ae60; border-radius: 50%; flex-shrink: 0;
      box-shadow: 0 0 0 3px rgba(39,174,96,0.3);
      animation: tcw-dot 2s ease-in-out infinite;
    }
    @keyframes tcw-dot {
      0%,100% { box-shadow: 0 0 0 3px rgba(39,174,96,0.3); }
      50%      { box-shadow: 0 0 0 6px rgba(39,174,96,0.12); }
    }
    .tcw-header-title {
      flex: 1; color: white;
      font-family: 'Oswald', sans-serif;
      font-size: 1rem; font-weight: 600; letter-spacing: 0.04em;
    }
    .tcw-header-sub {
      font-size: 0.72rem; color: rgba(255,255,255,0.6);
      font-family: 'Roboto', sans-serif;
    }
    .tcw-close-btn {
      background: rgba(255,255,255,0.15); border: none;
      color: white; width: 28px; height: 28px;
      border-radius: 50%; font-size: 1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .tcw-close-btn:hover { background: rgba(255,255,255,0.28); }

    /* Messages */
    .tcw-messages {
      flex: 1; overflow-y: auto;
      padding: 16px 14px;
      display: flex; flex-direction: column; gap: 10px;
      min-height: 200px; max-height: 300px;
      scroll-behavior: smooth;
    }
    .tcw-msg {
      display: flex; gap: 8px; align-items: flex-end;
    }
    .tcw-msg.user { flex-direction: row-reverse; }
    .tcw-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: linear-gradient(135deg, #1A6BC8, #0E3D91);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 0.7rem; flex-shrink: 0;
      font-family: 'Oswald', sans-serif; font-weight: 600;
    }
    .tcw-msg.user .tcw-avatar { background: #E62A2A; font-size: 0.65rem; }
    .tcw-bubble {
      max-width: 78%; padding: 9px 13px;
      border-radius: 14px; font-size: 0.875rem; line-height: 1.5;
      font-family: 'Roboto', sans-serif;
    }
    .tcw-msg.bot  .tcw-bubble { background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px; }
    .tcw-msg.user .tcw-bubble { background: #0E3D91; color: white; border-bottom-right-radius: 4px; }

    /* Typing indicator */
    .tcw-typing .tcw-bubble {
      display: flex; gap: 5px; padding: 12px 14px; align-items: center;
    }
    .tcw-dot-anim {
      width: 7px; height: 7px; border-radius: 50%;
      background: #94a3b8; animation: tcw-typing 1.2s ease-in-out infinite;
    }
    .tcw-dot-anim:nth-child(2) { animation-delay: 0.2s; }
    .tcw-dot-anim:nth-child(3) { animation-delay: 0.4s; }
    @keyframes tcw-typing {
      0%,80%,100% { transform: translateY(0); opacity: 0.4; }
      40%          { transform: translateY(-6px); opacity: 1; }
    }

    /* Input */
    .tcw-input-row {
      display: flex; gap: 8px; align-items: center;
      padding: 12px 12px; border-top: 1px solid #e2e8f0;
      background: #fafafa; flex-shrink: 0;
    }
    .tcw-input {
      flex: 1; border: 1.5px solid #e2e8f0;
      border-radius: 20px; padding: 9px 14px;
      font-size: 0.875rem; font-family: 'Roboto', sans-serif;
      color: #1e293b; outline: none; transition: border-color 0.2s;
      background: white;
    }
    .tcw-input:focus { border-color: #1A6BC8; }
    .tcw-send-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: #0E3D91; border: none; color: white;
      font-size: 0.85rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.15s;
      flex-shrink: 0;
    }
    .tcw-send-btn:hover { background: #1A6BC8; transform: scale(1.08); }

    /* Responsive */
    @media (max-width: 400px) {
      .tcw-panel { width: calc(100vw - 24px); right: 0; }
      #tca-chat-widget { right: 16px; bottom: 20px; }
      #tca-chat-widget.above-cart { bottom: 88px; }
    }
  `;
  document.head.appendChild(style);

  /* ---- FAQ ---- */
  const FAQ = [
    [/bonjour|salut|bonsoir|hello/i,
     'Bonjour ! Je suis l\'assistant TCA73. Je peux vous aider avec les adhésions, les tarifs, le terrain, les événements… Posez votre question !'],
    [/adhés|rejoin|inscri|membre/i,
     'Pour rejoindre le TCA73 : adhésion via HelloAsso + licence FFM. Tarifs de 50 à 130 €/an selon votre profil. Rendez-vous sur la page <a href="adhesion.html" style="color:#1A6BC8">Adhésion</a>.'],
    [/tarif|prix|coût|combien/i,
     'Tarifs annuels :<br>• Jeune loisir : 50 €<br>• Adulte loisir : 80 €<br>• Jeune compétition : 90 €<br>• Adulte compétition : 130 €<br>+ licence FFM obligatoire.'],
    [/terrain|où|accès|situé|adresse/i,
     'Le terrain est situé à Albertville (73200). Les coordonnées GPS précises sont communiquées aux membres inscrits.'],
    [/essayer|découvert|baptême|essai/i,
     'Des journées portes ouvertes sont organisées régulièrement avec motos et équipements fournis. Consultez la page <a href="evenements.html" style="color:#1A6BC8">Événements</a>.'],
    [/enfant|âge|école|jeune/i,
     'L\'école de trial accueille les enfants dès 5 ans avec des moniteurs diplômés FFM. Ambiance familiale garantie !'],
    [/boutique|commande|vêtement|maillot|pantalon|veste/i,
     'Notre boutique propose maillots, pantalons, vestes et accessoires TCA73 ainsi que les tenues HEBO. Visitez la <a href="boutique.html" style="color:#1A6BC8">Boutique</a>.'],
    [/événement|compétition|calendrier|prochain/i,
     'Retrouvez tous nos événements sur la page <a href="evenements.html" style="color:#1A6BC8">Événements</a> : sessions, compétitions et portes ouvertes.'],
    [/contact|email|téléphone|joindre/i,
     'Contactez-nous via notre <a href="contact.html" style="color:#1A6BC8">formulaire</a> ou par email à <a href="mailto:contacttca73@gmail.com" style="color:#1A6BC8">contacttca73@gmail.com</a>.'],
    [/merci|super|parfait|cool|ok/i,
     'Avec plaisir ! Si vous avez d\'autres questions sur le TCA73, n\'hésitez pas 😊'],
  ];

  const CONTEXT = `Tu es l'assistant officiel du Trial Club Albertvillois 73 (TCA73), club de trial moto situé à Albertville en Savoie. Réponds en français, de façon concise et sympathique. Infos clés : tarifs adhésion 50-130€/an, terrain à Albertville, école trial dès 5 ans, email contacttca73@gmail.com.`;

  /* ---- Inject HTML ---- */
  const widget = document.createElement('div');
  widget.id = 'tca-chat-widget';
  widget.innerHTML = `
    <div class="tcw-panel" id="tcw-panel" role="dialog" aria-label="Assistant TCA73">
      <div class="tcw-header">
        <div class="tcw-header-dot"></div>
        <div>
          <div class="tcw-header-title">Assistant TCA73</div>
          <div class="tcw-header-sub">Réponse instantanée</div>
        </div>
        <button class="tcw-close-btn" id="tcw-close" aria-label="Fermer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="tcw-messages" id="tcw-messages"></div>
      <div class="tcw-input-row">
        <input class="tcw-input" id="tcw-input" type="text"
          placeholder="Une question sur le club…" autocomplete="off">
        <button class="tcw-send-btn" id="tcw-send" aria-label="Envoyer">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
    <button class="tcw-btn" id="tcw-toggle" aria-label="Ouvrir l'assistant TCA73">
      <i class="fa-solid fa-comments"></i>
      <span class="tcw-badge hidden" id="tcw-badge">1</span>
    </button>
  `;
  document.body.appendChild(widget);

  /* ---- Stacking avec le cart FAB (boutique) ---- */
  if (document.getElementById('cart-fab')) {
    widget.classList.add('above-cart');
  }

  /* ---- State ---- */
  let isOpen = false;
  let hasUnread = false;

  const panel    = document.getElementById('tcw-panel');
  const toggle   = document.getElementById('tcw-toggle');
  const closeBtn = document.getElementById('tcw-close');
  const input    = document.getElementById('tcw-input');
  const sendBtn  = document.getElementById('tcw-send');
  const messages = document.getElementById('tcw-messages');
  const badge    = document.getElementById('tcw-badge');

  /* ---- Open / Close ---- */
  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    toggle.classList.add('open');
    toggle.querySelector('i').className = 'fa-solid fa-xmark';
    clearBadge();
    setTimeout(() => input.focus(), 260);
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    toggle.classList.remove('open');
    toggle.querySelector('i').className = 'fa-solid fa-comments';
  }

  function clearBadge() {
    hasUnread = false;
    badge.classList.add('hidden');
  }

  function showBadge() {
    if (!isOpen) {
      hasUnread = true;
      badge.classList.remove('hidden');
    }
  }

  toggle.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeChat(); });

  /* ---- Messages ---- */
  function addMsg(type, html) {
    const wrap = document.createElement('div');
    wrap.className = `tcw-msg ${type}`;
    const initials = type === 'bot' ? 'IA' : 'Moi';
    wrap.innerHTML = `
      <div class="tcw-avatar">${initials}</div>
      <div class="tcw-bubble">${html}</div>
    `;
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'tcw-msg bot tcw-typing';
    wrap.id = 'tcw-typing';
    wrap.innerHTML = `
      <div class="tcw-avatar">IA</div>
      <div class="tcw-bubble">
        <span class="tcw-dot-anim"></span>
        <span class="tcw-dot-anim"></span>
        <span class="tcw-dot-anim"></span>
      </div>
    `;
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('tcw-typing')?.remove();
  }

  /* ---- Message de bienvenue ---- */
  setTimeout(() => {
    addMsg('bot', 'Bonjour ! Je suis l\'assistant TCA73 🏍️ Une question sur le club, les adhésions ou la boutique ?');
    showBadge();
  }, 1200);

  /* ---- Envoi ---- */
  async function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg('user', text);

    showTyping();

    let response = null;
    const q = text.toLowerCase();

    for (const [pattern, ans] of FAQ) {
      if (pattern.test(q)) { response = ans; break; }
    }

    if (!response) {
      await new Promise(r => setTimeout(r, 600));
      if (typeof callClaude === 'function') {
        response = await callClaude(text, CONTEXT);
      }
    } else {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
    }

    if (!response) {
      response = 'Bonne question ! Pour une réponse précise, contactez-nous à <a href="mailto:contacttca73@gmail.com" style="color:#1A6BC8">contacttca73@gmail.com</a> ou via notre <a href="contact.html" style="color:#1A6BC8">formulaire</a>.';
    }

    removeTyping();
    addMsg('bot', response);
    showBadge();
  }

  sendBtn.addEventListener('click', sendMsg);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

})();
