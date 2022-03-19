import 'jasmine';
import { promises } from 'fs';
import { slimPackage } from '../src/slim-package';

interface IThisContext {
    readFileSpy: jasmine.Spy;
    writeFileSpy: jasmine.Spy;
}

describe('slimPackage', () => {
    beforeEach(function beforeEach(this: IThisContext) {
        this.readFileSpy = spyOn(promises, 'readFile');
        this.writeFileSpy = spyOn(promises, 'writeFile');
    });

    it('should slim package.json', async function (this: IThisContext) {
        const slimmedPackage = {
            name: 'my-package',
            version: '69',
            dependencies: {
                'lerna-dockerize': '^0.1.0',
            },
            devDependencies: {
                typescript: '1.0.0',
            },
            peerDependencies: {
                pear: 'latest',
            },
        };
        const extendetPackage = {
            ...slimmedPackage,
            scripts: {
                start: 'npm run loop',
                loop: 'npm start',
            },
        };
        this.readFileSpy.and.returnValue(JSON.stringify(extendetPackage));
        const packageDir = './somewhere';
        const packageFilePath = `${packageDir}/package.json`;
        const slimPackageFilePath = `${packageDir}/package-slim.json`;
        await slimPackage(packageFilePath);
        expect(this.readFileSpy).toHaveBeenCalledWith(packageFilePath);
        expect(this.writeFileSpy).toHaveBeenCalledWith(slimPackageFilePath, JSON.stringify(slimmedPackage, undefined, 4));
    });
});
