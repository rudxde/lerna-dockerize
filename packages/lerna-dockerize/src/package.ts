import { PackageGraphNode } from '@lerna/package-graph';
import { Package as LernaPackage } from '@lerna/package';
import { DockerStage, readDockerfile } from './read-dockerfile';
import { promises, existsSync } from 'fs';
import { join as joinPath, relative } from 'path';
import { getDependenciesTransitive } from './get-dependencies-transitive';
import { normalizePath } from './normalize-path';
import { getOptions } from './options';
import { applyExtendetDockerSyntax } from './extendet-docker-syntax';

export type PackageMap = Map<string, Package>;


export class Package {

    dockerFile?: DockerStage[];

    constructor(
        public name: string,
        public lernaPackage: LernaPackage,
        public lernaPackageGraphNode: PackageGraphNode,
    ) { }

    async findDockerfile(): Promise<string | undefined> {
        if (!this.lernaPackage) {
            throw new Error(`The lerna package is missing for the dependency ${this.name}`);
        }
        const files = await promises.readdir(this.lernaPackage.location);
        // console.log(files);
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
            console.log(`using default dockerfile for package ${this.name}`);
            this.dockerFile = defaultDockerFile!;
        } else {
            console.log(`using custom dockerfile for package ${this.name}`);
            this.dockerFile = await readDockerfile(dockerFileName);
        }
        this.dockerFile = this.dockerFile!.map((stage, i) => this.scopeDockerStage(stage, i));
        return this.dockerFile!;
    }

    get relativePath(): string {
        return normalizePath(relative(this.lernaPackage.rootPath, this.lernaPackage.location));
    }
    get dockerWorkingDir(): string {
        return getOptions().dockerfileWorkingDir + this.relativePath;
    }

    getPackageStageNamePrefix(): string {
        return this.name.replace(/@/gm, '').replace(/\//gm, '_');
    }

    getBuildStageName(): string | undefined {
        if (!this.dockerFile) {
            return undefined;
        }
        return this.dockerFile[this.dockerFile.length - 1].name;
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
            result.push(`FROM ${baseImage} as ${stage.name!}`);
            result.push(`WORKDIR ${this.dockerWorkingDir}`);
            result.push(...applyExtendetDockerSyntax(stage.stepsBeforeInstall, this));
            if (!stage.hasInstall) {
                continue;
            }
            result.push(`WORKDIR ${getOptions().dockerfileWorkingDir}`);

            const dependencyCopyContent = [];

            const dependencyPackages = (await getDependenciesTransitive(this.name, packageMap))
                .map(dependencyName => {
                    const pkg = packageMap.get(dependencyName);
                    if (!pkg) {
                        throw new Error(`the package for the dependency '${dependencyName} of the package '${this.name}' was not found!'`);
                    }
                    return pkg;
                });

            for (let dependencyPackage of dependencyPackages) {
                const fromStageName = dependencyPackage.getBuildStageName();
                const dependencyWorkingDir = dependencyPackage.dockerWorkingDir;
                const packageJsonPath = normalizePath(joinPath(dependencyWorkingDir, 'package.json'));
                result.push(`COPY --from=${fromStageName} ${packageJsonPath} ${dependencyWorkingDir}/`);
                dependencyCopyContent.push(`COPY --from=${fromStageName} ${dependencyWorkingDir}/ ${dependencyWorkingDir}/`);
            }

            result.push(`RUN ${getOptions().lernaCommand} bootstrap --scope=${this.name} --includeDependencies`);

            result.push(...dependencyCopyContent);

            result.push(`WORKDIR ${this.dockerWorkingDir}`);
            result.push(...applyExtendetDockerSyntax(stage.stepsAfterInstall, this));
        }
        return result;
    }

    private scopeDockerStage(stage: DockerStage, stageNumber: number): DockerStage {
        return {
            baseImage: stage.baseImage,
            name: this.getPackageStageNamePrefix() + '-' + (stage.name || stageNumber),
            originalName: stage.name,
            stepsBeforeInstall: [...stage.stepsBeforeInstall],
            stepsAfterInstall: [...stage.stepsAfterInstall],
            hasInstall: stage.hasInstall,
        };
    }



}
