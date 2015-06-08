{
  "name": "{{name}}",
  "version": "{{version}}",
  "homepage": "https://github.com/mamboer/{{name}}",
  "authors": ["{{author|raw}}"],
  "description": "{{description}}",
  "main": "{{main}}",
  "keywords": {{keywords|raw|json}},
  "license": "MIT",
  "dependencies":{
    "jquery":"*"
  },
  "ignore": [
    "gulpfile.js",
    "*.swig",
    "src",
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests",
    "*.json",
    "site",
    "*.html"
  ]
}
