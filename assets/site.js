
document.addEventListener('DOMContentLoaded',()=>{
 const trigger=document.querySelector('.lhd-mobile-trigger');
 const shade=document.querySelector('.lhd-shade');
 const aside=document.querySelector('.lhd-sidebar');
 const close=()=>{aside?.classList.remove('lhd-open');shade?.classList.remove('lhd-show');document.body.classList.remove('lhd-nav-open')};
 trigger?.addEventListener('click',()=>{aside?.classList.toggle('lhd-open');shade?.classList.toggle('lhd-show');document.body.classList.toggle('lhd-nav-open')});
 shade?.addEventListener('click',close);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 const inp=document.querySelector('section#search input,section#verify-project input');
 const btn=[...document.querySelectorAll('section#search button,section#verify-project button')].find(b=>b.textContent.includes('Search Registry'));
 if(inp&&btn){const result=document.createElement('p');result.style.cssText='font-size:13px;margin-top:12px;color:#0a4a2e';btn.parentElement?.append(result);btn.addEventListener('click',()=>{result.textContent=inp.value.trim()?'Search term: '+inp.value.trim()+'. This offline demonstration cannot confirm live project registry results.':'Enter a project serial number to search.'})}
});
