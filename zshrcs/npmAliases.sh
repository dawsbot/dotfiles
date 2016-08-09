
alias i='npm install '
alias t='npm test '

alias ni='npm install '
alias nis='npm install --save '
alias nuis='npm uninstall --save '
alias nig='npm install --global '
alias nuig='npm uninstall --global '
alias nid='npm install --save-dev '
alias nuid='npm uninstall --save-dev '
alias nl='npm link '
alias l='link '
alias nv='npm version '
alias nvp='npm version patch && git push --follow-tags '
alias np='npm publish '
alias ns='npm start '

alias nt='npm test '
alias pub='gpom && npm publish '

alias npm-exec='PATH=$(npm bin):$PATH '
alias nr='npm run '
alias nrw='npm run watch '
alias nrb='npm run build '
alias nrbd='npm run build-docs '
alias nrsd='npm run serve-docs '

why() {
  npm view "$1" description
}

opnm() {
  open https://npmjs.org/package/"$1"
}

die() {
  rm -rf node_modules
  npm install
}
