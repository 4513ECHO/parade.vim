function! parade#config(key_or_dict, value = v:null) abort
  let config =
  call parade#_internal#notify('setConfig', [config])
endfunction

" NOTE: this function is from
" https://github.com/Shougo/ddc.vim/blob/5dc1916654/autoload/ddc/custom.vim
function! s:normalize_key_or_dict(key_or_dict, value) abort
  if type(a:key_or_dict) ==# v:t_dict
    return a:key_or_dict
  elseif type(a:key_or_dict) ==# v:t_string
    let base = {}
    let base[a:key_or_dict] = a:value
    return base
  endif
  return {}
endfunction
