
> Highly recommended dotfiles for OSX.

<br>

Includes:  

1. iterm2 setup with oh-my-zsh  
2. vimrc setup with bundled packages

<br>

### Demo
![demo](img/demo.gif)

<br>

### Install

git clone this into your home directory (echo $HOME)


```
cd dotfiles
sh scripts/link.sh
```

This links your root files to the ~/dotfiles files. All modifications can be made to either the `~/<file>` or `~/dotfiles/link/<file>` since they are symlinked.

