set relativenumber
set showmode
set cursorline

map <C-j> 10j
map <C-k> 10k

map <C-l> 10l
map <C-h> 10h

function! NumberToggle()
  if(&relativenumber == 1)
    set number
  else
    set relativenumber
  endif
endfunc

nnoremap <C-n> :call NumberToggle()<cr>




