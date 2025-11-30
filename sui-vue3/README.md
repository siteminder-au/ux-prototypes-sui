# SUI (Vue 3)

SUI is the design system built using Vue 3.
SUI has no dependency on ElementUI.
SUI does have some dependencies on the following packages (as of 20240209):
- @ckpack/vue-color (new - `sui-core@17.0.0-vue3`)
- @lk77/vue3-color (old - `sui-core@16.1.0-vue3` and below)
- @popperjs/core
- @vee-validate/i18n
- @vee-validate/rules
- @vueuse/core
- fecha
- floating-vue
- lodash-es
- v-calendar
- vee-validate
- vue-multiselect
- vuedraggable

There are future initiatives to reduce these dependencies and written in-house by SiteMinder.

Please see https://github.com/siteminder-au/sui for the Vue 2 version.

## Changelog

Review the following

**Vue3:**
- [sui-core CHANGELOG.vue3.md](libs/sui-core/CHANGELOG.vue3.md)
- [sui-icons CHANGELOG.vue3.md](libs/sui-icons/CHANGELOG.vue3.md)
- [sui-themes CHANGELOG.vue3.md](libs/sui-themes/CHANGELOG.vue3.md)

## Feature Requests & Defects

Follow the [confluence doc](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/886999394/Feature+Requests+and+Defects) or reach out to the team via the #sui Slack channel.

Any updates to the Vue 2 version should be added to Vue 3 for feature parity.

## Contributing

Anyone is free to contribute to this repository.

### Branching Strategy

The following branches are operational:

- `vue3`: The main development branch for Vue3 version. Releases are conducted from here.

Work away on a feature branch (there is no strict naming convention).

When you're ready, provide a pull request against the `vue3` branch.

Merging to the `vue3` branch will trigger a deployment of the docs site to <https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/>

There is no production docs site at the moment.

### Running Locally

Run the documentation site locally, so you can document features as you develop them.

To do that, follow the [guide in the frontend/docs folder](https://github.com/siteminder-au/sui/tree/vue3/frontends/docs).

For help linking libs locally, see [here](LOCAL_LINKING.md).

### Review Process

When you're ready to integrate your changes, create a pull request to the `vue3` branch.

Add the ticket number on the PR title, e.g "PX-1234: (sui-core) Concise description of the change".

And then fill in the required details and go over the testing steps cited in the [PR template](pull_request_template.md).

Reach out for help as needed via the #sui and #guild_frontend Slack channels.

### Release Process

Checkout the [releasing guide](RELEASING.md).

### Installation

See [Storybook](https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/?path=/story/getting-started-installation--page)

### Creating a new component

To create a component for the sui-core library:
- copy the folder `libs/sui-core/src/app/components/sm-tag` in the same directory `components`
- replace all references of 'sm-tag' to your new component.
- update the necessary files as you need
