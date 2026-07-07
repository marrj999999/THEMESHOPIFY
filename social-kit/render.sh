#!/bin/zsh
# Render a social card template to PNG at exact size.
# Usage: ./render.sh templates/stat-card.html rendered/stat-card.png [1080x1080]
SIZE=${3:-1080x1080}
W=${SIZE%x*}; H=${SIZE#*x}
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --screenshot="$2" --window-size=$W,$H --hide-scrollbars "file://$(pwd)/$1" 2>/dev/null
echo "rendered $2 at ${W}x${H}"
