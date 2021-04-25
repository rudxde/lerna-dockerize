import { Command } from '@lerna/command';
import { getFilteredPackages } from '@lerna/filter-options';
import { Package } from '@lerna/package';
import { promises } from 'fs';
import { irrerateDependencies } from './itterate-dependencies';
import { getOptions } from './options';
import { PackageMap } from './package';
import { readDockerfile } from './read-dockerfile';

export class Dockerize extends Command {
    filteredPackages: Package[] = [];

    get requiresGit(): boolean {
        return false;
    }
    async initialize(): Promise<void> {
        this.filteredPackages = await getFilteredPackages(this.packageGraph, this.execOpts, this.options);
    }
    async execute(): Promise<void> {
        const baseDockerFile = await readDockerfile(getOptions().baseDockerfileName);
        const templateDockerFileName = getOptions().templateDockerfileName;
        let defaultDockerFile = undefined;
        if (templateDockerFileName) {
            defaultDockerFile = await readDockerfile(templateDockerFileName);
        }

        const baseStage = baseDockerFile[baseDockerFile.length - 1];
        baseStage.name = 'base';

        const result: string[] = [];
        for (let baseStage of baseDockerFile) {
            result.push(`FROM ${baseStage.baseImage} as ${baseStage.name!}`);
            result.push(...baseStage.stepsBeforeInstall);
            if (baseStage.hasInstall) {
                result.push(`RUN ${getOptions().packageManager} install`);
                result.push(...baseStage.stepsAfterInstall);
            }
        }
        const packages = await irrerateDependencies(this.filteredPackages, this.packageGraph, this.concurrency, this.options.rejectCycles, defaultDockerFile);

        const packageMap: PackageMap = new Map();
        for (let pkg of packages) {
            packageMap.set(pkg.name, pkg);
        }
        for (let pkg of packages) {
            result.push(`# Package ${pkg.name}`);
            const finalPackageDockerfile = await pkg.getFinalizedBuildStages(packageMap);
            result.push(...finalPackageDockerfile);
        }

        // finalStage
        result.push(`# final stage`);
        result.push(`FROM ${baseStage.name}`);
        for (let pkg of packages) {
            result.push(`COPY --from=${pkg.getBuildStageName()} ${pkg.dockerWorkingDir} ${pkg.dockerWorkingDir}`);
        }
        await promises.writeFile(getOptions().outDockerfileName, result.join('\n'));
    }
}
