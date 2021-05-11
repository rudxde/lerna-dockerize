# How to contribute to lerna-dockerize

## Have you found a bug or have a problem?
* __Ensure the bug was not already reported__, by searching on GitHub under Issues.
    * Take part of the discussion
* If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring. __Use the bug Template__

## Do you intend to add a new feature or change an existing one?
* __Ensure the feature is not already a listed as a Github issue__


## Have you written a patch that fixes a bug or implemented a new feature?
* Open a new GitHub pull request with the patch.
* Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

### Format of the commit messages
* see [format of the commit message](https://www.conventionalcommits.org/en/v1.0.0/)


## How To - Develop

### Setup dev environment

You will need to have the following tools installed.:
* [GIT](https://git-scm.com/)
* [Node and Npm](https://nodejs.org/en/)

We recommend that you use [Visual Studio Code](https://code.visualstudio.com/) as IDE.

#### Clone repository and install dependencies

run
```
$ git clone https://github.com/rudxde/lerna-dockerize.git
```
to clone lerna-dockerize on your machine.

Now you need to install all npm packages:
```
$ npm install
```

#### Build the project and run tests

Simply use the npm scripts inside the project. To build the app, just run ```npm run build```, to run the tests: ```npm run test``` and to check the linting, run ```npm run lint```.