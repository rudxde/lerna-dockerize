import 'jasmine';
import { join } from 'path';
import { run } from './run';
import { promises } from 'fs';
import { deleteIfExists } from './delete-if-exists';


describe('integration', () =>
    ['simple', 'config-file', 'if_exists', 'custom_dockerfile', 'hoist', 'split-stages']
        .forEach(testCase =>
            describe(testCase, () => {
                afterAll(async function cleanup() {
                    await deleteIfExists(`./${testCase}/Dockerfile`);
                    await deleteIfExists(`./${testCase}/packages/a/package-slim.json`);
                    await deleteIfExists(`./${testCase}/packages/b/package-slim.json`);
                    await deleteIfExists(`./${testCase}/packages/c/package-slim.json`);
                });

                it('should start', async () => {
                    const packageJson: any = JSON.parse((await promises.readFile(join(__dirname, `./${testCase}/package.json`))).toString());
                    if (!packageJson.scripts || !packageJson.scripts['lerna-dockerize']) {
                        throw new Error(`Missing script lerna-dockerize for test-case ${testCase}!`);
                    }
                    const command = packageJson.scripts['lerna-dockerize'].split(' ');
                    command[0] = join(__dirname, '../../dist/index.js');
                    await run(
                        'node',
                        command,
                        join(__dirname, `./${testCase}`),
                    );
                });

                it('Dockerfile should match the expected Dockerfile', async () => {
                    const [
                        result,
                        expected,
                    ] = await Promise.all([
                        promises.readFile(join(__dirname, `./${testCase}/Dockerfile`)).then(x => x.toString()),
                        promises.readFile(join(__dirname, `./${testCase}/Dockerfile.expected`)).then(x => x.toString()),
                    ]);
                    expect(result).toEqual(expected);
                });
            })),
);
