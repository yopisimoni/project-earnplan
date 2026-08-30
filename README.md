# EarnPlan

EarnPlan is a UK-focused personal earning planner. It helps people turn an income target, deadline, skills and practical constraints into a ranked, realistic earning plan.

## Product thesis

Most job boards answer: **What jobs exist?**

EarnPlan answers: **What is the fastest realistic earning route for me, given my target and constraints?**

UK students are the initial wedge, but the underlying product is a broader personal earning planner.

## Core MVP flow

1. Set an income target.
2. Choose a deadline and age band.
3. Add UK location and weekly availability.
4. Select existing skills and resources.
5. Add online/local and travel constraints.
6. Generate 3–5 ranked earning routes using EarnScore.
7. Follow a concrete action plan.
8. Rate whether the plan was useful.

## EarnScore v1

EarnScore is a deterministic fit score, not a guarantee of work or income.

Current weighting:
- income fit: 30%
- accessibility: 25%
- speed: 20%
- schedule flexibility: 15%
- startup friction: 10%

The score is adjusted for skills, age eligibility, equipment/resources, transport, work preference and deadline.

## Initial route catalogue

Current MVP routes include:
- tutoring
- campus/university work
- retail, hospitality and event shifts
- freelance digital work
- local business digital help
- paid research/user studies
- pet care/local services
- translation/language support

## Guardrails

EarnPlan must not:
- imply guaranteed earnings or guaranteed work
- invent job vacancies
- recommend work the user is not legally eligible to perform
- give personalized legal, tax or immigration advice
- recommend gambling, speculative trading, adult content, dangerous work or get-rich-quick schemes

International students receive an explicit work-rights warning because some visa conditions may restrict hours or prohibit self-employment.

## UK wage configuration

Current reference values from April 2026:
- age 21+: £12.71/hour
- age 18–20: £10.85/hour
- age 16–17: £8.00/hour

These are reference values only. Actual pay and legal eligibility depend on the role and circumstances.

## First-10 validation

The live site now explicitly recruits the first 10 UK testers and asks for post-plan feedback.

Initial smoke-test pass criteria:
- at least 8/10 complete the planner
- at least 6/10 rate it Useful or Somewhat useful
- at least 3/10 click a recommended action
- no severe eligibility/safety mismatch
- no major mobile usability blocker

Recruitment should stay small and targeted. Suitable outreach targets include university careers teams, student employment services and student unions that already help students find part-time work. Do not mass-email or spam communities.

## Full validation target

Before building marketplace infrastructure, prove:
- 50 completed plans
- >=60% planner completion
- >=25% action/opportunity engagement
- >=10 users voluntarily leave email for updates once a proper opt-in exists
- qualitative feedback that recommendations feel specific and useful

## Current MVP

Static GitHub Pages site:
- `index.html` — planner-first landing page, first-10 recruitment banner and results experience
- `styles.css` — responsive premium UI
- `script.js` — EarnScore, route ranking, browser-local measurement and feedback capture
- `privacy.html` — privacy information

## Current priority

P0: run the first-10 validation test. Freeze marketplace, payments, accounts and other product complexity until the test gives a clear signal.
