# Landing-page conversion diagnosis

Use this file whenever the target is a live landing page, a landing-page redesign, or a request to improve landing-page copy. It is a diagnosis order, not a section template.

Source model: Richard, [“Um framework para descobrir por que uma LP não converte”](https://x.com/richardrx/status/2089755232511123628), published on X on 2026-08-18 and accessed on 2026-08-20. The delivery gate below adds the crawler/user check required by this skill.

## 0. Prove that the page is deliverable

Before changing copy, open the deployed URL twice with browser automation:

1. **Real user:** the normal browser user agent at the page's supported desktop and mobile widths.
2. **Rendered Googlebot:** Googlebot Smartphone user agent at a mobile viewport, with JavaScript enabled.

Capture the response status and final URL, screenshot, console errors and warnings, failed requests, title, H1, main-content word count, primary CTA, forms, and load/CWV measurements. Compare critical content between profiles. The H1, primary value proposition, CTA destination, and form must not disappear or materially change for the bot. Keep the raw HTTP bot fetch from `site-audit` too; a rendered bot browser does not replace raw-HTML indexing checks.

Then complete a non-destructive real-user conversion smoke:

- Activate the primary CTA and verify its destination or resulting state.
- Fill every conversion field with safe test data, blur each field, and verify labels, validation, error recovery, focus, and a valid pre-submit state.
- Do not send a real lead or notify anyone without explicit authorization. If submission is not authorized, stop immediately before the network-writing action and mark delivery as unverified.
- Record JavaScript failures, layout collapse, slow LCP/INP, and form defects before evaluating wording.

If either profile is blocked, broken, materially divergent, or missing the conversion path, fix that delivery defect first. Sitemap and meta tags can help discovery, but they do not rescue a page that users or crawlers cannot use.

Run the live procedure through `$site-audit`; its `references/landing-conversion.md` owns the evidence format and pass/fail rules.

## 1. Lock acquisition context

Record the traffic source, promise made before the click, device mix, first-touch versus returning traffic, and the primary conversion. Check continuity between the ad, query, outbound message, referral, or founder post and the landing page. A mismatch here is not a copy-style problem.

## 2. Lock the ICP

Name the job, problem, operating context, cost of the problem, buying role, company or user shape, acceptable commitment, and meaningful segment boundaries. “B2B companies with 10–500 employees” is not specific enough to direct one page.

## 3. Lock awareness

Classify the dominant arrival state:

- **Unaware or weakly aware:** make the current problem and its impact legible before introducing the solution.
- **Problem-aware:** connect pain, impact, opportunity, mechanism, solution, proof, offer, and objections.
- **Solution-aware:** move quickly to mechanism, differentiation, proof, and the reason to choose this option.

One company may need different pages by channel, segment, and awareness level.

## 4. Test the message

Run a five-second test on the first screen: what is sold, for whom, which problem or result matters, and why this page continues the pre-click promise. Reject category fog such as “all-in-one,” “next-generation AI,” or “transform your business.”

## 5. Trace the sales narrative

Read the page as a progression, not a stack of sections. A useful default is:

`problem -> consequence -> opportunity -> mechanism -> solution -> proof -> offer -> risk reduction -> CTA`

Change the order when context, ICP, product, or awareness requires it. Every section must answer the next buyer question or move intent toward the one conversion.

## 6. Test the value proposition

The hero needs a relevant problem or outcome, a short explanation of how the product produces it, and a credible reason to believe. Prefer proof from the same ICP over a generic logo wall.

## 7. Map proof to objections

List real objections and resolve them where they arise, not only in the FAQ. Price needs a cost/value comparison; implementation needs a concrete setup path; security needs verifiable evidence; learning curve and staffing need real usage proof. Prefer linked originals, customer video, real message captures, and measurable cases over polished anonymous cards.

## 8. Remove conversion friction

Count fields, decisions, steps, competing CTA intents, hidden price or next-step uncertainty, and the commitment implied by the CTA. The label must state the outcome. Place the same primary action after arguments that raise intent. A form is part of the product path, not a footer accessory.

## 9. Direct attention with UI

Only now judge composition, hierarchy, rhythm, density, contrast, typography, color, spacing, images, and animation. Vary layout when it helps the narrative. Give proof and CTAs visual priority. Do not use visual polish to conceal a weak offer or broken path.

## 10. Add one functional surprise

After clarity and conversion work, add a bounded memorable element: an unexpected product demonstration, metaphor, illustration, composition, or easter egg. It must strengthen attention, differentiation, recall, or positioning. Random spectacle is not personality.

## Diagnostic output

Record one row per layer:

`layer | evidence | status (pass/risk/fail/unknown) | leak | next action | metric affected`

Never invent analytics. When CAC, conversion rate, activation, trial-to-paid, revenue, LTV, or churn are unavailable, mark them `unknown`. Separate measured technical failures from inferred persuasion risks. Fix in this order:

1. delivery and conversion-path blockers;
2. channel, ICP, awareness, offer, and proof mismatch;
3. message and narrative;
4. attention/UI;
5. personality.
