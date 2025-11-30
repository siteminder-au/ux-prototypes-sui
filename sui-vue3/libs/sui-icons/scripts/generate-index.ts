import * as _ from 'lodash'
import * as fs from 'fs'
import * as path from 'path'
import glob from 'glob'

;(glob as any)('./src/app/icons-out/**/*.ts', {}, (err: Error | null, matches: string[]) => {

  const content = matches
    .filter(match => !match.endsWith('index.ts'))
    .map((match) => {

      const { name } = path.parse(match)
      const filePath = match
        .replace('./src/app/icons-out/', './')
        .replace(/.ts$/, '')

      return `export { default as ${_.camelCase(name)} } from '${filePath}'`

    })
    .join('\n')

  fs.writeFileSync(path.join(__dirname, '../src/app/icons-out/index.ts'), content)

})

