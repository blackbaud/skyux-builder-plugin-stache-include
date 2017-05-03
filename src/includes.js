const cheerio = require('cheerio');
const fs = require('fs');
const directory = './assets/includes/'

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/\.html$/)) {
    return content;
  }

  let $ = cheerio.load(content, {
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
    decodeEntities: false
  });

  let includes = $('stache-includes');

  if (includes.length) {
    includes.each(function () {
      let fileName = directory + $(this).attr('fileName');
      let file = fs.readFile(fileName, (err, data) => {
        $(this).replaceWith(data);
      });
    });

    content = $.html().toString();
  }

  return content;
};

module.exports = { preload };