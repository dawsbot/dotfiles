#!/usr/bin/env bash

CLIPBOARD_CONTENTS=$(pbpaste)

################## GIT ALIASES ######################
current_branch() {
  basename "$(git symbolic-ref HEAD)"
}

alias hb='hub browse'

alias gaa='git add -A '

alias gps='git push staging '
alias gpo='git push origin "$(current_branch)"'
alias gpom='git push origin master '
alias gphm='git push heroku master '
alias gpbm='git push origin master && git push heroku master '
alias gpft='git push --follow-tags '

alias gpu='git pull origin "$(current_branch)"'
alias gpum='git pull origin master '
alias gbd='git branch -D '
alias grv='git remote -v '

# Remove all dirty parts of hte git tree
clean() {
  git reset && git checkout . && git clean -f -d
}

burn() {
  git branch -D "$1" # Delete branch locally
  git push origin :"$1" # Delete branch from remote (GitHub)
}

alias g'*'='git add -A && git commit && git push origin "$(current_branch)"'
alias prune='git branch | grep -v "master" | xargs git branch -D'


###################### npm/yarn aliases ##################
alias i='npm install '
alias t='npm test '
alias it='npm install && npm test'

alias t='npm test '
# Install and uninstall shorteners
alias ni='npm install '
alias nit='npm install && npm test '

alias nis='npm install --save '
alias nuis='npm uninstall --save '

alias nig='npm install --global '
alias nuig='npm uninstall --global '

alias nid='npm install --save-dev '
alias nuid='npm uninstall --save-dev '

alias nif='npm init -f '
alias nl='npm link '
alias nul='npm unlink '
alias nrl='npm run lint '
alias nrt='npm run transpile '
alias nrf='npm run flow '

alias nv='npm version '
alias gpft='git push --follow-tags'

PUSH_PUB="gpft"
alias nvp="npm version patch -m \"📦 %s\" && $PUSH_PUB"
alias nvmi="npm version minor -m \"📦 %s\" && $PUSH_PUB"
alias nvma="npm version major -m \"📦 %s\" && $PUSH_PUB"

alias np='npm publish '
alias ns='npm start '

# Executing locally installed npm_modules from project home
alias npm-exec='PATH=$(npm bin):$PATH '
alias ne="npm-exec "

# Command npm script aliases
alias nr='npm run '
alias nrw='npm run watch '
alias w='npm run watch '
alias nrb='npm run build '
alias nrbd='npm run build-docs '
alias nrsd='npm run serve-docs '

die() {
  rm -rf node_modules
  npm install
}

alias diet='die && npm run test'

###################### Random other helpers ##################
# copy last command
alias cp='cp -r '
alias copyLastCmd="fc -ln -1 | pbcopy"

# print the terminal color-scheme
printColors () {
  for x in 0 1 4 5 7 8; do for i in `seq 30 37`; do for a in `seq 40 47`; do echo -ne "\e[$x;$i;$a""m\\\e[$x;$i;$a""m\e[0;37;40m "; done; echo; done; done; echo "";
}

alias tr="tree -I 'node_modules' -L 4"

# Upgrade all the things
upgradeAll () {
  upgrade_oh_my_zsh
  brew prune
  brew update
  brew upgrade
  brew doctor
  npm update -g
}

# open vscode to current directory OR open file/dir in arg1
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
  git commit --amend -m "🎉  init"
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
}

# git clone and cd into that dir
# Usage: "gcl" when git url is in clipboard
gcl() {
  git clone $(pbpaste)
}

# copy a branch name from a github pr to clipboard.
b() {
  gch master
  git pull origin master
  fetch-all
  git checkout "$(pbpaste)"
  git pull
  # git merge master
  # git status
}

opent() {
  CURRENT_GIT_REPO=$(basename `git rev-parse --show-toplevel`)
  open https://travis-ci.com/drivergroup/"$CURRENT_GIT_REPO"
}
