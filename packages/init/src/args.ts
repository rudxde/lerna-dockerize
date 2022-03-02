export interface IInitArgs {
    workingDirectory?: string;
    installAsDevDependency: boolean;
    packageManager: string;
    templateDockerFileName: string;
    baseDockerfileName: string;
    scriptName: string;
};
