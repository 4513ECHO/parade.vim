if exists('g:loaded_parade')
  finish
endif
let g:loaded_parade = v:true

augroup parade_internal
  autocmd!
  autocmd BufReadCmd parade://* :
augroup END
