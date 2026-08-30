const form = document.getElementById('earn-form');
const results = document.getElementById('results');
const cards = document.getElementById('result-cards');
const resultTitle = document.getElementById('result-title');
const resultSummary = document.getElementById('result-summary');
const actionList = document.getElementById('action-list');
const visaWarning = document.getElementById('visa-warning');

// Privacy-friendly MVP measurement. Events stay in this browser only until a
// consent-aware analytics backend is deliberately connected.
const METRICS_KEY = 'earnplan_mvp_events_v1';
function track(event, data={}){
  try {
    const events = JSON.parse(localStorage.getItem(METRICS_KEY) || '[]');
    events.push({event, at:new Date().toISOString(), ...data});
    localStorage.setItem(METRICS_KEY, JSON.stringify(events.slice(-250)));
  } catch (_) {}
}

let plannerStarted = false;
form.addEventListener('input', ()=>{
  if(!plannerStarted){
    plannerStarted = true;
    track('planner_started');
  }
}, {once:true});

const wageConfig = {
  '16-17': 8.00,
  '18-20': 10.85,
  '21+': 12.71
};

const routes = [
  {id:'tutoring',name:'Tutoring',type:'either',age:['16-17','18-20','21+'],skills:['academic','language'],earnings:[12,25],speed:[3,14],startup:0,flexibility:9,access:8,requires:[],selfEmployment:true,actions:['Choose one subject you can confidently teach.','Create a simple one-paragraph offer with level, availability and price range.','Apply through legitimate tutoring channels or ask local schools/university groups where permitted.']},
  {id:'campus',name:'Campus / university work',type:'local',age:['18-20','21+'],skills:['admin','service','academic'],earnings:[11,16],speed:[5,21],startup:0,flexibility:8,access:8,requires:[],selfEmployment:false,actions:['Check your university careers portal and student union vacancies.','Apply to the 3 best-fit roles today.','Set a reminder to follow up on applications in 5–7 days.']},
  {id:'hospitality',name:'Retail / hospitality / event shifts',type:'local',age:['16-17','18-20','21+'],skills:['service','practical'],earnings:[8,15],speed:[2,14],startup:0,flexibility:7,access:9,requires:[],selfEmployment:false,actions:['Search nearby retailers, cafés, hotels and event staffing firms.','Prepare a one-page CV focused on reliability and availability.','Apply to at least 5 suitable openings, prioritising roles with immediate starts.']},
  {id:'freelance',name:'Freelance digital work',type:'online',age:['18-20','21+'],skills:['writing','design','web','video','social','admin','language'],earnings:[12,35],speed:[7,30],startup:0,flexibility:10,access:5,requires:['laptop'],selfEmployment:true,actions:['Pick one narrow service you can deliver in a few hours.','Create one sample or mini-portfolio item.','Pitch 5 relevant small businesses or use a legitimate freelance platform if eligible.']},
  {id:'localdigital',name:'Local business digital help',type:'either',age:['18-20','21+'],skills:['design','web','social','admin','writing','video'],earnings:[15,40],speed:[3,21],startup:0,flexibility:9,access:6,requires:['phone'],selfEmployment:true,actions:['Choose one clear offer such as menu updates, social content or website fixes.','Find 10 local businesses with an obvious small problem you can solve.','Send 3 personalised offers with a clear fixed scope.']},
  {id:'research',name:'Paid research / user studies',type:'online',age:['18-20','21+'],skills:[],earnings:[8,25],speed:[2,21],startup:0,flexibility:10,access:5,requires:['phone'],selfEmployment:false,actions:['Register only with reputable research-study providers.','Complete your profile honestly and fully.','Treat this as supplementary income, not a dependable monthly plan.']},
  {id:'petcare',name:'Pet care / local services',type:'local',age:['18-20','21+'],skills:['practical','service'],earnings:[10,20],speed:[3,14],startup:0,flexibility:8,access:7,requires:[],selfEmployment:true,actions:['Choose one simple local service you can perform safely and reliably.','Start with people or community networks that can verify you.','Agree scope, timing and payment clearly before starting.']},
  {id:'translation',name:'Translation / language support',type:'online',age:['18-20','21+'],skills:['language','writing'],earnings:[12,30],speed:[5,30],startup:0,flexibility:9,access:6,requires:['laptop'],selfEmployment:true,actions:['Choose the language pair and type of work you can genuinely handle.','Prepare a short sample.','Apply to legitimate translation opportunities or pitch small fixed-scope jobs.']}
];

function selected(name){ return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value); }
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function midpoint(range){ return (range[0]+range[1])/2; }
function effectiveEarnings(route, age){
  if(route.selfEmployment) return route.earnings;
  const floor = wageConfig[age] || 0;
  return [Math.max(route.earnings[0],floor), Math.max(route.earnings[1],floor)];
}

function scoreRoute(route, profile){
  if(!route.age.includes(profile.age)) return {...route,score:35,reality:'red',reason:'Age eligibility may limit this route.',effectiveEarnings:route.earnings};
  if(profile.visa && route.selfEmployment) return {...route,score:45,reality:'amber',reason:'Potential visa/work-rights restriction: check your conditions before considering self-employed work.',effectiveEarnings:route.earnings};
  if(profile.preference !== 'either' && route.type !== 'either' && route.type !== profile.preference) return {...route,score:48,reality:'amber',reason:`This route does not match your ${profile.preference}-only preference.`,effectiveEarnings:effectiveEarnings(route,profile.age)};

  const earnings = effectiveEarnings(route,profile.age);
  const weeks = Math.max(profile.deadline/7,1);
  const totalHours = profile.hours * weeks;
  const hourly = midpoint(earnings);
  const potential = hourly * totalHours;
  const incomeFit = clamp((potential / Math.max(profile.goal,1))*100,25,100);
  const skillMatches = route.skills.length ? route.skills.filter(s=>profile.skills.includes(s)).length : 1;
  const skillRatio = route.skills.length ? skillMatches/Math.min(route.skills.length,2) : .7;
  let access = route.access*10;
  access += skillRatio*18;
  if(route.requires.every(r=>profile.resources.includes(r))) access += 8;
  else if(route.requires.length) access -= 18;
  if(route.type==='local' && profile.transport==='none') access -= 10;
  access = clamp(access,20,100);
  const speedDays = midpoint(route.speed);
  const speed = clamp(100-(speedDays/profile.deadline)*70,20,100);
  const flexibility = route.flexibility*10;
  const friction = clamp(100-route.startup*4-route.requires.filter(r=>!profile.resources.includes(r)).length*25,20,100);
  const score = Math.round(incomeFit*.30+access*.25+speed*.20+flexibility*.15+friction*.10);
  const reality = score>=80?'green':score>=60?'amber':'red';
  const why=[];
  if(skillMatches) why.push('matches your existing skills');
  if(speed>=75) why.push('can potentially start relatively quickly');
  if(route.startup===0) why.push('low startup cost');
  if(route.type==='either'||route.type===profile.preference||profile.preference==='either') why.push('fits your work preference');
  const reason = why.length ? why.slice(0,2).join(' and ') : 'possible, but the fit is weaker for your current constraints';
  return {...route,score,reality,reason,effectiveEarnings:earnings};
}

function moneyRange(route){ const e=route.effectiveEarnings||route.earnings; return `£${e[0].toFixed(2).replace('.00','')}–£${e[1].toFixed(2).replace('.00','')}/hr`; }
function speedRange(route){ return `${route.speed[0]}–${route.speed[1]} days`; }
function hoursNeeded(route,goal){ const e=route.effectiveEarnings||route.earnings; return Math.ceil(goal/Math.max(midpoint(e),1)); }
function realityLabel(x){ return x==='green'?'Realistic fit':x==='amber'?'Possible / uncertain':'Weak fit'; }

form.addEventListener('submit', e=>{
  e.preventDefault();
  const profile={goal:Number(document.getElementById('goal').value||0),deadline:Number(document.getElementById('deadline').value||30),age:document.getElementById('age').value,location:document.getElementById('location').value.trim(),hours:Number(document.getElementById('hours').value||8),skills:selected('skills'),resources:selected('resources'),preference:document.getElementById('preference').value,transport:document.getElementById('transport').value,visa:document.getElementById('visa').checked};
  const ranked=routes.map(r=>scoreRoute(r,profile)).sort((a,b)=>b.score-a.score).slice(0,5);
  track('plan_generated',{age_band:profile.age,deadline_days:profile.deadline,hours_per_week:profile.hours,preference:profile.preference,top_route:ranked[0]?.id,top_score:ranked[0]?.score});
  resultTitle.textContent=`£${profile.goal} target · ${profile.deadline} days`;
  resultSummary.textContent=`Based on ${profile.hours} hours/week in ${profile.location || 'your area'}, here are your strongest current routes.`;
  cards.innerHTML=ranked.map((r,i)=>`<article class="route-card" data-route="${r.id}"><div class="route-top"><div><span class="rank">#${i+1}</span><h3>${r.name}</h3></div><div class="score score-${r.reality}"><strong>${r.score}</strong><small>EarnScore</small></div></div><p class="fit-reason">${r.reason.charAt(0).toUpperCase()+r.reason.slice(1)}.</p><div class="metrics"><div><span>Typical estimate</span><strong>${moneyRange(r)}</strong></div><div><span>Approx. hours for target</span><strong>~${hoursNeeded(r,profile.goal)} hrs</strong></div><div><span>Time to first income</span><strong>${speedRange(r)}</strong></div><div><span>Startup cost</span><strong>£${r.startup}</strong></div></div><div class="reality reality-${r.reality}"><span></span>${realityLabel(r.reality)}</div><ol>${r.actions.map((a,j)=>`<li><button type="button" class="action-track" data-route="${r.id}" data-action="${j+1}">${a}</button></li>`).join('')}</ol></article>`).join('');
  const top=ranked.slice(0,3);
  actionList.innerHTML=`<li>Start with <strong>${top[0].name}</strong> today. Complete its first action before researching more options.</li><li>Use <strong>${top[1].name}</strong> as your backup route so your plan does not depend on one opportunity.</li><li>Review progress after 7 days. If there is no traction, shift time toward <strong>${top[2].name}</strong> rather than adding random side hustles.</li>`;
  visaWarning.classList.toggle('hidden',!profile.visa);
  results.classList.remove('hidden');
  results.scrollIntoView({behavior:'smooth',block:'start'});
});

cards.addEventListener('click', e=>{
  const btn=e.target.closest('.action-track');
  if(!btn) return;
  track('recommended_action_clicked',{route:btn.dataset.route,action:Number(btn.dataset.action)});
});

track('planner_viewed');
