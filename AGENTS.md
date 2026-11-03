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
