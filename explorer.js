document.addEventListener('DOMContentLoaded',()=>{
 const wards=window.LHD_WARDS||[],projects=window.LHD_PROJECTS||[];
 const $=id=>document.getElementById(id);
 const categories=[...new Set(projects.map(p=>p.category))].sort();
 const statuses=[...new Set(projects.map(p=>p.status))].sort();
 const desc={Adakawa:'Community development and drainage-related project records.', 'Bakin Ruwa':'Explore public works and community facilities in Bakin Ruwa.',Dala:'Historic heart of Dala with community development priorities.','Dogon Nama':'Explore documented public projects in Dogon Nama.',Gobirawa:'Education and water-related projects are represented in the supplied records.',Gwammaja:'Road rehabilitation is featured among the supplied projects.',Kabuwaya:'Explore documented infrastructure and public services in Kabuwaya.',Kantudu:'Healthcare renovation is included in the existing project slideshow.','Kofar Mazugal':'The supplied photographs include a clinic renovation project.','Kofar Ruwa':'School construction is included among the documented projects.',Madigawa:'Explore local community development projects in Madigawa.',Yalwa:'Explore local facilities and public works in Yalwa.'};
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normalize=x=>String(x??'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const params=new URLSearchParams(location.search);
 function fill(select,values){if(!select)return;values.forEach(x=>select.add(new Option(x,x)));}
 function imageFor(ward){let p=projects.find(x=>x.ward===ward && x.image);return p?.image||'assets/project-photos/constituency-project-building.jpg';}
 function matching({query='',ward='',year='',category='',status='',categories:chosen=null}={}){
  const terms=normalize(query).split(' ').filter(Boolean);
  return projects.filter(p=>{
   const hay=normalize([p.name,p.id,p.ward,p.category,p.description,p.status,p.year].join(' '));
   return terms.every(t=>hay.includes(t))&&(!ward||p.ward===ward)&&(!year||String(p.year)===String(year))&&(!category||p.category===category)&&(!status||p.status===status)&&(!chosen||chosen.includes(p.category));
  });
 }
 function cards(list,target,count){if(!target)return;target.innerHTML=list.length?list.map(p=>`<article class="lhd-project-card">${p.image?`<img loading="lazy" src="${esc(p.image)}" alt="Supplied project documentation photograph"/>`:`<div style="height:90px;background:#e8eee9;display:flex;align-items:center;justify-content:center;color:#456452;font-size:12px">Photograph not confirmed</div>`}<div class="lhd-project-body"><span class="lhd-pill">${esc(p.category)}</span><h3>${esc(p.name)}</h3><p><strong>Ward:</strong> ${esc(p.ward||'Ward not confirmed')} · <strong>Year:</strong> ${esc(p.year||'Not recorded')}</p><p>${esc(p.description)}</p><p><strong>Reference:</strong> ${esc(p.id)}</p><p><strong>Record status:</strong> ${esc(p.status)}</p></div></article>`).join(''):'<div class="lhd-empty">No matching project records found. Try another ward, year, category or search term. This does not mean no projects exist in that ward.</div>';
 if(count)count.textContent=`${list.length} matching project record${list.length!==1?'s':''}`;
 }
 if($('lhd-ward-grid')){
  $('lhd-ward-grid').innerHTML=wards.map(w=>{let n=projects.filter(p=>p.ward===w).length;return `<a class="lhd-ward-tile" href="search.html?ward=${encodeURIComponent(w)}"><img loading="lazy" src="${esc(imageFor(w))}" alt="Illustrative community project photograph"/><div class="lhd-ward-inner"><strong>${esc(w)}</strong><span class="muted">${esc(desc[w])}</span><span class="lhd-pill">${n} available record${n!==1?'s':''}</span><span style="display:block;margin-top:10px;color:#0a4a2e;font-size:12px;font-weight:700">Explore projects →</span></div></a>`}).join('');
 }
 fill($('lhd-search-ward'),wards);fill($('map-ward'),wards);
 fill($('lhd-search-category'),categories);fill($('lhd-search-status'),statuses);
 const years=Array.from({length:28},(_,i)=>1999+i);
 fill($('lhd-search-year'),years);fill($('map-year'),years);
 if($('lhd-search-form')){
  let q=$('lhd-query'),w=$('lhd-search-ward'),y=$('lhd-search-year'),c=$('lhd-search-category'),s=$('lhd-search-status');
  q.value=params.get('q')||'';if(wards.includes(params.get('ward')))w.value=params.get('ward');
  if(params.has('year'))y.value=params.get('year');
  function render(){cards(matching({query:q.value,ward:w.value,year:y.value,category:c.value,status:s.value}),$('lhd-search-results'),$('lhd-search-count'));}
  $('lhd-search-form').addEventListener('submit',e=>{e.preventDefault();render();});
  q.addEventListener('input',render);[w,y,c,s].forEach(el=>el.addEventListener('change',render));
  $('lhd-clear').addEventListener('click',()=>{q.value='';[w,y,c,s].forEach(el=>el.value='');history.replaceState(null,'',location.pathname);render();});render();
 }
 if($('lhd-ward-schematic')){
  let mw=$('map-ward'),my=$('map-year'),box=$('map-categories');
  box.innerHTML=`<label><input type="checkbox" value="all" checked/> All categories</label>`+categories.map(c=>`<label><input type="checkbox" value="${esc(c)}"/> ${esc(c)}</label>`).join('');
  $('lhd-ward-schematic').innerHTML=wards.map(w=>`<button type="button" class="lhd-marker" data-ward="${esc(w)}"><strong>${esc(w)}</strong><span>${projects.filter(p=>p.ward===w).length} project record(s)</span><small>View ward →</small></button>`).join('');
  let active=[];
  function render(){let list=matching({ward:mw.value,year:my.value,categories:active.length?active:null});cards(list,$('lhd-map-results'),$('lhd-map-count'));$('lhd-ward-schematic').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.ward===mw.value));}
  box.addEventListener('change',e=>{
   const all=box.querySelector('input[value="all"]');
   if(e.target===all){if(all.checked){box.querySelectorAll('input:not([value="all"])').forEach(x=>x.checked=false);active=[];}else{all.checked=true;active=[];}}
   else {active=[...box.querySelectorAll('input:not([value="all"]):checked')].map(x=>x.value);all.checked=!active.length;}
   render();
  });
  $('lhd-ward-schematic').addEventListener('click',e=>{const b=e.target.closest('[data-ward]');if(!b)return;mw.value=mw.value===b.dataset.ward?'':b.dataset.ward;render();});
  mw.addEventListener('change',render);my.addEventListener('change',render);render();
 }
 // Header search, if present, routes to the live searchable registry.
 document.querySelectorAll('input[type="search"]').forEach(input=>{
  if(input.id==='lhd-query')return;
  const form=input.closest('form');if(form&&!form.id){form.addEventListener('submit',e=>{e.preventDefault();location.href='search.html?q='+encodeURIComponent(input.value);});}
 });
});
