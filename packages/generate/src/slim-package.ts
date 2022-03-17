import { promises } from 'fs';
import { getLogger } from '@lerna-dockerize/logger';

export async function slimPackage(file: string): Promise<string> {
    getLogger().info(`Slimming ${file}.`);
    const packageJsonRaw = (await promises.readFile(file)).toString();
    const packageJson = JSON.parse(packageJsonRaw);
    const result = {
        name: packageJson.name,
        version: packageJson.version,
        dependencies: packageJson.dependencies,
        devDependencies: packageJson.devDependencies,
        peerDependencies: packageJson.peerDependencies,
    };
    const slimPackageFileName = file.replace('package.json', 'package-slim.json');
    await promises.writeFile(slimPackageFileName, JSON.stringify(result, undefined, 4));
    return slimPackageFileName;
}
