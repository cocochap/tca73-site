/* TCA73 — intro.js  v1.0 */
(function () {
  'use strict';

  // Skip admin / espace-membre
  const pg = window.location.pathname.split('/').pop() || 'index.html';
  if (pg === 'admin.html' || pg === 'espace-membre.html') return;

  // Une seule animation par session
  if (sessionStorage.getItem('tca73-intro')) return;
  sessionStorage.setItem('tca73-intro', '1');

  /* ---- SVG moto trial ---- */
  const BIKE = `<svg viewBox="0 0 320 210" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Roue arrière -->
  <circle cx="68" cy="162" r="44" stroke="#E62A2A" stroke-width="8"/>
  <circle cx="68" cy="162" r="22" stroke="#E62A2A" stroke-width="3" opacity=".65"/>
  <g id="si-sr" style="transform-box:fill-box;transform-origin:center">
    <line x1="68" y1="118" x2="68"  y2="206" stroke="#E62A2A" stroke-width="2.5"/>
    <line x1="24" y1="162" x2="112" y2="162" stroke="#E62A2A" stroke-width="2.5"/>
    <line x1="37" y1="131" x2="99"  y2="193" stroke="#E62A2A" stroke-width="2.5"/>
    <line x1="37" y1="193" x2="99"  y2="131" stroke="#E62A2A" stroke-width="2.5"/>
  </g>
  <circle cx="68" cy="162" r="5.5" fill="#E62A2A"/>
  <!-- Bras oscillant -->
  <path stroke="white" stroke-width="5" stroke-linecap="round" d="M68,130 L135,108"/>
  <!-- Cadre principal -->
  <path stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"
        d="M68,130 L132,74 L188,90 L222,136"/>
  <!-- Tube diagonal -->
  <path stroke="white" stroke-width="7" stroke-linecap="round" d="M132,74 L108,118"/>
  <!-- Fourche avant -->
  <path stroke="white" stroke-width="7" stroke-linecap="round" d="M188,90 L248,131 L248,168"/>
  <!-- Moteur / boîte à air -->
  <rect x="100" y="87" width="54" height="40" rx="8"
        fill="rgba(255,255,255,.08)" stroke="white" stroke-width="2.5"/>
  <circle cx="116" cy="107" r="8" fill="rgba(255,255,255,.1)" stroke="white" stroke-width="2"/>
  <circle cx="138" cy="107" r="8" fill="rgba(255,255,255,.1)" stroke="white" stroke-width="2"/>
  <!-- Guidon -->
  <path stroke="white" stroke-width="7" stroke-linecap="round" d="M178,64 L200,50 L208,74"/>
  <!-- Selle -->
  <path stroke="white" stroke-width="12" stroke-linecap="round" d="M118,77 L165,64"/>
  <!-- Roue avant -->
  <circle cx="248" cy="168" r="40" stroke="white" stroke-width="8"/>
  <circle cx="248" cy="168" r="20" stroke="white" stroke-width="3" opacity=".65"/>
  <g id="si-sf" style="transform-box:fill-box;transform-origin:center">
    <line x1="248" y1="128" x2="248" y2="208" stroke="white" stroke-width="2.5"/>
    <line x1="208" y1="168" x2="288" y2="168" stroke="white" stroke-width="2.5"/>
    <line x1="220" y1="140" x2="276" y2="196" stroke="white" stroke-width="2.5"/>
    <line x1="220" y1="196" x2="276" y2="140" stroke="white" stroke-width="2.5"/>
  </g>
  <circle cx="248" cy="168" r="5.5" fill="white"/>
  <!-- Repose-pieds -->
  <path stroke="white" stroke-width="5" stroke-linecap="round" d="M105,110 L124,104"/>
  <path stroke="white" stroke-width="5" stroke-linecap="round" d="M70,129  L88,123"/>
  <!-- Corps pilote -->
  <path stroke="white" stroke-width="13" stroke-linecap="round" d="M155,28 L134,72"/>
  <!-- Casque pilote -->
  <ellipse cx="162" cy="16" rx="18" ry="20" fill="#E62A2A" stroke="white" stroke-width="3"/>
  <path stroke="rgba(0,0,0,.65)" stroke-width="5" stroke-linecap="round" d="M148,12 L177,7"/>
  <!-- Bras pilote -->
  <path stroke="white" stroke-width="10" stroke-linecap="round" d="M152,36 L178,64"/>
  <!-- Jambes pilote -->
  <path stroke="white" stroke-width="11" stroke-linecap="round" d="M137,74 L108,109"/>
  <path stroke="rgba(255,255,255,.6)" stroke-width="9" stroke-linecap="round"
        d="M140,76 L124,112"/>
</svg>`;

  /* ---- SVG montagnes en fond ---- */
  const MOUNTAINS = `<svg viewBox="0 0 1440 130" preserveAspectRatio="none" fill="none"
     xmlns="http://www.w3.org/2000/svg">
  <path fill="rgba(255,255,255,.055)"
    d="M0,130 L0,72 L80,36 L160,62 L260,18 L380,54 L480,10
       L600,46 L700,8 L820,40 L920,6 L1040,38 L1140,4 L1260,30
       L1360,8 L1440,20 L1440,130 Z"/>
  <path fill="rgba(255,255,255,.03)"
    d="M0,130 L0,88 L100,66 L220,80 L330,52 L460,74 L560,40
       L680,67 L790,44 L900,62 L1020,34 L1140,57 L1260,35
       L1360,52 L1440,40 L1440,130 Z"/>
</svg>`;

  /* ---- CSS injecté dynamiquement ---- */
  const CSS = `
#site-intro{position:fixed;inset:0;z-index:99999;
  background:linear-gradient(160deg,#040E2A 0%,#0E3D91 52%,#1A6BC8 100%);
  overflow:hidden;}

/* Sortie : remontée vers le haut */
#site-intro.si-exit{animation:si-lift .8s cubic-bezier(.76,0,.24,1) forwards;}
@keyframes si-lift{to{transform:translateY(-100%);}}

/* Particules flottantes */
.si-ptcls{position:absolute;inset:0;pointer-events:none;}
.si-pt{position:absolute;border-radius:50%;
  background:radial-gradient(circle,rgba(87,212,230,.16) 0%,transparent 70%);
  animation:si-flt 7s ease-in-out infinite;}
.si-pt:nth-child(1){width:340px;height:340px;top:3%;right:3%;}
.si-pt:nth-child(2){width:210px;height:210px;top:40%;left:1%;animation-delay:-2.5s;}
.si-pt:nth-child(3){width:150px;height:150px;bottom:28%;right:14%;animation-delay:-4.5s;}
@keyframes si-flt{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-18px);opacity:1}}

/* Montagnes en fond */
.si-mts{position:absolute;bottom:26%;left:0;right:0;line-height:0;}
.si-mts svg{width:100%;display:block;}

/* Sol + tirets de route */
.si-ground{position:absolute;bottom:26%;left:0;right:0;height:3px;
  background:rgba(255,255,255,.2);}
.si-dashes{position:absolute;bottom:calc(26% - 15px);left:0;right:0;height:2px;
  background:repeating-linear-gradient(90deg,
    rgba(255,255,255,.12) 0,rgba(255,255,255,.12) 28px,
    transparent 28px,transparent 60px);}

/* Moto — entrée depuis la gauche */
.si-bw{position:absolute;bottom:26%;left:50%;
  width:min(370px,54vw);
  transform:translateX(-170%);
  animation:si-in 1.1s cubic-bezier(.22,1,.36,1) forwards;
  transform-origin:21% 100%;}
@keyframes si-in{to{transform:translateX(-50%);}}

/* Rotation des roues */
#si-sr,#si-sf{animation:si-spin .35s linear infinite;}
@keyframes si-spin{to{transform:rotate(360deg);}}

/* Poussière derrière la roue arrière */
.si-dust{position:absolute;bottom:4px;left:6%;pointer-events:none;}
.si-dust span{position:absolute;border-radius:50%;
  background:rgba(255,255,255,.22);animation:si-puff .7s ease-out infinite;}
.si-dust span:nth-child(1){width:8px;height:8px;}
.si-dust span:nth-child(2){width:14px;height:14px;animation-delay:.18s;}
.si-dust span:nth-child(3){width:6px;height:6px;animation-delay:.36s;}
@keyframes si-puff{
  0%{transform:translate(0,0) scale(1);opacity:.5}
  100%{transform:translate(-48px,-24px) scale(0);opacity:0}}

/* Lignes de vitesse */
.si-speed{position:absolute;bottom:26%;left:0;right:50%;
  pointer-events:none;overflow:hidden;height:80px;}
.si-speed span{position:absolute;left:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.18));
  border-radius:1px;animation:si-speed-anim 0.9s ease-out infinite;}
.si-speed span:nth-child(1){top:25%;width:35%;animation-delay:0s;}
.si-speed span:nth-child(2){top:45%;width:50%;animation-delay:.12s;}
.si-speed span:nth-child(3){top:65%;width:28%;animation-delay:.24s;}
@keyframes si-speed-anim{
  0%{transform:translateX(100%);opacity:0}
  20%{opacity:1}
  100%{transform:translateX(-120%);opacity:0}}

/* Logo + nom du club */
.si-brand{position:absolute;top:15%;left:50%;transform:translate(-50%,12px);
  display:flex;align-items:center;gap:22px;
  opacity:0;transition:opacity .55s ease,transform .55s ease;}
.si-brand.si-on{opacity:1;transform:translate(-50%,0);}
.si-brand img{width:86px;height:86px;object-fit:contain;
  filter:drop-shadow(0 4px 20px rgba(0,0,0,.55));}
.si-bt strong{display:block;font-family:'Oswald',sans-serif;
  font-size:clamp(1.9rem,4.8vw,3.4rem);color:#fff;
  letter-spacing:.1em;line-height:1;}
.si-bt span{display:block;font-family:'Roboto',sans-serif;color:#57D4E6;
  font-size:clamp(.66rem,1.4vw,.92rem);letter-spacing:.22em;
  text-transform:uppercase;margin-top:6px;}

/* Barre rouge en bas */
.si-bar{position:absolute;bottom:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,transparent,#E62A2A 25%,#E62A2A 75%,transparent);
  animation:si-bar-in .9s ease-out .35s both;}
@keyframes si-bar-in{from{transform:scaleX(0)}to{transform:scaleX(1)}}

@media(max-width:580px){
  .si-brand{flex-direction:column;text-align:center;gap:12px;top:10%;}
  .si-brand img{width:64px;height:64px;}
  .si-speed{display:none;}
}`;

  function init() {
    /* Injecter le CSS */
    const sty = document.createElement('style');
    sty.textContent = CSS;
    document.head.appendChild(sty);

    /* Construire le overlay */
    const el = document.createElement('div');
    el.id = 'site-intro';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<div class="si-ptcls"><div class="si-pt"></div><div class="si-pt"></div><div class="si-pt"></div></div>' +
      '<div class="si-mts">' + MOUNTAINS + '</div>' +
      '<div class="si-ground"></div><div class="si-dashes"></div>' +
      '<div class="si-speed"><span></span><span></span><span></span></div>' +
      '<div class="si-bw" id="si-bw">' + BIKE +
        '<div class="si-dust"><span></span><span></span><span></span></div>' +
      '</div>' +
      '<div class="si-brand" id="si-brand">' +
        '<img src="assets/images/logo-tca73.png" alt="TCA73" onerror="this.style.display=\'none\'">' +
        '<div class="si-bt"><strong>TCA73</strong><span>Trial Club Albertvillois</span></div>' +
      '</div>' +
      '<div class="si-bar"></div>';

    document.body.insertBefore(el, document.body.firstChild);
    document.body.style.overflow = 'hidden';

    const bw    = document.getElementById('si-bw');
    const brand = document.getElementById('si-brand');
    const sr    = el.querySelector('#si-sr');
    const sf    = el.querySelector('#si-sf');

    /* — 1 100 ms : fin du roulement → wheelie — */
    setTimeout(function () {
      bw.style.animation      = 'none';
      bw.style.transform      = 'translateX(-50%)';
      bw.style.transformOrigin = '21% 100%';
      /* Double rAF pour forcer le reflow avant de démarrer la transition */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          bw.style.transition = 'transform .58s cubic-bezier(.34,1.56,.64,1)';
          bw.style.transform  = 'translateX(-50%) rotate(-22deg)';
        });
      });
    }, 1100);

    /* — 1 420 ms : logo + nom apparaît — */
    setTimeout(function () { brand.classList.add('si-on'); }, 1400);

    /* — 1 720 ms : redescente partielle — */
    setTimeout(function () {
      bw.style.transition = 'transform .3s ease-in';
      bw.style.transform  = 'translateX(-50%) rotate(-10deg)';
    }, 1720);

    /* — 1 980 ms : niveau final, arrêt des roues — */
    setTimeout(function () {
      bw.style.transition = 'transform .42s cubic-bezier(.22,1,.36,1)';
      bw.style.transform  = 'translateX(-50%) rotate(0deg)';
      if (sr) sr.style.animationPlayState = 'paused';
      if (sf) sf.style.animationPlayState = 'paused';
    }, 1980);

    /* — 2 900 ms : sortie vers le haut — */
    setTimeout(function () { el.classList.add('si-exit'); }, 2900);

    /* — 3 700 ms : nettoyage DOM — */
    setTimeout(function () {
      el.remove();
      sty.remove();
      document.body.style.overflow = '';
    }, 3700);
  }

  /* Lancement dès que le DOM est prêt */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
