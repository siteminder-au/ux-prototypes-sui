const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = function (source, sourceMap) {

  const dirPath = path.join(this.query.rootPath, source.trim());
  const files = fs.readdirSync(dirPath)

  const fileSource = _.reduce(files, (result, file) => {
    const fileContent = fs
      .readFileSync(`${dirPath}/${file}`, 'utf8')
      .replace(/<include-source>.*<\/include-source>\n/, '');
    result.push(`
<!--
${file}
-->

${fileContent}
`)
    return result
  }, []).join('\n\n')

  this.callback(
    null,
    `export default function (Component) {
            Component.options.__source = ${JSON.stringify(fileSource)};
        }`,
    sourceMap
  );
};