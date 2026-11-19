(function(){
  'use strict';
  // Links and content are ready in HTML; JavaScript adds optional motion.
  var motionQuery=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  var reduce=!!(motionQuery&&motionQuery.matches), revealObserver=null;

  function showContent(){
    [].slice.call(document.querySelectorAll('.reveal-pending')).forEach(function(el){
      el.classList.remove('reveal-pending');
    });
    if(revealObserver) revealObserver.disconnect();
  }

  (function(){
    var root=document.documentElement, scene=document.querySelector('.hero-art');
    var fly=document.querySelector('.fly'), bob=document.querySelector('.bob'), snow=document.getElementById('snow');
    var controls=document.getElementById('motionControls');
    var play=document.getElementById('motionPlay'), stop=document.getElementById('motionStop');
    if(!fly||!bob||!scene||!window.requestAnimationFrame||!window.cancelAnimationFrame) return;
    var enabled=false, flying=false, frame=null, elapsed=0, lastTime=null, sceneVisible=false;
    var duration=5200, delay=500;

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

    function cancelFrame(){
      if(frame!==null) window.cancelAnimationFrame(frame);
      frame=null;
      lastTime=null;
    }
    function canPlay(){return enabled&&flying&&!document.hidden&&sceneVisible;}
    function queueFrame(){
      if(canPlay()&&frame===null) frame=window.requestAnimationFrame(tick);
    }
    function tick(ts){
      frame=null;
      if(!canPlay()){lastTime=null;return;}
      // Count visible frame time, not time spent suspended in another app or tab.
      if(lastTime!==null) elapsed+=Math.max(0,Math.min(ts-lastTime,100));
      lastTime=ts;
      var t=(elapsed-delay)/duration;
      if(t>=1){
        set(1);
        flying=false;
        lastTime=null;
        bob.classList.add('on');
        return;
      }
      if(t>=0) set(t);
      queueFrame();
    }

    function readSceneVisibility(){
      var rect=scene.getBoundingClientRect();
      sceneVisible=rect.bottom>0&&rect.top<(window.innerHeight||root.clientHeight);
    }
    function syncPlayback(){
      root.classList.toggle('page-hidden',!!document.hidden);
      scene.classList.toggle('motion-idle',!enabled||document.hidden||!sceneVisible);
      if(canPlay()) queueFrame();
      else cancelFrame();
    }
    function restart(){
      cancelFrame();
      elapsed=0;
      flying=true;
      bob.classList.remove('on');
      set(0);
      readSceneVisibility();
      syncPlayback();
    }
    function createSnow(){
      if(!snow||snow.children.length) return;
      var html='', count=window.innerWidth<600?24:38;
      for(var i=0;i<count;i++){
        var l=Math.random()*100,d=8+Math.random()*10,de=-Math.random()*12,z=3+Math.random()*5;
        html+='<i style="left:'+l+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+d+'s;animation-delay:'+de+'s"></i>';
      }
      snow.innerHTML=html;
    }
    function setMotion(on){
      enabled=on;
      root.setAttribute('data-motion',on?'on':'off');
      if(on){
        createSnow();
        restart();
      }else{
        flying=false;
        cancelFrame();
        set(1);
        bob.classList.remove('on');
        showContent();
        syncPlayback();
      }
      if(play) play.textContent=on?'편지 다시 보기':'움직임 재생';
      if(stop) stop.hidden=!on;
    }
    function syncPreference(){
      var next=!!(motionQuery&&motionQuery.matches);
      if(next!==reduce){reduce=next;setMotion(!reduce);}
    }
    if(play) play.addEventListener('click',function(){setMotion(true);});
    if(stop) stop.addEventListener('click',function(){setMotion(false);});
    if(motionQuery){
      if(motionQuery.addEventListener) motionQuery.addEventListener('change',syncPreference);
      else if(motionQuery.addListener) motionQuery.addListener(syncPreference);
    }
    document.addEventListener('visibilitychange',function(){
      syncPreference();
      readSceneVisibility();
      syncPlayback();
    });
    window.addEventListener('pagehide',function(){
      cancelFrame();
      root.classList.add('page-hidden');
    });
    window.addEventListener('pageshow',function(event){
      syncPreference();
      readSceneVisibility();
      if(event.persisted&&enabled) restart();
      else syncPlayback();
    });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(entries){
        sceneVisible=entries[0].isIntersecting;
        syncPlayback();
      }).observe(scene);
    }else{
      window.addEventListener('scroll',function(){readSceneVisibility();syncPlayback();},{passive:true});
    }
    setMotion(!reduce);
    if(controls) controls.hidden=false;
  })();
  if(!('IntersectionObserver' in window)) return;
  if(!reduce){
    revealObserver=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.remove('reveal-pending');revealObserver.unobserve(e.target);}
    });},{threshold:.12});
    [].slice.call(document.querySelectorAll('.rv')).forEach(function(el){
      revealObserver.observe(el);el.classList.add('reveal-pending');
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
