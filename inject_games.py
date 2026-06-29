#!/usr/bin/env python3
"""Inject 4 new games into yearbook.html — no inline onclick, all event delegation"""
import re, subprocess, os

with open('docs/yearbook.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# ====== 1. Add 4 lobby cards ======
lobby_close = "+ '</div>';\n  document.getElementById('view').innerHTML = html;"

cards_html = """    + '<div data-game="crossroads" class="game-lobby-card" style="background:linear-gradient(135deg,#ff9eb0,#ffd980);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'
    + '<div style="font-size:36px">🌍</div><div><div style="font-weight:700;font-size:16px">缘分十字路口</div><div style="font-size:12px;opacity:0.85">搞怪投票，看看全班怎么选</div></div></div>'
    + '<div data-game="blindbox" class="game-lobby-card" style="background:linear-gradient(135deg,#b0a0e8,#f0b0b0);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'
    + '<div style="font-size:36px">🎁</div><div><div style="font-weight:700;font-size:16px">评价盲盒</div><div style="font-size:12px;opacity:0.85">金币开盲盒，随机看评价</div></div></div>'
    + '<div data-game="puzzle" class="game-lobby-card" style="background:linear-gradient(135deg,#88c8e8,#b8e0a0);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'
    + '<div style="font-size:36px">🧩</div><div><div style="font-weight:700;font-size:16px">回忆碎片拼图</div><div style="font-size:12px;opacity:0.85">班级合照拼图挑战</div></div></div>'
    + '<div data-game="hotsearch" class="game-lobby-card" style="background:linear-gradient(135deg,#ff6b6b,#ffb088);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px">'
    + '<div style="font-size:36px">🔥</div><div><div style="font-weight:700;font-size:16px">班级热搜榜</div><div style="font-size:12px;opacity:0.85">评价关键词实时热度</div></div></div>'
    + '</div>';
  document.getElementById('view').innerHTML = html;"""

content = content.replace(lobby_close, cards_html)
changes += 1
print("1. Added 4 lobby cards")

# ====== 2. Add render routes ======
old_route = "  if (_gameMode === 'truthdare') { renderTruthDare(); return; }\n  renderGameLobby();"
new_route = "  if (_gameMode === 'truthdare') { renderTruthDare(); return; }\n  if (_gameMode === 'crossroads') { renderCrossroads(); return; }\n  if (_gameMode === 'blindbox') { renderBlindBox(); return; }\n  if (_gameMode === 'puzzle') { renderPuzzle(); return; }\n  if (_gameMode === 'hotsearch') { renderHotSearch(); return; }\n  renderGameLobby();"
content = content.replace(old_route, new_route)
changes += 1
print("2. Added 4 routes")

# ====== 3. Add click delegation for data-game ======
old_del = "  // 点击照片/视频放大查看\n  var media = e.target.closest('.photo-card img, .photo-card video');"
new_del = "  // 游戏大厅卡片点击\n  var card = e.target.closest('[data-game]');\n  if (card) {\n    e.preventDefault();\n    var gmode = card.getAttribute('data-game');\n    if (gmode) { _gameMode = gmode; renderGame(); return; }\n  }\n  // 游戏内返回按钮\n  var back = e.target.closest('[data-back]');\n  if (back) {\n    e.preventDefault();\n    var bmode = back.getAttribute('data-back');\n    if (bmode) { _gameMode = bmode; renderGame(); return; }\n  }\n  // 点击照片/视频放大查看\n  var media = e.target.closest('.photo-card img, .photo-card video');"
content = content.replace(old_del, new_del)
changes += 1
print("3. Added data-game click delegation")

# ====== 4. Insert game functions ======
with open('_games.js', 'r', encoding='utf-8') as f:
    game_code = f.read()

idx_d = content.find("/*  游戏D: 真心话大冒险                           */")
if idx_d > 0:
    content = content[:idx_d] + game_code + "\n" + content[idx_d:]
    changes += 1
    print(f"4. Inserted game functions ({len(game_code)} chars)")
else:
    print("4. FAILED: 游戏D not found")

# Update lobby close in renderGameLobby (change onclick to use backToHall for all game back buttons)
# The game functions use backToHall() which is already defined

# Write
with open('docs/yearbook.html', 'w', encoding='utf-8') as f:
    f.write(content)

# JS check
match = re.search(r'<script>\s*\n(.*?)</script>', content, re.DOTALL)
if match:
    with open('_check.js', 'w', encoding='utf-8') as f:
        f.write(match.group(1))
    result = subprocess.run(['node', '--check', '_check.js'], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"JS error: {result.stderr[:400]}")
    else:
        print("JS OK")
    os.remove('_check.js')

print(f"Done: {changes}/4")
