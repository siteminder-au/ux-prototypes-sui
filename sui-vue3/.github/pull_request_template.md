### ℹ️ Description

Addresses https://siteminder-jira.atlassian.net/browse/PX-`<insert-jira-number>`

<!-- This is a description of what I've done in this PR, especially explaining choices made to make the reviewer's job easier. -->

### 🎨 Design

<!-- Remove this section if there is no UI/design change. -->

<!-- Add relevant Figma link(s) in here. The design specs and implementation should be synced between the two. -->

### 📷 Screenshots

<!-- Add screenshots if they help the reviewer see the changes -->

<!-- Add Storybook and/or Goldeneye Percy build link if any -->

### 🔙 Backwards Compatibility

<!-- Explain if this PR has breaking changes and if they are backwards compatible -->
This PR is backwards compatible.

This PR is NOT backwards compatible. Details: ...

### Type of PR
When updating libraries
- [ ] Breaking change - Major
- [ ] Features - Minor
- [ ] Fixes - Patch

### Browser tested (at least 1)
- [ ] Chrome
- [ ] Firefox
- [ ] Safari

### ⚠️ Mandatory Checklist
All applicable checkboxes must be ticked for PR approval
- [ ] Reviewed dangerjs warnings reported in this PR (with a thumbs up emoji) before merging
- [ ] Tested locally with no visible errors and console warnings/errors (see [testing guidelines](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/Testing+Guidelines))
- [ ] There are no dev console warnings (and not caused by third-party libraries) in the Vue3 sample project where the component is rendered
- [ ] [Added/update localisation key](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/SUI+Vue+2+Contribution+Guide#Translations) (xx.lang.json) (if applicable)
- [ ] Responsive (see [testing guidelines](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/SUI+Vue+2+Contribution+Guide#Common-gotchas))
- [ ] [Passed accessibility testing and is valid HTML](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/SUI+Vue+2+Contribution+Guide#Accessibility)
- [ ] [Compatible with theming library](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/SUI+Vue+2+Contribution+Guide#Theming)
- [ ] [Compatible with white-labelling](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/SUI+Vue+2+Contribution+Guide#White-labelling) (if applicable)
- [ ] [Well written documentation](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2400747592/SUI+Coding+Conventions#Add-documentation)
- [ ] (For SUI library or demo changes) I acknowledge that I will [run a Percy build](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/SUI+Contribution+Guide#Percy-visual-testing) to compare the base and the updated Storybook, ensuring there are no unexpected visual regressions in the component(s) changed in this PR. I will update the JIRA ticket with the Percy build link.
- [ ] (For Goldeneye changes) I acknowledge that I will [run a Percy build](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2655420629/SUI+Contribution+Guide#Percy-visual-testing) to compare the base and the updated Goldeneye, and ensure there are no unexpected visual regressions for the component(s) changed in this PR. I will update the JIRA ticket with the Percy build link.

### 🔄 Release Checklist (if applicable)
To be completed before tagging a release
- [ ] (Vue3) I acknowledge that I will follow the [Vue3 release steps](https://github.com/siteminder-au/sui/blob/vue3/RELEASING.md#vue3-ga-release-process) and complete the [checklist](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2221932703/SUI+Release+checklist) before tagging.
- [ ] (Vue2) Bump the `package.json` version (if not done already), you will not be able to do it afterwards. Use `npm version X.Y.Z` command to ensure `package-lock.json` changes also. See [release process](https://github.com/siteminder-au/sui/blob/master/RELEASING.md) for how to tag afterwards.
