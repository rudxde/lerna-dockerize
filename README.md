# lerna-dockerize

lerna-dockerize is a package, that generates a dockerfile for lerna (see [github/lerna](https://github.com/lerna/lerna) for more information about lerna) projects. 

It generates an multistage build Dockerfile, with stages for each package.

## install

```
npm i --save-dev lerna-dockerize
```

## project setup

You will need at least two dockerfiles.

### Base Dockerfile

The base dockerfile should contain lerna and the lerna configuration. It will be build first and should be used in every other dockerfile as source in the ```FROM``` clause. In this dockerfile you should copy every file which you need from you root project.

Create the file `Dockerfile.base` in your projects root and add the following content:

```
FROM node:14 as base
COPY ./package.json ./
RUN npm i
COPY ./lerna.json ./
```

In the end an Dockerstage will be created based on the last Base Dockerfile stage containg ever package

### Custom package Dockerfile

You can create an custom Dockerfile for each package. If a package has no Dockerfile lerna-dockerize will try to use the template Dockerfile. The Dockerfile's working directory will be set inside the package directory. You don't need to perform `lerna bootstrap` on your own. just add the line `RUN npm install` and lerna dockerize will handle the bootstrapping.

#### Multiple stages

You can use multiple stages in each stage an ```RUN npm install``` step will be replaced by bootstrapping and adding the dependent packages. The last stage of the dockerfile will be used for the install into other packages. The names of the stages will be scoped with the package name as a prefix.

### Template Dockerfile

The template Dockerfile will be used inside of each package, which doesn't provide its own dockerfile. The template Dockerfile will behave like an custom package Dockerfile.

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
        "lerna-dockerize": "lerna-dockerize",
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
npx lerna-dockerize
```


This will output an Dockerfile in your projects root.


## Docker file syntax extension

lerna-dockerize adds an flag to the Dockerfile syntax, which you can optionally use.

### --if-exists
The ```--if-exists``` flag can be added to docker ```RUN``` statements with an npm script and ```COPY``` without a ```--from``` flag statements.

At ```RUN --if-exists npm run <script>``` lerna-dockerize will look if the script exists for an package. If not, the command will be ignored.

The ```COPY --if-exists <source>... <dest>``` will look for each source if it exists and will remove missing files from the ```COPY``` command. If none of the files exists the command will be ignored.

 