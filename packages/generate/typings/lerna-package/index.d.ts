declare module '@lerna/package' {
    /**
  * The subset of package.json properties that Lerna uses
  */
    export type RawManifest = {
        name: string;
        version: string;
        private?: boolean;
        bin?: Record<string, string> | string;
        scripts?: Record<string, string>;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        optionalDependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
        publishConfig?: Record<'directory' | 'registry' | 'tag', string>;
        workspaces?: string[] | {
            packages: string[];
        };
    };
    /**
     * @typedef {object} RawManifest The subset of package.json properties that Lerna uses
     * @property {string} name
     * @property {string} version
     * @property {boolean} [private]
     * @property {Record<string, string>|string} [bin]
     * @property {Record<string, string>} [scripts]
     * @property {Record<string, string>} [dependencies]
     * @property {Record<string, string>} [devDependencies]
     * @property {Record<string, string>} [optionalDependencies]
     * @property {Record<string, string>} [peerDependencies]
     * @property {Record<'directory' | 'registry' | 'tag', string>} [publishConfig]
     * @property {string[] | { packages: string[] }} [workspaces]
     */
    /**
     * Lerna's internal representation of a local package, with
     * many values resolved directly from the original JSON.
     */
    export class Package {
        name: string;
        [PKG]: RawManifest;
        [_location]: string;
        [_resolved]: any;
        [_rootPath]: string;
        [_scripts]: {
            [x: string]: string;
        };
        [_contents]: any;
        /**
        * @param {RawManifest} pkg
        * @param {string} location
        * @param {string} [rootPath]
        */
        constructor(pkg: RawManifest, location: string, rootPath?: string);

        
        get location(): string;
        get private(): boolean;
        get resolved(): any;
        get rootPath(): string;
        get scripts(): {
            [x: string]: string;
        };
        get bin(): Record<string, string>;
        get binLocation(): string;
        get manifestLocation(): string;
        get nodeModulesLocation(): string;
        get __isLernaPackage(): boolean;
        get version(): string;
        get contents(): any;
        get dependencies(): Record<string, string>;
        get devDependencies(): Record<string, string>;
        get optionalDependencies(): Record<string, string>;
        get peerDependencies(): Record<string, string>;
        set version(arg: string);
        set contents(arg: any);
        
        /**
         * Create a Package instance from parameters, possibly reusing existing instance.
         * @param {string|Package|RawManifest} ref A path to a package.json file, Package instance, or JSON object
         * @param {string} [dir] If `ref` is a JSON object, this is the location of the manifest
         * @returns {Package}
         */
        static lazy(ref: string | Package | RawManifest, dir?: string): Package;

        /**
         * Map-like retrieval of arbitrary values
         * @template {keyof RawManifest} K
         * @param {K} key field name to retrieve value
         * @returns {RawManifest[K]} value stored under key, if present
         */
        get<K extends keyof RawManifest>(key: K): RawManifest[K];
        /**
         * Map-like storage of arbitrary values
         * @template {keyof RawManifest} K
         * @param {T} key field name to store value
         * @param {RawManifest[K]} val value to store
         * @returns {Package} instance for chaining
         */
        set<K_2 extends keyof RawManifest>(key: any, val: RawManifest[K_2]): Package;
        /**
         * Provide shallow copy for munging elsewhere
         * @returns {Object}
         */
        toJSON(): any;
        /**
         * Refresh internal state from disk (e.g., changed by external lifecycles)
         */
        refresh(): Promise<Package>;
        /**
         * Write manifest changes to disk
         * @returns {Promise} resolves when write finished
         */
        serialize(): Promise<any>;
        /**
         * Mutate local dependency spec according to type
         * @param {Object} resolved npa metadata
         * @param {String} depVersion semver
         * @param {String} savePrefix npm_config_save_prefix
         */
        updateLocalDependency(resolved: any, depVersion: string, savePrefix: string): void;
    }
    const PKG: unique symbol;
    const _location: unique symbol;
    const _resolved: unique symbol;
    const _rootPath: unique symbol;
    const _scripts: unique symbol;
    const _contents: unique symbol;
}
