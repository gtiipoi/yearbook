/* ============================================ */
/*  游戏G: 缘分十字路口                         */
/* ============================================ */
async function renderCrossroads() {
  _gameMode = 'crossroads';
  if (!me) { goGuestLogin(); return; }
  var questions = [
    '谁更可能成为CEO？','谁会最早结婚？','谁最可能环游世界？','谁最可能上电视？',
    '谁最可能养宠物？','谁最可能成为老师？','谁最可能赚到第一个100万？','谁最可能发明新东西？',
    '谁的婚礼会最豪华？','谁最可能搬到国外住？','谁最可能写一本书？','谁最可能开公司？',
    '谁最可能成为网红？','谁最可能活到100岁？','谁最可能成为家长群里最活跃的？'
  ];
  var sResp = await sb.from('students').select('id,name').limit(52);
  var students = (sResp.data||[]).filter(function(s){return s.name.length>=2;});
  var colors=['#ff9eb0','#ffb088','#88c8e8','#b0a0e8','#e8a0d0','#80d0c0','#f0b0b0','#c0c0e0'];

  var q = questions[Math.floor(Math.random()*questions.length)];
  var a=students[Math.floor(Math.random()*students.length)];
  var b=students[Math.floor(Math.random()*students.length)];
  while(b.id===a.id) b=students[Math.floor(Math.random()*students.length)];
  var ca=a.name.charCodeAt(a.name.length-1)%colors.length;
  var cb=b.name.charCodeAt(b.name.length-1)%colors.length;

  var vResp = await sb.from('crossroads_votes').select('voted_id').eq('question',q);
  var votes={}; var total=0;
  (vResp.data||[]).forEach(function(v){votes[v.voted_id]=(votes[v.voted_id]||0)+1;total++;});
  var aPct=total>0?Math.round((votes[a.id]||0)/total*100):50;
  var bPct=100-aPct;

  var html='<a href="javascript:void(0)" class="btn btn-back mb-16" style="text-decoration:none" data-back="lobby">'+
    '← 游戏大厅</a>'+
    '<div class="section-title" style="font-size:18px;font-weight:700;margin-bottom:4px">🌍 缘分十字路口</div>'+
    '<p style="text-align:center;font-size:13px;color:var(--text-light);margin-bottom:8px">点击你支持的选手！</p>'+
    '<div style="text-align:center;font-size:18px;font-weight:700;color:var(--text);margin-bottom:20px">'+q+'</div>'+
    '<div style="display:flex;gap:16px;justify-content:center;align-items:center">'+
    '<div id="crsVoteA" data-crs-vote="'+a.id+'" style="cursor:pointer;text-align:center;padding:16px 24px;background:rgba(255,255,255,0.8);border-radius:16px;min-width:120px">'+
    '<div style="width:64px;height:64px;border-radius:50%;background:'+colors[ca]+';display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;font-weight:700;margin:0 auto 8px">'+a.name.charAt(a.name.length-1)+'</div>'+
    '<div style="font-size:16px;font-weight:600;color:var(--text)">'+a.name+'</div>'+
    '<div style="font-size:24px;font-weight:700;color:var(--pink);margin-top:4px">'+aPct+'%</div></div>'+
    '<div style="font-size:24px;font-weight:700;color:var(--text-light)">VS</div>'+
    '<div id="crsVoteB" data-crs-vote="'+b.id+'" style="cursor:pointer;text-align:center;padding:16px 24px;background:rgba(255,255,255,0.8);border-radius:16px;min-width:120px">'+
    '<div style="width:64px;height:64px;border-radius:50%;background:'+colors[cb]+';display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;font-weight:700;margin:0 auto 8px">'+b.name.charAt(b.name.length-1)+'</div>'+
    '<div style="font-size:16px;font-weight:600;color:var(--text)">'+b.name+'</div>'+
    '<div style="font-size:24px;font-weight:700;color:var(--pink);margin-top:4px">'+bPct+'%</div></div>'+
    '</div><div style="text-align:center;margin-top:12px;font-size:12px;color:var(--text-light)">共 '+total+' 票</div>'+
    '<button class="btn btn-primary" style="display:block;margin:16px auto" onclick="renderCrossroads()">🔄 换一题</button>';
  document.getElementById('view').innerHTML=html;
  // Bind vote clicks
  setTimeout(function(){
    var va=document.getElementById('crsVoteA'); if(va) va.onclick=function(){window._crsVote(a.id);};
    var vb=document.getElementById('crsVoteB'); if(vb) vb.onclick=function(){window._crsVote(b.id);};
  },50);
  window._crsVote=async function(sid){
    try{await sb.from('crossroads_votes').upsert({question:q,voted_id:sid,voter_id:me.id},{onConflict:'question,voter_id'});}catch(e){}
    renderCrossroads();
  };
}

/* ============================================ */
/*  游戏H: 评价盲盒                             */
/* ============================================ */
async function renderBlindBox() {
  _gameMode = 'blindbox';
  if (!me) { goGuestLogin(); return; }
  var countResp = await sb.from('reviews').select('id',{count:'exact',head:true}).eq('author_id',me.id);
  var coins = countResp.count||0;
  var html='<a href="javascript:void(0)" class="btn btn-back mb-16" style="text-decoration:none" data-back="lobby">'+
    '← 游戏大厅</a>'+
    '<div class="section-title" style="font-size:18px;font-weight:700;margin-bottom:4px">🎁 评价盲盒</div>'+
    '<p style="text-align:center;font-size:14px;color:var(--text);margin-bottom:4px">💰 你的金币: <b style="color:#ffb088;font-size:20px">'+coins+'</b></p>'+
    '<p style="text-align:center;font-size:12px;color:var(--text-light);margin-bottom:16px">每写一条评价获得1金币</p>'+
    '<div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">'+
    '<div id="boxNormal" style="cursor:pointer;background:linear-gradient(135deg,#e0d8e8,#f5f0f8);border-radius:16px;padding:24px 20px;text-align:center;min-width:140px">'+
    '<div style="font-size:40px">📦</div><div style="font-weight:700;margin-top:8px">普通盲盒</div><div style="font-size:13px;color:var(--text-light)">1金币</div></div>'+
    '<div id="boxGold" style="cursor:pointer;background:linear-gradient(135deg,#ffd980,#ffb088);border-radius:16px;padding:24px 20px;text-align:center;min-width:140px">'+
    '<div style="font-size:40px">✨</div><div style="font-weight:700;margin-top:8px">金色盲盒</div><div style="font-size:13px;color:var(--text-light)">3金币 - 最走心评价</div></div>'+
    '</div><div id="boxResult" style="text-align:center;margin-top:20px"></div>';
  document.getElementById('view').innerHTML=html;
  setTimeout(function(){
    var bn=document.getElementById('boxNormal'); if(bn) bn.onclick=function(){window._openBox(1);};
    var bg=document.getElementById('boxGold'); if(bg) bg.onclick=function(){window._openBox(3);};
  },50);
  window._openBox=async function(cost){
    if(coins<cost){alert('金币不足！写评价赚金币吧~');return;}
    var rResp=await sb.from('reviews').select('strengths,weaknesses').not('strengths','is',null).neq('strengths','');
    var revs=rResp.data||[];
    if(revs.length===0){alert('还没有评价可开');return;}
    var picked;
    if(cost===3){revs.sort(function(a,b){return(b.strengths||'').length-(a.strengths||'').length;});picked=revs[0];}
    else{picked=revs[Math.floor(Math.random()*revs.length)];}
    var boxEl=document.getElementById('boxResult');
    if(boxEl){
      boxEl.innerHTML='<div style="animation:boxOpen 0.6s ease"><div style="font-size:36px;margin-bottom:8px">🎉</div>'+
        '<div style="background:rgba(255,255,255,0.8);border-radius:16px;padding:20px;max-width:360px;margin:0 auto;font-size:15px;line-height:1.8;color:var(--text)">'+
        '<p style="color:var(--pink);font-weight:600;margin-bottom:8px">✨ 优点</p><p>'+picked.strengths.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p>'+
        (picked.weaknesses?'<p style="color:var(--purple);font-weight:600;margin:12px 0 8px">💡 待改进</p><p>'+picked.weaknesses.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</p>':'')+
        '</div></div>';
    }
  };
}

/* ============================================ */
/*  游戏I: 回忆碎片拼图                         */
/* ============================================ */
var _puzzleTiles=[], _puzzleEmpty=0, _puzzleTimer=0, _puzzleInt=null, _puzzleNames=[];

function renderPuzzle(){
  _gameMode='puzzle'; _puzzleTimer=0; if(_puzzleInt)clearInterval(_puzzleInt);
  _puzzleNames=['陆','冬','莉','戴','用','华','国','浩','燕'];
  _puzzleTiles=_puzzleNames.slice(); _puzzleEmpty=8;
  for(var i=0;i<20;i++){
    var neighbors=[];
    var er=Math.floor(_puzzleEmpty/3), ec=_puzzleEmpty%3;
    if(er>0)neighbors.push(_puzzleEmpty-3);
    if(er<2)neighbors.push(_puzzleEmpty+3);
    if(ec>0)neighbors.push(_puzzleEmpty-1);
    if(ec<2)neighbors.push(_puzzleEmpty+1);
    var swap=neighbors[Math.floor(Math.random()*neighbors.length)];
    var t=_puzzleTiles[_puzzleEmpty]; _puzzleTiles[_puzzleEmpty]=_puzzleTiles[swap]; _puzzleTiles[swap]=t;
    _puzzleEmpty=swap;
  }
  _puzzleDraw();
  _puzzleInt=setInterval(function(){_puzzleTimer++;var el=document.getElementById('pzTimer');if(el)el.textContent='⏱ '+_puzzleTimer+'s';},1000);
}

function _puzzleDraw(){
  var colors=['#ff9eb0','#ffb088','#ffd980','#b8e0a0','#88c8e8','#b0a0e8','#e8a0d0','#80d0c0','#f0b0b0'];
  var html='<a href="javascript:void(0)" class="btn btn-back mb-16" style="text-decoration:none" data-back="lobby">'+
    '← 游戏大厅</a>'+
    '<div class="section-title" style="font-size:16px;font-weight:700;margin-bottom:4px">🧩 回忆碎片拼图</div>'+
    '<div style="text-align:center;font-size:14px;margin-bottom:12px"><span id="pzTimer">⏱ '+_puzzleTimer+'s</span></div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,100px);gap:4px;justify-content:center">';
  for(var i=0;i<9;i++){
    if(i===_puzzleEmpty){
      html+='<div style="width:100px;height:100px;background:transparent"></div>';
    }else{
      html+='<div data-pz="'+i+'" style="width:100px;height:100px;background:'+colors[i%9]+';border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:36px;font-weight:700;cursor:pointer">'+_puzzleTiles[i]+'</div>';
    }
  }
  html+='</div>';
  document.getElementById('view').innerHTML=html;
  setTimeout(function(){
    var tiles=document.querySelectorAll('[data-pz]');
    tiles.forEach(function(t){t.onclick=function(){window._pzClick(parseInt(this.getAttribute('data-pz')));};});
  },50);
  window._pzClick=function(i){
    var er=Math.floor(_puzzleEmpty/3), ec=_puzzleEmpty%3;
    var cr=Math.floor(i/3), cc=i%3;
    if((Math.abs(er-cr)+Math.abs(ec-cc))===1){
      var t=_puzzleTiles[_puzzleEmpty]; _puzzleTiles[_puzzleEmpty]=_puzzleTiles[i]; _puzzleTiles[i]=t;
      _puzzleEmpty=i; _puzzleDraw();
      var solved=true;
      for(var j=0;j<8;j++){if(_puzzleTiles[j]!==_puzzleNames[j]){solved=false;break;}}
      if(solved){clearInterval(_puzzleInt);_puzzleInt=null;
        try{sb.from('game_scores').insert({user_id:me.id,game:'puzzle',score:_puzzleTimer,detail:'3x3 solved'}).then(function(){});}catch(e){}
        setTimeout(function(){alert('🎉 拼好了！用时 '+_puzzleTimer+' 秒');},200);}
    }
  };
}

/* ============================================ */
/*  游戏J: 班级热搜榜                           */
/* ============================================ */
async function renderHotSearch() {
  _gameMode = 'hotsearch';
  if (!me) { goGuestLogin(); return; }
  var html='<a href="javascript:void(0)" class="btn btn-back mb-16" style="text-decoration:none" data-back="lobby">'+
    '← 游戏大厅</a>'+
    '<div class="section-title" style="font-size:18px;font-weight:700;margin-bottom:4px">🔥 班级热搜榜</div>'+
    '<p style="text-align:center;font-size:12px;color:var(--text-light);margin-bottom:16px">关键词提取自真实评价</p>'+
    '<div id="hotList" style="text-align:center;color:var(--text-light);padding:20px">分析中...</div>';
  document.getElementById('view').innerHTML=html;

  var rResp=await sb.from('reviews').select('strengths,weaknesses');
  var revs=rResp.data||[];
  var words={};
  var kwList=['漂亮','帅气','靠谱','温柔','聪明','幽默','细心','努力','大方','可爱','厉害','认真','善良','霸道','有趣','学霸','女神','男神','暖心','阳光','稳重','开朗','美丽','强大'];
  revs.forEach(function(r){
    var txt=(r.strengths||'')+(r.weaknesses||'');
    kwList.forEach(function(w){if(txt.indexOf(w)>=0) words[w]=(words[w]||0)+1;});
  });
  var sorted=Object.entries(words).filter(function(e){return e[1]>=2;}).sort(function(a,b){return b[1]-a[1];}).slice(0,15);

  var lResp=await sb.from('hotsearch_likes').select('keyword');
  var likes={}; (lResp.data||[]).forEach(function(l){likes[l.keyword]=(likes[l.keyword]||0)+1;});

  var hotHTML='';
  sorted.forEach(function(e,i){
    var icon=i===0?'🥇':i===1?'🥈':i===2?'🥉':'🔥';
    var lc=likes[e[0]]||0;
    hotHTML+='<div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.8);border-radius:12px;padding:12px 16px;margin-bottom:8px;max-width:400px;margin-left:auto;margin-right:auto">'+
      '<span style="font-size:18px">'+icon+'</span>'+
      '<span style="flex:1;text-align:left;font-size:15px;font-weight:600;color:var(--text)">#'+e[0]+'</span>'+
      '<span style="font-size:12px;color:var(--text-light)">'+e[1]+'次</span>'+
      '<span data-like="'+e[0]+'" style="cursor:pointer;font-size:14px;color:var(--pink)">❤️ '+lc+'</span>'+
      '</div>';
  });
  document.getElementById('hotList').innerHTML=hotHTML||'<p>数据还不够，多写评价吧~</p>';
  setTimeout(function(){
    var btns=document.querySelectorAll('[data-like]');
    btns.forEach(function(b){b.onclick=function(){window._likeKW(this.getAttribute('data-like'));};});
  },50);
  window._likeKW=async function(kw){
    try{await sb.from('hotsearch_likes').upsert({keyword:kw,user_id:me.id},{onConflict:'keyword,user_id'});}catch(e){}
    renderHotSearch();
  };
}
