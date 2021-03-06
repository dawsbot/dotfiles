# * Manually install XCode (or just XCode tools)
# * Manually Install Chrome
# * Manually Install Iterm2 https://www.iterm2.com/downloads.html

#Does NOT require XCode tools
#Set git configs
git config --global user.name "Dawson Botsford"
git config --global user.email "DawsonBotsford@gmail.com"
# setup ssh keys on github

#Requires XCode tools:
cd ~ || exit
#Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#Dotfiles
cd "$HOME/Dropbox"
git clone git@github.com:dawsonbotsford/dotfiles.git
./dotfiles/scripts/bootstrap.sh

brew update
brew install wget node
brew install the_silver_searcher # Also known as "ag"

brew install diff-so-fancy

# Set default "git diff" to be diff-so-fancy
git config --global core.pager "diff-so-fancy | less --tabs=2 -RFX"

npm install -g npm-name-cli
npm install -g hicat
npm install -g nodemon
npm install -g pluc

brew install vim cmake

sudo easy_install pip
sudo pip install grip

git clone git://github.com/tarruda/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions

# install neovim plug package manager
curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

# Enable key repeats
defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false

