#!/bin/sh
set -ue
git checkout gh-pages
git checkout master index.html
git checkout master narrative.css
git checkout master default.css
git commit -m "published."

