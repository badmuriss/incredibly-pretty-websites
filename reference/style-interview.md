# Style interview

The autonomous mode picks the direction from evidence and tells the user what it assumed. The interview picks it **with** the user, so the site comes out looking like theirs instead of looking like a competent default. Same research, same lock, same contract — only the source of the taste decision changes.

## When it runs

Run the interview when any of these hold:

- the invocation asks for it (`--interview`, "modo entrevista", "me pergunta o estilo", "ask me first", "which style do you want");
- `CHANGE_SCOPE=world`, the session is attended, and the user has pinned no reference and no brand;
- the user has rejected a direction once and cannot say why in design terms.

Do **not** run it for `local` scope, for a redesign in Preserve mode, for an unattended run, or when the brand tokens already answer the question. Asking a user to pick a canvas color for a component that must inherit the surrounding surface is noise, and the incumbent system wins anyway ([foundations.md](foundations.md)).

## The rule that makes it worth running

**Candidates are built from research, never read off the §5 archetype list.** A menu of nine named vibes moves the work to the user without giving them anything to judge: nobody outside design knows what they are buying when they pick "Ethereal Glass." Research first (§0), then compose two or three *concrete* directions that already fit this brief, and let the archetype names sit in the label as shorthand only.

Three tests before a candidate set goes on screen:

1. **Separated.** The candidates differ on at least two of: canvas polarity (light/dark), type character (grotesque/rounded/serif/condensed), media strategy (photography/3D/illustration/pure type). Three tints of the same idea is a fake choice and the user will feel it.
2. **Backed.** Each candidate names the real product it comes from and what it takes from it. No candidate exists without a source, same rule as the decision ledger.
3. **Legible to a non-designer.** Describe outcomes and feel, then show the specifics. "Feels like a calm bank" is a question a client can answer; "Warm-Monochrome Editorial with pastel token pairs" is not.

## Round 1 — the brief

One `AskUserQuestion` call, at most four questions, only the ones context cannot already answer:

| Question | Options shape |
|---|---|
| What is this and who buys it? | the two or three segments you actually suspect |
| What should the visitor feel in the first three seconds? | trust / speed / craft / fun — pick the axis the segment fights over |
| What is fixed? | brand colors and fonts exist · logo only · nothing, start clean |
| Any site you already like? | free text — this is the highest-value answer in the whole interview |

If they name a site, read it before Round 2 (Route A in [design-references.md](design-references.md)). A site the user already likes outranks every gallery result and often collapses the interview to a single confirming question.

## Research, then Round 2 — the direction pick

Run §0 with the brief. Then one `AskUserQuestion` call, single-select, two or three candidates, each carrying a `preview` block in this shape:

```
CANVAS   #F3F5FB cool off-white, one deep navy block
TYPE     Poppins 700 headlines / Poppins 400 body
ACCENT   indigo #664FE8 on buttons only, mint #19D3C5 on the 3D props
MEDIA    generated matte clay 3D renders (image-gen), 3 across the page
MOVE     the hero object floats inside a dashed orbit ring
FROM     waveofunboxing.com.br
FEELS    approachable, modern, nothing about it is intimidating
```

Same six lines for every candidate, so the user compares rows instead of prose. The tool adds "Other" on its own; that is the escape hatch for "none of these" and for "the second one but darker" — treat a mixed answer as a primary plus one bounded borrow, never as an average (§0, step 4).

Optional and bounded: when the session can render, screenshot the one or two real reference sites and show them before asking. Two captures maximum. Do not build comps to ask the question — comps are gated separately in [direction-workflow.md](direction-workflow.md) §6.

## Round 3 — the single fork

At most one more question, and only for a fork the pick genuinely left open: light or dark canvas, photography or 3D, dense or airy. If the direction has no open fork, skip this round. Never use it to relitigate Round 2.

## After the pick

Stop asking. Write the reference-lock, the decision ledger, and the direction contract, with `user interview` as the source on every row the user decided. Show the contract once for confirmation, then build. Contradictions between the pick and a craft rule resolve the normal way: accessibility, semantics, and product truth win; taste defaults lose to the user's choice.

## Hard limits

- Three rounds maximum, four questions per round, no repeats.
- No question the brief, the repo, or the incumbent system already answers.
- No jargon in an option label the user has to choose blind.
- Never ask permission to follow a rule this skill already owns (spacing scale, states, a11y, responsive behavior).
- If the user disengages or answers "you decide," fall back to autonomous mode, record the assumption in one line, and keep going.
