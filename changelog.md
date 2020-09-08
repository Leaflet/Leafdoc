
# 2.0.1 (2020-09-08)

* Tweak the `bin` field in package.json

# 2.0.0 (2020-09-04)

* Support for multiple languages (tests now include java, ruby); this is done via deprecation of the comment block regexes in favour of `multilang-extract-comments`
* Switch from `marked` to `markdown-it` (because commonmark + stackoverflow extensions such as tables)
* Switch from `unicode-7.0.0` to `regenerate-unicode-properties` for the `ID_Start` unicode characters
* Added templates to create UML-like class diagrams via graphviz (the resulting `.dot` files need to be passed through graphviz's `dot` utility to create the actual graphic)
* All files are now `*.mjs` for better ESM module support

# 1.5.1 (2019-01-30)

* Fixed --character argument for command-line utility.


# 1.4.0

* Documentables have an `optional` flag
* Documentables can be defined as inheritable or not
* Added a `getTemplateEngine` to override the default handlebars helpers
* Cached the compiled templates




