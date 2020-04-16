var babel = require("rollup-plugin-babel");

export default {
    input: 'src/index.js',
    plugins: [babel()],
    output: {
        file: 'docs/index.js',
        format: 'iife',
    }
  };