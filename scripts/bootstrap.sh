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

# Enable italics in terminal
tic ../styles/xterm-256color-italic.terminfo
if [ "$TERM" != "xterm-256color-italic" ]
        then
                echo "⚠️  Set terminal type to xterm-256color-italic in iTerm settings"
                echo "Follow this for more info: https://alexpearce.me/2014/05/italics-in-iterm2-vim-tmux"
        fi
