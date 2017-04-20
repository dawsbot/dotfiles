"""""""""""""""" Plug """"""""""""""""""""""""
" Plug start
call plug#begin('~/.local/share/nvim/plugged')

" Load on startup
Plug 'vim-airline/vim-airline'
Plug 'mhartington/oceanic-next'
Plug 'ryanoasis/vim-devicons'
Plug 'editorconfig/editorconfig-vim'

Plug 'tomtom/tcomment_vim'
Plug 'scrooloose/syntastic'

" JavaScript
Plug 'pangloss/vim-javascript', { 'for': 'javascript' }
" Plug 'othree/es.next.syntax.vim', { 'for': 'javascript' }

" Plug 'sheerun/vim-polyglot'

" On-demand loading
Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }

call plug#end()

" Airline
set laststatus=2
let g:airline_theme='oceanicnext'
let g:airline_powerline_fonts = 1

" Nerdtree
let NERDTreeShowLineNumbers=1

" Syntastic
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*

let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0

let g:syntastic_javascript_checkers = ['eslint']
" let g:syntastic_javascript_eslint_exe = '$(npm bin)/eslint'

" " let g:syntastic_javascript_eslint_generic = 1
" " let g:syntastic_javascript_eslint_exec = 'xo'
" " let g:syntastic_javascript_eslint_args = '--compact'
" " let g:syntastic_javascript_checkers = ['eslint', 'jshint']
"
"""""""""""""""" Plug end """""""""""""""""""


"""""""""""""""" miscellaneous """""""""""""""
set encoding=utf8
set background=dark
filetype plugin on

syntax enable

if (has("termguicolors"))
 set termguicolors
endif
set guifont=Operator\ Mono:h14

colorscheme OceanicNext

set number
set relativenumber
set noswapfile
set hlsearch

set cursorline
set cursorcolumn
set scrolloff=20

" Mouse scrolling
set mouse=a

" Set's vim's shell to source zshrc (so aliases are available in "!<command>"
set shell=/bin/zsh\ --login

" Copy to system clipboard
set clipboard=unnamed

" Ignore case when searching
set ignorecase


""""""""""""""" Leader shortcuts """""""""""""
let mapleader = ' '

" Saving
nnoremap <leader>w :w<cr>
nnoremap <leader>q :q!<cr>
nnoremap <leader>e :wq<cr>

nnoremap <leader>n :NERDTree<cr>

" Swap between panes
nnoremap <silent> <leader>h :wincmd h<CR>
nnoremap <silent> <leader>l :wincmd l<CR>
nnoremap <leader><leader> :bnext<CR>

" Un-highlight search matches after a second \"Enter\" press
nnoremap <CR> :noh<CR><CR>


" """" fix broken crontab temp file """""
" au BufEnter /private/tmp/crontab.* setl backupcopy=yes
"
" """"""""""""""""""" Functions """""""""""""""""""""
" function! TrimWhiteSpace()
"   %s/\s\+$//e
"   :w
"   ''
" endfunction
"
" function! DoubleQuotesToSingle()
"   %s/"/'/g
"   :w
"   ''
" endfunction
"
" " Set leader key
"
" "Yank to clipboard
"
" """"""""""""""""""" Neobundle """""""""""""""""""
" " Required:
" if has('vim_starting')
"   set runtimepath+=~/.vim/bundle/neobundle.vim/
" end
"
" call neobundle#begin(expand('~/.vim/bundle/'))
"
" " Let NeoBundle manage NeoBundle
" " Required:
" NeoBundleFetch 'Shougo/neobundle.vim'
" NeoBundle 'scrooloose/syntastic.git'
" NeoBundle 'scrooloose/nerdtree.git'
" NeoBundle 
" NeoBundle 'bling/vim-airline'
" NeoBundle 'qpkorr/vim-bufkill'
" NeoBundle 'herrbischoff/cobalt2.vim'
"
" NeoBundle 'tpope/vim-surround'
" NeoBundle 'jelera/vim-javascript-syntax'
" NeoBundle 'editorconfig/editorconfig-vim'
" " NeoBundle 'pangloss/vim-javascript'
" " NeoBundle 'nathanaelkane/vim-indent-guides'
" " NeoBundle 'tmhedberg/matchit'
"
" " NeoBundle 'yosiat/oceanic-next-vim'
" " NeoBundle 'mhartington/oceanic-next'
" call neobundle#end()
"
" let g:airline_powerline_fonts = 1
"
" " Required:
" " filetype plugin indent on
" set ai
" set si
"
" " If there are uninstalled bundles found on startup,
" " this will conveniently prompt you to install them.
" NeoBundleCheck
"
" " Syntastic
" " set statusline+=%#warningmsg#
" " set statusline+=%{SyntasticStatuslineFlag()}
" " set statusline+=%*
" " set laststatus=2
"
" " let g:syntastic_javascript_eslint_generic = 1
" " let g:syntastic_javascript_eslint_exec = 'xo'
" " let g:syntastic_javascript_eslint_args = '--compact'
" " let g:syntastic_javascript_checkers = ['eslint', 'jshint']
"
" " let g:syntastic_javascript_checkers=['eslint']
" " let g:syntastic_python_checkers = []
" let g:syntastic_check_on_open=1
"
" " NERDTree
" let NERDTreeShowLineNumbers=1
"
" " Close out NERDTree if it's the last things open
" autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif
"
" """"""""""""""""""""""""" Custom
" set relativenumber
" set number
" set showmode
" set cursorline
" set cursorcolumn
" set scrolloff=10
"
" match ErrorMsg '\s\+$'
"
" set background=dark
"
" set t_Co=256
"
" set noswapfile
"
" "Tabbing and efficiency
" set tabstop=2
" set smartindent
" set shiftwidth=2
" set expandtab
" set hlsearch
" set incsearch
" set backspace=indent,eol,start
"
" syntax on
"
" set mouse=a
"
" if !has('nvim')
"   set ttymouse=xterm
" endif
"
" """"""""""""""""""" Leader overrides """"""""""""""""""""
" nnoremap <silent> <leader>s :call TrimWhiteSpace()<CR>
"
" "Delete buffer special. Defined in vim-bufkill
" nmap <leader>k :BD<CR>
"
"
" nmap <leader>p <F2><CR>ki
"
" " Navigating windows
" nnoremap <silent> <leader>l :wincmd l<CR>
" nnoremap <silent> <leader>h :wincmd h<CR>
" nnoremap <silent> <leader>j :wincmd j<CR>
" nnoremap <leader><leader> :bnext<CR>
"
" "Set no highlight after a second \"Enter\" press
" nnoremap <CR> :noh<CR><CR>
"
" """""""""""""""""""" Custom commands """"""""""""""""""""
" " Paste in teammate names for code review
" nnoremap <leader>t a dkearns aleksey<ESC>
" "Engage spell checking
" command Spell execute "set spell spelllang=en_us"
"
" " Auto-add shebang for certain file types
" augroup Shebang
"   autocmd BufNewFile *.py 0put =\"#!/usr/bin/env python\<nl>\"|$
"   autocmd BufNewFile *.sh 0put =\"#!/bin/bash\<nl>\"|$
"   autocmd BufNewFile *.js 0put =\"\'use strict\';\<nl>\"|$
" augroup END
"
"
" " Show matching brackets when text indicator is over them
" set showmatch
