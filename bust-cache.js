const replace = require('replace-in-file');
const md5File = require('md5-file');

const css = {
  files: 'docs/index.html',
  from: /(style.css)/g,
  to: `style.css?rel=${md5File.sync('docs/style.css')}`,
};

const js = {
    files: 'docs/index.html',
    from: /(index.js)/g,
    to: `index.js?rel=${md5File.sync('docs/index.js')}`,
};

try {
    replace.sync(css);
    replace.sync(js);
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
