current_branch() {
  basename "$(git symbolic-ref HEAD)"
}

alias hb='hub browse'

alias g='git '
alias gs='git status '
alias ga='git add '
alias gl='git log '
alias gaa='git add -A '
alias gc='git commit '
alias gch='git checkout '
alias gchm='git checkout master '
alias gchb='git checkout -b '

alias gp='git push '
alias gps='git push staging '
alias gpo='git push origin '
alias gpom='git push origin master '
alias gphm='git push heroku master '
alias gpbm='git push origin master && git push heroku master '
alias gpft='git push --follow-tags '

alias gpu='git pull origin "$(current_branch)"'
alias gpum='git pull origin master '
alias gd='git diff '
alias gb='git branch '
alias gbd='git branch -D '

alias gr='git remote '
alias grv='git remote -v '

clean() {
  git checkout . && git clean -f -d
}
burn() {
  git branch -D "$1" # Delete branch locally
  git push origin :"$1" # Delete branch from remote (GitHub)
}

alias g'*'='git add -A && git commit && git push origin "$(current_branch)"'

gcl() {
  git clone "$1"
}

alias prune='git branch | grep -v "master" | xargs git branch -D'
