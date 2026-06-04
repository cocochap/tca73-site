/* TCA73 — boutique.js */

/* ===== DONNÉES PRODUITS ===== */
const PRODUCTS = {
  /* Collection TCA73 */
  B01: { id:'B01', nom:'Maillot TCA73 MC',        prix:30,  emoji:'👕', cat:'tca73' },
  B02: { id:'B02', nom:'Maillot TCA73 ML',        prix:37,  emoji:'👕', cat:'tca73' },
  B03: { id:'B03', nom:'Pantalon TCA73',          prix:105, emoji:'👖', cat:'tca73' },
  B04: { id:'B04', nom:'Pantalon Enfant TCA73',   prix:83,  emoji:'👖', cat:'tca73' },
  B05: { id:'B05', nom:'Pantalon Flex TCA73',     prix:121, emoji:'👖', cat:'tca73' },
  B06: { id:'B06', nom:'Veste Hybrid TCA73',      prix:85,  emoji:'🧥', cat:'tca73' },
  B07: { id:'B07', nom:'Veste de Pluie TCA73',    prix:70,  emoji:'🧥', cat:'tca73' },
  B08: { id:'B08', nom:'Veste Thermique TCA73',   prix:65,  emoji:'🧥', cat:'tca73' },
  /* Accessoires TCA73 */
  A01: { id:'A01', nom:'Gants S3 Spyder TCA73',   prix:33,  emoji:'🧤', cat:'accessoires' },
  A02: { id:'A02', nom:'Bonnet TCA73',            prix:15,  emoji:'🧣', cat:'accessoires' },
  A03: { id:'A03', nom:'Casquette TCA73',         prix:10,  emoji:'🧢', cat:'accessoires' },
  A04: { id:'A04', nom:'Polo TCA73',              prix:30,  emoji:'👕', cat:'accessoires' },
  A05: { id:'A05', nom:'Tour de cou TCA73',       prix:15,  emoji:'🧣', cat:'accessoires', indispo:true },
  A06: { id:'A06', nom:'Tee-Shirt TCA73',         prix:15,  emoji:'👕', cat:'accessoires', indispo:true },
  A07: { id:'A07', nom:'Casquette TCA73 Pro',     prix:20,  emoji:'🧢', cat:'accessoires', indispo:true },
  /* Tenues HEBO */
  H01: { id:'H01', nom:'Maillot HEBO ML',         prix:38,  emoji:'👕', cat:'hebo' },
  H02: { id:'H02', nom:'Maillot HEBO ML Kids',    prix:33,  emoji:'👕', cat:'hebo' },
  H03: { id:'H03', nom:'Pantalon HEBO',           prix:87,  emoji:'👖', cat:'hebo' },
  H04: { id:'H04', nom:'Pantalon HEBO Kids',      prix:69,  emoji:'👖', cat:'hebo' },
  H05: { id:'H05', nom:'Casque HEBO',             prix:220, emoji:'⛑️', cat:'hebo' },
  H06: { id:'H06', nom:'Pantalon Tech HEBO',      prix:102, emoji:'👖', cat:'hebo' },
  H07: { id:'H07', nom:'Veste Tech HEBO',         prix:112, emoji:'🧥', cat:'hebo' },
  H08: { id:'H08', nom:'Gilet Wind Pro HEBO',     prix:74,  emoji:'🦺', cat:'hebo' },
  H09: { id:'H09', nom:'Veste 3en1 HEBO',         prix:109, emoji:'🧥', cat:'hebo' },
};

/* ===== PANIER ===== */
let cart = [];

function getSelectedSize(card) {
  const btn = card.querySelector('.size-btn.selected');
  return btn ? btn.dataset.size : null;
}

function getQty(card) {
  const input = card.querySelector('.qty-val');
  return input ? parseInt(input.value, 10) || 1 : 1;
}

function addToCart(btn) {
  const card  = btn.closest('.product-card');
  const id    = card.dataset.id;
  const size  = getSelectedSize(card);
  const qty   = getQty(card);

  if (!size) {
    card.querySelector('.product-size-row label').style.color = 'var(--tca-red)';
    setTimeout(() => card.querySelector('.product-size-row label').style.color = '', 1500);
    return;
  }

  const product = PRODUCTS[id];
  const key = id + '_' + size;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ key, id, nom: product.nom, prix: product.prix, emoji: product.emoji, taille: size, qty });
  }

  updateCartUI();
  openCart();

  btn.innerHTML = '<i class="fa-solid fa-check"></i> Ajouté !';
  btn.classList.add('added');
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Ajouter au panier';
    btn.classList.remove('added');
  }, 1800);
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  updateCartUI();
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.prix * i.qty, 0);
}

function formatPrice(val) {
  return val.toFixed(2).replace('.', ',') + ' €';
}

function updateCartUI() {
  /* Compteur FAB */
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const countEl  = document.getElementById('cart-count');
  if (countEl) {
    countEl.textContent = totalQty;
    countEl.classList.toggle('visible', totalQty > 0);
  }

  /* Items drawer */
  const itemsEl = document.getElementById('cart-items');
  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>Votre panier est vide.</p>
      </div>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji" style="background:rgba(14,61,145,0.08);">${item.emoji}</div>
        <div class="cart-item-info">
          <strong>${item.nom}</strong>
          <small>Taille : ${item.taille} · Qté : ${item.qty}</small>
        </div>
        <div class="cart-item-price">${formatPrice(item.prix * item.qty)}</div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.key}')" aria-label="Supprimer">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>`).join('');
  }

  /* Total */
  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = formatPrice(cartTotal());

  /* Bouton commande */
  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

/* ===== DRAWER ===== */
function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== MODALE COMMANDE ===== */
function openModal() {
  /* Récap dans la modale */
  const recapEl = document.getElementById('modal-recap-items');
  if (recapEl) {
    recapEl.innerHTML = cart.map(i => `
      <div class="recap-item">
        <span>${i.emoji} ${i.nom} (${i.taille}) × ${i.qty}</span>
        <span>${formatPrice(i.prix * i.qty)}</span>
      </div>`).join('');
  }
  const recapTotal = document.getElementById('modal-recap-total');
  if (recapTotal) recapTotal.textContent = formatPrice(cartTotal());

  document.getElementById('modal-form-view').style.display = '';
  document.getElementById('modal-success-view').style.display = 'none';

  document.getElementById('modal-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== FILTRE & TRI ===== */
function applyFilter(filter) {
  document.querySelectorAll('.product-card').forEach(card => {
    const match = filter === 'tous' || card.dataset.cat === filter;
    card.dataset.hidden = match ? 'false' : 'true';
  });
}

function applySort(sort) {
  const grid   = document.getElementById('products-grid');
  const cards  = [...grid.querySelectorAll('.product-card')];
  cards.sort((a, b) => {
    if (sort === 'prix-asc')  return parseFloat(a.dataset.prix) - parseFloat(b.dataset.prix);
    if (sort === 'prix-desc') return parseFloat(b.dataset.prix) - parseFloat(a.dataset.prix);
    if (sort === 'nom')       return a.dataset.nom.localeCompare(b.dataset.nom, 'fr');
    return 0;
  });
  cards.forEach(c => grid.appendChild(c));
}

/* ===== ENVOI COMMANDE ===== */
function submitOrder(prenom, nom, email, tel, message) {
  const lines = cart.map(i => `  - ${i.nom} (${i.taille}) x${i.qty} = ${formatPrice(i.prix * i.qty)}`).join('\n');
  const body  = encodeURIComponent(
    `Bonjour,\n\nNouvelle commande boutique TCA73 :\n\n${lines}\n\nTotal : ${formatPrice(cartTotal())}\n\n---\nNom : ${prenom} ${nom}\nEmail : ${email}\nTéléphone : ${tel || 'non renseigné'}\n\n${message ? 'Message : ' + message + '\n\n' : ''}Moyens de paiement acceptés :\n  - Chèque à l'ordre de "TCA73"\n  - Virement bancaire (IBAN communiqué sur demande)\n  - Espèces sur le terrain`
  );
  const mailto = `mailto:contacttca73@gmail.com?subject=${encodeURIComponent('Commande boutique TCA73 — ' + prenom + ' ' + nom)}&body=${body}`;
  window.location.href = mailto;

  document.getElementById('modal-form-view').style.display = 'none';
  document.getElementById('modal-success-view').style.display = '';
  cart = [];
  updateCartUI();
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {

  /* Sélection de taille */
  document.querySelectorAll('.size-options').forEach(group => {
    group.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  });

  /* Quantités */
  document.querySelectorAll('.qty-control').forEach(ctrl => {
    const input = ctrl.querySelector('.qty-val');
    ctrl.querySelector('.qty-minus').addEventListener('click', () => {
      const v = parseInt(input.value, 10);
      if (v > 1) input.value = v - 1;
    });
    ctrl.querySelector('.qty-plus').addEventListener('click', () => {
      const v = parseInt(input.value, 10);
      if (v < 10) input.value = v + 1;
    });
  });

  /* FAB + fermeture drawer */
  document.getElementById('cart-fab')?.addEventListener('click', openCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  /* Commande depuis drawer */
  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    closeCart();
    openModal();
  });

  /* Fermeture modale */
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  /* Soumission formulaire */
  document.getElementById('order-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const prenom  = document.getElementById('order-prenom').value.trim();
    const nom     = document.getElementById('order-nom').value.trim();
    const email   = document.getElementById('order-email').value.trim();
    const tel     = document.getElementById('order-tel').value.trim();
    const message = document.getElementById('order-message').value.trim();
    if (!prenom || !nom || !email) return;
    submitOrder(prenom, nom, email, tel, message);
  });

  /* Filtres */
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.dataset.filter);
    });
  });

  /* Tri */
  document.getElementById('sort-select')?.addEventListener('change', e => {
    applySort(e.target.value);
  });

  /* Touche Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeCart();
      closeModal();
    }
  });

  updateCartUI();
});
