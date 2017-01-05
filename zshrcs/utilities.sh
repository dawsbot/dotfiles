# copy last command
alias copyLastCmd='fc -ln -1 | awk '{$1=$1}1' | pbcopy '

# kill functions for processes
alias kPhantom='pkill -f phantom'
alias kNode='pkill -f "node"'
alias kFinder='killall Finder'

alias kil='kPhantom && kNode && kFinder'

# print the terminal color-scheme
printColors () {
  for x in 0 1 4 5 7 8; do for i in `seq 30 37`; do for a in `seq 40 47`; do echo -ne "\e[$x;$i;$a""m\\\e[$x;$i;$a""m\e[0;37;40m "; done; echo; done; done; echo "";
}

cz () {
  cd ~/Dropbox/dotfiles/zshrcs
  ls
}

alias c='hicat '
alias v='vim '
alias tr="tree -I 'node_modules' -L 4"

upgradeAll () {
  brew prune
  brew update
  brew upgrade
  brew doctor
  npm update -g
}

function take() {
  mkdir -p $1
  cd $1
}

function co() {
  if [[ $# -eq 0 ]] ; then
    code-insiders .
    exit 1
  fi
  code-insiders "$1"
}

function s() {
  if [[ $# -eq 0 ]] ; then
    subl .
    exit 1
  fi
  subl "$1"
}

function db-nm() {
  mkdir src
  mv index.js src
  mv cli.js src
  npm install --save-dev babel-cli babel-preset-es2015 babel-preset-stage-2

}
