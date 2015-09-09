#!/bin/bash
############################
# .make.sh
# This script creates symlinks from the home directory to any desired dotfiles in ~/dotfiles
############################

########## Variables

dir=~/dotfiles                    # dotfiles directory
olddir=~/dotfiles_old             # old dotfiles backup directory
files="vimrc zshrc eslintrc gitignore"    # list of files/folders to symlink in homedir

########## generic unix things 
#Install homebrew here?
brew install fasd #The z search
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh ~/install.sh)"
rm -rf ~/install.sh
brew install thefuck
sudo easy_install Pygments

########## npm installs ###############
brew install nvm
npm install -g eslint
npm install -g babel-eslint
npm install -g vantage

# create dotfiles_old in homedir
printf "\nCreating $olddir for backup of any existing dotfiles in ~"
mkdir -p $olddir
printf "...done"

# change to the dotfiles directory
printf "\nChanging to the $dir directory"
cd $dir
printf "...done"

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks 
for file in $files; do
    printf "\nMoving any existing dotfiles from ~ to $olddir"
    mv ~/.$file ~/dotfiles_old/
    printf "Creating symlink to $file in home directory."
    ln -s $dir/$file ~/.$file
done

sh ./gitignore.sh
