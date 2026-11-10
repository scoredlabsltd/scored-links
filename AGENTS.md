# Scored public links

## Engineering and Git boundaries
- Inspect branch, HEAD, worktrees and staged/unstaged/untracked files before work. Preserve unrelated work; never silently include it in a commit.
- Use a task branch or isolated worktree. Commit only named, reviewed files. Do not force-push, rewrite shared history, move published tags or merge feature branches without authorization.
- Keep secrets, signing material, device backups and raw credential-bearing journals outside Git and CI artifacts. Never print credentials.
- Link cross-repository changes through an issue and an exact commit/contract compatibility manifest; there is no atomic multi-repository merge.
- Separate code validation, simulation and physical qualification. Report commands, results and remaining gaps accurately.
- Production database changes, deployments, publishing releases, flashing, erase, eFuse changes and identity provisioning require explicit target-specific authorization. CI in this phase validates only.
- Preserve application identifiers, device UUIDs/serials, pairing identities, event UUIDs/sequences and existing production data. Do not regenerate identities during tooling changes.

## Public website boundary
Everything committed here is public. Do not add internal migration manifests, device inventories, private endpoints with credentials or firmware source.
Preserve CNAME, app association files, install targets, pairing URL formats and feedback behavior. Coordinate app/deep-link changes with scored-v2.
Review HTML/JavaScript changes and validate JSON association/configuration files. Changes to main can trigger GitHub Pages publication; do not merge or change deployment configuration without release authorization.
This foundation adds documentation only and must not alter live website content.

## Default local-first CI workflow

- Read `docs/development/CI-POLICY.md` before planning a change. Use the current approved `main` revision as the task base and PR target.
- Read the approved issue, inspect HEAD/worktrees and staged, unstaged and untracked files, then work in an isolated task branch/worktree. Preserve unrelated work and existing source/dependency pins.
- Run the relevant local checks documented here and in component instructions before proposing review. Record the exact revision, commands, results and any gaps; local success does not replace required hosted validation.
- Keep routine development on the task branch and prepare a linked draft PR after local validation. Unless the current task explicitly authorizes the next milestone, stop at draft: do not mark ready, dispatch workflows, merge, deploy or publish. Authorization for another task does not carry over.
- Keep existing security, integrity and coordination checks enabled. Draft-skipped producers and intentionally failing full-result gates are not full validation; never weaken checks, refresh fixtures or change protections/budgets to get green results. Before an authorized readiness transition, verify the current PR head and base and confirm that the Actions budget and runner capacity are sufficient. Before an authorized merge, require successful, non-skipped CI for the current head and base.
- This repository is public: keep private issue links, coordination manifests and internal evidence out of commits and PR descriptions. A merge to `main` can publish GitHub Pages; obtain explicit Pages publication authorization as well as merge approval.
