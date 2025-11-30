# sui-icons

This library provides a collection of icons designed for use within our design system.

## Local Development

### Previewing icons

See the [frontends/docs](../../frontends/docs/README.md) readme for steps on how to run the development site (Storybook).

### Adding or updating icons

To add or update icons, use `src/app/icons-src` directory to store the raw `*.svg` files.

These are the files provided by the Design team.

Then you need to run `npm run generate-icons` command to convert them to JavaScript objects which will appear in `src/app/icons-out`.

There are also references to icons in sui-core (e.g. libs/sui-core/src/app/components/sm-dialog/icons).
If an existing icon is updated, you will need to update the *.ts files representing the same icons in sui-core.

### Running tests

```bash
npm test
# or
npx jest path/to/test
```

## Documenting Components

Documentation is written in `*.stories.ts` files. Visit the [documentation site README](../../frontends/docs/README.md) for more information.
