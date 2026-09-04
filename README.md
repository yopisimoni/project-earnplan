# Project EarnPlan / Saudi Work Connect

This repository currently preserves two separate product experiments. They should not be mixed operationally.

## Active project: Saudi Work Connect

The current validation focus is **Saudi Work Connect**, located in [`saudi-work/`](./saudi-work/).

Saudi Work Connect is a bilingual Arabic/English candidate-interest and employer-intake MVP for legitimate Saudi employment opportunities. It is designed to validate a simple path:

**verified employer requirement → adult candidate application → consented matching → employer decision → official employment process**

### Current Saudi Work Connect MVP

- `saudi-work/index.html` — bilingual adult candidate intake and CV submission
- `saudi-work/employers.html` — employer vacancy/worker-requirement intake
- `saudi-work/candidate-safety.html` — candidate safety guidance
- `saudi-work/vacancy-verification.html` — vacancy verification standard
- `saudi-work/privacy.html` — privacy information
- `saudi-work/terms.html` — terms
- `saudi-work/about.html` — operating model and disclosures
- `saudi-work/contact.html` — contact information
- `saudi-work/OPERATIONS.md` — manual MVP operating workflow

### Saudi Work Connect guardrails

- Candidate intake is for adults aged 18+ only.
- No job, visa, work-permit or placement guarantee.
- Do not request passport scans, national ID or bank details through the initial candidate form.
- Do not share candidate information with employers without recruitment-sharing consent.
- Do not publish or promote a vacancy until the employer and role are reviewed.
- Candidate application remains free.
- Official Saudi HRSD guidance states that the employer bears recruitment fees for non-Saudi workers as well as residence/work-permit fees and related renewals under Labor Law Article 40.
- Final employment terms and the employment process must use the applicable official Saudi channels; HRSD provides contract management/documentation through Qiwa.

Official HRSD references:
- https://www.hrsd.gov.sa/en/knowledge-centre/articles/64434-0
- https://www.hrsd.gov.sa/en/ministry-services/services/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%B9%D9%82%D9%88%D8%AF

### Current validation milestone

Do not add accounts, payments, a public vacancy marketplace or large candidate infrastructure until the manual workflow proves demand.

First proof target:
1. one verified Saudi employer requirement;
2. at least three suitable adult candidates reviewed with consent;
3. at least one candidate reaches employer review/interview;
4. the outcome is recorded clearly without a job/visa guarantee.

The active GitHub control issue is **#3 — Saudi Work Connect launch gate**.

---

## Parked experiment: EarnPlan

EarnPlan is a UK-focused personal earning planner. It helps people turn an income target, deadline, skills and practical constraints into a ranked earning plan.

Its planner MVP remains in the repository root:
- `index.html`
- `styles.css`
- `script.js`
- `privacy.html`

The previous EarnPlan validation issues are closed while Saudi Work Connect is the active project. Do not restart EarnPlan expansion unless it is explicitly resumed.
