import { Command } from '@lerna/command';
import { getFilteredPackages } from '@lerna/filter-options';
import { Package as LernaPackage } from '@lerna/package';
import { promises } from 'fs';
import { irrerateDependencies } from './itterate-dependencies';
import { getLogger } from '@lerna-dockerize/logger';
import { IGenerateArgs } from './args';
import { Package, PackageMap } from './package';
import { DockerStage, readDockerfile } from './read-dockerfile';

export class Dockerize extends Command {
    filteredPackages: LernaPackage[] = [];

    constructor(
        private args: IGenerateArgs,
    ) {
        super({ composed: '' });
    }

    get requiresGit(): boolean {
        return false;
    }
    async initialize(): Promise<void> {
        this.filteredPackages = await getFilteredPackages(this.packageGraph, this.execOpts, this.options);
    }
    async execute(): Promise<void> {
        try {
            const baseDockerFile = await readDockerfile(this.args.baseDockerfileName);
            const templateDockerFileName = this.args.templateDockerfileName;
            let defaultDockerFile = undefined;
            if (templateDockerFileName) {
                defaultDockerFile = await readDockerfile(templateDockerFileName);
            }

            const baseStage = baseDockerFile[baseDockerFile.length - 1];
            baseStage.name = 'base';

            const result: string[] = [];
            for (let baseStage of baseDockerFile) {
                result.push(getDockerFileFromInstruction(baseStage.baseImage, baseStage.name, baseStage.plattform));
                result.push(...baseStage.stepsBeforeInstall);
                if (baseStage.install) {
                    result.push(`RUN ${this.args.packageManager} install`);
                    result.push(...baseStage.stepsAfterInstall);
                }
            }
            const packages = await irrerateDependencies(
                this.args,
                this.filteredPackages,
                this.packageGraph,
                this.concurrency,
                this.options.rejectCycles,
                defaultDockerFile,
            );

            const packageMap: PackageMap = new Map();
            for (let pkg of packages) {
                packageMap.set(pkg.name, pkg);
            }
            for (let pkg of packages) {
                result.push(`# Package ${pkg.name}`);
                const finalPackageDockerfile = await pkg.getFinalizedBuildStages(packageMap);
                result.push(...finalPackageDockerfile);
            }

            if (this.args.finalStage) {
                result.push(...(await this.createFinalStage(baseStage, packages)));
            }
            await promises.writeFile(this.args.outDockerfileName, result.join('\n'));
        } catch (err) {
            getLogger().error(err);
            process.exit(1);
        }
    }

    private async createFinalStage(baseStage: DockerStage, packages: Package[]): Promise<string[]> {
        const result: string[] = [];
        result.push(`# final stage`);

        const finalDockerfileName = this.args.finalDockerfileName;
        let finalStages: DockerStage[] = [
            {
                baseImage: baseStage.name!,
                install: {
                    ci: false,
                    ignoreScripts: false,
                    onlyProduction: false,
                },
                stepsAfterInstall: [],
                stepsBeforeInstall: [],
            },
        ];

        // overwrite final docker stage
        if (finalDockerfileName) {
            finalStages = await readDockerfile(finalDockerfileName);
        }

        for (let finalStage of finalStages) {
            result.push(getDockerFileFromInstruction(finalStage.baseImage, finalStage.name, finalStage.plattform));
            result.push(...finalStage.stepsBeforeInstall);
            if (finalStage.install) {
                for (let pkg of packages) {
                    result.push(`COPY --from=${pkg.getBuildStageName()} ${pkg.dockerWorkingDir} ${pkg.dockerWorkingDir}`);
                }
            }
            result.push(...finalStage.stepsAfterInstall);
        }
        return result;
    }
}

export function getDockerFileFromInstruction(baseImage: string, stageName?: string, plattform?: string): string {
    return [
        'FROM',
        ...(plattform ? [`--platform=${plattform}`] : []),
        baseImage,
        ...(stageName ? ['as', stageName] : []),
    ].join(' ');
}
