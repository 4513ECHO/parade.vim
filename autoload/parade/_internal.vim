function! parade#_internal#notify(method, params) abort
  call denops#notify('parade', a:method, a:params)
endfunction

function! parade#_internal#print_error(msg) abort
  echohl ErrorMsg
  echomsg '[parade]' a:msg
  echohl NONE
endfunction
