> Highly recommended dotfiles for OSX hacking with maximum-efficient-speed.

<br>

Includes:

1. iterm2 setup with oh-my-zsh
2. vimrc setup with **all** bundled packages :tada:

<br>

### Demo
![demo](img/demo.gif)

<br>

### Install

#### XCode already installed
```sh
cd ~
git clone https://github.com/dawsonbotsford/dotfiles

cd dotfiles
# Link all dotfiles to $HOME
sh scripts/link.sh
```

This links your root files to the ~/dotfiles files.  
Modifications can be made to `~/<file>` **or** `~/dotfiles/link/<file>` since they are symlinked.

<br>

#### Brand-New Computer
```sh
cd ~
git clone https://github.com/dawsonbotsford/dotfiles

cd dotfiles
sh setup/freshOSXInstall.sh

# Link all dotfiles to $HOME
sh scripts/link.sh
```

<br>

## License

MIT © [Dawson Botsford](http://dawsonbotsford.com)
