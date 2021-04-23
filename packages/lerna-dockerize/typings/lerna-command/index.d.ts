declare module '@lerna/command' {
    export class Command {
        constructor(_argv: any);
        name: string;
        composed: boolean;
        project: any;
        then(onResolved: any, onRejected: any): any;
        catch(onRejected: any): any;
        get requiresGit(): boolean;
        get otherCommandConfigs(): any[];
        configureEnvironment(): void;
        configureOptions(): void;
        options: any;
        configureProperties(): void;
        concurrency: number;
        toposort: any;
        /** @type {import("@lerna/child-process").ExecOpts} */
        execOpts: any;
        configureLogging(): void;
        enableProgressBar(): void;
        gitInitialized(): boolean;
        runValidations(): void;
        runPreparations(): Promise<void>;
        packageGraph: import('@lerna/package-graph').PackageGraph;
        runCommand(): Promise<void>;
        initialize(): void;
        execute(): void;
    }
}
