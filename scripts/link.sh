#!/bin/bash
############################
# Creates symlinks from the home directory to any desired dotfiles in ~/dotfiles
############################

DIR="$HOME/Dropbox/dotfiles/link" # dotfiles directory
FILES="zshrc vimrc"    # list of files/folders to symlink in homedir

cd "$DIR" || exit

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks 
for file in $FILES; do
  rm -rf "$HOME/.$file"
  ln -s "$DIR/$file" "$HOME/.$file"
done

# link neovimrc
rm -rf ~/.config/nvim
mkdir ~/.config/nvim
ln -s "$DIR/vimrc" ~/.config/nvim/init.vim
