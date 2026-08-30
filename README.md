# Project EarnPlan

Validation MVP for a Bristol-first two-sided micro-project marketplace concept.

## Product thesis

**Earners:** set an income goal, skills and availability to generate an EarnPlan.

**Businesses:** describe an unfinished problem and receive a clearly scoped micro-project recommendation.

The MVP intentionally uses manual matching. We do **not** build marketplace infrastructure until real transactions validate demand.

## Validation gate

Primary KPI: **completed paid projects**.

Initial target: **10 completed paid Bristol projects**.

Supporting metrics:
- business request conversion
- match acceptance
- completion rate
- repeat-business intent
- average project value
- platform gross margin
- manual operating time per match

## Initial packages

1. Content Rescue
2. Online Presence Fix
3. Website Quick Fix
4. Admin / Spreadsheet Rescue
5. Product / Data Rescue

## Current MVP

Static GitHub Pages-ready site:
- `index.html` — landing page and both funnels
- `styles.css` — responsive premium UI
- `script.js` — EarnPlan generator, business package recommender, pilot demo signup

## Important MVP limitation

Pilot signup data currently uses browser `localStorage` for demo purposes only. It is **not** a production lead capture system. The next backend milestone is connecting the forms to a secure pilot database and notification workflow.

## Compliance principle

The platform must not imply that every user is eligible for every form of work. Work eligibility must be checked before real matching, particularly where immigration/visa or employment-status restrictions apply.

## Build rule

Do not add payments, messaging, ratings, native apps, complex accounts or automated matching until the 10-paid-project validation gate is reached.
