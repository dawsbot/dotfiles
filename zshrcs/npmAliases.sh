alias i='npm install '
alias t='npm test '
alias it='npm install && npm test'

alias t='npm test '
# Install and uninstall shorteners
alias ni='npm install '
alias nit='npm install && npm test '

alias nis='npm install --save '
alias nuis='npm uninstall --save '

alias nig='npm install --global '
alias nuig='npm uninstall --global '

alias nid='npm install --save-dev '
alias nuid='npm uninstall --save-dev '

alias nif='npm init -f '
alias nl='npm link '
alias nul='npm unlink '
alias nrl='npm run lint '
alias nrt='npm run transpile '
alias nrf='npm run flow '

alias nv='npm version '
alias gpft='git push --follow-tags'
alias nvp='npm version patch -m ":package: %s" && gpft '
alias nvmi='npm version minor -m ":package: %s" && gpft '
alias nvma='npm version major -m ":package: %s" && gpft '
alias np='npm publish '
alias ns='npm start '

# Executing locally installed npm_modules from project home
alias npm-exec='PATH=$(npm bin):$PATH '
alias ne="npm-exec "

# Command npm script aliases
alias nr='npm run '
alias nrw='npm run watch '
alias w='npm run watch '
alias nrb='npm run build '
alias nrbd='npm run build-docs '
alias nrsd='npm run serve-docs '

die() {
  rm -rf node_modules
  npm install
}

alias diet='die && npm run test'
