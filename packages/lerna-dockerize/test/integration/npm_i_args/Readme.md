# Simple project setup

This project setup contains 3 packages, who are dependant of each other. The `dockerfile.base` and `Dockerfile.template` are used by `lerna-dockerize` to generate the out coming dockerfile.

`lerna-dockerize` is started over an npm command inside the root package.json.

The file `Dockerfile.template` will be used for each service. It uses the `--slim` flag from the extendet Dockerfile syntax.
