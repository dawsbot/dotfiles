echo "loaded dotfiles/zshrcs/npmAliases.sh"

alias ni='npm install '
alias nis='npm install --save '
alias nig='npm install --global '
alias nid='npm install --save-dev '
alias nl='npm link'
alias l='link'
alias nv='npm version'
alias nvp='npm version patch'
alias np='npm publish'
alias ns='npm start'
alias pub='gpom && npm publish'

alias npm-exec='PATH=$(npm bin):$PATH'

why() {
  npm view "$1" description
}
