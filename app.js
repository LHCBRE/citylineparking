window.demoData={p1:{available:686},p2:{available:241},p5:{available:112}};
function createBadges(){const c=document.getElementById("map-container");Object.entries(lotConfig).forEach(([lot])=>{const b=document.createElement("div");b.id=`badge-${lot}`;b.className='parking-badge';b.innerHTML='<div class="parking-count">0</div><div class="parking-sub">SPACES</div>';c.appendChild(b);});}
function getStatus(a,c){const r=a/c; if(r>.30)return 'green'; if(r>.10)return 'yellow'; return 'red';}
function animateNumber(el,start,end,duration=800){const st=performance.now(); function step(n){const p=Math.min((n-st)/duration,1); el.textContent=Math.round(start+((end-start)*p)); if(p<1)requestAnimationFrame(step);} requestAnimationFrame(step);}
function updateTimestamp(){document.getElementById('update-time').textContent='Last Updated: '+new Date().toLocaleTimeString();}
function renderMap(){Object.entries(lotConfig).forEach(([lot,cfg])=>{const badge=document.getElementById(`badge-${lot}`); badge.style.left=cfg.x+'%'; badge.style.top=cfg.y+'%'; badge.classList.remove('status-green','status-yellow','status-red'); const av=demoData[lot].available; const status=getStatus(av,cfg.capacity); colorParkingFill(lot,status); badge.classList.add(`status-${status}`); const count=badge.querySelector('.parking-count'); animateNumber(count,parseInt(count.textContent)||0,av);}); updateTimestamp();}
window.renderMap=renderMap;
window.scenarios={normal(){demoData.p1.available=686;demoData.p2.available=241;demoData.p5.available=112;renderMap();},busy(){demoData.p1.available=140;demoData.p2.available=82;demoData.p5.available=37;renderMap();},full(){demoData.p1.available=8;demoData.p2.available=5;demoData.p5.available=2;renderMap();}};
window.randomizeParking=function(){Object.entries(demoData).forEach(([lot,data])=>{data.available=Math.floor(Math.random()*lotConfig[lot].capacity);}); const s=Object.entries(demoData).map(([lot,d])=>getStatus(d.available,lotConfig[lot].capacity)); if(s.every(v=>v===s[0])) demoData.p1.available=Math.floor(lotConfig.p1.capacity*0.08); renderMap();};
createBadges();renderMap(); function colorParkingFill(lot, status) {
 
const colors = {
green: "#31a354",
yellow: "#f4b400",
red: "#d93025"
};
 
const fill =
document.getElementById(
`${lot}-fill`
);
 
if(fill){
fill.style.fill =
colors[status];
}
 
}
