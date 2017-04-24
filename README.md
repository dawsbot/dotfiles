> Dotfiles for OSX hacking with maximum-efficient-speed.

<br>

Includes:

1. iterm2 setup for oh-my-zsh 💁
2. neovim setup similar to a well equipped IDE 💅
3. Bootstrap scripts to link it all up for you ⚡️

![demo](img/demo.png)

<br>

### Install

#### XCode already installed
```sh
cd ~
git clone https://github.com/dawsonbotsford/dotfiles

# Link all dotfiles to $HOME
./dotfiles/scripts/link.sh
```

Modifications can be made to either `~/<file>` **or** `~/dotfiles/link/<file>` since they are symlinked.

<br>

#### Brand-New Computer
```sh
cd ~
git clone https://github.com/dawsonbotsford/dotfiles

./dotfiles/setup/freshOSXInstall.sh
./dotfiles/scripts/link.sh
```

<br>

## License

MIT © [Dawson Botsford](http://dawsonbotsford.com)
