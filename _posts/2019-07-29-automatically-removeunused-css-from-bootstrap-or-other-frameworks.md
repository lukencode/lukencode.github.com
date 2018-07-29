---
title: Automatically remove unused css from Bootstrap or other frameworks
date: 2018-07-29
layout: post
---

I love bootstrap (and other css frameworks). For a developer like me who often works on web projects without any design input it is a real lifesaver.
The problem is since bootstrap is a kitchen sink type framework (although you can pick and choose via sass) the css file size can get out of hand quickly. 
Bootstrap.min.css weighs in at 138 KB. If you add a theme and custom css it can easily bump you over 200 kb.

[![PurgeCSS](/img/posts/purgecss.png)](https://www.purgecss.com/) 
[PurgeCSS](https://www.purgecss.com/) is a node.js package that can detect and remove unused css selectors. It will analyze your view pages - be they HTML 
or a templating engine and build a list of the css selectors in use. PurgeCSS will then take your stylesheets and remove any selectors that are not 
present in your views.

I setup PurgeCSS using the [webpack plugin](https://www.purgecss.com/with-webpack) which works in conjunction with the extract-text-webpack-plugin. My webpack config 
is based off the [Simple webpack config](https://lukencode.com/2018/04/14/simple-webpack-config-to-build-javascript-sass-and-css-using-npm-and-aspnet-core/) I have written about previously.

The webpack config was already setup to process sass and combine css into a single file. I added the PurgecssPlugin which will run at after the initial css processing.

`npm i -D purgecss-webpack-plugin`

`npm i -D extract-text-webpack-plugin`

```javascript
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')

const outputDir = './wwwroot/dist'
const entry = './wwwroot/js/app.js'
const cssOutput = 'site.css'

module.exports = (env) => {    
    return [{
        entry: entry,
        output: {
            path: path.join(__dirname, outputDir),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader'],
                        fallback: 'style-loader'
                    })
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader', 'sass-loader' ],
                        fallback: 'style-loader'
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin(cssOutput),
            new PurgecssPlugin({
                paths: glob.sync('./Views/**/*.cshtml', { nodir: true }),
                whitelistPatterns: [ /selectize-.*/ ]
            })
        ]
    }]
}
```

The plugin accepts an array of paths to view files to search for css selectors in use. The glob package accepts a search pattern 
and generates a list of files. I am looking for .cshtml view files in my .net web app.

```javascript
paths: glob.sync('./Views/**/*.cshtml', { nodir: true })
```

The whitelistPatterns parameter allows you to exclude selectors from the purge that may not have been present in the paths. 
I found that the [selectize plugin](https://selectize.github.io/selectize.js/) I am using has css classes that are added dynamically and were being removed 
so I added a pattern to match the prefix of its css classes. I could alternatively include the .js file for this plugin with the paths parameter.

```javascript
whitelistPatterns: [ /selectize-.*/ ]
```

Running PurgeCSS on one of my (admittedly heavy) bootstrap based web sites reduced the css file size from 159KB to 60KB with essentially no effort on my end!

![PurgeCSS](/img/posts/purgecss-results.png)