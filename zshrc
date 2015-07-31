# Path to your oh-my-zsh installation.
export ZSH=~/.oh-my-zsh
export PATH=/usr/local/share/npm/bin:$PATH

export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh

# Set name of the theme to load.
ZSH_THEME='agnoster'

# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
plugins=(git)
plugins=(brew)
plugins=(node)
plugins=(heroku)
plugins=(vi-mode)

source $ZSH/oh-my-zsh.sh

# You may need to manually set your language environment
export LANG=en_US.UTF-8
export EDITOR='vim'

eval "$(fasd --init auto)"
alias fuck='eval $(thefuck $(fc -ln -1 | tail -n 1)); fc -R'
alias f='fuck'

#Removes user from prompt status line
prompt_context(){}

#Yank directly to clipboard OSX
set clipboard=unnamed

########## ALIASES ###########
#Git aliases
alias g='git '
alias gs='git status'
alias ga='git add'
alias gaa='git add -A'
alias gc='git commit'
alias gch='git checkout'
alias gp='git push'
alias gpo='git push origin'
alias gd='git diff '
alias gb='git branch '
alias gl='git log'
alias g*='git add -A && git commit'

alias v='vim '

alias s='source '
alias sz='source ~/.zshrc'
alias sv='source ~/.vimrc'

alias r='rm -rf '
