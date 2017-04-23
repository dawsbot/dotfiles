#!/bin/bash
############################
# Creates symlinks from the home directory to any desired dotfiles in ~/dotfiles
############################

dir="$HOME/Dropbox/dotfiles/link" # dotfiles directory
files="zshrc vim"    # list of files/folders to symlink in homedir

cd "$dir" || exit

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks 
for file in $files; do
  rm -rf "$HOME/.$file"
  ln -s "$HOME/$file" "$HOME/.$file"
done

# link neovimrc
rm -rf ~/.config/nvim
mkdir ~/.config/nvim
ln -s "$dir/vimrc" ~/.config/nvim/init.vim
# ln -s ~/.vim ~/.config/nvim
