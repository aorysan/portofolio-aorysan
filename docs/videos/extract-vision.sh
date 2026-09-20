#!/bin/sh
set -eu
mkdir -p public/videos
yt-dlp -f "bv*[height<=720]" --download-sections "*46-48" "https://www.youtube.com/watch?v=gNwABGACsfY" -o "public/videos/vision-sea-loop.raw.mp4"
ffmpeg -y -i "public/videos/vision-sea-loop.raw.mp4" -an -c:v libx264 -crf 23 -r 24 -vf "scale=1280:-2" "public/videos/vision-sea-loop.mp4"
ffmpeg -y -ss 0 -i "public/videos/vision-sea-loop.mp4" -vframes 1 "public/videos/vision-sea-poster.jpg"
rm -f "public/videos/vision-sea-loop.raw.mp4"
ls -lh public/videos/
