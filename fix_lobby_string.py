#!/usr/bin/env python3
"""Fix unclosed JS string in game lobby"""
with open('docs/yearbook.html', 'rb') as f:
    content = f.read()

# UTF-8 bytes for 游戏中心
game_center = b'\xe6\xb8\xb8\xe6\x88\x8f\xe4\xb8\xad\xe5\xbf\x83'  # 游戏中心

# Pattern: 游戏中心</div>\r\n    + '<div data-game=
old_start = game_center + b'</div>\r\n    + '
# Find the exact pattern
idx = content.find(old_start)
if idx > 0:
    # The next chars should be '<div data-game=...'
    next_chars = content[idx + len(old_start):idx + len(old_start) + 30]
    print(f'Found at {idx}, next chars: {next_chars[:30]}')

    # Fix: insert ' + after </div> and before \r\n
    # Replace 游戏中心</div> with 游戏中心</div>' +
    old = game_center + b'</div>'
    new = game_center + b"</div>' +"
    content = content.replace(old + b'\r\n    + ', new + b'\r\n    + ')
    print('Fixed')
else:
    print('Not found')
    # Search for the unclosed string
    idx2 = content.find(game_center + b'</div>')
    if idx2 > 0:
        chunk = content[idx2:idx2+80]
        print(f'At {idx2}: {chunk!r}')

with open('docs/yearbook.html', 'wb') as f:
    f.write(content)
print('Done')
