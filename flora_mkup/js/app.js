// app.js - Vanilla JS single-file SPA
// ---------------------------------------------------
// Data: produtos de exemplo (substitua/expanda como quiser)
const PRODUCTS = [
  { id: 'p1', 
    title: 'Paleta de Sombras Glow 25 Cores', 
    price: 10.00, 
    img: '/assets/produtos/paleta_sombras_25.png' 
  },
  { id: 'p2', 
    title: 'Duo Gloss + Batom Líquido', 
    price: 10.00, 
    img: '/assets/produtos/duo_gloss_batom_liquido.png' 
  },
  { id: 'p3', 
    title: 'Bálsamo Labial Mel/Flor de Cerejeiras', 
    price: 10.00, 
    img: '/assets/produtos/balsamo_labial.png' 
  },
  { id: 'p4', 
    title: 'Base Stick Perfect Ruby Rose', 
    price: 10.00, 
    img: '/assets/produtos/base_stick_rb.png' 
  },
  { id: 'p5', 
    title: 'Esfoliante de Melancia Tree Hut', 
    price: 10.00, 
    img: '/assets/produtos/esfoliante_melancia.png' 
  },
  { id: 'p6', 
    title: 'Rosa Mosqueta Lady Beauty', 
    price: 10.00, 
    img: '/assets/produtos/rosa_mosqueta.png' 
  },
  { id: 'p7', 
    title: 'Sérum Facial de Melancia linha MELU Ruby Rose', 
    price: 10.00, 
    img: '/assets/produtos/serum_facial_melancia.png' 
  },
  { id: 'p8', 
    title: 'Kit 10 Unhas Postiças Coquette', 
    price: 10.00, 
    img: '/assets/produtos/kit_10_unhas_coquette.png' 
  },
  { id: 'p9', 
    title: 'Pó Solto Ultrafino Dapop Pink Powder', 
    price: 10.00, 
    img: '/assets/produtos/po_solto.png' 
  },
  { id: 'p10', 
    title: 'Presilhas de Flor', 
    price: 10.00, 
    img: '/assets/produtos/presilhas.png' 
  },
  { id: 'p11', 
    title: 'Gel para Sobrancelhas Brow Rise Ruby Rose', 
    price: 10.00, 
    img: '/assets/produtos/brow_rise.png.png' 
  },
  { id: 'p12', 
    title: 'Base Líquida Soft Blend Ruby Rose', 
    price: 10.00, 
    img: '/assets/produtos/presilhas.png' 
  },
  { id: 'p13', 
    title: 'Pó Solto Banana Jasmyne', 
    price: 10.00, 
    img: '/assets/produtos/po_banana.png' 
  },
];

// ---------------- utils ----------------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const fmt = v => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);

// --------------- state ---------------
let CART = JSON.parse(localStorage.getItem('glowup_cart_v1') || '{}');
function saveCart(){ localStorage.setItem('glowup_cart_v1', JSON.stringify(CART)); renderCartCount(); }

// -------------- UI helpers -------------
function toast(msg, time=2200){
  const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
  setTimeout(()=> t.classList.add('hidden'), time);
}

// -------------- RENDERERS --------------
function renderHome(){
  const el = document.createElement('div');
  el.innerHTML = `
    <section>
      <h2>Nova Coleção</h2>
      <p>Produtos selecionados</p>
      <div class="grid" id="product-grid"></div>
    </section>
  `;
  const grid = el.querySelector('#product-grid');
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="meta">${fmt(p.price)}</div>
      <div class="actions">
        <button class="btn ghost btn-view" data-id="${p.id}">Ver</button>
        <button class="btn primary btn-add" data-id="${p.id}">Adicionar</button>
      </div>
    `;
    grid.appendChild(card);
  });
  $('#app').innerHTML=''; $('#app').appendChild(el);

  // handlers
  $$('.btn-view').forEach(b => b.addEventListener('click', e => {
    const id = e.currentTarget.dataset.id;
    location.hash = `#/product?id=${id}`;
  }));
  $$('.btn-add').forEach(b => b.addEventListener('click', e => {
    const id = e.currentTarget.dataset.id; addToCart(id,1);
  }));
}

function renderProductsList(){
  // simple products page
  const el = document.createElement('div');
  el.innerHTML = `<h2>Produtos</h2><div class="grid" id="product-grid"></div>`;
  const grid = el.querySelector('#product-grid');
  PRODUCTS.forEach(p => {
    const node = document.createElement('div');
    node.className = 'card';
    node.innerHTML = `<img src="${p.img}" alt="${p.title}"><h4>${p.title}</h4><div class="meta">${fmt(p.price)}</div>
      <div class="actions"><button class="btn ghost btn-view" data-id="${p.id}">Ver</button><button class="btn primary btn-add" data-id="${p.id}">Adicionar</button></div>`;
    grid.appendChild(node);
  });
  $('#app').innerHTML=''; $('#app').appendChild(el);
  $$('.btn-view').forEach(b => b.addEventListener('click', e => {
    const id = e.currentTarget.dataset.id;
    location.hash = `#/product?id=${id}`;
  }));
  $$('.btn-add').forEach(b => b.addEventListener('click', e => {
    const id = e.currentTarget.dataset.id; addToCart(id,1);
  }));
}

function renderProductDetail(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ $('#app').innerHTML = '<p>Produto não encontrado</p>'; return; }
  const el = document.createElement('div');
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start">
      <div><img src="${p.img}" alt="${p.title}" style="width:100%;border-radius:12px"></div>
      <div>
        <h2>${p.title}</h2>
        <p style="margin-top:12px;font-size:20px;color:var(--accent)">${fmt(p.price)}</p>
        <div style="margin-top:16px;display:flex;gap:8px">
          <input id="qty" type="number" min="1" value="1" style="width:80px;padding:8px;border-radius:8px;border:1px solid #ddd">
          <button id="add-prod" class="btn primary">Adicionar ao carrinho</button>
          <button id="buy-now" class="btn ghost">Comprar agora</button>
        </div>
      </div>
    </div>
  `;
  $('#app').innerHTML=''; $('#app').appendChild(el);

  $('#add-prod').addEventListener('click', ()=>{
    const q = Math.max(1, parseInt($('#qty').value||1));
    addToCart(id,q);
  });
  $('#buy-now').addEventListener('click', ()=>{
    addToCart(id, parseInt($('#qty').value||1));
    openCart();
  });
}

function renderProfile(){
  // small profile page with login/register using localStorage (for demo only)
  const user = JSON.parse(localStorage.getItem('glowup_user')||'null');
  const el = document.createElement('div');
  if(!user){
    el.innerHTML = `
      <div class="profile-card">
        <h3>Entrar / Cadastrar</h3>
        <div class="form-row"><input id="email" placeholder="E-mail" type="email"></div>
        <div class="form-row"><input id="name" placeholder="Nome (apenas para cadastro)"></div>
        <div style="display:flex;gap:8px"><button id="btn-login" class="btn primary">Entrar</button><button id="btn-register" class="btn ghost">Cadastrar</button></div>
      </div>
    `;
    $('#app').innerHTML=''; $('#app').appendChild(el);
    $('#btn-register').addEventListener('click', ()=>{
      const email = $('#email').value.trim(), name = $('#name').value.trim();
      if(!email||!name){ toast('Preencha nome e e-mail'); return; }
      localStorage.setItem('glowup_user', JSON.stringify({email,name}));
      toast('Cadastro salvo');
      renderProfile();
    });
    $('#btn-login').addEventListener('click', ()=>{
      const email = $('#email').value.trim();
      const saved = JSON.parse(localStorage.getItem('glowup_user')||'null');
      if(saved && saved.email === email){ toast('Login bem-sucedido'); renderProfile(); }
      else toast('Usuário não encontrado. Cadastre-se primeiro.');
    });
  } else {
    el.innerHTML = `
      <div class="profile-card">
        <h3>Olá, ${user.name}</h3>
        <p class="meta">${user.email}</p>
        <div style="margin-top:12px"><button id="logout" class="btn ghost">Sair</button></div>
      </div>
    `;
    $('#app').innerHTML=''; $('#app').appendChild(el);
    $('#logout').addEventListener('click', ()=>{ localStorage.removeItem('glowup_user'); renderProfile(); });
  }
}

// -------------- SEARCH preview --------------
function initSearch(){
  const input = $('#search'); const preview = $('#search-preview');
  let timer;
  input.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
      if(!q){ preview.classList.add('hidden'); preview.innerHTML=''; return; }
      const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(q)).slice(0,6);
      if(matches.length===0){ preview.innerHTML = `<div class="item">Nenhum produto encontrado</div>`; preview.classList.remove('hidden'); return; }
      preview.innerHTML = matches.map(m => `
        <div class="item" data-id="${m.id}">
          <img src="${m.img}" alt="${m.title}">
          <div>
            <div style="font-weight:600">${m.title}</div>
            <div style="color:var(--muted);font-size:13px">${fmt(m.price)}</div>
          </div>
        </div>
      `).join('');
      preview.classList.remove('hidden');

      // click handlers
      preview.querySelectorAll('.item').forEach(it => it.addEventListener('click', (ev)=>{
        const id = ev.currentTarget.dataset.id;
        $('#search').value = '';
        preview.classList.add('hidden');
        location.hash = `#/product?id=${id}`;
      }));
    }, 160);
  });

  // close preview when click outside
  document.addEventListener('click', (ev)=>{
    if(!preview.contains(ev.target) && ev.target !== input) preview.classList.add('hidden');
  });
}

// -------------- CART logic --------------
function addToCart(id, qty=1){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  if(!CART[id]) CART[id] = { ...p, qtd:0 };
  CART[id].qtd += qty;
  saveCart();
  toast(`${p.title} adicionado ao carrinho`);
  renderCart();
}

function removeFromCart(id){
  delete CART[id]; saveCart(); renderCart();
}

function changeQty(id, delta){
  if(!CART[id]) return;
  CART[id].qtd = Math.max(1, CART[id].qtd + delta);
  saveCart(); renderCart();
}

function calcTotal(){ return Object.values(CART).reduce((s,it)=> s + (it.price * it.qtd), 0); }

function renderCart(){
  const list = $('#cart-list');
  if(!list) return;
  list.innerHTML = '';
  const items = Object.values(CART);
  if(items.length===0){ list.innerHTML = '<p class="meta">Carrinho vazio.</p>'; $('#cart-total').textContent = fmt(0); return; }
  items.forEach(it=>{
    const row = document.createElement('div'); row.className = 'cart-item';
    row.innerHTML = `<div>
      <div style="font-weight:600">${it.title}</div>
      <div class="meta">${fmt(it.price)} x ${it.qtd}</div>
    </div>
    <div style="display:flex;gap:6px;align-items:center">
      <button class="btn ghost btn-dec" data-id="${it.id}">-</button>
      <button class="btn ghost btn-inc" data-id="${it.id}">+</button>
      <button class="btn ghost btn-rm" data-id="${it.id}">Remover</button>
    </div>`;
    list.appendChild(row);
  });
  $('#cart-total').textContent = fmt(calcTotal());

  // attach handlers
  $$('.btn-dec').forEach(b => b.addEventListener('click', e => changeQty(e.currentTarget.dataset.id, -1)));
  $$('.btn-inc').forEach(b => b.addEventListener('click', e => changeQty(e.currentTarget.dataset.id, +1)));
  $$('.btn-rm').forEach(b => b.addEventListener('click', e => removeFromCart(e.currentTarget.dataset.id)));
}

function openCart(){ $('#cart-modal').classList.remove('hidden'); $('#cart-modal').setAttribute('aria-hidden','false'); renderCart(); }
function closeCart(){ $('#cart-modal').classList.add('hidden'); $('#cart-modal').setAttribute('aria-hidden','true'); }
function clearCart(){ CART = {}; saveCart(); renderCart(); }

// --------------- ROUTER ---------------
function router(){
  const hash = location.hash || '#/';
  // route: #/ , #/products, #/product?id=..., #/profile
  if(hash.startsWith('#/product')){
    const q = new URLSearchParams(hash.split('?')[1] || '');
    const id = q.get('id');
    renderProductDetail(id);
  } else if(hash === '#/products'){
    renderProductsList();
  } else if(hash === '#/profile'){
    renderProfile();
  } else {
    renderHome();
  }
}

// --------------- init ui ---------------
function initUI(){
  // sidebar controls
  $('#burger').addEventListener('click', ()=>$('#sidebar').classList.remove('hidden'));
  $('#close-sidebar').addEventListener('click', ()=>$('#sidebar').classList.add('hidden'));
  $$('#sidebar a').forEach(a => a.addEventListener('click', ()=>$('#sidebar').classList.add('hidden')));

  // cart modal
  $('#btn-cart').addEventListener('click', openCart);
  $('#close-cart').addEventListener('click', closeCart);
  $('#clear-cart').addEventListener('click', ()=>{ if(confirm('Limpar carrinho?')) clearCart(); });
  $('#checkout').addEventListener('click', ()=>{
    if(calcTotal() === 0){ alert('Carrinho vazio'); return; }
    if(confirm(`Total ${fmt(calcTotal())}\nConfirmar compra fictícia?`)){
      alert('Pedido simulado - obrigado!');
      clearCart();
      closeCart();
    }
  });

  // search
  initSearch();

  // keep cart count
  renderCartCount();
}

function renderCartCount(){
  const c = Object.values(CART).reduce((s,it)=> s + it.qtd, 0);
  $('#cart-count').textContent = c;
}

// handle hash changes
window.addEventListener('hashchange', router);
window.addEventListener('load', ()=>{ initUI(); router(); renderCart(); });

// keyboard shortcut: "c" abre carrinho
document.addEventListener('keydown', e => { if(e.key === 'c') openCart(); });
