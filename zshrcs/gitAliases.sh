echo "loaded dotfiles/zshrcs/gitAliases.sh"

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
alias gpft='git push --follow-tags'

alias gd='git diff '
alias gb='git branch '
alias gch="git checkout "

burn() {
  git branch -d "$1" # Delete branch locally
  git push origin :"$1" # Delete branch from remote (GitHub)
}

current_branch() {
  basename "$(git symbolic-ref HEAD)"
}

alias g'*'='git add -A && git commit && git push origin "$(current_branch)"'
