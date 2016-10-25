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
  cd ~/dotfiles/zshrcs
  ls
}

eval $(thefuck --alias)

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
