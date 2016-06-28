#!/bin/bash
############################
# Creates symlinks from the home directory to any desired dotfiles in ~/dotfiles
############################

########## Variables
dir=~/dotfiles/link               # dotfiles directory
olddir=~/dotfiles_old             # old dotfiles backup directory
# files="vimrc zshrc eslintrc gitignore"    # list of files/folders to symlink in homedir
files="vimrc zshrc vim"    # list of files/folders to symlink in homedir

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
