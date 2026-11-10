# Local-first validation

Run the existing source, JSON and history checks locally during development. Keep development changes on task branches and prepare a draft pull request for human review.

The source-validation workflow runs for pull requests and main-branch integration pushes, and supports manual validation. Task-branch pushes do not create duplicate validation runs. Newer runs cancel superseded runs for the same workflow, event and pull request or ref. Pull-request validation has no path filter or draft skip; existing checks, pinned tools, runner and read-only permissions are unchanged.

Before an approved merge, review successful validation for the current revision. Revalidate when the source or base changes. Local success is not merge or release authorization. Manual validation supplements the pull-request result.

The existing website publication mechanism, website content, association files and domain configuration are unchanged. Publication still requires separate approval. Roll back an approved workflow change through a reviewed revert pull request.
