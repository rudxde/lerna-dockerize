declare module '@lerna/command' {
    export class Command {
        name: string;
        composed: boolean;
        project: any;
        options: any;
        concurrency: number;
        toposort: any;
        execOpts: import('@lerna/child-process').ExecOpts;
        packageGraph: import('@lerna/package-graph').PackageGraph;
        constructor(_argv: any);
        get requiresGit(): boolean;
        get otherCommandConfigs(): any[];
        then(onResolved: any, onRejected: any): any;
        catch(onRejected: any): any;
        configureEnvironment(): void;
        configureOptions(): void;
        configureProperties(): void;
        configureLogging(): void;
        enableProgressBar(): void;
        gitInitialized(): boolean;
        runValidations(): void;
        runPreparations(): Promise<void>;
        runCommand(): Promise<void>;
        initialize(): void;
        execute(): void;
    }
}
