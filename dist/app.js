const state = {category:'All categories', query:'', sort:'highest', type:'all'};
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const catalog = window.CATALOG.filter(p=>p.price!=='Exclude');
const categories = [...new Set(catalog.map(p=>p.category))].sort();
const categoryRank = p => 1+catalog.filter(other=>other.category===p.category&&other.score>p.score).length;
const kind = p => p.price.includes('self-hosted')?'selfhost':p.price==='Usage-priced'?'usage':'hosted';
function renderCategories(){document.getElementById('categories').innerHTML=['All categories',...categories].map(name=>`<button class="category-button" aria-pressed="${state.category===name}" data-category="${escapeHtml(name)}"><span>${escapeHtml(name)}</span><span class="category-count">${name==='All categories'?catalog.length:catalog.filter(p=>p.category===name).length}</span></button>`).join('');}
function render(){
 let items=catalog.filter(p=>(state.category==='All categories'||p.category===state.category)&&(state.type==='all'||kind(p)===state.type)&&`${p.name} ${p.category} ${p.product} ${p.summary}`.toLowerCase().includes(state.query.toLowerCase().trim()));
 items.sort((a,b)=>state.sort==='name'?a.name.localeCompare(b.name):state.sort==='category'?a.category.localeCompare(b.category)||b.score-a.score||a.name.localeCompare(b.name):(state.sort==='lowest'?a.score-b.score:b.score-a.score)||a.name.localeCompare(b.name));
 document.getElementById('total').textContent=catalog.length;
 document.getElementById('category-title').textContent=state.category;
 document.getElementById('count').textContent=`${items.length} ${items.length===1?'product':'products'}`;
 document.getElementById('empty').hidden=items.length>0;
 document.getElementById('results').innerHTML=items.map(p=>`<article class="product"><div class="product-main"><div class="monogram" aria-hidden="true">${escapeHtml(p.name.replace(/^Microsoft |^Google /,'').slice(0,2))}</div><div><div class="product-title"><a href="${escapeHtml(p.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.name)} <span class="external" aria-label="opens official source in new tab">↗</span></a></div><p class="product-category">${escapeHtml(p.category)} / ${escapeHtml(p.product)}</p><p class="description">${escapeHtml(p.summary)}</p></div><div class="score" aria-label="Draft editorial score ${p.score} out of 100"><span class="score-value">${p.score}</span><span class="score-max"> /100</span><div class="score-track" aria-hidden="true"><span style="width:${p.score}%"></span></div><div class="rank">#${categoryRank(p)} in category</div></div></div><div class="product-bottom"><span class="pill">${escapeHtml(p.tier)}</span>${kind(p)!=='hosted'?`<span class="pill">${kind(p)==='selfhost'?'Self-hosted':'Usage fees apply'}</span>`:''}<details><summary>Score breakdown</summary><div class="breakdown">${['Permanence','Capacity','Features','Commercial fit','No card'].map((label,i)=>`<span>${label}<strong>${p.dimensions[i]}/4</strong></span>`).join('')}</div></details></div></article>`).join('');
}
document.getElementById('categories').addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;state.category=button.dataset.category;renderCategories();render();});
document.getElementById('search').addEventListener('input',e=>{state.query=e.target.value;render();});
document.getElementById('sort').addEventListener('change',e=>{state.sort=e.target.value;render();});
document.getElementById('type').addEventListener('change',e=>{state.type=e.target.value;render();});
document.getElementById('reset').addEventListener('click',()=>{Object.assign(state,{category:'All categories',query:'',type:'all',sort:'highest'});document.getElementById('search').value='';document.getElementById('type').value='all';document.getElementById('sort').value='highest';renderCategories();render();});
renderCategories();render();
