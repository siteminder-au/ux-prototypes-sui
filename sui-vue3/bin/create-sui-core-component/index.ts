import * as _ from 'lodash'
import * as fs from 'fs'
import * as path from 'path'

if (!process.env.NAME) {
  console.log('Error: missing NAME var')
  console.log('Usage: NAME=<component-name> npm run create-component:sui-core')
  process.exit(1)
}

const resolveApp = (segment: string) => {

  return path.join(__dirname, '../../libs/sui-core/src/app', segment)

}

const resolveClone = (segment: string = '') => {

  return path.join(__dirname, 'clone', segment)

}

const nameAsPascalCase = _.upperFirst(_.camelCase(process.env.NAME))
const nameAsKebabCase =  _.kebabCase(process.env.NAME)
const nameAsDocsTitle = _.upperFirst(nameAsPascalCase.replace('Sm', ''))

fs.mkdirSync(resolveApp(`/components/${nameAsKebabCase}`))

const files = fs.readdirSync(resolveClone())

files.forEach((file) => {

  const content = fs.readFileSync(resolveClone(file))
    .toString()
    .replace(/SmTag/g, nameAsPascalCase)
    .replace(/sm-tag/g, nameAsKebabCase)
    .replace(/<story-title>/g, nameAsDocsTitle)

  const fileName = file.replace('sm-tag', nameAsKebabCase)

  const filePath = resolveApp(`/components/${nameAsKebabCase}/${fileName}`)

  fs.writeFileSync(filePath, content)

  console.log(`Created: ${filePath}`)

})
