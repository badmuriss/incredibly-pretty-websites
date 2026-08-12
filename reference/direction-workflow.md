# Direction workflow

Use this reference before presets, vibes, or implementation. It decides how much invention the task allows and what the surface must accomplish.

## 1. Resolve the incumbent truth

Inspect the target route or component, its nearest workspace, and the repository root. Resolve visual authority in this order:

1. Explicit user constraints and supplied assets.
2. Tokens, theme, components, and `DESIGN.md` in the target app or workspace.
3. The same evidence at the monorepo root.
4. Research and this skill's defaults.

The nearest evidence wins for fields it defines. Missing local fields may inherit from the root. A missing `DESIGN.md` does not erase a coherent system already present in code.

## 2. Set `CHANGE_SCOPE`

Choose one scope before research or visual exploration:

| Scope | Use when | Freedom |
|---|---|---|
| `local` | Adding or refining one component, section, or state inside an established surface | Inherit its tokens, composition, type, motion, and component language. Decide only the new content, hierarchy, states, and join. |
| `surface` | Creating or replacing a whole route inside an established system | Keep the global visual system. Explore structure, sequence, density, content, and interaction for this route. |
| `world` | Greenfield work or an approved visual-identity replacement | Research and commit a new visual world. Preserve product truth, behavior, and explicit constraints. |

Never turn a `local` change into a redesign. Never treat missing documentation alone as permission for `world` scope.

## 3. Set `SURFACE_MODE`

Choose by the visitor's job on this surface, not by the company's category:

| Mode | Visitor success | Design priority |
|---|---|---|
| `persuade` | Understands, believes, and acts | Offer, proof, memorable first viewport, clear primary action |
| `operate` | Completes a task | Scanability, state, familiar controls, speed, error recovery |
| `read` | Understands material | Reading order, hierarchy, wayfinding, measure, comprehension |
| `experience` | Explores the work itself | Artifact-first composition, pacing, transitions, authored media |

Mode governs expression and density. Segment presets govern domain expectations and technical restraint. A SaaS landing page is `persuade`; its dashboard is `operate`; its documentation is `read`.

## 4. Research in proportion to scope

- `local`: inspect the surrounding surface and research only a new pattern the existing system cannot answer.
- `surface`: inspect the incumbent system and study comparable flows or page structures. Do not reopen brand tokens.
- `world`: run the full research-first workflow in `SKILL.md` Section 0.

Real references and user-pinned direction outrank archetypes. Vibes and project presets are prompts for analysis, never a menu that must supply the answer.

## 5. Write the direction contract

Before code, record five concrete blocks in at most 150 words:

- **Thesis:** the one idea the surface owns and the category default it refuses.
- **World:** palette roles, type character, material, and component language, recognizable without copy.
- **Story:** what the visitor understands, believes, and does.
- **First viewport:** exact composition, scale relationship, focal point, and primary action or task.
- **Form:** layout grammar, media strategy, signature interaction, and honest implementation risk.

For `local`, keep only the blocks affected by the change. Store the contract in task notes; when visual evidence is required, include it in that change's evidence manifest. Review the render against the contract, not only against generic rules.

## 6. Gate expensive visual exploration

Generate direction sketches or three compositional comps only when at least one condition holds:

- the user requests visual exploration;
- `CHANGE_SCOPE=world` and the session is attended;
- `SURFACE_MODE=experience` or a Tier 3 surface has unresolved composition or asset risk.

One approved direction can yield three comps that vary topology, sequence, density, hierarchy, or focal composition. Keep palette, type character, and material fixed. Before building, inventory every major visible ingredient and assign its medium: semantic HTML/CSS, authored SVG, existing asset, generated or sourced raster, icon library, canvas/WebGL, or accepted omission.

Do not run this gate for a narrow local change. In autonomous work, choose from the evidence, record the decision, and proceed.

## 7. Finish in bounded passes

Declare the supported platforms and states before capture. Then:

1. Capture all declared surfaces, states, and platforms in one batched inspection round.
2. Inspect the pixels and record every material finding.
3. Apply one correction batch.
4. Capture the same matrix once more and classify each finding as `resolved`, `partial`, or `open`.

Stop after the confirmation round. Report remaining findings instead of opening a new self-directed polish loop. A user may explicitly fund another round.
