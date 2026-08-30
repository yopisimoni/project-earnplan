const earnForm = document.getElementById('earn-form');
const earnResult = document.getElementById('earnplan-result');
const resultCards = document.getElementById('result-cards');
const resultTitle = document.getElementById('result-title');
const potentialTotal = document.getElementById('potential-total');
const goalTotal = document.getElementById('goal-total');

const projectCatalog = [
  {name:'Content Rescue', value:50, skills:['Social media','Photography','Video','Canva'], time:3, description:'Create a small batch of usable social content for a local business.'},
  {name:'Online Presence Fix', value:35, skills:['Writing','Social media','Admin'], time:2, description:'Help update and organize public business information and content.'},
  {name:'Website Quick Fix', value:50, skills:['WordPress','Writing'], time:2, description:'Complete small website copy, image or link updates.'},
  {name:'Admin Rescue', value:35, skills:['Excel','Admin'], time:2, description:'Clean up a spreadsheet or complete a clearly structured admin task.'},
  {name:'Product/Data Rescue', value:40, skills:['Excel','Admin','Writing'], time:2, description:'Upload, format or organize product and catalogue information.'},
  {name:'Menu / Flyer Refresh', value:30, skills:['Canva','Writing'], time:2, description:'Refresh a simple menu, price list or promotional layout.'}
];

function getSelectedSkills() {
  return [...document.querySelectorAll('input[name="skills"]:checked')].map(el => el.value);
}

function buildEarnPlan(goal, skills, hours) {
  let matches = projectCatalog.filter(project => project.skills.some(skill => skills.includes(skill)));
  if (!matches.length) matches = projectCatalog.slice(0, 3);
  matches = matches.sort((a,b) => b.value - a.value);

  const selected = [];
  let total = 0;
  let usedHours = 0;

  for (const project of matches) {
    if (usedHours + project.time <= hours || selected.length === 0) {
      selected.push(project);
      total += project.value;
      usedHours += project.time;
    }
    if (total >= goal || selected.length >= 4) break;
  }

  if (total < goal && selected.length < 4) {
    for (const project of projectCatalog) {
      if (!selected.find(item => item.name === project.name) && usedHours + project.time <= hours) {
        selected.push(project);
        total += project.value;
        usedHours += project.time;
      }
      if (total >= goal || selected.length >= 4) break;
    }
  }

  return {selected, total, usedHours};
}

earnForm.addEventListener('submit', event => {
  event.preventDefault();
  const goal = Number(document.getElementById('goal').value || 0);
  const skills = getSelectedSkills();
  const hours = Number(document.getElementById('availability').value || 8);
  const plan = buildEarnPlan(goal, skills, hours);

  resultTitle.textContent = `Goal: £${goal}`;
  goalTotal.textContent = `£${goal}`;
  potentialTotal.textContent = `£${plan.total}`;
  resultCards.innerHTML = plan.selected.map(project => `
    <article class="project-card">
      <span>Typical student pay £${project.value}</span>
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <p style="margin-top:10px"><strong>Approx. ${project.time} hrs</strong></p>
    </article>
  `).join('');
  earnResult.classList.remove('hidden');
  earnResult.scrollIntoView({behavior:'smooth', block:'start'});
});

const businessForm = document.getElementById('business-form');
const projectResult = document.getElementById('project-result');
const packageName = document.getElementById('package-name');
const packagePrice = document.getElementById('package-price');
const packageSummary = document.getElementById('package-summary');
const packageDeliverables = document.getElementById('package-deliverables');

const businessPackages = {
  content: {
    name:'Content Rescue', price:'£59',
    summary:'A compact content package for a local business that needs fresh usable material without hiring an agency.',
    deliverables:['10 usable photos','3 short-form video clips','5 caption drafts','Organized delivery folder']
  },
  presence: {
    name:'Online Presence Fix', price:'£45',
    summary:'A focused cleanup of public-facing business information and lightweight content preparation.',
    deliverables:['Profile information audit','Suggested description updates','Photo/content organization','Simple improvement checklist']
  },
  website: {
    name:'Website Quick Fix', price:'£49–£79',
    summary:'A small website maintenance task with a fixed scope—not a redesign or development project.',
    deliverables:['Up to 3 small content edits','Image or link replacements','Basic mobile/content check','Completion summary']
  },
  admin: {
    name:'Admin / Spreadsheet Rescue', price:'£39–£59',
    summary:'A clearly defined admin task for work that keeps sitting at the bottom of the to-do list.',
    deliverables:['Up to ~2 hours structured admin','Formatting or spreadsheet cleanup','Organized final file','Short handover note']
  },
  data: {
    name:'Product / Data Rescue', price:'£39–£69',
    summary:'Structured help with repetitive product, catalogue or data maintenance work.',
    deliverables:['Defined batch of product/data updates','Formatting consistency check','Missing-field flagging','Completion summary']
  }
};

businessForm.addEventListener('submit', event => {
  event.preventDefault();
  const type = document.getElementById('problem-type').value;
  const pkg = businessPackages[type];
  packageName.textContent = pkg.name;
  packagePrice.textContent = pkg.price;
  packageSummary.textContent = pkg.summary;
  packageDeliverables.innerHTML = pkg.deliverables.map(item => `<li>${item}</li>`).join('');
  projectResult.classList.remove('hidden');
  projectResult.scrollIntoView({behavior:'smooth', block:'start'});
});

const pilotForm = document.getElementById('pilot-form');
const pilotMessage = document.getElementById('pilot-message');
const pilotSubmitButton = pilotForm.querySelector('button[type="submit"]');

pilotForm.addEventListener('submit', async event => {
  event.preventDefault();

  const payload = {
    _subject: 'New EarnPlan Bristol pilot signup',
    _template: 'table',
    lead_type: document.getElementById('pilot-type').value,
    name: document.getElementById('pilot-name').value.trim(),
    email: document.getElementById('pilot-email').value.trim(),
    area: document.getElementById('pilot-area').value.trim(),
    consent: 'Agreed to be contacted about the Bristol pilot',
    source: 'project-earnplan GitHub Pages',
    submitted_at: new Date().toISOString()
  };

  pilotSubmitButton.disabled = true;
  pilotSubmitButton.textContent = 'Sending…';
  pilotMessage.textContent = 'Sending your pilot signup…';

  try {
    const response = await fetch('https://formsubmit.co/ajax/helloearnplan@protonmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Submission failed');

    pilotForm.reset();
    pilotMessage.textContent = 'Thanks — your pilot signup was sent. If this is the first submission, the EarnPlan inbox must confirm the one-time FormSubmit activation email before leads are forwarded.';

    setTimeout(() => {
      window.location.href = 'thanks.html';
    }, 1800);
  } catch (error) {
    pilotMessage.textContent = 'We could not send your signup right now. Please try again.';
  } finally {
    pilotSubmitButton.disabled = false;
    pilotSubmitButton.innerHTML = 'Join the pilot <span>→</span>';
  }
});
