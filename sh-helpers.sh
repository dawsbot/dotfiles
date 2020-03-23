#!/usr/bin/env bash

################## GIT ALIASES ######################
current_branch() {
  git rev-parse --abbrev-ref HEAD
}

alias hb='hub browse'

alias gaa='git add -A '

alias gpo='git push origin HEAD '
alias gpom='git push origin master '
alias gpft='git push --follow-tags '

alias gpu='git pull origin "$(current_branch)"'
alias gbd='git branch -D '
alias grv='git remote -v '

# Remove all dirty parts of the git tree
clean() {
  git reset && git checkout . && git clean -f -d
}

burn() {
  git branch -D "$1" # Delete branch locally
  git push origin :"$1" # Delete branch from remote (GitHub)
}

alias g'*'='git add -A && git commit && git push origin HEAD'
alias gpr='g* && pr'
alias update-branch='git checkout master && git pull origin master && git checkout - && git merge master'

alias prune='git branch | grep -v "master" | xargs git branch -D'

alias w='which '

###################### npm/yarn aliases ##################
alias t='npm test '
alias nd='npm run dev'
alias nb='npm run build'
alias ns='npm start'

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
alias nrb='npm run build '

die() {
  rm -rf node_modules
  npm install
}

###################### Random other helpers ##################
# copy last command
alias cp='cp -r '
alias copyLastCmd="fc -ln -1 | pbcopy"

# print the terminal color-scheme
printColors () {
  for x in 0 1 4 5 7 8; do for i in `seq 30 37`; do for a in `seq 40 47`; do echo -ne "\e[$x;$i;$a""m\\\e[$x;$i;$a""m\e[0;37;40m "; done; echo; done; done; echo "";
}

alias tr="tree -I 'node_modules' -L 4"

# opens a version of chrome where sourcemaps will work without being over https
openChromeSourceMappable() {
  /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost:3000
}

# Upgrade all the things

upgradeAll () {
  upgrade_oh_my_zsh
  yarn global upgrade
  npm update -g
  brew update
  brew upgrade
  brew doctor
  brew prune
  brew cleanup
  docker image prune --all --filter until=400h # delete all stale-ish docker images
  sudo softwareupdate -i -a --restart
}

# open vscode to current directory OR open file/dir in arg1
function vs() {
  if [[ $# -eq 0 ]] ; then
    code .
  fi
  code "$1"
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
  git clone "$(pbpaste)" && cd $_
}

opent() {
  CURRENT_GIT_REPO=$(basename `git rev-parse --show-toplevel`)
  open https://travis-ci.com/drivergroup/"$CURRENT_GIT_REPO"
}

apr() {
	git checkout master
  git reset --hard origin/master
  git pull origin master
  git fetch -p origin
  git checkout "$1"
  git pull origin "$1"
  git merge master
}

to-webp() {
  cwebp -m 6 -z 9 -q 100 "$1".png -o "$1".webp
}

ssh-prod() {
  ssh ubuntu@dev24.everipedia.org
}
ssh-dev() {
  ssh -i ~/Downloads/aws-ep-staging.pem ubuntu@ec2-18-144-104-120.us-west-1.compute.amazonaws.com
}
# Kills whatever is running on port 3000
kill-3000() {
  lsof -t -i tcp:3000 | xargs kill
}

