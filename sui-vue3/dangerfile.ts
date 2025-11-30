// see: https://danger.systems/js/
import { danger, warn } from 'danger'

// update changelog warning
// Add a CHANGELOG entry for app changes
// sample of danger.git.modified_files (contains relative path from root directory!)
// .buildkite/pipeline.yml,
// .vscode/settings.sui.json,
// libs/sui-core/package.json,
// package.json
const hasChangelog = danger.git.modified_files.find(path => path.includes('CHANGELOG.vue3.md'))
if (!hasChangelog) {
  warn(`Please add a CHANGELOG.md entry for your changes.`)
}

// keep lockfile up to date
const packageChanged = danger.git.modified_files.find(path => path.includes('package.json'));
const lockfileChanged = danger.git.modified_files.find(path => path.includes('package-lock.json'));
if (packageChanged && !lockfileChanged) {
  warn(`Changes were made to package.json, but not to package-lock.json. That's OK as long as changes were not updating dependencies or the package.json version.`);
}

// encourage more testing
const testChanges = danger.git.modified_files.filter(file => file.includes('.spec.ts'));
const hasTestChanges = testChanges.length > 0;
// Warn for no tests
if (!hasTestChanges) {
  warn(`There were no test changes. That's OK as long as you're refactoring existing code`,);
}

// Any PR related events should be handled inside this if statement
if (danger.github.pr) {
  const titleRegex = new RegExp(/^([A-Z]+-[\d]{3,5}(, )?)+: \((.+)\) /)
  if (!titleRegex.test(danger.github.pr.title)) {
    warn(`PR title "${danger.github.pr.title}" does not conform to "[A-Z]-12345: (...) " format. Please consider updating it.`)
  }
}
