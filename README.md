# angular-modernizr
Sample Grunt Bower Angular Modernizr application

It is a sample test ember application. It realize a simple angular modernizr boostrap service.
An init and build script are provided with the source.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Pre-Requisites

This project requires `Ruby` and `compass` for building and `grunt serve` the preview.
You can find `Ruby 2.3.0` at [Ruby Installation Page] (http://www.ruby-lang.org/en/documentation/installation)

After you have installed `Ruby 2.3.0` you can install on the system shell compass with this two commands:

`ruby update` : > gem update --system

`compass install` : > gem install compass

Please run the `NODE and NPM` maven install (`install-platform`) and the `pre-build` process to setup environment or simply install npm and bower (`npm install` & `bower install`)

## Build & Export

Run `grunt` or `grunt build` for building and `grunt serve` for preview.
Tests and jshint are required before to compile and distribute the app in the folder `build` in a folder that matches with the application name. A junit and a cobertura reports are provided in the same folder inside the container folder `tests`.


## Build & Deployment

A maven POM procedure runs new features :

build:
`mvn clean install -P build,package`

(NOTE: In the target directory will be created during the package a war file. To be completed: The executable running external services.)

install NODE and NPM:
`mvn clean install -P install-platform`

(NOTE: In the build/bin directory will be installed the executables.)

run NPM and bower install of dependency packages:
`mvn clean install -P pre-build`

(NOTE: This profile installs all the dependecies for NPM and bower configuration files.)


## Testing

Running `grunt test` will run the unit tests with karma. Test cases are running before the build as pre-requisites.
Running the tests a junit and a cobertura reports have been created  in the `dist` folder inside the container folder `tests`.
Testing frameworks : `karma, jasmine, mocha, chai, sinon`
