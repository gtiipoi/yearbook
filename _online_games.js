/* ============================================ */
/*  在线游戏: 房间系统 + 5个游戏                  */
/* ============================================ */

// ---- 房间工具函数 ----
function _genRoomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function _getRoom(code) {
  var r = await sb.from('game_rooms').select('*').eq('room_code', code).single();
  return r.data;
}

async function _updateRoom(code, updates) {
  await sb.from('game_rooms').update(updates).eq('room_code', code);
}

// ---- 在线游戏大厅 ----
function renderOnlineLobby() {
  var html = '<a href="yearbook.html" class="btn btn-back mb-16" style="text-decoration:none" data-back="lobby">← 游戏大厅</a>'+
    '<div class="section-title" style="font-size:18px;font-weight:700;margin-bottom:4px">🌐 在线对战</div>'+
    '<p style="text-align:center;font-size:13px;color:var(--text-light);margin-bottom:20px">邀请好友，实时互动</p>'+
    '<div style="display:flex;flex-direction:column;gap:12px;max-width:340px;margin:0 auto">'+
    '<div data-game="compat" class="game-lobby-card" style="background:linear-gradient(135deg,#ff9eb0,#ffb088);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'+
    '<div style="font-size:36px">🎯</div><div><div style="font-weight:700;font-size:16px">默契问答</div><div style="font-size:12px;opacity:0.85">2人答题，测试你们的默契度</div></div></div>'+
    '<div data-game="binchoice" class="game-lobby-card" style="background:linear-gradient(135deg,#88c8e8,#b0a0e8);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'+
    '<div style="font-size:36px">🃏</div><div><div style="font-weight:700;font-size:16px">默契二选一</div><div style="font-size:12px;opacity:0.85">同时选择，看你们有多合拍</div></div></div>'+
    '<div data-game="anonymous" class="game-lobby-card" style="background:linear-gradient(135deg,#b0a0e8,#80d0c0);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'+
    '<div style="font-size:36px">🎭</div><div><div style="font-weight:700;font-size:16px">匿名真心话</div><div style="font-size:12px;opacity:0.85">匿名身份，畅所欲言</div></div></div>'+
    '<div data-game="chain" class="game-lobby-card" style="background:linear-gradient(135deg,#ffd980,#ff9eb0);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'+
    '<div style="font-size:36px">⚔️</div><div><div style="font-weight:700;font-size:16px">评价接龙</div><div style="font-size:12px;opacity:0.85">轮流写评价，看看能接多长</div></div></div>'+
    '<div data-game="race" class="game-lobby-card" style="background:linear-gradient(135deg,#ff6b6b,#ffb088);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'+
    '<div style="font-size:36px">🏆</div><div><div style="font-weight:700;font-size:16px">班级知识竞赛</div><div style="font-size:12px;opacity:0.85">抢答班级知识，看谁最快</div></div></div>'+
    '</div>';
  document.getElementById('view').innerHTML = html;
}

var _onlineGame = ''; var _roomCode = ''; var _pollTimer = null;

function endOnline() { if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; } }

// ---- 游戏1: 默契问答 ----
async function renderCompat() {
  _onlineGame = 'compat'; endOnline();
  if (!me) { goGuestLogin(); return; }
  _showRoomUI('🎯 默契问答', '2人各答5道关于对方的题，看看默契度！', 'compat');
}

async function _startCompat(room) {
  var players = room.players || [];
  if (players.length < 2) return;
  var p1 = players[0], p2 = players[1];
  // 生成5道题
  var qs = [
    {q: p1.name+'最常被评价的优点是什么？', a: '来自数据库'},
    {q: p2.name+'的性格用一个词形容？', a: ''},
    {q: '你觉得'+p1.name+'最喜欢的科目是什么？', a: ''},
    {q: p2.name+'以后最可能做什么职业？', a: ''},
    {q: p1.name+'和'+p2.name+'谁更可能先结婚？', a: ''}
  ];
  await _updateRoom(room.room_code, {status:'playing', data:{questions:qs, step:0, answers:{}}});
}

function _showRoomUI(title, desc, gameType) {
  _roomCode = '';
  var html = '<a href="javascript:void(0)" class="btn btn-back mb-16" style="text-decoration:none" data-back="online">← 在线大厅</a>'+
    '<div class="section-title" style="font-size:18px;font-weight:700;margin-bottom:4px">'+title+'</div>'+
    '<p style="text-align:center;font-size:13px;color:var(--text-light);margin-bottom:16px">'+desc+'</p>'+
    '<div id="roomPanel" style="max-width:360px;margin:0 auto">'+
    '<div style="display:flex;gap:10px;margin-bottom:16px">'+
    '<button class="btn btn-primary" id="btnCreate" style="flex:1" onclick="window._createRoom(\''+gameType+'\')">🏠 创建房间</button>'+
    '<input type="text" id="roomCodeInput" placeholder="输入房间码" maxlength="6" style="flex:1;padding:10px;border-radius:24px;border:1.5px solid #e0d8e8;font-size:14px;text-align:center;font-family:inherit">'+
    '<button class="btn btn-outline" id="btnJoin" onclick="window._joinRoom()">加入</button></div>'+
    '<div id="roomStatus" style="text-align:center"></div></div>';
  document.getElementById('view').innerHTML = html;

  window._createRoom = async function(gt) {
    var code = _genRoomCode();
    await sb.from('game_rooms').insert({room_code:code, host_id:me.id, game_type:gt, status:'waiting', players:[{id:me.id,name:me.name}], data:{}});
    _roomCode = code;
    _showWaitingRoom(code, gt);
  };
  window._joinRoom = async function() {
    var code = document.getElementById('roomCodeInput').value.trim();
    if (!code) return;
    var room = await _getRoom(code);
    if (!room) { alert('房间不存在'); return; }
    if (room.status !== 'waiting') { alert('游戏已开始'); return; }
    var players = room.players || [];
    if (players.find(function(p){return p.id===me.id;})) { _roomCode=code; _showWaitingRoom(code, room.game_type); return; }
    players.push({id:me.id, name:me.name});
    await _updateRoom(code, {players:players});
    _roomCode = code;
    _showWaitingRoom(code, room.game_type);
  };
}

function _showWaitingRoom(code, gameType) {
  _pollTimer = setInterval(function() { _pollRoom(code, gameType); }, 2000);
  var html = '<div style="text-align:center;padding:20px">'+
    '<p style="font-size:48px;font-weight:700;color:var(--pink);letter-spacing:8px;margin-bottom:8px">'+code+'</p>'+
    '<p style="font-size:13px;color:var(--text-light);margin-bottom:16px">把房间码发给好友</p>'+
    '<p style="font-size:14px">⏳ 等待玩家加入...</p>'+
    '<div id="playerList" style="margin-top:16px"></div>'+
    '<button class="btn btn-primary mt-16" id="btnStart" style="display:none" onclick="window._startGame()">▶ 开始游戏</button>'+
    '</div>';
  document.getElementById('roomStatus').innerHTML = html;
  window._startGame = async function() {
    var room = await _getRoom(code);
    if (room.game_type === 'compat') await _startCompat(room);
    else if (room.game_type === 'binchoice') await _startBinChoice(room);
    else if (room.game_type === 'anonymous') await _startAnonymous(room);
    else if (room.game_type === 'chain') await _startChain(room);
    else if (room.game_type === 'race') await _startRace(room);
  };
}

async function _pollRoom(code, gameType) {
  var room = await _getRoom(code);
  if (!room) { clearInterval(_pollTimer); return; }
  var players = room.players || [];
  var el = document.getElementById('playerList');
  if (el) {
    el.innerHTML = players.map(function(p){return '<div style="padding:8px;background:rgba(255,255,255,0.7);border-radius:8px;margin:4px 0">'+p.name+'</div>';}).join('');
    var btn = document.getElementById('btnStart');
    if (btn) btn.style.display = (players.length >= 2 && room.host_id === me.id) ? '' : 'none';
  }
  if (room.status === 'playing') {
    clearInterval(_pollTimer);
    if (gameType === 'compat') _playCompat(room);
    else if (gameType === 'binchoice') _playBinChoice(room);
    else if (gameType === 'anonymous') _playAnonymous(room);
    else if (gameType === 'chain') _playChain(room);
    else if (gameType === 'race') _playRace(room);
  }
}

// ---- 默契问答游戏逻辑 ----
var _compatQIdx = 0; var _compatAnswers = [];

async function _playCompat(room) {
  var data = room.data || {};
  var qs = data.questions || [];
  if (_compatQIdx >= qs.length) { _showCompatResult(room); return; }
  var q = qs[_compatQIdx];
  var html = '<div id="compatArea" style="max-width:400px;margin:0 auto;text-align:center">'+
    '<p style="font-size:13px;color:var(--text-light);margin-bottom:4px">第 '+(_compatQIdx+1)+'/'+qs.length+' 题</p>'+
    '<p style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:16px">'+q.q+'</p>'+
    '<textarea id="compatAnswer" placeholder="输入你的答案..." maxlength="100" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid #e0d8e8;font-size:14px;resize:vertical;font-family:inherit;min-height:60px"></textarea>'+
    '<button class="btn btn-primary mt-12" onclick="window._submitCompatAnswer()" style="width:100%">✅ 提交</button></div>';
  document.getElementById('view').innerHTML = html;
  _pollTimer = setInterval(async function() {
    var r = await _getRoom(room.room_code);
    var answers = (r.data||{}).answers||{};
    if (answers[me.id] && Object.keys(answers).length >= 2) {
      clearInterval(_pollTimer);
      _showCompatReveal(r);
    }
  }, 2000);
  window._submitCompatAnswer = async function() {
    var ans = document.getElementById('compatAnswer').value.trim();
    if (!ans) return;
    _compatAnswers.push(ans);
    var r = await _getRoom(room.room_code);
    var data2 = r.data || {}; var answers = data2.answers || {};
    answers[me.id] = ans;
    await _updateRoom(room.room_code, {data:{questions:data2.questions, step:_compatQIdx, answers:answers}});
    _compatQIdx++;
    if (Object.keys(answers).length >= 2) {
      clearInterval(_pollTimer);
      _showCompatReveal(await _getRoom(room.room_code));
    } else {
      document.getElementById('compatArea').innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">⏳ 等待对方...</p>';
    }
  };
}

function _showCompatReveal(room) {
  var data = room.data || {}; var answers = data.answers || {};
  var players = room.players || [];
  var meAns = answers[me.id] || '';
  var otherId = players.find(function(p){return p.id!==me.id;});
  var otherAns = otherId ? (answers[otherId.id]||'') : '';
  var html = '<p style="text-align:center;font-size:14px;margin-bottom:8px">📝 你的答案: <b>'+meAns+'</b></p>'+
    '<p style="text-align:center;font-size:14px;margin-bottom:16px">📝 对方的答案: <b>'+otherAns+'</b></p>'+
    '<button class="btn btn-primary" style="display:block;margin:0 auto" onclick="window._nextCompatQ()">▶ 下一题</button>';
  document.getElementById('compatArea').innerHTML += html;
  window._nextCompatQ = async function() { _compatQIdx++; _playCompat(room); };
}

async function _showCompatResult(room) {
  endOnline();
  var score = Math.floor(Math.random() * 40 + 60); // Simple score
  var label = score >= 90 ? '💯 灵魂伴侣' : score >= 70 ? '💕 心有灵犀' : '🤝 还需了解';
  var html = '<div style="text-align:center;padding:40px">'+
    '<div style="font-size:64px;margin-bottom:16px">'+label+'</div>'+
    '<div style="font-size:48px;font-weight:700;color:var(--pink)">'+score+'%</div>'+
    '<p style="color:var(--text-light);margin-top:8px">默契度评分</p>'+
    '<button class="btn btn-primary mt-16" data-back="online">🏠 返回</button></div>';
  document.getElementById('view').innerHTML = html;
  await _updateRoom(room.room_code, {status:'done', data:{score:score, label:label}});
}

// ---- 游戏2: 默契二选一 ----
var _binQIdx = 0; var _binScore = 0;

async function renderBinChoice() {
  _onlineGame = 'binchoice'; endOnline();
  if (!me) { goGuestLogin(); return; }
  _showRoomUI('🃏 默契二选一', '10道二选一，同时选看默契', 'binchoice');
}

async function _startBinChoice(room) {
  var opts = ['猫 还是 狗？','夏天 还是 冬天？','火锅 还是 烧烤？','电影 还是 看书？','宅家 还是 出去浪？',
              '早起 还是 熬夜？','甜 还是 咸？','奶茶 还是 咖啡？','海 还是 山？','计划 还是 随缘？'];
  await _updateRoom(room.room_code, {status:'playing', data:{questions:opts, step:0, answers:{}}});
}

async function _playBinChoice(room) {
  var data = room.data || {}; var qs = data.questions || [];
  if (_binQIdx >= qs.length) { _showBinResult(room); return; }
  var q = qs[_binQIdx];
  var html = '<div style="text-align:center;max-width:360px;margin:0 auto">'+
    '<p style="font-size:13px;color:var(--text-light);margin-bottom:4px">第 '+(_binQIdx+1)+'/'+qs.length+' 题</p>'+
    '<p style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:20px">'+q+'</p>'+
    '<div style="display:flex;gap:12px">'+
    '<button class="btn btn-primary" onclick="window._binAnswer(0)" style="flex:1;font-size:18px;padding:16px">'+q.split(' 还是 ')[0]+'</button>'+
    '<button class="btn btn-outline" onclick="window._binAnswer(1)" style="flex:1;font-size:18px;padding:16px">'+q.split(' 还是 ')[1].replace('？','')+'</button></div>'+
    '<div id="binStatus" style="margin-top:12px;font-size:13px;color:var(--text-light)"></div></div>';
  document.getElementById('view').innerHTML = html;
  window._binAnswer = async function(choice) {
    var r = await _getRoom(room.room_code);
    var data2 = r.data || {}; var answers = data2.answers || {};
    answers[me.id] = choice;
    await _updateRoom(room.room_code, {data:{questions:qs, step:_binQIdx, answers:answers}});
    document.getElementById('binStatus').innerHTML = '⏳ 等待对方...';
    _pollTimer = setInterval(async function() {
      var r2 = await _getRoom(room.room_code);
      var ans2 = (r2.data||{}).answers||{};
      if (Object.keys(ans2).length >= 2) {
        clearInterval(_pollTimer);
        var other = Object.entries(ans2).find(function(e){return e[0]!==me.id;});
        var match = other && other[1] == choice;
        if (match) _binScore++;
        var el = document.getElementById('binStatus');
        if (el) {
          el.innerHTML = match ? '✅ 一致！+1分' : '❌ 不一致';
          setTimeout(function(){ _binQIdx++; _playBinChoice(r2); }, 1500);
        }
      }
    }, 2000);
  };
}

async function _showBinResult(room) {
  endOnline();
  var html = '<div style="text-align:center;padding:40px">'+
    '<div style="font-size:64px">' + (_binScore >= 8 ? '💯' : _binScore >= 5 ? '🤝' : '😅') + '</div>'+
    '<div style="font-size:48px;font-weight:700;color:var(--pink)">'+_binScore+'/10</div>'+
    '<button class="btn btn-primary mt-16" data-back="online">🏠 返回</button></div>';
  document.getElementById('view').innerHTML = html;
}

// ---- 游戏3: 匿名真心话 ----
async function renderAnonymous() {
  _onlineGame = 'anonymous'; endOnline();
  if (!me) { goGuestLogin(); return; }
  _showRoomUI('🎭 匿名真心话', '多人匿名聊天，解散后无记录', 'anonymous');
}

async function _startAnonymous(room) {
  var players = room.players || [];
  players.forEach(function(p,i){ p.anonName = '同学'+(i+1); });
  await _updateRoom(room.room_code, {status:'playing', players:players, data:{messages:[]}});
}

async function _playAnonymous(room) {
  var players = room.players || [];
  var meAnon = (players.find(function(p){return p.id===me.id;})||{}).anonName || '?';
  var msgs = (room.data||{}).messages || [];
  var html = '<div style="max-width:400px;margin:0 auto">'+
    '<p style="text-align:center;font-size:13px;color:var(--text-light);margin-bottom:4px">你的身份: <b>'+meAnon+'</b></p>'+
    '<div style="text-align:center;font-size:11px;color:#ff6b6b;margin-bottom:8px">你的发言会以匿名身份显示</div>'+
    '<div id="anonMsgs" style="max-height:300px;overflow-y:auto;margin-bottom:12px">';
  msgs.forEach(function(m){
    html += '<div style="padding:6px 10px;background:rgba(255,255,255,0.7);border-radius:8px;margin-bottom:4px;font-size:13px"><b>'+m.from+'</b>: '+m.text+'</div>';
  });
  html += '</div><div style="display:flex;gap:8px">'+
    '<input type="text" id="anonInput" placeholder="说点什么..." maxlength="200" style="flex:1;padding:10px;border-radius:24px;border:1.5px solid #e0d8e8;font-size:13px;font-family:inherit">'+
    '<button class="btn btn-primary" onclick="window._sendAnon()">发送</button></div>'+
    '<button class="btn btn-outline mt-12" style="width:100%" onclick="endOnline();_gameMode=\'online\';renderGame();">🚪 退出房间</button></div>';
  document.getElementById('view').innerHTML = html;
  document.getElementById('anonInput').onkeydown = function(e) { if(e.key==='Enter') window._sendAnon(); };
  window._sendAnon = async function() {
    var inp = document.getElementById('anonInput'); if (!inp) return;
    var txt = inp.value.trim(); if (!txt) return; inp.value = '';
    var r = await _getRoom(room.room_code);
    var msgs2 = (r.data||{}).messages || [];
    msgs2.push({from:meAnon, text:txt});
    await _updateRoom(room.room_code, {data:{messages:msgs2}});
    _playAnonymous(r);
  };
  _pollTimer = setInterval(async function() {
    var r = await _getRoom(room.room_code);
    if (!r || r.status === 'done') { clearInterval(_pollTimer); return; }
    var msgs2 = (r.data||{}).messages || [];
    var el = document.getElementById('anonMsgs');
    if (el && msgs2.length > msgs.length) { _playAnonymous(r); clearInterval(_pollTimer); }
  }, 2000);
}

// ---- 游戏4: 评价接龙 ----
var _chainTarget = null;

async function renderChain() {
  _onlineGame = 'chain'; endOnline();
  if (!me) { goGuestLogin(); return; }
  _showRoomUI('⚔️ 评价接龙', '每人写评价给上一个人提到的同学', 'chain');
}

async function _startChain(room) {
  var sResp = await sb.from('students').select('id,name').limit(52);
  var students = (sResp.data||[]).filter(function(s){return s.name.length>=2;});
  var first = students[Math.floor(Math.random()*students.length)];
  await _updateRoom(room.room_code, {status:'playing', data:{chain:[], currentTarget:first, turn:0}});
}

async function _playChain(room) {
  var data = room.data || {}; var chain = data.chain || [];
  var target = data.currentTarget; var turn = data.turn || 0;
  var players = room.players || [];
  // Check if it's my turn
  var myTurnIdx = players.findIndex(function(p){return p.id===me.id;});
  var isMyTurn = (myTurnIdx === turn % players.length);
  if (!isMyTurn) {
    document.getElementById('view').innerHTML = '<div style="text-align:center;padding:40px"><p>⏳ 等待第'+(turn+1)+'位玩家写评价...</p><p style="font-size:12px;color:var(--text-light)">当前目标: '+target.name+'</p></div>';
    _pollTimer = setInterval(async function() {
      var r = await _getRoom(room.room_code);
      var d2 = r.data || {}; var newChain = d2.chain || [];
      if (newChain.length > chain.length) { clearInterval(_pollTimer); _playChain(r); }
    }, 2000);
    return;
  }
  // My turn
  var html = '<div style="max-width:360px;margin:0 auto;text-align:center">'+
    '<p style="font-size:14px;color:var(--text-light);margin-bottom:4px">轮到你了！</p>'+
    '<div style="width:60px;height:60px;border-radius:50%;background:#ff9eb0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:28px;font-weight:700;margin:12px auto">'+target.name.charAt(target.name.length-1)+'</div>'+
    '<p style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:16px">给 '+target.name+' 写评价</p>'+
    '<textarea id="chainStrengths" placeholder="优点..." maxlength="200" style="width:100%;padding:10px;border-radius:10px;border:1.5px solid #e0d8e8;font-size:13px;resize:vertical;font-family:inherit;min-height:50px;margin-bottom:8px"></textarea>'+
    '<button class="btn btn-primary" onclick="window._submitChain()" style="width:100%">📝 提交</button></div>';
  document.getElementById('view').innerHTML = html;
  window._submitChain = async function() {
    var st = document.getElementById('chainStrengths').value.trim();
    if (!st) return;
    var r = await _getRoom(room.room_code);
    var d2 = r.data || {}; var newChain = d2.chain || [];
    newChain.push({from:me.name, to:target.name, content:st, fromId:me.id, toId:target.id});
    // Random next target
    var sResp = await sb.from('students').select('id,name').limit(52);
    var students = (sResp.data||[]).filter(function(s){return s.name.length>=2 && s.id!==target.id;});
    var next = students[Math.floor(Math.random()*students.length)];
    await _updateRoom(room.room_code, {data:{chain:newChain, currentTarget:next, turn:(d2.turn||0)+1}});
    // Also save to reviews
    try{await sb.from('reviews').insert({author_id:me.id,target_id:target.id,strengths:st,is_anonymous:false});}catch(e){}
    _playChain(await _getRoom(room.room_code));
  };
}

// ---- 游戏5: 班级知识竞赛 ----
var _raceScore = 0;

async function renderRace() {
  _onlineGame = 'race'; endOnline();
  if (!me) { goGuestLogin(); return; }
  _showRoomUI('🏆 班级知识竞赛', '抢答班级知识，手速王！', 'race');
}

async function _startRace(room) {
  var qs2 = [
    {q:'第一对互评的同学是谁？', a:''},
    {q:'被评价最多的同学是谁？', a:''},
    {q:'评价里出现最多的词是？', a:''},
    {q:'第一个注册的同学是？', a:''},
    {q:'"霸道总裁"是谁的外号？', a:''}
  ];
  await _updateRoom(room.room_code, {status:'playing', data:{questions:qs2, step:0, winner:null}});
}

async function _playRace(room) {
  var data = room.data || {}; var qs = data.questions || [];
  var step = data.step || 0;
  if (step >= qs.length) { _showRaceResult(room); return; }
  var q = qs[step];
  var html = '<div style="text-align:center;max-width:360px;margin:0 auto">'+
    '<p style="font-size:13px;color:var(--text-light);margin-bottom:4px">第 '+(step+1)+'/'+qs.length+' 题 · '+_raceScore+'分</p>'+
    '<p style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:20px">'+q.q+'</p>'+
    '<input type="text" id="raceAnswer" placeholder="输入答案..." maxlength="50" style="width:100%;padding:12px;border-radius:24px;border:1.5px solid #e0d8e8;font-size:14px;text-align:center;font-family:inherit">'+
    '<button class="btn btn-primary mt-12" onclick="window._raceSubmit()" style="width:100%">🚀 抢答</button>'+
    '<div id="raceStatus" style="margin-top:8px;font-size:12px;color:var(--text-light)"></div></div>';
  document.getElementById('view').innerHTML = html;
  document.getElementById('raceAnswer').onkeydown = function(e) { if(e.key==='Enter') window._raceSubmit(); };
  window._raceSubmit = async function() {
    var ans = document.getElementById('raceAnswer').value.trim();
    if (!ans) return;
    var r = await _getRoom(room.room_code);
    var d2 = r.data || {};
    if (d2.winner) { document.getElementById('raceStatus').textContent = '已被抢先！'; return; }
    d2.winner = me.id;
    await _updateRoom(room.room_code, {data:{questions:qs, step:step, winner:me.id, winnerName:me.name, winnerAns:ans}});
    _raceScore += 10;
    document.getElementById('raceStatus').textContent = '✅ 你抢到了！+10分';
    setTimeout(async function() {
      await _updateRoom(room.room_code, {data:{questions:qs, step:step+1, winner:null, winnerName:null, winnerAns:null}});
      _playRace(await _getRoom(room.room_code));
    }, 2000);
  };
  _pollTimer = setInterval(async function() {
    var r = await _getRoom(room.room_code);
    var d2 = r.data || {};
    if (d2.winner && d2.winner !== me.id) {
      clearInterval(_pollTimer);
      document.getElementById('raceStatus').textContent = '⚡ '+d2.winnerName+' 抢到了！答案: '+d2.winnerAns;
      setTimeout(function() { _playRace(r); }, 2000);
    }
  }, 2000);
}

async function _showRaceResult(room) {
  endOnline();
  var html = '<div style="text-align:center;padding:40px">'+
    '<div style="font-size:64px">🏆</div>'+
    '<div style="font-size:48px;font-weight:700;color:var(--pink)">'+_raceScore+'分</div>'+
    '<button class="btn btn-primary mt-16" data-back="online">🏠 返回</button></div>';
  document.getElementById('view').innerHTML = html;
}
