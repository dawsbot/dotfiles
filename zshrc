# Dawson Botsford zshrc https://github.com/dawsonbotsford

# Increase history size
HISTFILE=~/.zsh_history
HISTSIZE=100000
SAVEHIST=100000

# Path to your oh-my-zsh installation.
export ZSH=~/.oh-my-zsh

# Extend path
export PATH=/usr/local/lib:$PATH
export PATH=/usr/local/share/npm/bin:$PATH
export PATH=$PATH:/usr/local/git/bin/
export PATH=$PATH:/usr/local/bin
export PATH=$PATH:~/Library/Android/sdk
export PATH=$PATH:~/Library/Android/sdk/tools
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting


# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
ZSH_THEME='agnoster'

plugins=(git)
plugins=(heroku)

source $ZSH/oh-my-zsh.sh

# Manually set your language environment
export LANG=en_US.UTF-8
export EDITOR='vim'

eval "$(fasd --init auto)"

#backwards search
bindkey "^R" history-incremental-search-backward

#Removes user from prompt status line
prompt_context(){}

#Yank directly to clipboard OSX
set clipboard=unnamed

########## ALIASES ###########

#File movement aliases
alias b='cd ..'
alias bb='cd ...'

#Git aliases
alias g='git '
alias gs='git status'
alias ga='git add'
alias gaa='git add -A'
alias gc='git commit'
alias gch='git checkout'

alias gp='git push'
alias gps='git push staging'
alias gpp='git push production'
alias gpo='git push origin'
alias gpom='git push origin master'
alias gphm='git push heroku master'
alias gpbm='git push origin master && git push heroku master'
alias gd='git diff '
alias gb='git branch '

why() {
  npm view "$1" description
}

burn() {
  git branch -d "$1" # Delete branch locally
  git push origin :"$1" # Delete branch from remote (GitHub)
}

current_branch() {
  basename "$(git symbolic-ref HEAD)"
}

alias g'*'='git add -A && git commit && git push origin "$(current_branch)"'
alias sz='source ~/.zshrc'

alias vz='vim ~/dotfiles/zshrc'
alias vv='vim ~/dotfiles/vimrc'

#grip readme viewer shortcut command
gr() {
  grip $1 3003 &
  open "http://localhost:3003/"
}

#daemon watching
alias na="nodemon --exec 'ava'"
alias nx="nodemon --exec 'xo'"
alias nt="nodemon --exec 'npm test'"

alias pydemon="nodemon --exec 'python' "

#youtube-dl mp3 alias
alias youtube-dl-mp3="youtube-dl --extract-audio --audio-format mp3 "

alias subl="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"
alias s="subl ."
alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"

alias howto='how2 -l javascript '

cm() {
  mkdir "$1"
  cd "$1"
}

LS_COLORS='no=00;37:fi=00:di=00;33:ln=04;36:pi=40;33:so=01;35:bd=40;33;01:'
export LS_COLORS
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}

source ~/dotfiles/zshrcFiles/npmAliases