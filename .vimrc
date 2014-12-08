set relativenumber
set showmode
set cursorline

syntax on

set noswapfile

set tabstop=2
set smartindent
set shiftwidth=2
set expandtab

map <C-j> 10j
map <C-k> 10k

function! NumberToggle()
  if(&relativenumber == 1)
    set number
  else
    set relativenumber
  endif
endfunc

nnoremap <C-n> :call NumberToggle()<cr>

