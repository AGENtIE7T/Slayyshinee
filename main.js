(function(){
  var d=document,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return[].slice.call((c||d).querySelectorAll(s))};
  // Nav background on scroll
  var nav=$('.nav');
  if(nav&&!nav.classList.contains('solid')){var onS=function(){nav.classList.toggle('scrolled',scrollY>40)};onS();addEventListener('scroll',onS,{passive:true})}
  // Mobile menu
  var menu=$('#menu'),openB=$('.menu-btn'),closeB=$('.menu-close');
  function setMenu(o){if(!menu)return;menu.classList.toggle('open',o);menu.setAttribute('aria-hidden',!o);openB&&openB.setAttribute('aria-expanded',o);d.body.style.overflow=o?'hidden':'';if(o)closeB.focus();else openB&&openB.focus()}
  openB&&openB.addEventListener('click',function(){setMenu(true)});
  closeB&&closeB.addEventListener('click',function(){setMenu(false)});
  menu&&$$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu&&menu.classList.contains('open'))setMenu(false)});
  // Reveal on scroll
  var rv=$$('.reveal');
  if('IntersectionObserver'in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});rv.forEach(function(el){io.observe(el)})}else rv.forEach(function(el){el.classList.add('in')});
  setTimeout(function(){rv.forEach(function(el){if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in')})},300);
  // Catalogue from the cards on the page
  var CAT={};$$('.card').forEach(function(c){var b=$('.add',c);if(!b)return;CAT[b.dataset.id]={name:b.dataset.name,sub:($('.card-sub',c)||{}).textContent||'',price:parseInt(($('.price',c).textContent||'').replace(/[^0-9]/g,''),10)||0,svg:($('.card-media svg',c)||{}).outerHTML||''}});
  var inr=function(n){return '₹'+n.toLocaleString('en-IN')};
  // Cart (stored on device) — [{id,q}]
  var KEY='ssj-cart2',cart=[];try{cart=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
  cart=cart.filter(function(i){return i&&CAT[i.id]});
  var badge=$('.cart-count'),toast=$('.toast'),tt;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}}
  function count(){return cart.reduce(function(s,i){return s+i.q},0)}
  function total(){return cart.reduce(function(s,i){return s+i.q*CAT[i.id].price},0)}
  function say(m){if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},2200)}
  // Drawer
  var waLink=$('a[href^="https://wa.me/"]'),waBase=waLink?waLink.getAttribute('href').split('?')[0]:'https://wa.me/';
  var scrim=d.createElement('div');scrim.className='scrim';
  var dr=d.createElement('aside');dr.className='drawer';dr.id='cart';dr.setAttribute('role','dialog');dr.setAttribute('aria-modal','true');dr.setAttribute('aria-label','Your bag');dr.setAttribute('aria-hidden','true');
  dr.innerHTML='<div class="dr-head"><p class="dr-title">Your <em>bag</em></p><button class="icon-btn dr-close" type="button" aria-label="Close bag"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg></button></div><div class="dr-ship"></div><ul class="dr-list"></ul><div class="dr-foot"><p class="dr-sum"><span>Subtotal</span><b></b></p><a class="btn dr-checkout" target="_blank" rel="noopener">Order on WhatsApp</a><p class="dr-note">Free shipping above ₹999 · Ships in 2–3 days</p></div>';
  d.body.appendChild(scrim);d.body.appendChild(dr);
  var lastFocus;
  function setDrawer(o){dr.classList.toggle('open',o);scrim.classList.toggle('open',o);dr.setAttribute('aria-hidden',!o);d.body.style.overflow=o?'hidden':'';if(o){lastFocus=d.activeElement;$('.dr-close',dr).focus()}else lastFocus&&lastFocus.focus&&lastFocus.focus()}
  function render(){var n=count(),t=total();
    if(badge){badge.textContent=n;badge.setAttribute('data-n',n);badge.parentNode.setAttribute('aria-label','Bag, '+n+' item'+(n===1?'':'s'))}
    var list=$('.dr-list',dr);
    if(!cart.length){list.innerHTML='<li class="dr-empty"><p>Your bag is empty.</p><a class="tlink" href="shop.html#all">Shop the collection <span aria-hidden="true">→</span></a></li>'}
    else list.innerHTML=cart.map(function(i){var p=CAT[i.id];return '<li class="dr-row" data-id="'+i.id+'"><div class="dr-img">'+p.svg+'</div><div class="dr-info"><p class="dr-name">'+p.name+'</p><p class="dr-sub">'+p.sub+'</p><div class="qty"><button type="button" data-a="-" aria-label="Decrease quantity of '+p.name+'">−</button><span aria-live="polite">'+i.q+'</span><button type="button" data-a="+" aria-label="Increase quantity of '+p.name+'">+</button></div></div><div class="dr-right"><p class="price">'+inr(p.price*i.q)+'</p><button type="button" class="dr-rm" data-a="x">Remove</button></div></li>'}).join('');
    $('.dr-sum b',dr).textContent=inr(t);
    $('.dr-foot',dr).hidden=!cart.length;
    var left=999-t,sh=$('.dr-ship',dr);sh.hidden=!cart.length;sh.innerHTML=left>0?'Add <b>'+inr(left)+'</b> more for free shipping<span style="--p:'+Math.min(100,t/999*100)+'%"></span>':'You\u2019ve unlocked <b>free shipping</b> ✦<span style="--p:100%"></span>';
    var msg='Hi Slayyshine! I\u2019d like to order:\n'+cart.map(function(i){return '• '+CAT[i.id].name+' × '+i.q+' — '+inr(CAT[i.id].price*i.q)}).join('\n')+'\n\nSubtotal: '+inr(t);
    $('.dr-checkout',dr).href=waBase+'?text='+encodeURIComponent(msg)}
  dr.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.classList.contains('dr-close'))return setDrawer(false);var row=b.closest('.dr-row');if(!row)return;var it=cart.filter(function(i){return i.id===row.dataset.id})[0];if(!it)return;var a=b.dataset.a;if(a==='+')it.q=Math.min(9,it.q+1);else if(a==='-')it.q--;else it.q=0;cart=cart.filter(function(i){return i.q>0});save();render()});
  scrim.addEventListener('click',function(){setDrawer(false)});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&dr.classList.contains('open'))setDrawer(false)});
  var bagBtn=badge&&badge.parentNode;bagBtn&&bagBtn.addEventListener('click',function(e){e.preventDefault();setDrawer(true)});
  render();
  $$('.add').forEach(function(b){b.addEventListener('click',function(){var id=b.dataset.id,it=cart.filter(function(i){return i.id===id})[0];if(it)it.q=Math.min(9,it.q+1);else cart.push({id:id,q:1});save();render();b.classList.add('added');b.textContent='✓ Added';say(b.dataset.name+' added to bag');setTimeout(function(){b.classList.remove('added');b.textContent='Add to Cart'},1800)})});
  if(location.hash==='#bag')setTimeout(function(){setDrawer(true)},50);
  // Newsletter
  var f=$('.sub-form');
  f&&f.addEventListener('submit',function(e){e.preventDefault();var i=$('input',f),m=$('.sub-msg');if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim())){m.className='sub-msg err';m.textContent='Please enter a valid email address.';i.focus();return}m.className='sub-msg';m.textContent="You're in. New drops land in your inbox first.";f.reset()});
  // Shop filters
  var grid=$('#shop-grid');
  if(grid){
    var cards=$$('.card',grid),pills=$$('.pill'),h1=$('#shop-title'),cnt=$('#shop-count'),lbl={};
    pills.forEach(function(p){lbl[p.dataset.f]=p.textContent});
    function apply(f){if(!lbl[f])f='all';var n=0;cards.forEach(function(c){var show=f==='all'||c.dataset.cats.split(' ').indexOf(f)>-1;c.hidden=!show;if(show)n++});pills.forEach(function(p){p.setAttribute('aria-pressed',p.dataset.f===f)});$$('.nav-links a, .menu a').forEach(function(a){var h=a.getAttribute('href')||'';if(h.indexOf('shop.html#')===0){if(h==='shop.html#'+f)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}});h1.textContent=f==='all'?'Shop All Jewellery':lbl[f];cnt.textContent=n+(n===1?' piece':' pieces');d.title=(f==='all'?'Shop All Demifine Jewellery':lbl[f]+' — Demifine Jewellery')+' | Slayyshine Jewels'}
    pills.forEach(function(p){p.addEventListener('click',function(){history.replaceState(null,'','#'+p.dataset.f);apply(p.dataset.f)})});
    addEventListener('hashchange',function(){apply(location.hash.slice(1))});
    apply(location.hash.slice(1)||'all');
  }
  var y=$('#year');y&&(y.textContent=new Date().getFullYear());
})();
