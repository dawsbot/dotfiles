# Dawson Botsford zshrc https://github.com/dawsonbotsford

# Increase history size
HISTFILE=~/.zsh_history
HISTSIZE=100000
SAVEHIST=100000

# Path to your oh-my-zsh installation.
export ZSH=~/.oh-my-zsh
export PATH=/usr/local/lib:$PATH
export PATH=/usr/local/share/npm/bin:$PATH
export PATH=$PATH:/usr/local/git/bin/
export PATH=$PATH:/usr/local/bin

export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh

# Set name of the theme to load.
ZSH_THEME='agnoster'

# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
plugins=(git)
plugins=(heroku)
# plugins=(vi-mode)

source $ZSH/oh-my-zsh.sh

# You may need to manually set your language environment
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

#npm aliases
alias ni='npm install '
alias nis='npm install --save '
alias nig='npm install --global '
alias nid='npm install --save-dev '
alias nl='npm link'
alias l='link'
alias n='npm'

alias npm-exec='PATH=$(npm bin):$PATH'

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
alias gl='git log --graph --oneline --all'
alias g*='git add -A && git commit && git push'

alias s='source '
alias sz='source ~/.zshrc'

alias r='rm -rf '

alias vz='vim ~/dotfiles/zshrc'
alias vv='vim ~/dotfiles/vimrc'
alias ve='vim ~/dotfiles/eslintrc'

#grip required shortcut command
gr() {
  grip $1 3003 &
  open "http://localhost:3003/"
}

#daemon watching
alias na="nodemon --exec 'ava'"
alias nx="nodemon --exec 'xo'"
alias nt="nodemon --exec 'npm test'"
alias openg="gh-home"

alias pydemon="nodemon --exec 'python' "

#youtube-dl mp3 alias
alias youtube-dl-mp3="youtube-dl --extract-audio --audio-format mp3 "

alias ct="cd /tmp"

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting

alias howto='how2 -l javascript '

alias cm="mkdir $1 && cd $1"

LS_COLORS='no=00;37:fi=00:di=00;33:ln=04;36:pi=40;33:so=01;35:bd=40;33;01:'
export LS_COLORS
zstyle ':completion:*' list-colors ${(s.:.)LS_COLORS}
