(function(){
  var rok=document.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var b=document.getElementById('burger'), m=document.getElementById('menu');
  function zamknij(){m.classList.remove('otwarte');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu');document.body.style.overflow='';}
  b.addEventListener('click',function(){
    var o=m.classList.toggle('otwarte');
    b.setAttribute('aria-expanded',o?'true':'false');
    b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');
    document.body.style.overflow=o?'hidden':'';
  });
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){
    if(a.getAttribute('href').charAt(0)==='#'){m.querySelectorAll('a').forEach(function(x){x.classList.remove('akt')});if(!a.classList.contains('menu-tel'))a.classList.add('akt');}
    zamknij();
  })});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu przy przewijaniu
  var linki={}; m.querySelectorAll('a[href^="#"]').forEach(function(a){linki[a.getAttribute('href').slice(1)]=a;});
  if('IntersectionObserver' in window){
    var ids=Object.keys(linki).filter(function(id,i,arr){return arr.indexOf(id)===i&&document.getElementById(id);});
    var akt=function(){var mid=innerHeight*0.45,cur=null;
      ids.forEach(function(id){if(document.getElementById(id).getBoundingClientRect().top<=mid)cur=id;});
      m.querySelectorAll('a').forEach(function(x){x.classList.toggle('akt',cur!==null&&x===linki[cur]);});};
    var raf=0; window.addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(function(){raf=0;akt();});},{passive:true}); akt();

    // dolny pasek na telefonie dopiero po przewinięciu za pierwszy ekran
    var pasek=document.getElementById('mobPasek'), hero=document.querySelector('.hero');
    new IntersectionObserver(function(en){
      var w=!en[0].isIntersecting; pasek.classList.toggle('widac',w); pasek.setAttribute('aria-hidden',w?'false':'true');
      pasek.querySelectorAll('a').forEach(function(a){a.tabIndex=w?0:-1;});
    },{threshold:0}).observe(hero);
  }

  // galeria: palec, mysz, strzałki, klawiatura
  var g=document.getElementById('galeria'), licz=document.getElementById('licznik');
  var figs=g.querySelectorAll('figure');
  function biez(){var l=g.getBoundingClientRect().left+parseFloat(getComputedStyle(g).paddingLeft),best=0,d=1e9;
    figs.forEach(function(f,i){var x=Math.abs(f.getBoundingClientRect().left-l);if(x<d){d=x;best=i;}});return best;}
  function idz(i){i=Math.max(0,Math.min(figs.length-1,i));var f=figs[i];
    g.scrollTo({left:f.offsetLeft-parseFloat(getComputedStyle(g).paddingLeft),behavior:'smooth'});}
  document.querySelectorAll('.strz').forEach(function(s){s.addEventListener('click',function(){idz(biez()+parseInt(s.dataset.kier,10));});});
  g.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(biez()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(biez()-1);}});
  var t; g.addEventListener('scroll',function(){clearTimeout(t);t=setTimeout(function(){licz.textContent=(biez()+1)+' / '+figs.length;},60);},{passive:true});
  var down=false,sx=0,sl=0,ruch=false;
  g.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;ruch=false;sx=e.clientX;sl=g.scrollLeft;});
  window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4){ruch=true;g.classList.add('ciagnie');}g.scrollLeft=sl-dx;});
  window.addEventListener('pointerup',function(){if(!down)return;down=false;if(ruch){g.classList.remove('ciagnie');idz(biez());}});
  g.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
})();
