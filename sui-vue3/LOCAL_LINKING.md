### Releasing Locally

You can tell a locally-running frontend to use a local version of an SUI lib using the `npm link` command.

To get started, choose the SUI lib you'd like to test. The following example will assume you're using the `sui-core` lib.

#### Step #1 Linking SUI

**Using your terminal, navigate to the sui-core directory and compile the lib**

```
cd sui/libs/sui-core

npm run compile
```

**Copy the package.json and package-lock.json files into the `dist` directory**

```
cp package* dist/
```

**Navigate to the `dist` directory and run `npm link`**

```
cd dist
npm link
```

_The npm link command creates a symbolic link between two npm packages. [See more](https://docs.npmjs.com/cli/link)_

**Navigate to the package you want to run `sui-core` in and link the package in**

```
cd my-package

npm link @siteminder/sui-core
```

_Make sure to run npm i @siteminder/sui-core if the package was not already installed._

#### Step #2 Linking Vue Composition API

At the time of writing, the `@vue/composition-api` package breaks the above process... This package has a local variable defined in it which requires both of the linked implementations to share the same install. To work around this, follow the below.

**Navigate to the package you want to run `sui-core` in and link @vue/composition-api**

```
cd my-package

cd node_modules/@vue/composition-api
npm link
```

**Navigate to the `sui-core` directory and link @vue/composition-api**

```
cd sui/libs/sui-core

npm link @vue/composition-api
```

Let's cover what just happened...

1. In the first set of commands you _ellevated_ the installed `@vue/composition-api` package up and told NPM that anyone else looking to use this "linked" package can find it here.
2. In the second command you told `sui-core` to consume that package
   As a result, both the `sui-core` package and the package you're working on are now using the same `@vue/composition-api` artifact on your local machine.

#### Step 3. Run it!

**In your package, run the frontend**

```
cd my-package

npm run dev # or whatever your local dev server command may be
```

Your frontend is now using the local instance of the `sui-core` lib.

#### Step 4. Compiling changes

Changes made in the `src` directory of SUI will not make it to your package... To apply a change, run the rollup compiler like so:

**Navigate to the `sui-core` lib and compile it using rollup**

```
cd sui/libs/sui-core

npx rollup -c
```

_The command above will compile the sui-core lib and your frontend will update automatically. Note, `npx rollup -c` is similar to running `npm run compile` except that it does not delete the `dist` folder. We use this command instead because deleting the `dist` folder would break the symlink created in Step 1._

#### Step 5. Cleanup

To revert the temporary link you've created, simply run `npm i` in both your package and the `sui-core` lib.
