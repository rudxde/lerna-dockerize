declare module '@lerna/filter-options' {

    /**
     * Retrieve a list of Package instances filtered by various options.
     * @param {import("@lerna/package-graph").PackageGraph} packageGraph
     * @param {import("@lerna/child-process").ExecOpts} execOpts
     * @param {Partial<FilterOptions>} opts
     * @returns {Promise<import("@lerna/package").Package[]>}
     */
    export function getFilteredPackages(
        packageGraph: import('@lerna/package-graph').PackageGraph,
        execOpts: import('@lerna/child-process').ExecOpts,
        opts: Partial<FilterOptions>,
    ): Promise<import('@lerna/package').Package[]>;

    /**
     * @typedef {object} FilterOptions
     * @property {string} scope
     * @property {string} ignore
     * @property {boolean} private
     * @property {string} since
     * @property {boolean} continueIfNoMatch
     * @property {boolean} excludeDependents
     * @property {boolean} includeDependents
     * @property {boolean} includeDependencies
     * @property {boolean} includeMergedTags
     * @property {typeof log} log
     */
    export type FilterOptions = {
        scope: string;
        ignore: string;
        private: boolean;
        since: string;
        continueIfNoMatch: boolean;
        excludeDependents: boolean;
        includeDependents: boolean;
        includeDependencies: boolean;
        includeMergedTags: boolean;
        log: any;
    };
}
