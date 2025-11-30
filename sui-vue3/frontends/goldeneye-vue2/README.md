# SUI - CampMinder (vue2)
This is the root folder for the vue2 sample project that consumes the sui libraries (i.e. sui-core, sui-icons, sui-themes)

# Overview
Welcome to CampMinder, a webapp built to help test SUI libraries by emulating as a SiteMinder product.
This allows us to quickly test the sui libraries if they are working in a real downstream project.

This webapp emulates a platform where campsite owners can setup their campsites for the purposes of distribution.

Once all SiteMinder webapps have been migrated to vue3, this goldeneye-vue2 project can be deleted and we will only maintain the vue3 goldeneye project.

This webapp is deployed automatically (see pipeline.yml) in the sui-dev environment: https://goldeneye-vue2.dev.siteminderlabs.com/

# Getting Started
Follow these steps to run CampMinder locally in your machine once you are in `frontends/goldeneye-vue2` folder:
```
nvm use
npm install
npm run dev
```
NOTE: ensure that you use `nvm` to correctly switch to the right node version. Please consult the `.nvmrc` file at the root of this repository.

# TODO list
This sample project is a living document and extra contributions from any member of the SUI team as well as external contributors are welcome to update this sample project in any way shape or form!

See some example tasks that you can do to contribute to this sample project:
- [x] add VTL tests
- [x] add cypress component tests (CCT) - currently under `siteminder-au/sui-cypress` repository
- [x] add routing examples
- [x] add all 120 base components
- [x] add vue-i18n translations (at least German and Thai)
- [ ] add apollo composable usages
- [ ] add heap.io support
- [ ] add gtm installation support
- [ ] add releasenotes.io support
- [ ] add more theming token support
- [ ] add official SUI patterns (e.g. rates list)
- [ ] update favicons to support 'CampMinder' theme
- [ ] add fake data related to camping (consider using msw to simulate a beef)
- [ ] add sample route guards
- [ ] add more error pages (404, 403, etc...)
- [ ] enhance each section of the webapp (e.g. health-check, insights, etc...)
- [x] setup percy against this sample project - currently under `siteminder-au/sui-cypress` repository
- [ ] create a branch to simulate vue3 upgrade
