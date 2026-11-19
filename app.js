const $ = id => document.getElementById(id);
const loginScreen = $('login-screen'), cover = $('cover'), app = $('app'), toast = $('toast');
const VIEWS = {matrix:'page-matrix', organizacional:'page-organizacional', comissoes:'page-comissoes', paineis:'page-paineis'};
const AUTH_KEY = 'matriz_auth_ok';

function isAuthenticated(){
  return sessionStorage.getItem(AUTH_KEY) === '1' || localStorage.getItem(AUTH_KEY) === '1';
}

function setAuthenticated(active, remember = false){
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
  if (!active) return;
  (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, '1');
}

function showToast(t){ toast.textContent=t; toast.classList.add('show');
  clearTimeout(window.__t); window.__t=setTimeout(()=>toast.classList.remove('show'),2600); }
function go(hash){ location.hash===('#'+hash) ? route() : (location.hash=hash); }

function renderDetail(id){
  const i = Math.max(0, STEPS.findIndex(s=>s.id===id)), s = STEPS[i];
  const prev = STEPS[i-1], next = STEPS[i+1];
  $('stepNavItems').innerHTML = STEPS.map(x=>
    `<button type="button" class="${x.id===s.id?'active':''}" data-step="${x.id}">${x.id}. ${x.title}</button>`).join('');
  $('detailContent').innerHTML = `
    <div class="detail-hero"><span class="phase-pill">${s.phase}</span><h1>${s.title}</h1></div>
    <div class="detail-body">${s.html}
      <div class="detail-actions">
        <button class="secondary-btn" data-to="${prev?'etapa-'+prev.id:'matrix'}">← ${prev?prev.title:'Matriz'}</button>
        <button class="next-btn" data-to="${next?'etapa-'+next.id:'matrix'}">${next?next.title+' →':'Concluir'}</button>
      </div></div>`;
  $('stepNavItems').querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>go('etapa-'+b.dataset.step));
  $('detailContent').querySelectorAll('[data-to]').forEach(b=>b.onclick=()=>go(b.dataset.to));
}

function renderCommissions(){
  $('commissionsGrid').innerHTML = Object.entries(COMMISSIONS).map(([g,items])=>`
    <section class="group-card"><div class="group-letter">${g}</div>
      ${items.map(n=>`<button class="commission-item" type="button">${n}</button>`).join('')}
    </section>`).join('');
  document.querySelectorAll('.commission-item').forEach(b=>b.onclick=()=>showToast('Ficha do grupo em breve.'));
}

/* Busca global (ignora acentos; exige todos os termos) */
const norm = t => (t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const txt = h => { const d=document.createElement('div'); d.innerHTML=h; return d.textContent.replace(/\s+/g,' ').trim(); };
const INDEX = [
  ...STEPS.map(s=>({kind:'Etapa', title:`${s.id}. ${s.title}`, route:'etapa-'+s.id, text:txt(s.html)})),
  ...Object.entries(COMMISSIONS).flatMap(([g,l])=>l.map(n=>({kind:'Grupo', title:n, route:'comissoes', text:`Grupo ${g}`})))
];
function runSearch(){
  const terms = norm($('globalSearchInput').value).split(/\s+/).filter(Boolean);
  const out = $('globalSearchResults');
  if(!terms.length){ out.innerHTML='<p>Digite um termo para pesquisar.</p>'; return; }
  const hits = INDEX.filter(i=>{ const h=norm(i.title+' '+i.text); return terms.every(t=>h.includes(t)); }).slice(0,40);
  out.innerHTML = hits.length
    ? hits.map((h,k)=>`<button class="search-result" data-k="${k}"><small>${h.kind}</small><br><strong>${h.title}</strong></button>`).join('')
    : '<p>Nenhum resultado.</p>';
  out.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{ closeSearch(); go(hits[b.dataset.k].route); });
}
function openSearch(){ $('globalSearchOverlay').classList.remove('hidden'); document.body.style.overflow='hidden'; $('globalSearchInput').focus(); runSearch(); }
function closeSearch(){ $('globalSearchOverlay').classList.add('hidden'); document.body.style.overflow=''; }

/* Roteador por hash */
function route(){
  const loggedIn = isAuthenticated();
  const rawHash = location.hash.slice(1) || 'login';
  const h = !loggedIn ? 'login' : (rawHash === 'login' ? 'capa' : rawHash);

  loginScreen.classList.toggle('hidden', h !== 'login');
  cover.classList.toggle('hidden', h !== 'capa');
  app.classList.toggle('hidden', h === 'login' || h === 'capa');

  if(h === 'login' || h === 'capa') return;

  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
  const isStep = h.startsWith('etapa-');
  $(isStep ? 'page-detail' : (VIEWS[h]||'page-matrix')).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', isStep ? b.dataset.page==='matrix' : b.dataset.page===h));
  if(isStep) renderDetail(h.replace('etapa-',''));
  scrollTo({top:0});
}

if ($('loginForm')) {
  $('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const userInput = $('loginUser').value.trim();
    const passInput = $('loginPass').value;

    const foundUser = USERS.find(
      u => u.user === userInput && u.pass === passInput
    );

    if (!foundUser) {
      showToast('Usuário ou senha inválidos.');
      return;
    }

    setAuthenticated(true, Boolean($('rememberMe')?.checked));
    showToast(`Bem-vindo, ${foundUser.name}!`);
    go('capa');
  });
}

function logout() {
  setAuthenticated(false);
  if ($('loginPass')) $('loginPass').value = '';
  if (location.hash === '#login' || location.hash === '') {
    route();
  } else {
    location.hash = 'login';
  }
  showToast('Você saiu da sessão.');
}

if ($('logoutBtn')) {
  $('logoutBtn').addEventListener('click', logout);
}

$('enterBtn').onclick = ()=>go('matrix');
document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>go(b.dataset.page));
document.querySelectorAll('.hotspot').forEach(b=>b.onclick=()=>go('etapa-'+b.dataset.step));
$('globalSearchBtn').onclick = openSearch;
$('globalSearchInput').oninput = runSearch;
$('globalSearchOverlay').onclick = e=>{ if(e.target.id==='globalSearchOverlay') closeSearch(); };
addEventListener('keydown', e=>{ if(e.key==='Escape') closeSearch(); });
addEventListener('hashchange', route);
renderCommissions(); route();