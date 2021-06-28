#!/bin/sh
# TODO: 
# TODO: 
# TODO: 

f="$1".php

if ! [ -f "$f" ]; then
 echo "File $f was not found..."
 exit 1
fi

while :; do
 vi "$f"
 php "$f" | less
 date
 sleep 3
done

