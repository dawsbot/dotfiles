############################
# Creates symlinks from this repo to the home directory
# After this, several checks are made for accessory programs
# which are required in order to support the advanced features
# required by these dotfiles (italics, autocomplete, etc.)
#
# Assumes you placed this repo in $HOME/Dropbox
############################

command -v nvim >/dev/null 2>&1 || (echo "\"nvim\" executable required. Install this before running bootsrap" && exit 0);

DIR="$HOME/Dropbox/dotfiles/link" # dotfiles directory

FILES="zshrc gitignore" # symlink to homedir

# Symlink "$FILES" to "$HOME/*"
for file in $FILES; do
  rm -rf "$HOME/.$file"
  ln -s "$DIR/$file" "$HOME/.$file"
done

# Link Neovim
rm -rf "$HOME/.config/nvim/init.vim" # vimrc
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

# Enusure pip3 exists (for neovim's deoplete)
command -v pip3 >/dev/null 2>&1 || echo "pip3 required for neovim deoplete, but none installed. See \"requirements\" here for more info: https://github.com/Shougo/deoplete.nvim"

echo "✅  Bootstrapped successfully!"
