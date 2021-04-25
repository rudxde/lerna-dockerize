import { Package } from './package';
import { join as joinPath } from 'path';
import { existsSync } from 'fs';
import { normalizePath } from './normalize-path';

const isCopy = /COPY\s+(--from=\S*\s+)?(--chown=\S*\s+)?(--if-exists)?(.*)\s+(.*)/;
const isRun = /RUN( --if-exists)? (.+)/;

export function applyExtendetDockerSyntax(steps: string[], pkg: Package): string[] {
    const result: string[] = [];
    for (let step of steps) {
        const isCopyMatch = step.match(isCopy);
        const isRunMatch = step.match(isRun);
        const transformedStep =
            isCopyMatch ? applyExtendetDockerSyntaxCopy(step, pkg) :
                isRunMatch ? applyExtendetDockerSyntaxRun(step, pkg) :
                    step;
        if (transformedStep) {
            result.push(transformedStep);
        }
    }
    return result;
}

function applyExtendetDockerSyntaxCopy(step: string, pkg: Package): string | undefined {
    const [_, fromStage, chown, ifExists, files, destination] = step.match(isCopy)!;
    if (fromStage) {
        const [_, fromStageName] = fromStage.match(/--from=(\S*)/) ?? [];
        const isLocalStage = pkg.dockerFile!.find(x => x.originalName === fromStageName);
        if (isLocalStage) {
            return `COPY --from=${isLocalStage.name} ${chown || ''} ${files} ${destination}`;
        }
        return step;
    }
    const fixedFilePaths = files
        .split(' ')
        .map(file => normalizePath(joinPath(pkg.relativePath, file)))
        .filter(file => !ifExists || existsSync(file))
        .join(' ');
    if (fixedFilePaths === '') {
        return;
    }
    return `COPY ${chown || ''} ${fixedFilePaths} ${destination}`;
}

function applyExtendetDockerSyntaxRun(step: string, pkg: Package): string | undefined {
    const [_, ifExists, command] = step.match(isRun)!;
    const commandTokens = command.split(' ');
    if (ifExists && command.startsWith('npm run') && !pkg.lernaPackage.scripts[commandTokens[3]]) {
        return;
    }
    if (ifExists && command.startsWith('./') && !existsSync(joinPath(pkg.relativePath, command.split(' ')[0]))) {
        return;
    }
    return `RUN ${command}`;
}
