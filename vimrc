 " Required:

 if has('vim_starting')
   set nocompatible
   set runtimepath+=~/.vim/bundle/neobundle.vim/
 end

 call neobundle#begin(expand('~/.vim/bundle/'))

 " Let NeoBundle manage NeoBundle
 " Required:
 NeoBundleFetch 'Shougo/neobundle.vim'
 NeoBundle 'scrooloose/syntastic.git'
 NeoBundle 'scrooloose/nerdtree.git'
 NeoBundle 'powerline/powerline.git'
 NeoBundle 'tomtom/tcomment_vim.git' 
 NeoBundle 'bling/vim-airline' 
 NeoBundle 'altercation/vim-colors-solarized'

 call neobundle#end()

 " Required:
 filetype plugin indent on

 " If there are uninstalled bundles found on startup,
 " this will conveniently prompt you to install them.
 NeoBundleCheck

"" Syntastic
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
set laststatus=2
let g:syntastic_javascript_checkers=['eslint']
let g:syntastic_check_on_open = 1 

"" Custom
set relativenumber
set number
set showmode
set cursorline

syntax on
colorscheme solarized

set noswapfile

set tabstop=2
set smartindent
set shiftwidth=2
set expandtab
set hlsearch
set backspace=indent,eol,start

map <C-j> 10j
map <C-k> 10k

set mouse=a
set ttymouse=xterm

let mapleader = " "
nmap <leader>n :NERDTree<cr>
let NERDTreeShowLineNumbers=1

" Leader overrides
nmap <leader>w :w<cr>
nmap <leader>q :q<cr>
