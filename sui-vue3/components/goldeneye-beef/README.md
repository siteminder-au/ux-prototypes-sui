# SUI - CampMinder beef
This is the root folder for the sample project that feeds CampMinder mock data.

# Getting Started

To set up and run the beef, make sure that you are inside `components/goldeneye-beef` before running the following:

```bash
npm install
npm run compile
DOTENV=.env.playpen npm run dev:playpen
```
NOTE: ensure that you use `nvm` to correctly switch to the right node version. Please consult the `.nvmrc` file at the root of this repository.

To verify that the server is running:

```bash
curl http://localhost:3000/healthcheck/
```

You should see a response similar to this:

```json
{"uptime":1659.727}
```

# TODO List
This sample project is a living document and extra contributions from any member of the SUI team as well as external contributors are welcome to update this sample project in any way shape or form!

See some example tasks that you can do to contribute to this sample project:
- [ ] e2e tests
- [ ] high-level arch diagram
- [ ] mutation resolver
- [ ] type resolver
- [ ] auth
- [ ] data persistence
- [ ] playpen
- [ ] deployment to dev env
- [ ] new branch for the frontend bootcamp hands-on activity (sample: https://github.com/siteminder-au/sui/compare/vue3...bootcamp-vue3?expand=1)

**Refer to the [contribution guide](../../CONTRIBUTING_GOLDENEYE.md) here.**
