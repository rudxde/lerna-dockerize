# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.9.1](https://github.com/rudxde/lerna-dockerize/compare/v0.9.0...v0.9.1) (2022-04-02)

**Note:** Version bump only for package @lerna-dockerize/init





# [0.9.0](https://github.com/rudxde/lerna-dockerize/compare/v0.8.4...v0.9.0) (2022-03-20)


### Bug Fixes

* **init:** linting issues ([015764f](https://github.com/rudxde/lerna-dockerize/commit/015764f440d90bcc45fe3bc44f160af72b2fcba1))
* **init:** path of templates ([007541a](https://github.com/rudxde/lerna-dockerize/commit/007541a475ce9da0ce8ae50ea59f09d45d21ccc4))


### Features

* **cli:** make default command dynamic ([886aa19](https://github.com/rudxde/lerna-dockerize/commit/886aa19ad4f603d4d3ba2ca0e169b76e7c464ae0))
* **generate:** extract generate code into separate module [#271](https://github.com/rudxde/lerna-dockerize/issues/271) ([b78217d](https://github.com/rudxde/lerna-dockerize/commit/b78217d0da06a58515e3e54027cb084413a3b390))
* **init:** add description to options ([d4ec08f](https://github.com/rudxde/lerna-dockerize/commit/d4ec08f83604dd6e215591504e93f3956542924f))
* **init:** add entries to .gitignore ([47bc39f](https://github.com/rudxde/lerna-dockerize/commit/47bc39fcba5f977d7ae484c730c37a15c9c3e163))
* **init:** add first implementation ([486fbe5](https://github.com/rudxde/lerna-dockerize/commit/486fbe5ae81d07336d38d2f7632d10443587427f))
* **init:** add hint to start lerna-dockerize ([8d18a35](https://github.com/rudxde/lerna-dockerize/commit/8d18a35fc7b921668a15698fd7b044fe54f7ab0d))
* **init:** add lerna dockerize script on init ([2cee74f](https://github.com/rudxde/lerna-dockerize/commit/2cee74fab5411e45e1dddd90b2f5cfc6671d0152))
* **init:** add ora spinner ([e86d494](https://github.com/rudxde/lerna-dockerize/commit/e86d4949c8123aaa2f9e3c1f1a2259279a7a02bd))
* **init:** include templates in npm package ([b51a8eb](https://github.com/rudxde/lerna-dockerize/commit/b51a8eb0941012fdba1d43f5ae95b2b28d6f1f2c))
* **lerna-dockerize:** add init command to main cli ([a1ba0a0](https://github.com/rudxde/lerna-dockerize/commit/a1ba0a09cdd8b36dc10e70a47bddde8c1ba63f99)), closes [#269](https://github.com/rudxde/lerna-dockerize/issues/269)





## [0.7.1](https://github.com/rudxde/lerna-dockerize/compare/v0.7.0...v0.7.1) (2021-08-16)

**Note:** Version bump only for package lerna-dockerize





# [0.7.0](https://github.com/rudxde/lerna-dockerize/compare/v0.6.0...v0.7.0) (2021-07-12)


### Bug Fixes

* remove lerna version: vundefined logging at startup ([ec0a49e](https://github.com/rudxde/lerna-dockerize/commit/ec0a49e8bfc303439012902eb7a81c327164c232))


### Features

* add support for --platform flag for dockerfile FROM instruction ([f7e3f40](https://github.com/rudxde/lerna-dockerize/commit/f7e3f40922b5acdc98f49b905928b3b9ecfe7bf3))





# [0.6.0](https://github.com/rudxde/lerna-dockerize/compare/v0.5.0...v0.6.0) (2021-06-17)


### Features

* add support for install parameters ([bd9f626](https://github.com/rudxde/lerna-dockerize/commit/bd9f6264344c1f4765995570f1b6f7ecfca3fcc3))
* add warning for misuse of the --if-exists flag in the RUN command ([6f17659](https://github.com/rudxde/lerna-dockerize/commit/6f176599d41e5bc69c0ffb3894b4e5b0c9dc9687))





# [0.5.0](https://github.com/rudxde/lerna-dockerize/compare/v0.4.1...v0.5.0) (2021-06-12)


### Bug Fixes

* add support for custom registry and digest for images ([7e0486a](https://github.com/rudxde/lerna-dockerize/commit/7e0486a7fe1069a1ac2b0f376e5439f7b566315b)), closes [#53](https://github.com/rudxde/lerna-dockerize/issues/53)


### Features

* add finalStage option to enable or disable final stage generation ([1a57118](https://github.com/rudxde/lerna-dockerize/commit/1a57118d5f51002a40f06269bce6127742371ecc))
* add possibility to set options in lerna.json ([efd6eaa](https://github.com/rudxde/lerna-dockerize/commit/efd6eaacea761c34966d766285a27563bb1de9d4))





## [0.4.1](https://github.com/rudxde/lerna-dockerize/compare/v0.4.0...v0.4.1) (2021-05-25)


### Bug Fixes

* add prepare stage only when npm install is present ([bd9836a](https://github.com/rudxde/lerna-dockerize/commit/bd9836af42075428ac685ace844f3bf60caa6ea0))
* await yargs.parse for support of new yargs typings version ([a2951a0](https://github.com/rudxde/lerna-dockerize/commit/a2951a031add69058eb1db6fd417fe783af8c4b0))





# [0.4.0](https://github.com/rudxde/lerna-dockerize/compare/v0.3.0...v0.4.0) (2021-05-17)


### Features

* add package.json slimming ([29d5a49](https://github.com/rudxde/lerna-dockerize/commit/29d5a49d2dc0b05891366893e6850e758a58c93f))
* split stages into extra prepare stage ([e5dae45](https://github.com/rudxde/lerna-dockerize/commit/e5dae45a228a7b911f29986be0c75a9d4d75224c))





# [0.3.0](https://github.com/rudxde/lerna-dockerize/compare/v0.2.0...v0.3.0) (2021-05-05)


### Bug Fixes

* right array index for extendet-docker-syntax if exists npm run ([15dafbe](https://github.com/rudxde/lerna-dockerize/commit/15dafbe0eaddfb30e701a019e2a93658216c9a97))


### Features

* add hoist option ([7520090](https://github.com/rudxde/lerna-dockerize/commit/7520090bfb45dadbdcb962219acc0583950d70a0))
* add option to overwrite final stage ([12f527f](https://github.com/rudxde/lerna-dockerize/commit/12f527fc8103ba5e5f7105ff811bd3ea03e4c810))
* add support for local scripts for RUN --if-exists ([00e70e8](https://github.com/rudxde/lerna-dockerize/commit/00e70e8bcfbae9db5497e7cc348d355add5da7c3))
* add warning if Dockerfile was parsed as empty ([5f57510](https://github.com/rudxde/lerna-dockerize/commit/5f57510ba9dcc2d38f3210ec5fd633b6accba4bb))
* set yargs help width to terminal width ([844876f](https://github.com/rudxde/lerna-dockerize/commit/844876f479635fb39b9add41df38726a711545f1))
* setup logging ([4f52602](https://github.com/rudxde/lerna-dockerize/commit/4f52602645176aee798bb27ad7d3ddf5bf1f4061))





# [0.2.0](https://github.com/rudxde/lerna-dockerize/compare/v0.1.0...v0.2.0) (2021-04-25)


### Features

* add dockerfileWorkingDir option ([f237a16](https://github.com/rudxde/lerna-dockerize/commit/f237a16bc7f66b6882862ed7a2c293c4f77c6901))
* add lernaCommand option ([b8bdd51](https://github.com/rudxde/lerna-dockerize/commit/b8bdd5163ede77e10d73f0dabee1af882a87de31))
* add outDockerfileName option ([c875f9a](https://github.com/rudxde/lerna-dockerize/commit/c875f9a970c8ddc9375ac2208117b6f900ccd1bb))
* add support for yarn install ([e89ecc6](https://github.com/rudxde/lerna-dockerize/commit/e89ecc6b12b7f3e7551df835e245f1a8c81fb6c7))
* setup yargs and add base and template dockerfile option ([8df310a](https://github.com/rudxde/lerna-dockerize/commit/8df310a82b973e2cf2a6723a5b13350520994e97))





# 0.1.0 (2021-04-23)


### Bug Fixes

* adapt package bin to work with windows ([80c37cd](https://github.com/rudxde/lerna-dockerize/commit/80c37cd923175c7a451d791092795a23d1fa15d2))
* add bin.js with nodeenv header for cli script ([5a7d5e6](https://github.com/rudxde/lerna-dockerize/commit/5a7d5e6137ac43027978b86a9dc17345eca10065))
* linting errors ([07bc7a4](https://github.com/rudxde/lerna-dockerize/commit/07bc7a40388c0333fe27a78fa8fa65f82b5f4e58))
* replace local package stage name in from clause through scoped name ([cc18fba](https://github.com/rudxde/lerna-dockerize/commit/cc18fbae563f08e804f4bb0e8b580f21a5d08033))
* tests ([8a9bd2c](https://github.com/rudxde/lerna-dockerize/commit/8a9bd2c368c0f68f5c74b158ef901aff611e1cd4))


### Features

* add npm:publish script ([cd67247](https://github.com/rudxde/lerna-dockerize/commit/cd67247c0bfe3e1149b2cfc3201013a8aa821047))
* setup lerna ([693f440](https://github.com/rudxde/lerna-dockerize/commit/693f440f151dacb1a94806de1c8956ec2a304bf7))
