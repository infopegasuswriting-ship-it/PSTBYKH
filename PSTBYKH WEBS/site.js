const products=[
 {id:'history',type:'History',name:'Constitutional History',detail:'1947–1973 · key changes and answer practice',price:850,preview:'Build a chronological outline, then explain how each constitutional change affected political power.'},
 {id:'geo',type:'Geography',name:'Climate & Agriculture',detail:'Climate patterns and their effect on farming',price:750,preview:'Identify the pattern, name the geographical factor, then explain its effect on farming.'},
 {id:'bundle',type:'Bundles',name:'Pakistan Studies Bundle',detail:'Constitutional History + Climate & Agriculture',price:1350,preview:'Includes both topic packs. Illustrative saving against buying the two packs separately: PKR 250.'}
];
const $=id=>document.getElementById(id);
const dialog=$('dialog'),detail=$('detail'),key='pst-preview-bag';
let bag=[];
try{const saved=JSON.parse(localStorage.getItem(key));if(Array.isArray(saved))bag=[...new Set(saved.filter(id=>products.some(p=>p.id===id)))];}catch{}
const money=n=>'PKR '+n.toLocaleString('en-PK');
function save(){
 try{localStorage.setItem(key,JSON.stringify(bag));}catch{}
 $('count').textContent=bag.length;
}
function open(title,html){
 $('dialog-title').textContent=title;detail.innerHTML=html;
 if(!dialog.open)dialog.showModal();
}
function render(filter='All'){
 $('filters').innerHTML=['All','History','Geography','Bundles'].map(f=>'<button data-filter="'+f+'" aria-pressed="'+(f===filter)+'">'+f+'</button>').join('');
 $('products').innerHTML=products.filter(p=>filter==='All'||p.type===filter).map(p=>'<article class="product"><div class="cover"><p class="mono">'+p.type.toUpperCase()+' / PDF</p><strong>'+p.name+'</strong></div><div class="pad"><h3>'+p.name+'</h3><p>'+p.detail+'</p><p><strong>'+money(p.price)+'</strong></p><button data-preview="'+p.id+'">View pack ↗</button></div></article>').join('');
}
function showBag(){
 const list=products.filter(p=>bag.includes(p.id));
 open('Your bag',list.length?list.map(p=>'<div class="line"><div>'+p.name+'<br><strong>'+money(p.price)+'</strong></div><button class="quiet" data-remove="'+p.id+'">Remove</button></div>').join('')+'<p><strong>Total '+money(list.reduce((s,p)=>s+p.price,0))+'</strong></p><button class="action" data-review>Review order</button>':'<p>Your bag is empty.</p>');
}
document.addEventListener('click',event=>{
 const el=event.target.closest('button,a');if(!el)return;
 const d=el.dataset;
 if(d.filter||d.filterLink){render(d.filter||d.filterLink);if(d.filter)$('filters').querySelector('[aria-pressed=true]').focus();}
 if(el.id==='bag'||el.id==='back-to-bag')showBag();
 if(d.preview){
  const p=products.find(p=>p.id===d.preview);
  open(p.name,'<p>'+p.detail+'</p><p>'+p.preview+'</p><p><strong>'+money(p.price)+'</strong></p><button class="action" data-add="'+p.id+'">Add to bag</button>');
 }
 if(d.add){
  if(d.add==='bundle')bag=['bundle'];
  else if(!bag.includes('bundle')&&!bag.includes(d.add))bag.push(d.add);
  $('status').textContent=bag.includes('bundle')&&d.add!=='bundle'?'This pack is included in your bundle.':'Bag updated.';
  save();showBag();
 }
 if(d.remove){bag=bag.filter(id=>id!==d.remove);save();showBag();}
 if('review' in d){
  const list=products.filter(p=>bag.includes(p.id));
  open('Review order','<ul>'+list.map(p=>'<li>'+p.name+' — '+money(p.price)+'</li>').join('')+'</ul><p><strong>Total '+money(list.reduce((s,p)=>s+p.price,0))+'</strong></p><p class="notice">This is a preview. Ordering, payment and PDF delivery are awaiting setup.</p><button class="action" id="back-to-bag">Back to bag</button>');
 }
});
const videos=[...document.querySelectorAll('video')];
for(const video of videos)video.addEventListener('play',()=>videos.filter(v=>v!==video).forEach(v=>v.pause()));
const desk=document.querySelector('iframe');
desk.addEventListener('load',()=>{const body=desk.contentDocument?.body;if(!body)return;const size=()=>desk.style.height=Math.ceil(body.offsetHeight)+'px';size();new ResizeObserver(size).observe(body);});
render();save();

