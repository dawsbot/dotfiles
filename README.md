> Dotfiles for ⚡️-fast hacking

<br>

This assumes you have the following:

1. MacOS
2. [iTerm2](https://www.iterm2.com/)
3. [Operator Mono Font](https://www.typography.com/blog/introducing-operator). Change the following line in [link/vimrc](link/vimrc) to use a different *italics friendly* font
4. Dropbox located in `$HOME/Dropbox` (same as `~`)

```sh
set guifont=Operator\ Mono:h14 " Custom font.
```

🎁 You'll get:

1. A beautiful terminal thanks to zsh & oh-my-zsh 💁
2. A [Neovim](https://neovim.io/) setup similar to a well equipped IDE 💅
3. A packaged vimrc with linting & syntax highlighting from the get-go 🎨
4. A bootstrap script to get setup quickly ⚡️

![demo](img/demo.png)

<br>

### Install

```sh
cd ~/Dropbox
git clone https://github.com/dawsonbotsford/dotfiles
./dotfiles/scripts/bootstrap.sh
```

Modifications can be made to either `~/<file>` **or** `~/dotfiles/link/<file>` since they are symlinked.

<br>

#### Brand-New Computer
```sh
cd ~/Dropbox
git clone https://github.com/dawsonbotsford/dotfiles

./dotfiles/setup/freshOSXInstall.sh
./dotfiles/scripts/bootstrap.sh
```

<br>

## License

MIT © [Dawson Botsford](https://dawsbot.com)
