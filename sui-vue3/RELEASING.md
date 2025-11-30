# Release guide

> This guide details the various ways to release the SUI framework.

## Releasing to NPM

SUI is made up of libs which are located in the [libs/](libs/) directory. Each lib is released as its own NPM package under the `@siteminder` scope.

SUI also hosts assets & docs frontends.

## Releasing SUI monorepo with a single command
All of this monorepo's libs and frontends components can be released using a single command.

### Prerequisites
These steps need to be done first before the script can be run successfully.
- Ensure that you have [gh](https://github.com/cli/cli) installed.
- You can add a personal access token [here](https://github.com/settings/tokens), you will need to add GITHUB_TOKEN in your ~/.zshrc file for gh cli to work.
- Don't forget to `source ~/.zshrc` after adding the GITHUB_TOKEN env
- If you have set up gh cli correctly try running:
```bash
gh pr list
```
It should output a list of open pull request in a github source-controlled directory you are in.

### Steps
- Double check that `npm version X.Y.Z` was run on all the appropriate libs and frontends components. Confirm you can see the version prop has changed in the package.json and package-lock.json files. It is ideal if the version bumps were done as part of the PRs that were merged and contributed to the specific lib or frontends component.
- Update the `release-config.ini` file to specify what the old and the upcoming new versions are for each lib and frontends component.
- Navigate to the root sui folder
- Run the following command:
```bash
npm run release:sui
```
- This should output some text that is copied for you to paste in the #sui-release channel

### Release Conventions

- Apply semantic versioning when releasing:
  - `major` version when you make incompatible API changes.
  - `minor` version when you add functionality in a backwards compatible manner.
    - New, backward-compatible functionality is introduced to the public API.
    - Any public API functionality is marked as deprecated.
    - When you release new functionality in your project.
  - `patch` version when you make bug fixes (and/or backwards compatible bug fixes).
- Communicate changes via the #sui Slack channel

Versions following these conventions must be applied **before** a pull request is merged.


### Releasing a lib e.g. sui-core

Say we'd like to make a change & release a new version of the `@siteminder/sui-core` NPM package...

If you haven't made the changes yet, you will need to make a Pull Request.

> - To do that, pull down the contents of the `master` branch.
>   ```bash
>   git pull origin master
>   ```
> - Branch off master, do the changes, PR it into master. **Ensure version is updated in the PR**.
> - Get it reviewed, approved & merged to master branch.

On your laptop on master branch, release the `sui-core` lib by running the following command in the root of the `sui` repo. It will trigger a tagged build and deploy the tagged package.

```bash
npm run release:lib libs/sui-core "Short description describing your change"
```

That command will create a git tag, with the expected naming convention, and push that tag to the remote repository.

In-turn, the buildkite pipeline will see the tagged release and attempt to publish the new version to npm.


### Releasing docs site

Now you'll want to release the docs site.

If you haven't made the changes yet, you will need to make a Pull Request.

> - To do that, pull down the contents of the `master` branch.
>   ```bash
>   git pull origin master
>   ```
> - Branch off master, do the changes, PR it into master. **Ensure version is updated in the PR**.
> - Get it reviewed, approved & merged to master branch.

On your laptop on master branch, release the `docs` site by running the following command in the root of the `sui` repo. It will trigger a tagged build and deploy the tagged package.

```bash
npm run release:docs "Short description describing your change"
```

When deployment is complete, visit the [production site](https://sui.siteminder.systems) to find your documentation.


### Releasing assets site

If you haven't made the changes yet, you will need to make a Pull Request.

> - To do that, pull down the contents of the `master` branch.
>   ```bash
>   git pull origin master
>   ```
> - Branch off master, do the changes, PR it into master. **Ensure version is updated in the PR**.
> - Get it reviewed, approved & merged to master branch.

On your laptop on master branch, release the assets site by running the following command in the root of the `sui` repo. It will trigger a tagged build and deploy the tagged package.

```bash
npm run release:assets "Short description describing your change"
```

That command will create a git tag, with the expected naming convention, and push that tag to the remote repository.

In-turn, the buildkite pipeline will see the tagged release and attempt to build & deploy the new version to the targeted environments, just like any frontend deployment.

For more information, Please find the detailed document [here](https://siteminder.atlassian.net/wiki/spaces/SUI/pages/2561245827/SUI+Assets+Deployment)


### Beta Release Process (Libs only)

Beta versions will always be published when a build is executed.

The beta version will be automatically generated from the version in `package.json` e.g. 1.2.3 and built as `1.2.3-feature-abc-beta.6789` where 6789 is buildkite build number, and branch name is `feature-abc` or `feature/abc`.

There are no extra steps manual required, nor any need to use pre-releases etc.

## Vue3 GA Release Process
1. In the `vue3` branch root directory, create a feature branch

2. Run the following command:
    ```bash
    ./bin/vue3-version.sh X.Y.Z
    ```

    Where X.Y.Z is the version number you want to release. There is no need to add `-vue3` suffix, the script will add it.

    This will update the version number in the `package.json` for sui-core, sui-icons, sui-themes libs and frontends/docs and frontends/goldeneye.

3. Search for the last tagged version, update the strings from the following
    - `1-using-storybook.stories.mdx` (Storybook)
    - `2-installation.stories.mdx` (Storybook)
    - `the-app-header.vue` (Goldeneye)
    - `(pending release)` label from `CHANGELOG.vue3.md` file(s)

4. Create a PR and merge it back to `vue3` branch.
    - Wait for Buildkite and Cypress runs to complete
    - Verify string changes from above step once deployed to dev envs
    - [Run Percy](frontends/docs/README.md#visual-testing-via-percy) in Vue3 Storybook and/or Goldeneye if needed and verify visual diffs

5. Checkout `vue3` branch. In the root directory, run the following commands:
    ```bash
    ./bin/vue3-release-lib.sh libs/sui-core vX.Y.Z-vue3
    ./bin/vue3-release-lib.sh libs/sui-icons vX.Y.Z-vue3
    ./bin/vue3-release-lib.sh libs/sui-themes vX.Y.Z-vue3
    ```

    These will kick off some tag Buildkite builds and will publish the libs officially as `X.Y.Z-vue3`
    in https://buildkite.com/siteminder/sui

    For example, assume the version we use is `9.0.0`. Then,
      - The Buildkite builds will be named as
        - `sui-core.v9.0.0-vue3`
        - `sui-icons.v9.0.0-vue3`
        - `sui-themes.v9.0.0-vue3`
      - in JFrog npm registry, you should see the published packages as
        - `@siteminder/sui-core@9.0.0-vue3`
        - `@siteminder/sui-icons@9.0.0-vue3`
        - `@siteminder/sui-themes@9.0.0-vue3`

6. Once Buildkite builds are done, verify if the new tags are available
    - Create new PR to install official tags into `frontends/goldeneye`
    - Announce new tags in `#sui` Slack channel

**NOTE:**
- We will not tag frontends/docs or frontends/assets in `vue3` branch. They will only be tagged in the `master` branch.
- For frontends/docs, there's no harm in continuing to deploy to [dev env](https://sui-dev-v3-sui-docs.dev.siteminderlabs.com/?path=/story/welcome--page) only for now. We can think about deploying vue3 docs to prod env once all teams are on vue3 and `master` branch officially becomes the vue3 build.
- For frontends/assets, there is no difference between vue2 and vue3 assets. So, frontends/assets will continue to only be tagged in the `master` branch.
