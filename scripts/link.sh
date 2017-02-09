#!/bin/bash
############################
# Creates symlinks from the home directory to any desired dotfiles in ~/dotfiles
############################

dir="$HOME/Dropbox/dotfiles/link"               # dotfiles directory
olddir=/tmp/dotfiles_old             # old dotfiles backup directory
files="vimrc zshrc vim"    # list of files/folders to symlink in homedir

mkdir -p $olddir
cd "$dir" || exit

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks 
for file in $files; do
    # printf "\nMoving any existing dotfiles from ~ to $olddir"
    rm "$olddir/$file"
    mv "$HOME/.$file" "$olddir/$file"

    ln -s "$dir/$file" "$HOME/.$file"
done
