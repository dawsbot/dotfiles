#!/usr/bin/env bash
# copy last command
alias cp='cp -r '
alias copyLastCmd="fc -ln -1 | pbcopy"

# kill functions for processes
alias kPhantom='pkill -f phantom'
alias kNode='pkill -f "node"'
alias kFinder='killall Finder'

alias kil='kPhantom && kNode && kFinder'

# print the terminal color-scheme
printColors () {
  for x in 0 1 4 5 7 8; do for i in `seq 30 37`; do for a in `seq 40 47`; do echo -ne "\e[$x;$i;$a""m\\\e[$x;$i;$a""m\e[0;37;40m "; done; echo; done; done; echo "";
}

# change dirs to zshrcs' file dump location
cz () {
  cd ~/Dropbox/dotfiles/zshrcs || exit
  ls
}

alias c='hicat '
alias v='vim '
alias tr="tree -I 'node_modules' -L 4"

upgradeAll () {
  ussh
  upgrade_oh_my_zsh
  brew prune
  brew update
  brew upgrade
  brew doctor
  npm update -g
}

# function take() {
#   mkdir -p "$1"
#   cd "$1" || exit
# }

alias subl="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl "

function s() {
  if [[ $# -eq 0 ]] ; then
    subl .
  fi
  subl "$1"
}
function vs() {
  if [[ $# -eq 0 ]] ; then
    code .
  fi
  code "$1"
}

# Remove application from OSX installed Applications
function remove-app() {
  rm -rf /Applications/"$1".app
}

function db-nm() {
  mkdir src
  mv index.js src
  mv cli.js src
  cp  ~/code/gmap/.babelrc .
  npm install --save-dev babel-cli babel-preset-es2015 babel-preset-stage-2
  echo "UPDATE PACKAGE.JSON"
}

alias play='cd "$(mktemp)"'

function new-repo() {
  hub create
  travis enable
  g*
  openg && opent
}

fetch-all() {
  git branch -r | grep -v '\->' | while read -r remote; do git branch --track "${remote#origin/}" "$remote"; done
  git fetch --all
  git pull --all
}

# squash every single git commit into one root init commit
squash-root() {
  git reset --soft "$(git rev-list --max-parents=0 --abbrev-commit HEAD)"
  git commit --amend -m "🎉 init"
}

# When ghetto-starting my own projects, these important files are missing
copy-gh-stuff() {
  cp ~/Dropbox/sharedCode/pluc/.gitignore .
  cp ~/Dropbox/sharedCode/pluc/.gitattributes .
  cp ~/Dropbox/sharedCode/pluc/.editorconfig .
  cp ~/Dropbox/sharedCode/pluc/.travis.yml .
}

# executes "commands" in "dir" then returns to cwd
# Usage: "in <dir> <commands>"
function in() {
  cd "$1" || exit
  eval "${@:2}"
  cd - || exit
}

# "!!" executes last command
bindkey -s '  ' '!!^m^m'

# clones and cd's the url in the clipboard. No need to paste!
# Usage: "cl <git url"
function cl() {
  local git_url
  git_url="$(pbpaste)" 
  git clone "$git_url"
  cd "$(basename "$git_url")" || exit
}

# git clone and cd into that dir
gcl() {
  git clone "$1" && cd "$(basename "$1")" || exit
}

