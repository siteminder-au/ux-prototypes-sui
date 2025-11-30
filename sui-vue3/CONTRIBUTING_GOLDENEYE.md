# Contribution Guide

Anyone is free to contribute to this repository.

## Before You Start

- Pick a task from the TODO lists:
  - [CampMinder frontend](frontends/goldeneye/README.md#todo-list)
  - [CampMinder beef](components/goldeneye-beef/README.md#todo-list)
- Check open PRs to avoid duplication.
- If unsure, reach out for help as needed via the `#sui` and `#guild_frontend` Slack channels.

## Branching Strategy

- Use vue3 as your base branch.
- Work away on a feature branch (there is no strict naming convention).

## PR Review Process

- Create a PR with a title following this format:
  ```
  (goldeneye) <task title>
  ```
  If there is a JIRA ticket associated with the task, include the ticket number in the title. For example:
  ```
  PX-1234: (goldeneye) <task title>
  ```
- Remember to update the TODO list and tick the task you’ve accomplished and include the PR link.
- SUI owners will review PRs to ensure alignment with standards.
- Address feedback by making changes and pushing updates to the same branch.
- Once approved, a SUI owner will merge your PR.
