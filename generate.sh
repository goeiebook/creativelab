#!/bin/sh
set -ue
python -m markdown -x markdown.extensions.fenced_code -x markdown.extensions.tables -x markdown.extensions.codehilite narrative.md > body.html
cat top.html body.html bottom.html > index.html

