import 'jasmine';
import { promises } from 'fs';
import { readStage, splitInSteps, readDockerfile } from '../src/read-dockerfile';
import { loadOptions } from '../src/options';
import { getLogger } from '../src/logger';

interface ReadDockerfileThisContext {
    fsReadFile: jasmine.Spy<typeof promises.readFile>;
}

describe('readDockerfile', () => {

    describe('readDockerfile', () => {

        beforeAll(async () => {
            await loadOptions([]);
        });

        beforeEach(function (this: ReadDockerfileThisContext) {
            this.fsReadFile = spyOn(promises, 'readFile');
        });

        it('should return no stages if file is empty', async function (this: ReadDockerfileThisContext) {
            this.fsReadFile.and.resolveTo('');
            const oldLogLevel = getLogger().level;
            getLogger().level = 'error';
            const result = await readDockerfile('Dockerfile');
            getLogger().level = oldLogLevel;
            expect(result).toEqual([]);
        });

        it('should return one stage from dockerfile', async function (this: ReadDockerfileThisContext) {
            this.fsReadFile.and.resolveTo([
                'FROM nginx:latest',
                'COPY ./file ./somewhere',
                'RUN npm i',
                'RUN npm run prepare',
            ].join('\n'));
            const result = await readDockerfile('Dockerfile');
            expect(result).toEqual([{
                baseImage: 'nginx:latest',
                name: undefined,
                stepsBeforeInstall: ['COPY ./file ./somewhere'],
                stepsAfterInstall: ['RUN npm run prepare'],
                hasInstall: true,
            }]);
        });

        it('should return one stage from dockerfile with yarn install', async function (this: ReadDockerfileThisContext) {
            this.fsReadFile.and.resolveTo([
                'FROM nginx:latest',
                'COPY ./file ./somewhere',
                'RUN yarn i',
                'RUN npm run prepare',
            ].join('\n'));
            const result = await readDockerfile('Dockerfile');
            expect(result).toEqual([{
                baseImage: 'nginx:latest',
                name: undefined,
                stepsBeforeInstall: ['COPY ./file ./somewhere'],
                stepsAfterInstall: ['RUN npm run prepare'],
                hasInstall: true,
            }]);
        });

        it('should return multiple stages from dockerfile', async function (this: ReadDockerfileThisContext) {
            this.fsReadFile.and.resolveTo([
                'FROM node:14 as build',
                'COPY ./file ./somewhere',
                'RUN npm i',
                'RUN npm run build',
                'FROM nginx:latest',
                'RUN npm install',
                'ENTRYPOINT ["entrypoint.sh"]',
            ].join('\n'));
            const result = await readDockerfile('Dockerfile');
            expect(result).toEqual([
                {
                    baseImage: 'node:14',
                    name: 'build',
                    stepsBeforeInstall: ['COPY ./file ./somewhere'],
                    stepsAfterInstall: ['RUN npm run build'],
                    hasInstall: true,
                },
                {
                    baseImage: 'nginx:latest',
                    name: undefined,
                    stepsBeforeInstall: [],
                    stepsAfterInstall: ['ENTRYPOINT ["entrypoint.sh"]'],
                    hasInstall: true,
                },
            ]);
        });

    });

    describe('readStage', () => {
        it('should return undefined if no stages are available', () => {
            const dockerfile: string[] = [];
            const result = readStage(dockerfile, 0);
            expect(result).toBeUndefined();
        });

        it('should return undefined if the dockerfile only contains a comment', () => {
            const dockerfile = [
                '# THIS is a comment',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).toBeUndefined();
        });

        it('should return undefined if no more stages are left after start index', () => {
            const dockerfile = [
                'FROM nginx:latest as foo-stage',
                '# THIS is a comment',
            ];
            const result = readStage(dockerfile, 1);
            expect(result).toBeUndefined();
        });

        it('should return stage with baseimage', () => {
            const dockerfile = [
                'FROM nginx:latest',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).not.toBeUndefined();
            expect(result!.stage.baseImage).toBe('nginx:latest');
        });

        it('should return stage with stage name', () => {
            const dockerfile = [
                'FROM nginx:latest as foo-stage',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).not.toBeUndefined();
            expect(result!.stage.name).toBe('foo-stage');
        });

        it('should return stage with without steps', () => {
            const dockerfile = [
                'FROM nginx:latest as foo-stage',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).not.toBeUndefined();
            expect(result!.stage.stepsBeforeInstall.length).toBe(0);
            expect(result!.stage.stepsAfterInstall.length).toBe(0);
        });

        it('should return stage with without steps when new stage starts', () => {
            const dockerfile = [
                'FROM nginx:latest as foo-stage',
                'FROM nginx:latest as foo-stage',
                'COPY ./something ./somewhere',
                'RUN echo Foo',
                'RUN npm i',
                'RUN echo Bar',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).not.toBeUndefined();
            expect(result!.stage.stepsBeforeInstall.length).toBe(0);
            expect(result!.stage.stepsAfterInstall.length).toBe(0);
        });

        it('should return stage with steps before install', () => {
            const dockerfile = [
                'FROM nginx:latest as foo-stage',
                'COPY ./something ./somewhere',
                'RUN echo Foo',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).not.toBeUndefined();
            expect(result!.stage.stepsAfterInstall.length).toBe(0);
            expect(result!.stage.stepsBeforeInstall.length).toBe(2);
        });

        it('should return stage with steps before and after npm i', () => {
            const dockerfile = [
                'FROM nginx:latest as foo-stage',
                'COPY ./something ./somewhere',
                'RUN npm i',
                'RUN echo Foo',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).not.toBeUndefined();
            expect(result!.stage.stepsAfterInstall.length).toBe(1);
            expect(result!.stage.stepsBeforeInstall.length).toBe(1);
        });

        it('should return stage with steps before and after npm install', () => {
            const dockerfile = [
                'FROM nginx:latest as foo-stage',
                'COPY ./something ./somewhere',
                'RUN npm install',
                'RUN echo Foo',
            ];
            const result = readStage(dockerfile, 0);
            expect(result).not.toBeUndefined();
            expect(result!.stage.stepsAfterInstall.length).toBe(1);
            expect(result!.stage.stepsBeforeInstall.length).toBe(1);
        });
    });

    describe('splitInSteps', () => {
        it('should return empty array if empty string is provided', () => {
            expect(splitInSteps('').length).toBe(0);
        });
        it('should return empty array if string with empty lines is provided', () => {
            const string = '\n\n\n';
            expect(splitInSteps(string).length).toBe(0);
        });
        it('should return content of one line', () => {
            const string = 'foo';
            expect(splitInSteps(string)).toEqual(['foo']);
        });
        it('should return content of multiple lines', () => {
            const string = 'foo\nbar\nasdf';
            expect(splitInSteps(string)).toEqual(['foo', 'bar', 'asdf']);
        });
        it('should return content of multiple lines with multiline step', () => {
            const string = 'foo\nbar\\\nasdf';
            expect(splitInSteps(string)).toEqual(['foo', 'bar\\\nasdf']);
        });
    });
});
