# Merge Bump Action

A GitHub action that integrates the pull request summary into the project's changelog, and bumps the repository's version appropriately.

## Initial Setup

Add the following to `.github/workflows/merge.yml`:

```yaml
on:
  issue_comment:
    types: [created, edited]
  check_run:
    types: [completed]
  status:

jobs:
  merge:
    runs-on: ubuntu-20.04
    steps:
      - uses: peyda-project-automation/bump-and-merge@1
```

## Using It

To initiate a merge, the pull request author (or any other repository owner) must leave a comment in the form:

> Merge: [major|minor|patch]

Once all CI checks pass, the pull request will be merged into master, and the repository's X, Y, or Z version will be bumped based on whether you specified major, minor, or patch respectively.

## License

This repository is licensed under the [Blue Oak Model License](./LICENSE.md).
