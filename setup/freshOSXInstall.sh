# * Manually install XCode (or just XCode tools)
# * Manually Install Chrome
# * Manually Install Iterm2 https://www.iterm2.com/downloads.html

#Does NOT require XCode tools
#Set git configs
git config --global user.name "Dawson Botsford"
git config --global user.email "DawsonBotsford@gmail.com"
# setup ssh keys on github

#Requires XCode tools:
cd ~
#Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#Dotfiles
git clone git@github.com:dawsonbotsford/dotfiles.git
cd dotfiles/scripts
sh make.sh

brew update
brew install wget
brew install node
brew install the_silver_searcher # Also known as "ag"

brew install diff-so-fancy
# Set default "git diff" to be diff-so-fancy
git config --global core.pager "diff-so-fancy | less --tabs=2 -RFX"

npm install -g gh
npm install -g npm-name-cli
npm install -g hicat
npm install -g openg-cli
npm install -g openm
npm install -g opent

brew install heroku-toolbelt
heroku update
brew install vim
brew install cmake

# Neobundle install
curl https://raw.githubusercontent.com/Shougo/neobundle.vim/master/bin/install.sh > install.sh
sh ./install.sh

sudo easy_install pip
sudo pip install grip

git clone git://github.com/tarruda/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions

# fzf setup
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
