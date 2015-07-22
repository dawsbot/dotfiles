""""""""""""""""""" Functions """""""""""""""""""""
function! TrimWhiteSpace()
  %s/\s\+$//e
  :w
endfunction

function! DoubleQuotesToSingle()
  %s/"/'/g
  :w
endfunction

" Set leader key
let mapleader = ' '

"Yank to clipboard
set clipboard=unnamed

""""""""""""""""""" Neobundle """""""""""""""""""
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
NeoBundle 'qpkorr/vim-bufkill'
NeoBundle 'ajh17/VimCompletesMe'
call neobundle#end()

" Required:
filetype plugin indent on

" If there are uninstalled bundles found on startup,
" this will conveniently prompt you to install them.
NeoBundleCheck

" Syntastic
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
set laststatus=2
let g:syntastic_javascript_checkers=['eslint']
let g:syntastic_check_on_open=1

" NERDTree
let NERDTreeShowLineNumbers=1

" Close out NERDTree if it's the last things open
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif

" Custom
set relativenumber
set number
set showmode
set cursorline
set cursorcolumn

" Syntax
syntax on
match ErrorMsg '\s\+$'

colorscheme solarized

set noswapfile

"Tabbing and efficiency
set tabstop=2
set smartindent
set shiftwidth=2
set expandtab
set hlsearch
set incsearch
set backspace=indent,eol,start

map <C-j> 10j
map <C-k> 10k

set mouse=a
set ttymouse=xterm

""""""""""""""""""" Leader overrides """"""""""""""""""""
nnoremap <silent> <leader>s :call TrimWhiteSpace()<CR>
nnoremap <silent> <leader>" :call DoubleQuotesToSingle()<CR>
nmap <leader>n :NERDTree<cr>

"Delete buffer special. Defined in vim-bufkill
nmap <leader>k :BD<CR>

" Saving
nnoremap <leader>w :w<cr>
nnoremap <leader>q :q<cr>
nnoremap <leader>! :q!<cr>
nnoremap <leader>1 :q!<cr>
set pastetoggle=<F2>
nmap <leader>p <F2><cr>

" Navigating windows
nnoremap <silent> <leader>l :wincmd l<CR>
nnoremap <silent> <leader>h :wincmd h<CR>
nnoremap <silent> <leader>j :wincmd j<CR>
nnoremap <leader><leader> :bnext<CR>

"Set no highlight after a second Enter press
nnoremap <CR> :noh<CR><CR>

" Abbreviations
iab cl console.log('');
iab db debugger;
