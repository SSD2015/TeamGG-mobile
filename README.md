![Exceed Vote logo](logo.png)

[![Codacy Badge](https://www.codacy.com/project/badge/89fdb92d305e4900b164b8be2d450a17)](https://www.codacy.com/public/manatsawin/TeamGG-mobile)

This repository contains the mobile part of Exceed Vote by TeamGG.

The server side is located at [SSD2015/TeamGG](https://github.com/SSD2015/TeamGG). All issues of both repository should be reported there.

## Running

You need [Ionic Framework](http://ionicframework.com/getting-started/) to build this.

### Development server

To run the development server,

```sh
ionic serve
```

Your browser will automatically navigates to the development server.

### Running

To run a debug application, plug in your Android phone and type

*(first time only)*

```sh
ionic platform add android
```

Then for every time you want to run,

```sh
ionic run
```

## Contributing note

The application should be completely working in the development server (don't depends on plugins, if you need to make it optional). This is because the application will need to be installed as web page too.