(function(){
  'use strict';
  // Links and content are ready in HTML; JavaScript adds optional motion.
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  (function(){
    var fly=document.querySelector('.fly'), bob=document.querySelector('.bob');
    if(!fly) return;
    function set(p){
      var sx=80, sy=-236;
      var q=Math.sin(p*Math.PI/2); /* gentle ease-out: fast start, soft landing */
      q=0.35*p+0.65*q;
      var ramp=Math.min(1,Math.max(0,q/.22)); ramp=ramp*ramp*(3-2*ramp);
      var R=150*(1-q)*ramp;
      var th=-1.1+Math.PI*2*3*q;
      var cx=sx*(1-q), cy=sy*(1-q);
      var x=cx+R*Math.cos(th), y=cy+R*Math.sin(th)*.62;
      var sc=0.02+0.98*Math.pow(q,1.15);
      var rot=1440*q;
      fly.setAttribute('transform','translate('+x.toFixed(2)+' '+y.toFixed(2)+') scale('+sc.toFixed(4)+') rotate('+rot.toFixed(2)+')');
      fly.style.opacity=Math.min(1,q*25);
    }
    if(reduce){ set(1); fly.style.opacity=1; return; }
    set(0);
    var D=5200, delay=500, t0=null;
    function tick(ts){
      if(t0===null) t0=ts;
      var t=(ts-t0-delay)/D;
      if(t<0){ requestAnimationFrame(tick); return; }
      if(t>=1){ set(1); fly.style.opacity=1; bob.classList.add('on'); return; }
      set(t); requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();
  var s=document.getElementById('snow'), html='';
  if(s&&!reduce){
    for(var i=0;i<38;i++){var l=Math.random()*100,d=8+Math.random()*10,de=-Math.random()*12,z=3+Math.random()*5;
      html+='<i style="left:'+l+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+d+'s;animation-delay:'+de+'s"></i>';}
    s.innerHTML=html;
  }
  if(!('IntersectionObserver' in window)) return;
  if(!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.remove('reveal-pending');io.unobserve(e.target);}
    });},{threshold:.12});
    [].slice.call(document.querySelectorAll('.rv')).forEach(function(el){
      io.observe(el);el.classList.add('reveal-pending');
    });
  }
  var bar=document.getElementById('bar'), button=document.getElementById('barBtn');
  var apply=document.getElementById('apply'), hero=document.querySelector('.hero');
  if(!bar||!button||!apply||!hero) return;
  var past=false, atEnd=false;
  function upd(){
    var show=past&&!atEnd;
    bar.classList.toggle('show',show);
    bar.setAttribute('aria-hidden',show?'false':'true');
    bar.toggleAttribute('inert',!show);
    button.tabIndex=show?0:-1;
  }
  new IntersectionObserver(function(es){past=es[0].boundingClientRect.bottom<=0;upd();}).observe(hero);
  new IntersectionObserver(function(es){atEnd=es[0].isIntersecting;upd();}).observe(apply);
})();
