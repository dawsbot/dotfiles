alias g='git '
alias gs='git status '
alias ga='git add '
alias gl='git log '
alias gaa='git add -A '
alias gc='git commit '
alias gch='git checkout '
alias gchm='git checkout master '

alias gp='git push '
alias gps='git push staging '
alias gpp='git push production '
alias gpo='git push origin '
alias gpom='git push origin master '
alias gphm='git push heroku master '
alias gpbm='git push origin master && git push heroku master '
alias gpft='git push --follow-tags '

alias gd='git diff '
alias gb='git branch '

burn() {
  git branch -D "$1" # Delete branch locally
  git push origin :"$1" # Delete branch from remote (GitHub)
}

current_branch() {
  basename "$(git symbolic-ref HEAD)"
}

alias g'*'='git add -A && git commit && git push origin "$(current_branch)"'

# git push "this branch"
gpt() {
  git push origin "$(current_branch)"
}

gcl() {
  git clone "$1"
  # TODO: cd into cloned repo
}
