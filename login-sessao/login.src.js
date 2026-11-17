(function(){
var CFG=window.LG||{},USERS=CFG.users||{},ACTIVE=CFG.active||[];
var META={};
var root=document.getElementById(CFG.el||'lg');if(!root)return;
var css=document.createElement('style');
css.textContent='.lg-card{max-width:440px;margin:0 auto;background:var(--surface-2);border:0.5px solid var(--border);border-radius:12px;padding:1.25rem 1.5rem}'+
'.lg-f{margin-bottom:14px}.lg-f label{display:block;font-size:13px;color:var(--text-secondary);margin-bottom:6px}.lg-f input{width:100%;box-sizing:border-box}'+
'.lg-err{font-size:13px;color:var(--text-danger);margin-top:6px;min-height:0}.lg-ok{font-size:13px;color:var(--text-success);margin-top:6px}.lg-hint{font-size:13px;color:var(--text-muted);margin-top:6px}'+
'.lg-locked{cursor:pointer}.lg-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}'+
'.lg-u{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 8px;border-radius:var(--radius);cursor:pointer;font-size:13px;color:var(--text-primary);user-select:none;outline:none;transition:background .12s}'+
'.lg-u:hover{background:var(--surface-1)}.lg-u:focus-visible{box-shadow:0 0 0 2px var(--border-accent)}'+
'.lg-av{width:56px;height:56px;border-radius:50%;background:var(--bg-accent);color:var(--text-accent);display:flex;align-items:center;justify-content:center;font-weight:500;font-size:15px;overflow:hidden;flex:none}.lg-av img{width:100%;height:100%;object-fit:cover;display:block}'+
'.lg-chk{position:absolute;top:6px;right:6px;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px}'+
'.lg-badge{font-size:11px;padding:2px 8px;border-radius:var(--radius);background:var(--bg-success);color:var(--text-success)}';
root.appendChild(css);
var pad=function(n){return String(n).padStart(2,'0')};
function now(){var d=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Sao_Paulo'}));return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()+' · '+pad(d.getHours())+':'+pad(d.getMinutes())}
function h(tag,attrs,kids){var e=document.createElement(tag);if(attrs)for(var k in attrs){if(k==='style')e.style.cssText=attrs[k];else if(k==='text')e.textContent=attrs[k];else if(k==='html')e.innerHTML=attrs[k];else e.setAttribute(k,attrs[k])}(kids||[]).forEach(function(c){if(c)e.appendChild(c)});return e}
function nm(k){return USERS[k].name||k}
function avatar(el,k){el.innerHTML='';var m=USERS[k]||{};if(m.img){var i=h('img',{src:m.img,alt:nm(k)});i.onerror=function(){el.textContent=nm(k).slice(0,2).toUpperCase()};el.appendChild(i)}else el.textContent=nm(k).slice(0,2).toUpperCase()}
async function sha(s){var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
function norm(s){return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
var sel=null,unlocked=false,fails=0,lockedUntil=0,cards={};
var uErr=h('div',{class:'lg-err'}),grid=h('div',{class:'lg-grid',role:'radiogroup','aria-label':'Usuário'});
var cIn=h('input',{type:'password',autocomplete:'off',placeholder:'Seu código',style:'flex:1'}),cBtn=h('button',{text:'Validar'}),cErr=h('div',{class:'lg-err'});
var codeWrap=h('div',{class:'lg-f',style:'display:none'},[h('label',{text:'Código secreto'}),h('div',{style:'display:flex;gap:8px'},[cIn,cBtn]),cErr]);
var pIn=h('input',{type:'password',readonly:'',class:'lg-locked',placeholder:'Clique para desbloquear',autocomplete:'off'}),pErr=h('div',{class:'lg-err'}),pHint=h('div',{class:'lg-hint'});
var full=h('div',null,[codeWrap,h('div',{class:'lg-f'},[h('label',{text:'Senha'}),pIn,pErr,pHint])]);
var quick=h('div',{style:'display:none;margin-bottom:14px;padding:10px 12px;border-radius:var(--radius);background:var(--bg-success);color:var(--text-success);font-size:13px',html:'<i class="ti ti-circle-check" aria-hidden="true"></i> Sessão do dia ativa. Não precisa de senha até 23:59.'});
var go=h('button',{text:'Entrar',style:'width:100%'});
var form=h('div',null,[
 h('div',{style:'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px'},[h('div',{style:'display:flex;align-items:center;gap:10px',html:'<i class="ti ti-lock" style="font-size:20px;color:var(--text-secondary)" aria-hidden="true"></i><div style="font-size:16px;font-weight:500">Entrar</div>'}),h('div',{style:'font-size:12px;color:var(--text-muted)',text:now().split(' · ')[0]})]),
 h('div',{class:'lg-f'},[h('label',{text:'Quem é você?'}),grid,uErr]),full,quick,go]);
var doneAv=h('div',{class:'lg-av',style:'width:72px;height:72px;margin:0 auto 12px'}),welcome=h('div',{style:'font-size:18px;font-weight:500;margin:2px 0'}),stamp=h('div',{style:'font-size:13px;color:var(--text-muted);margin-bottom:16px'}),out=h('button',{text:'Trocar usuário'});
var done=h('div',{style:'display:none;text-align:center;padding:1.25rem 0'},[doneAv,h('div',{style:'font-size:13px;color:var(--text-secondary)',text:'Expert dessa sessão'}),welcome,stamp,out]);
root.appendChild(h('div',{style:'padding:1rem 0'},[h('div',{class:'lg-card'},[form,done])]));
function paint(){Object.keys(cards).forEach(function(k){var c=cards[k],on=k===sel;c.el.setAttribute('aria-checked',on?'true':'false');
 c.el.style.border=on?'2px solid var(--fill-accent, #378ADD)':'0.5px solid var(--border)';c.el.style.padding=on?'12.5px 6.5px':'14px 8px';
 c.el.style.background=on?'var(--bg-accent-muted, var(--bg-accent))':'transparent';c.chk.style.display=on?'flex':'none'})}
function lockPass(){unlocked=false;pIn.readOnly=true;pIn.value='';pIn.classList.add('lg-locked');pIn.placeholder='Clique para desbloquear';pHint.className='lg-hint';pHint.innerHTML='<i class="ti ti-lock" aria-hidden="true"></i> Bloqueada até validar o código secreto'}
function resetFlow(){lockPass();codeWrap.style.display='none';cIn.value='';cErr.textContent='';pErr.textContent=''}
function mode(){var q=sel&&ACTIVE.indexOf(sel)>=0;full.style.display=q?'none':'block';quick.style.display=q?'block':'none'}
function pick(k){sel=k;uErr.textContent='';resetFlow();mode();paint()}
Object.keys(USERS).forEach(function(k){var av=h('span',{class:'lg-av'});avatar(av,k);
 var chk=h('span',{class:'lg-chk',style:'display:none;background:var(--fill-accent, #378ADD);color:var(--on-accent, #fff)',html:'<i class="ti ti-check" aria-hidden="true"></i>'});
 var el=h('div',{class:'lg-u',role:'radio',tabindex:'0','aria-checked':'false'},[chk,av,document.createTextNode(nm(k)),ACTIVE.indexOf(k)>=0?h('span',{class:'lg-badge',text:'hoje'}):null]);
 el.addEventListener('click',function(){pick(k)});el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(k)}});
 cards[k]={el:el,chk:chk};grid.appendChild(el)});
lockPass();paint();
pIn.addEventListener('click',function(){if(unlocked)return;if(!sel){uErr.textContent='Escolha um usuário primeiro';return}codeWrap.style.display='block';cIn.focus()});
async function validate(){cErr.textContent='';if(Date.now()<lockedUntil){cErr.textContent='Muitas tentativas. Aguarde '+Math.ceil((lockedUntil-Date.now())/1000)+'s.';return}
 var c=norm(cIn.value);if(!c){cErr.textContent='Digite o código secreto';return}
 if(await sha(sel+':code:'+c)===USERS[sel].c){unlocked=true;fails=0;cIn.value='';pIn.readOnly=false;pIn.classList.remove('lg-locked');pIn.placeholder='Sua senha';pHint.className='lg-ok';pHint.innerHTML='<i class="ti ti-lock-open" aria-hidden="true"></i> Código válido. Senha liberada';codeWrap.style.display='none';pIn.focus()}
 else{fails++;cIn.value='';if(fails>=3){lockedUntil=Date.now()+10000;fails=0;cErr.textContent='Código incorreto. Travado por 10s.';if(typeof sendPrompt==='function')sendPrompt('[login] bloqueio: '+sel+' errou o código secreto 3 vezes')}else cErr.textContent='Código incorreto. Tentativa '+fails+' de 3.'}}
cBtn.onclick=validate;cIn.addEventListener('input',function(){cErr.textContent=''});cIn.addEventListener('keydown',function(e){if(e.key==='Enter')validate()});
function success(tipo){form.style.display='none';done.style.display='block';avatar(doneAv,sel);welcome.textContent=nm(sel);stamp.textContent=now();if(typeof sendPrompt==='function')sendPrompt('[login] sucesso: '+sel+' · perfil '+(USERS[sel].perfil||sel)+' · '+tipo)}
async function login(){pErr.textContent='';if(!sel){uErr.textContent='Escolha um usuário';return}
 if(ACTIVE.indexOf(sel)>=0){success('sessão do dia');return}
 if(!unlocked){pErr.textContent='Valide o código secreto antes';return}
 var pv=pIn.value;if(!pv){pErr.textContent='Digite a senha';return}
 if(await sha(sel+':pass:'+pv)===USERS[sel].p){pIn.value='';success('login completo')}else{pIn.value='';pErr.textContent='Senha incorreta'}}
go.onclick=login;pIn.addEventListener('input',function(){pErr.textContent=''});pIn.addEventListener('keydown',function(e){if(e.key==='Enter')login()});
out.onclick=function(){sel=null;resetFlow();mode();paint();done.style.display='none';form.style.display='block'};
})();
