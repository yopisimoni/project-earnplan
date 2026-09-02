# Saudi Work Connect — MVP Operating Workflow

## Purpose
Run a simple, low-cost candidate-to-employer matching service while the product is still validating demand. Candidate applications and employer requirements arrive by email. No Supabase or candidate database is required for this phase.

## Candidate pipeline
1. **New application** — application received from the candidate form.
2. **Basic review** — confirm candidate is 18+, CV is readable, contact details work, experience and preferred field are clear.
3. **Suitable** — candidate appears relevant to at least one real employer requirement.
4. **Employer review** — share only the minimum candidate information needed and only where candidate consent exists.
5. **Interview / employer contact** — employer decides whether to proceed.
6. **Selected** — employer confirms selection.
7. **Official employment process** — employment/work authorization is handled through the applicable lawful employer process.
8. **Placed / Closed / Rejected** — close the candidate case with a clear outcome.

## Employer opportunity pipeline
1. **New employer requirement** — received from `employers.html`.
2. **Identity review** — confirm the business/employer and responsible contact are genuine.
3. **Role review** — confirm job title, city, number needed, salary, schedule, accommodation/transport and requirements.
4. **Process review** — confirm who is responsible for the lawful employment/work authorization process.
5. **Approved for matching** — only after the above checks.
6. **Candidate shortlist** — choose suitable candidates from current applications.
7. **Employer decision** — interview, reject, select or request more profiles.
8. **Closed** — filled, cancelled or expired.

## Non-negotiable safety and trust rules
- Never advertise an unconfirmed vacancy as live or verified.
- Never promise a guaranteed job, visa or work permit.
- Do not request passport scans, national ID, bank details or other sensitive identity documents through the public candidate form.
- Do not charge candidates merely to submit an application.
- Do not share a candidate profile with an employer unless the candidate has consented to recruitment sharing.
- Do not publish employer names, salary claims or benefits until the employer information has been reviewed.

## Minimum information needed before publishing a real vacancy
- Employer/company name
- Responsible contact
- Saudi city
- Job title
- Number of workers required
- Salary in SAR
- Working schedule
- Experience/skills/language requirements
- Accommodation terms
- Transport terms
- Who handles lawful employment/work authorization
- Confirmation that the vacancy is real and authorized

## Current MVP forms
- Candidate intake: `index.html`
- Employer intake: `employers.html`
- Delivery inbox: `helloearnplan@protonmail.com`

## Next product milestone
Once several real vacancies and candidate applications are flowing consistently, migrate the email workflow to a dedicated database and private CV storage. Until then, keep the system simple and validate employer demand first.
