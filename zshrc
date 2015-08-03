# Path to your oh-my-zsh installation.
export ZSH=~/.oh-my-zsh
export PATH=/usr/local/share/npm/bin:$PATH
export PATH=$PATH:/usr/local/git/bin/

export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh

# Set name of the theme to load.
ZSH_THEME='agnoster'

# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
plugins=(git)
plugins=(heroku)
plugins=(vi-mode)

source $ZSH/oh-my-zsh.sh

# You may need to manually set your language environment
export LANG=en_US.UTF-8
export EDITOR='vim'

eval "$(fasd --init auto)"
alias fuck='eval $(thefuck $(fc -ln -1 | tail -n 1)); fc -R'
alias f='fuck'

#backwards search
bindkey "^R" history-incremental-search-backward

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
alias gcm='git checkout master'

alias gp='git push'
alias gps='git push staging'
alias gpp='git push production'
alias gpo='git push origin'
alias gd='git diff '
alias gb='git branch '
alias gbd='git branch -D '
alias gl='git log'
alias g*='git add -A && git commit'
alias gr='git rebase'

alias s='source '
alias sz='source ~/.zshrc'

alias r='rm -rf '
alias vd='vimdiff '

alias vz='vim ~/dotfiles/zshrc'
alias vv='vim ~/dotfiles/vimrc'
alias ve='vim ~/dotfiles/eslintrc'

#Colorize cat. Requies Python script "pygmentize" accessable in path
cat() {
  if command -v pygmentize > /dev/null; then
    pygmentize $1 > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      pygmentize $1
    else
      command cat $1
    fi
  else
    command cat $1
  fi
}
