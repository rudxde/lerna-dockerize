# lerna-dockerize

>  .  
> **Please read the issue about the discontinuation of lerna-dockerize: [Discontinuation of Active Maintenance for "lerna-dockerize"](https://github.com/rudxde/lerna-dockerize/issues/2055)**  
>  .


[![build and test](https://github.com/rudxde/lerna-dockerize/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/rudxde/lerna-dockerize/actions/workflows/build-and-test.yml)

lerna-dockerize is a package, that generates a dockerfile for lerna (see [github/lerna](https://github.com/lerna/lerna) for more information about lerna) projects. 

It generates a multistage build Dockerfile, with stages for each package.

## Software requirements

The current nodejs major versions 14.x 16.x, 18.x and 19.x are supported.  

> Dockerfiles generated with `lerna-dockerize` work with the default docker builder, but it is recommended to use the new [Docker BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) engine. With Docker BuildKit and the use of the [`addPrepareStages`](#configuration) option, you can get more speed out of your builds.

## install

```
npm i --save-dev lerna-dockerize
```


## Examples

Inside the [test/integration](./packages/lerna-dockerize/test/integration) folder are some example setups, where the expected outcome is named 'Dockerfile.expected'.


## Project setup

From version 0.9.0 you can use the init command to setup an new Project. You need to have setup lerna, afterwards you can run 
```
npx lerna-dockerize init
```
this will install lerna dockerize and setup the required configs.

### Manual setup

You will need at least two dockerfiles.

### Base Dockerfile

The base dockerfile should contain lerna and the lerna configuration. It will be built first and should be used in every other dockerfile as source in the ```FROM``` clause. In this dockerfile you should copy every file which you need from you root project.

Create the file `Dockerfile.base` in your projects root and add the following content:

```
FROM node:14 as base
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY ./lerna.json ./
```

In the end a Dockerstage will be created based on the last Base Dockerfile stage contains ever package

#### Global Arg's

In dockerfile's it is supported to define `ARG` instructions before any `FROM` clause. ([Docker Understand how ARG and FROM interact](https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact)). This behavior is partly supported by lerna-dockerize. Only `ARG` instructions from the base dockerfile before the `FROM` instruction will be taken into account, the instructions from any other Dockerfile before the first stage/`FROM` clause will be ignored. The `ARG`'s defined in the base dockerfile will be available in any stage of any dockerfile.

### Custom package Dockerfile

You can create a custom Dockerfile for each package. If a package has no Dockerfile lerna-dockerize will try to use the template Dockerfile. The Dockerfile's working directory will be set inside the package directory. You don't need to perform `lerna bootstrap` on your own. just add the line `RUN npm install` and lerna dockerize will handle the bootstrapping.

#### install/bootstrap parameters

You can add parameters to the `RUN npm install` command, to customize the install. `lerna-dockerize` supports currently the `--production`, the `--ignore-scripts`, `--ci` and the `--no-ci` parameters.

The command
```
RUN npm ci
```
will result in the same result as 
```
RUN npm i --ci
```

#### Multiple stages

You can use multiple stages. In each stage a ```RUN npm install``` step will be replaced by bootstrapping and adding the dependent packages. The last stage of the dockerfile will be used for the dependent packages, to install the package. The names of the stages will be scoped with the package name as a prefix.

### Template Dockerfile

The template Dockerfile will be used inside of each package, which doesn't provide its own dockerfile. The template Dockerfile will behave like a custom package Dockerfile.

Create the file `Dockerfile.template` with your required steps for your packages:
```
FROM base as build

COPY ./package.json ./

RUN npm install

RUN --if-exists npm run build
```


## generate dockerfile

add a npm script to your package.json:
```
{
    "scripts": {
        "lerna-dockerize": "lerna-dockerize --template-dockerfile-name Dockerfile.template",
    }
}
```
and run it:
```
npm run lerna-dockerize
```

### npx

or run it over npx:
```
npx lerna-dockerize --template-dockerfile-name Dockerfile.template
```


This will output a Dockerfile in your projects root.

## Configuration

You can configure lerna dockerize over parameters or entries to the `lerna.json` file.  Each option can be set as command line parameter or key inside the config file inside the `lerna-dockerize` object.

For example:
`lerna.json`
```
{
  "packages": [
    "packages/*"
  ],
  "version": "1.0.0",
  "lerna-dockerize": {
    "logLevel": "error",
    "templateDockerfileName": "Dockerfile.template"
  }
}
```


The following options do exists:

| Option                 | cli parameter                    | description                                                                                | details                                                                |
|------------------------|----------------------------------|--------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| baseDockerfileName     | --baseDockerfileName [value]     | The name of the base Dockerfile.                                                           | [string] [default: "Dockerfile.base"]                                  |
| templateDockerfileName | --templateDockerfileName [value] | The name of the Dockerfile template for all packages.                                      | [string]                                                               |
| finalStage             | --no-finalStage                  | Should a final stage be added, which combines all packages.                               | [boolean] [default: true]                                              |
| finalDockerfileName    | --finalDockerfileName [value]    | Dockerfile-Name for custom final stages.                                                   | [string]                                                               |
| outDockerfileName      | --outDockerfileName [value]      | Name for where output Dockerfile should be stored.                                         | [string] [default: "Dockerfile"]                                       |
| dockerfileWorkingDir   | --dockerfileWorkingDir [value]   | The root working directory for the created dockerfile                                      | [string] [default: "/app/"]                                            |
| packageManager         | --packageManager [value]         | The package manager used by the project.                                                   | [string] [choices: "npm", "yarn"] [default: "npm"]                     |
| lernaCommand           | --lernaCommand [value]           | The command used to call lerna inside the Dockerfile.                                      | [string] [default: "npx lerna"]                                        |
| logLevel               | --logLevel [value]               | The level which should be logged.                                                          | [string] [choices: "info", "error", "debug", "warn"] [default: "info"] |
| logConsole             | --no-logConsole                  | Should be logged to the console                                                            | [boolean] [default: true]                                              |
| hoist                  | --hoist                          | Should the hoist option of lerna be used inside the generated dockerfile                   | [boolean] [default: false]                                             |
| addPrepareStages       | --addPrepareStages               | Should stages be split into extra prepare stage. Works the best with Docker BuildKit.      | [boolean] [default: false]                                             |



## Dockerfile syntax extension

lerna-dockerize adds a flag to the Dockerfile syntax, which you can optionally use.

### --if-exists
The ```--if-exists``` flag can be added to docker ```RUN``` statements with a npm script and ```COPY``` without a ```--from``` flag statements.

At ```RUN --if-exists ./<local file>``` lerna-dockerize will look if the executable exists inside the package. If not, the command will be ignored.

_Important: lerna-dockerize doesn't check if the file is inside the container. The RUN will be executed also if the file exists only locally._

For ```RUN --if-exists npm run <script>``` lerna-dockerize will look if the npm script exists for a package. If not, the command will be ignored.

The ```COPY --if-exists <source>... <dest>``` will look for each source if it exists and will remove missing files from the ```COPY``` command. If none of the files exists, the command will be ignored.

### --slim

The --slim flag is used to slim down package.json files to the only required fields for installing dependencies. This makes development easier, so not every change to your package json files will trigger a new install inside the building docker container.

just use the --slim flag inside the ```COPY``` statement:
```
COPY --slim ./package.json ./
RUN npm install
COPY ./package.json ./
```

> If you want to use --if-exists and --slim in parallel, the --if-exists needs to be written first.

