declare module '@lerna/package-graph' {
    /**
 * A node in a PackageGraph.
 */
    export class PackageGraphNode {
        /**
         * @param {import("@lerna/package").Package} pkg
         */
        constructor(pkg: any);
        name: any;
        /** @type {Map<string, import("npm-package-arg").Result>} */
        externalDependencies: Map<string, any>;
        /** @type {Map<string, import("npm-package-arg").Result>} */
        localDependencies: Map<string, any>;
        /** @type {Map<string, PackageGraphNode>} */
        localDependents: Map<string, PackageGraphNode>;
        get location(): any;
        get pkg(): any;
        get prereleaseId(): any;
        get version(): any;
        /**
         * Determine if the Node satisfies a resolved semver range.
         * @see https://github.com/npm/npm-package-arg#result-object
         *
         * @param {!Result} resolved npm-package-arg Result object
         * @returns {Boolean}
         */
        satisfies({ gitCommittish, gitRange, fetchSpec }: any): boolean;
        /**
         * Returns a string representation of this node (its name)
         *
         * @returns {String}
         */
        toString(): string;
        [PKG]: any;
    }
    const PKG: unique symbol;

    /** @typedef {import("./lib/package-graph-node").PackageGraphNode} PackageGraphNode */
    /**
     * A graph of packages in the current project.
     *
     * @extends {Map<string, PackageGraphNode>}
     */
    export class PackageGraph extends Map<string, PackageGraphNode> {
        /**
         * @param {import("@lerna/package").Package[]} packages An array of Packages to build the graph out of.
         * @param {'allDependencies'|'dependencies'} [graphType]
         *    Pass "dependencies" to create a graph of only dependencies,
         *    excluding the devDependencies that would normally be included.
         * @param {boolean} [forceLocal] Force all local dependencies to be linked.
         */
        constructor(packages: any[], graphType?: 'allDependencies' | 'dependencies', forceLocal?: boolean);
        get rawPackageList(): import('@lerna/package').Package[];
        /**
         * Takes a list of Packages and returns a list of those same Packages with any Packages
         * they depend on. i.e if packageA depended on packageB `graph.addDependencies([packageA])`
         * would return [packageA, packageB].
         *
         * @param {import("@lerna/package").Package[]} filteredPackages The packages to include dependencies for.
         */
        addDependencies(filteredPackages: any[]): any[];
        /**
         * Takes a list of Packages and returns a list of those same Packages with any Packages
         * that depend on them. i.e if packageC depended on packageD `graph.addDependents([packageD])`
         * would return [packageD, packageC].
         *
         * @param {import("@lerna/package").Package[]} filteredPackages The packages to include dependents for.
         */
        addDependents(filteredPackages: any[]): any[];
        /**
         * Extends a list of packages by traversing on a given property, which must refer to a
         * `PackageGraphNode` property that is a collection of `PackageGraphNode`s.
         * Returns input packages with any additional packages found by traversing `nodeProp`.
         *
         * @param {import("@lerna/package").Package[]} packageList The list of packages to extend
         * @param {'localDependencies'|'localDependents'} nodeProp The property on `PackageGraphNode` used to traverse
         */
        extendList(packageList: any[], nodeProp: 'localDependencies' | 'localDependents'): any[];
        /**
         * Return a tuple of cycle paths and nodes.
         *
         * @deprecated Use collapseCycles instead.
         *
         * @param {boolean} rejectCycles Whether or not to reject cycles
         * @returns {[Set<string[]>, Set<PackageGraphNode>]}
         */
        partitionCycles(rejectCycles: boolean): [Set<string[]>, Set<any>];
        /**
         * Returns the cycles of this graph. If two cycles share some elements, they will
         * be returned as a single cycle.
         *
         * @param {boolean} rejectCycles Whether or not to reject cycles
         * @returns {Set<CyclicPackageGraphNode>}
         */
        collapseCycles(rejectCycles: boolean): Set<any>;
        /**
         * Remove cycle nodes.
         *
         * @deprecated Spread set into prune() instead.
         *
         * @param {Set<PackageGraphNode>} cycleNodes
         */
        pruneCycleNodes(cycleNodes: Set<any>): void;
        /**
         * Remove all candidate nodes.
         * @param {PackageGraphNode[]} candidates
         */
        prune(...candidates: any[]): void;
        /**
         * Delete by value (instead of key), as well as removing pointers
         * to itself in the other node's internal collections.
         * @param {PackageGraphNode} candidateNode instance to remove
         */
        remove(candidateNode: any): void;
    }

}
