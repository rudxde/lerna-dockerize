declare module '@lerna/run-topologically' {
    /**
     * @typedef {import("@lerna/query-graph").QueryGraphConfig & { concurrency: number }} TopologicalConfig
     */
    /**
     * Run callback in maximally-saturated topological order.
     *
     * @template T
     * @param {import("@lerna/package").Package[]} packages List of `Package` instances
     * @param {(pkg: import("@lerna/package").Package) => Promise<T>} runner Callback to map each `Package` with
     * @param {TopologicalConfig} [options]
     * @returns {Promise<T[]>} when all executions complete
     */
    export function runTopologically<T>(
        packages: import('@lerna/package').Package[],
        runner: (pkg: import('@lerna/package').Package) => Promise<T>,
        { concurrency, graphType, rejectCycles }?: TopologicalConfig,
    ): Promise<T[]>;
    export type TopologicalConfig = import('@lerna/query-graph').QueryGraphConfig & {
        concurrency: number;
    };

}
