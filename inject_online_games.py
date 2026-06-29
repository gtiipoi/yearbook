#!/usr/bin/env python3
"""Inject 5 online multiplayer games into yearbook.html"""
import re, subprocess, os

with open('docs/yearbook.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = 0

# 1. Add route for online lobby
old_route = "  if (_gameMode === 'truthdare') { renderTruthDare(); return; }"
new_route = "  if (_gameMode === 'online') { renderOnlineLobby(); return; }\n  if (_gameMode === 'compat') { renderCompat(); return; }\n  if (_gameMode === 'binchoice') { renderBinChoice(); return; }\n  if (_gameMode === 'anonymous') { renderAnonymous(); return; }\n  if (_gameMode === 'chain') { renderChain(); return; }\n  if (_gameMode === 'race') { renderRace(); return; }\n  if (_gameMode === 'truthdare') { renderTruthDare(); return; }"
content = content.replace(old_route, new_route)
changes += 1
print("1. Added online game routes")

# 2. Add "在线对战" button to game lobby
lobby_title = "<div class=\"section-title\" style=\"font-size:18px;font-weight:700;margin-bottom:4px\">🎮 游戏中心</div>"
new_title = "<div class=\"section-title\" style=\"font-size:18px;font-weight:700;margin-bottom:4px\">🎮 游戏中心</div>\n    + '<div data-game=\"online\" class=\"game-lobby-card\" style=\"background:linear-gradient(135deg,#667eea,#764ba2);border-radius:16px;padding:18px;color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px;margin-bottom:16px\">'\n    + '<div style=\"font-size:36px\">🌐</div><div><div style=\"font-weight:700;font-size:16px\">在线对战</div><div style=\"font-size:12px;opacity:0.85\">邀请好友，实时互动游戏</div></div></div>'\n    + '<p style=\"text-align:center;font-size:13px;color:var(--text-light);margin-bottom:8px\">单机游戏</p>'"
content = content.replace(lobby_title, new_title)
changes += 1
print("2. Added online lobby card to game center")

# 3. Add cleanup in render() function
old_render = "async function render() {\n  endSphere(); endChat(); endDM();"
new_render = "async function render() {\n  endSphere(); endChat(); endDM(); endOnline();"
content = content.replace(old_render, new_render)
changes += 1
print("3. Added endOnline() to render cleanup")

# 4. Insert online game code before the 旧 comment
with open('_online_games.js', 'r', encoding='utf-8') as f:
    game_code = f.read()

insert_point = "/* 旧renderGame已替换为游戏大厅 */"
idx = content.find(insert_point)
if idx > 0:
    content = content[:idx] + game_code + "\n" + content[idx:]
    changes += 1
    print(f"4. Inserted online games ({len(game_code)} chars)")
else:
    # Alternative insert before 游戏A
    idx2 = content.find("/*  游戏A: 猜同学PK                              */")
    if idx2 > 0:
        content = content[:idx2] + game_code + "\n" + content[idx2:]
        changes += 1
        print(f"4. Inserted online games before game A ({len(game_code)} chars)")
    else:
        print("4. FAILED: no insert point found")

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
