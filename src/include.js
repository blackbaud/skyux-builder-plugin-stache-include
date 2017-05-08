const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd(), 'src', 'stache', 'includes');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  let $ = cheerio.load(content, {
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
    decodeEntities: false
  });

  let includes = $('stache-include');

  if (includes.length) {
    includes.each(function () {
      let fileName = $(this).attr('fileName');
      let filePath = path.join(root, fileName);
      let file;

      try {
        file = $(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        /* eslint-disable no-console */
        console.error('INCLUDE ERROR: ', error.message);
        throw error;
        /* eslint-enable */
      }

      $(this).text(file);
    });

    content = $.html().toString();
  }

  return content;
};

module.exports = { preload };
