############################
# Creates symlinks from the home directory to any desired dotfiles in ~/dotfiles
############################

DIR="$HOME/Dropbox/dotfiles/link" # dotfiles directory
FILES="zshrc vimrc gitignore" # symlink to homedir

cd "$DIR" || exit

# move any existing dotfiles in homedir to dotfiles_old directory, then create symlinks
for file in $FILES; do
  rm -rf "$HOME/.$file"
  ln -s "$DIR/$file" "$HOME/.$file"
done

# Link Neovim
rm -rf "$HOME/.config/nvim"
mkdir -p "$HOME/.config/nvim/spell"
ln -s "$DIR/vimrc" "$HOME/.config/nvim/init.vim" # vimrc
ln -s "$DIR/en.utf-8.add" "$HOME/.config/nvim/spell/en.utf-8.add" # Dictionary

# Link global gitignore
git config --global core.excludesfile ~/.gitignore

# Enable italics in terminal
if [ "$TERM" != "xterm-256color-italic" ]
then
  tic ../styles/xterm-256color-italic.terminfo
  echo "⚠️  Set terminal type to xterm-256color-italic in iTerm settings"
  echo "Follow this for more info: https://alexpearce.me/2014/05/italics-in-iterm2-vim-tmux"
fi
