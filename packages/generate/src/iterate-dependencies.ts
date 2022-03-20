import { Package as lernaPackage } from '@lerna/package';
import { PackageGraph } from '@lerna/package-graph';
import { runTopologically } from '@lerna/run-topologically';
import { IGenerateArgs } from './args';
import { Package } from './package';
import { DockerStage } from './read-dockerfile';

export async function iterateDependencies(
    args: IGenerateArgs,
    lernaPackages: lernaPackage[],
    packageGraph: PackageGraph,
    concurrency: number,
    rejectCycles?: boolean,
    defaultDockerFile?: DockerStage[],
): Promise<Package[]> {
    const packages: Package[] = [];
    await runTopologically(
        lernaPackages,
        async (lernaPackage) => {
            const packageGraphNode = packageGraph.get(lernaPackage.name);
            if (!packageGraphNode) {
                throw new Error(`Package ${lernaPackage.name} missing in packageGraph`);
            }
            const pkg = new Package(lernaPackage.name, lernaPackage, packageGraphNode, args);
            await pkg.loadDockerfile(defaultDockerFile);
            packages.push(pkg);
        },
        {
            concurrency: concurrency,
            rejectCycles: rejectCycles,
        },
    );
    return packages;
}
