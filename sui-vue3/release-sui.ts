import { exec } from 'child_process';
import * as fs from 'fs';
const ini = require('ini');

const config = ini.parse(fs.readFileSync('release-config.ini', 'utf-8'))

const execShellCommand = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      } else {
        console.log(`Output: ${stdout}`);
        resolve(stdout ? stdout : stderr);
      }
    });
  });
}

const runScript = async () => {
  console.log('=== start release ===');

  if (config.OLD_VERSION === config.NEW_VERSION) {
    console.log(`skipping release... check release-config.ini file!`);
    return
  }

  const isValidTag = (name: string, silent: boolean = false) => {
    const isValid = config[name].NEW_VERSION && config[name].OLD_VERSION !== config[name].NEW_VERSION
    if (!silent) {
      if (isValid) {
        console.log(`tagging ${name}... ${config[name].NEW_VERSION}`);
      } else {
        console.log(`skipping ${name}... check release-config.ini file!`);
      }
    }
    return isValid
  }

  // libs
  if (isValidTag('SUI_THEMES')) {
    await execShellCommand(`npm run release:lib libs/sui-themes v${config.SUI_THEMES.NEW_VERSION}`)
  }
  if (isValidTag('SUI_ICONS')) {
    await execShellCommand(`npm run release:lib libs/sui-icons v${config.SUI_ICONS.NEW_VERSION}`)
  }
  if (isValidTag('SUI_CORE')) {
    await execShellCommand(`npm run release:lib libs/sui-core v${config.SUI_CORE.NEW_VERSION}`)
  }

  // frontends
  if (isValidTag('DOCS')) {
    await execShellCommand(`npm run release:docs v${config.DOCS.NEW_VERSION}`)
  }
  if (isValidTag('ASSETS')) {
    await execShellCommand(`npm run release:assets v${config.ASSETS.NEW_VERSION}`)
  }

  if (isValidTag('DOCS', true) || isValidTag('ASSETS', true)) {
    const checkoutDir = fs.mkdtempSync('sui-release')
    await execShellCommand(`
      git clone https://github.com/siteminder-au/sui-config-pciprod.git ${checkoutDir} &&
      cd ${checkoutDir} &&
      git checkout master &&
      git pull --no-ff &&
      git checkout -b release-v${config.NEW_VERSION}
    `)

    if (isValidTag('ASSETS', true)) {
      // create config PR for assets
      await execShellCommand(`
        cd ${checkoutDir} &&
        npx replace-in-files-cli@2.2.0 --string=${config.ASSETS.OLD_VERSION} --replacement=${config.ASSETS.NEW_VERSION} assets/prod/frontend.rc
      `)
    }

    if (isValidTag('DOCS', true)) {
      // create config PR for docs
      await execShellCommand(`
        cd ${checkoutDir} &&
        npx replace-in-files-cli@2.2.0 --string=${config.DOCS.OLD_VERSION} --replacement=${config.DOCS.NEW_VERSION} docs/prod/frontend.rc
      `) 
    }

    // commit and push
    await execShellCommand(`
      cd ${checkoutDir} &&
      git status -v &&
      git status -s &&
      git add . &&
      git commit -m "Release v${config.NEW_VERSION}" &&
      git push origin &&
      gh pr create --title "Release v${config.NEW_VERSION}" --body "This releases v${config.NEW_VERSION}. Please check https://github.com/siteminder-au/sui/compare/v${config.OLD_VERSION}..v${config.NEW_VERSION} to review the changes in this release before approving."
    `) 

    // create gh release for sui repo
    await execShellCommand(`gh release create v${config.NEW_VERSION} --title "Release v${config.NEW_VERSION}" --generate-notes`)
    
    // clean up
    console.log(`Cleaning up temp dir ${checkoutDir}`)
    fs.rmSync(checkoutDir, { recursive: true })
    
    // generate release notes
    await execShellCommand(`npx @siteminder/dx@6.3.1 github release-notes -t ${config.NEW_VERSION} --repositories sui`)
  }

  console.log('=== end release ===');
}

runScript();
