import { getLogger } from './logger';
import { PackageMap } from './package';

function getDependenciesRecursive(dependenciesFrom: string, packageMap: PackageMap, ignoreDevDependencies: boolean): string[] {
    let result: string[] = [];
    const packageGraphNode = packageMap.get(dependenciesFrom);
    if (!packageGraphNode) {
        getLogger().warn(`Package ${dependenciesFrom} not found!`);
        return [];
    }
    for (let dependencyName of packageGraphNode.lernaPackageGraphNode.localDependencies.keys()) {
        if(ignoreDevDependencies && packageGraphNode.lernaPackage.devDependencies[dependencyName]) {
            continue;
        }
        result.push(dependencyName);
        result.push(...getDependenciesRecursive(dependencyName, packageMap, ignoreDevDependencies));
    }
    return result;
}


export function getDependenciesTransitive(dependenciesFrom: string, packageMap: PackageMap, ignoreDevDependencies: boolean): string[] {
    let result = getDependenciesRecursive(dependenciesFrom, packageMap, ignoreDevDependencies);
    result = result.filter((v, i, a) => a.indexOf(v) === i); // Filter duplicates
    return result;
}
