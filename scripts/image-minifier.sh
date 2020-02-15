#!/bin/bash
# Minify all jpg and png images in current directory recursively
command_exists () {
    type "$1" &> /dev/null ;
}

image-minifier () {
  if command_exists optipng ; then
    optipng -o2 -strip all **/*.png
  else
    echo 'Error: optipng is not installed. If you are on a Mac, we recommend googling "homebrew Mac" and installing via brew' >&2
    exit 1
  fi

  if command_exists jpegoptim ; then
    jpegoptim --strip-all **/*.{jpg,jpeg}
  else
    echo 'Error: jpegoptim is not installed. If you are on a Mac, we recommend googling "homebrew Mac" and installing via brew' >&2
    exit 1
  fi
}
