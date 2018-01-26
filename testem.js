{
  "framework": "mocha",
  "serve_files": [ "test/bind-polyfill.js", "bundle.test.js" ],
  "src_files": [ "test/*.js" ],
  "before_tests": "browserify test/cron-emitter.test.js -o bundle.test.js -t [ babelify --presets [ es2015 ] ]",
  "after_tests": "rm bundle.test.js"
}
