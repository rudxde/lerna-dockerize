import { PackageGraphNode } from '@lerna/package-graph';
import { Package as LernaPackage } from '@lerna/package';
import { DockerStage, readDockerfile } from './read-dockerfile';
import { promises } from 'fs';
import { join as joinPath, relative } from 'path';
import { getDependenciesTransitive } from './get-dependencies-transitive';
import { normalizePath } from './normalize-path';
import { IGenerateArgs } from './args';
import { applyExtendedDockerSyntax } from './extended-docker-syntax';
import { getLogger } from '@lerna-dockerize/logger';
import { getDockerFileFromInstruction } from './lerna-command';

export type PackageMap = Map<string, Package>;


export class Package {

    dockerFile?: DockerStage[];

    constructor(
        public name: string,
        public lernaPackage: LernaPackage,
        public lernaPackageGraphNode: PackageGraphNode,
        private args: IGenerateArgs,
    ) { }

    async findDockerfile(): Promise<string | undefined> {
        if (!this.lernaPackage) {
            throw new Error(`The lerna package is missing for the dependency ${this.name}`);
        }
        const files = await promises.readdir(this.lernaPackage.location);
        getLogger().debug(`the package ${this.name} contains the following files: ${files.join(', ')}`);
        for (let file of files) {
            if (file.toLowerCase() === 'dockerfile') {
                return joinPath(this.lernaPackage.location, file);
            }
        }
        return undefined;
    }

    async loadDockerfile(defaultDockerFile?: DockerStage[]): Promise<DockerStage[]> {
        const dockerFileName = await this.findDockerfile();
        if (!dockerFileName && !defaultDockerFile) {
            throw new Error(`No Dockerfile for the package ${this.name} and no default docker file was found!`);
        }
        if (!dockerFileName) {
            getLogger().info(`using default dockerfile for package ${this.name}`);
            this.dockerFile = defaultDockerFile!;
        } else {
            getLogger().info(`using custom dockerfile for package ${this.name}`);
            this.dockerFile = await readDockerfile(dockerFileName);
        }
        this.dockerFile = this.dockerFile!.map((stage, i) => this.scopeDockerStage(stage, i));
        return this.dockerFile!;
    }

    get relativePath(): string {
        return normalizePath(relative(this.lernaPackage.rootPath, this.lernaPackage.location));
    }

    get dockerWorkingDir(): string {
        return this.args.dockerfileWorkingDir + this.relativePath;
    }

    getPackageStageNamePrefix(): string {
        return this.name.replace(/@/gm, '').replace(/\//gm, '_');
    }

    getPrepareStageName(): string | undefined {
        if (!this.stageHasInstall(this.getBuildStage())) {
            return this.getBuildStageName();
        }
        if (!this.dockerFile) {
            return undefined;
        }
        if (!this.args.addPrepareStages) {
            return this.getBuildStageName();
        }
        return this.dockerFile[this.dockerFile.length - 1].prepareStageName;
    }

    getBuildStageName(): string | undefined {
        return this.getBuildStage()?.name;
    }

    getBuildStage(): DockerStage | undefined {
        if (!this.dockerFile) {
            return undefined;
        }
        return this.dockerFile[this.dockerFile.length - 1];
    }

    stageHasInstall(stage?: DockerStage): boolean {
        if (!stage?.install) {
            return false;
        }
        return true;
    }

    async getFinalizedBuildStages(packageMap: PackageMap): Promise<string[]> {
        if (!this.dockerFile) {
            return [];
        }
        const result: string[] = [];
        for (let stage of this.dockerFile) {
            let baseImage = stage.baseImage;
            const baseImageIsLocalStage = this.dockerFile!.find(x => x.originalName === baseImage);
            if (baseImageIsLocalStage) {
                baseImage = baseImageIsLocalStage.name!;
            }
            const addPrepareStage = this.args.addPrepareStages && this.stageHasInstall(stage);
            if (addPrepareStage) {
                result.push(getDockerFileFromInstruction(baseImage, stage.prepareStageName, stage.platform));
            } else {
                result.push(getDockerFileFromInstruction(baseImage, stage.name!, stage.platform));
            }
            result.push(`WORKDIR ${this.dockerWorkingDir}`);
            result.push(...(await applyExtendedDockerSyntax(stage.stepsBeforeInstall, this, this.args)));
            if (!this.stageHasInstall(stage)) {
                continue;
            }
            result.push(`WORKDIR ${this.args.dockerfileWorkingDir}`);

            const dependencyCopyContent = [];

            const dependencyPackages = (await getDependenciesTransitive(this.name, packageMap, stage.install!.onlyProduction))
                .map(dependencyName => {
                    const pkg = packageMap.get(dependencyName);
                    if (!pkg) {
                        throw new Error(`the package for the dependency '${dependencyName} of the package '${this.name}' was not found!'`);
                    }
                    return pkg;
                });

            for (let dependencyPackage of dependencyPackages) {
                const fromStageName = dependencyPackage.getBuildStageName();
                const packageDataFromStageName = dependencyPackage.getPrepareStageName();
                const dependencyWorkingDir = dependencyPackage.dockerWorkingDir;
                const packageJsonPath = normalizePath(joinPath(dependencyWorkingDir, 'package.json'));
                result.push(`COPY --from=${packageDataFromStageName} ${packageJsonPath} ${dependencyWorkingDir}/`);
                dependencyCopyContent.push(`COPY --from=${fromStageName} ${dependencyWorkingDir}/ ${dependencyWorkingDir}/`);
            }

            const bootstrapNpmDirectArgs = [
                ...(stage.install!.onlyProduction ? ['--production'] : []),
            ];

            if (bootstrapNpmDirectArgs.length !== 0) {
                bootstrapNpmDirectArgs.unshift('--');
            }

            result.push([
                'RUN',
                this.args.lernaCommand,
                'bootstrap',
                ...(this.args.hoist ? ['--hoist'] : []),
                `--scope=${this.name}`,
                '--includeDependencies',
                ...(stage.install!.ignoreScripts ? ['--ignore-scripts'] : []),
                ...(stage.install!.ci ? ['--ci'] : stage.install!.ci === false ? ['--no-ci'] : []),
                ...bootstrapNpmDirectArgs,
            ].join(' '));

            if (addPrepareStage) {
                result.push(getDockerFileFromInstruction(stage.prepareStageName!, stage.name!, stage.platform));
            }

            result.push(...dependencyCopyContent);

            result.push(`WORKDIR ${this.dockerWorkingDir}`);
            result.push(...(await applyExtendedDockerSyntax(stage.stepsAfterInstall, this, this.args)));
        }
        return result;
    }

    private scopeDockerStage(stage: DockerStage, stageNumber: number): DockerStage {
        const stageName = this.getPackageStageNamePrefix() + '-' + (stage.name || stageNumber);
        return {
            baseImage: stage.baseImage,
            name: stageName,
            platform: stage.platform,
            prepareStageName: this.args.addPrepareStages ? `${stageName}_prepare` : undefined,
            originalName: stage.name,
            stepsBeforeInstall: [...stage.stepsBeforeInstall],
            stepsAfterInstall: [...stage.stepsAfterInstall],
            install: stage.install,
        };
    }



}
