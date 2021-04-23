declare module '@lerna/query-graph' {
    export type QueryGraphConfig = {
        /**
         * "dependencies" excludes devDependencies from graph
         */
        graphType?: 'allDependencies' | 'dependencies';
        /**
         * Whether or not to reject dependency cycles
         */
        rejectCycles?: boolean;
    };
    /**
     * @typedef {object} QueryGraphConfig
     * @property {'allDependencies'|'dependencies'} [graphType] "dependencies" excludes devDependencies from graph
     * @property {boolean} [rejectCycles] Whether or not to reject dependency cycles
     */
    /**
     * A mutable PackageGraph used to query for next available packages.
     */
    export class QueryGraph {
        graph: any;
        cycles: any;
        constructor(packages: any[], { graphType, rejectCycles }?: QueryGraphConfig);
        /**
         * Sort a list of Packages topologically.
         *
         * @param {import("@lerna/package").Package[]} packages An array of Packages to build the list out of
         * @param {QueryGraphConfig} [options]
         *
         * @returns {import("@lerna/package").Package[]} A list of Package instances in topological order
         */
        static toposort(packages: any[], options?: QueryGraphConfig): any[];
        /**
         * @param {import("@lerna/package").Package[]} packages An array of Packages to build the graph out of
         * @param {QueryGraphConfig} [options]
         */
        _getNextLeaf(): any[];
        _getNextCycle(): any;
        getAvailablePackages(): any;
        /**
         * @param {string} name
         */
        markAsTaken(name: string): void;
        /**
         * @param {import("@lerna/package-graph").PackageGraphNode} candidateNode
         */
        markAsDone(candidateNode: any): void;
    }
    /**
     * Sort a list of Packages topologically.
     *
     * @param {import("@lerna/package").Package[]} packages An array of Packages to build the list out of
     * @param {QueryGraphConfig} [options]
     *
     * @returns {import("@lerna/package").Package[]} A list of Package instances in topological order
     */
    export function toposort(packages: any[], options?: QueryGraphConfig): any[];

}
