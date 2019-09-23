# value-retail

## Requirements

For UI build and development requires [node.js >= 4.4.0](http://nodejs.org/) and [npm >= 2.14.20](https://www.npmjs.org/)
Note: You need to install stable Node.js versions >= 4.4.0.
Odd version numbers of Node.js are considered
unstable development versions.

To install other node versions
you need [nvm](https://www.npmjs.org/package/nvm).
To check which version you are running:

	node --version

To install another version run:

	nvm install v4.4.0

You will then need [Grunt](http://gruntjs.com) and [Bower](http://bower.io).

## Getting Started

To globally install Grunt, Bower and Modernizr run the following from the command line:

	npm install -g grunt-cli bower modernizr

Install Grunt plugins and other dependencies:

	npm install

Install Bower components

	bower install

Install fontforge for icon webfont generator

On Mac:

brew install ttfautohint fontforge --with-python

On Windows:

npm install grunt-webfont --save-dev

## Upgrading

If you'd like to upgrade to a newer version of the project's dependencies down the road just run:

	bower update

## Back-end and Front-end developers & deployment tasks

Run `gulp` or `gulp dev` for front-end development and `grunt build`
to get front-end's assets folder production ready into the DOTNET folder for Umbraco to manage them.
