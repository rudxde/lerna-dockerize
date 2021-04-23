import { PackageMap } from './package';

function getDependenciesRecursive(dependenciesFrom: string, packageMap: PackageMap): string[] {
    let result: string[] = [];
    const packageGraphNode = packageMap.get(dependenciesFrom);
    if (!packageGraphNode) {
        console.log(`Package ${dependenciesFrom} not found!`);
        return [];
    }
    for (let dependencyName of packageGraphNode.lernaPackageGraphNode.localDependencies.keys()) {
        result.push(dependencyName);
        result.push(...getDependenciesRecursive(dependencyName, packageMap));
    }
    return result;
}


export function getDependenciesTransitive(dependenciesFrom: string, packageMap: PackageMap): string[] {
    let result = getDependenciesRecursive(dependenciesFrom, packageMap);
    result = result.filter((v, i, a) => a.indexOf(v) === i); // Filter duplicates
    return result;
}
