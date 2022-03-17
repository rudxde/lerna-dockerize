export interface IGenerateArgs {
    baseDockerfileName: string;
    templateDockerfileName?: string;
    finalStage: boolean;
    finalDockerfileName?: string;
    outDockerfileName: string;
    dockerfileWorkingDir: string;
    packageManager: string;
    lernaCommand: string;
    hoist: boolean;
    addPrepareStages: boolean;
}
