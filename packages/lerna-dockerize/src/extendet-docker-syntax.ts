import { Package } from './package';
import { join as joinPath } from 'path';
import { existsSync } from 'fs';
import { normalizePath } from './normalize-path';
import { getLogger } from './logger';
import { slimPackage } from './slim-package';
import { getOptions } from './options';

const isCopy = /COPY\s+(--from=\S*\s+)?(--chown=\S*\s+)?(--if-exists\s+)?(--slim\s+)?(.*)\s+(.*)/;
const isRun = /RUN( --if-exists)? (.+)/;

export async function applyExtendetDockerSyntax(steps: string[], pkg: Package): Promise<string[]> {
    const result: string[] = [];
    for (let step of steps) {
        const isCopyMatch = step.match(isCopy);
        const isRunMatch = step.match(isRun);
        const transformedStep =
            isCopyMatch ? await applyExtendetDockerSyntaxCopy(step, pkg) :
                isRunMatch ? applyExtendetDockerSyntaxRun(step, pkg) :
                    step;
        if (transformedStep) {
            result.push(transformedStep);
        }
    }
    return result;
}

async function applyExtendetDockerSyntaxCopy(step: string, pkg: Package): Promise<string | undefined> {
    const [_, fromStage, chown, ifExistsFlag, slimFlag, filesList, destination] = step.match(isCopy)!;
    if (fromStage) {
        const [_, fromStageName] = fromStage.match(/--from=(\S*)/) ?? [];
        const isLocalStage = pkg.dockerFile!.find(x => x.originalName === fromStageName);
        if (isLocalStage) {
            return `COPY --from=${isLocalStage.name} ${chown || ''} ${filesList} ${destination}`;
        }
        return step;
    }
    let files = filesList.split(' ')
        .map(file => normalizePath(joinPath(pkg.relativePath, file)))
        .filter(file => !ifExistsFlag || existsSync(file));
    if (files.length === 0) {
        getLogger().debug(`None of the files '${filesList}' was found in the package '${pkg.name}'. Ignoring COPY due set '--if-exists' flag.`);
        return;
    }
    if (slimFlag) {
        return await slimCopy(chown, files, destination);
    }
    return `COPY ${chown || ''} ${files.join(' ')} ${destination}`;
}

async function slimCopy(chown: string | undefined, files: string[], destination: string): Promise<string> {
    if (files.length !== 1) {
        throw new Error(`Slimming multiple files is not supported!`);
    }
    const file = files[0];
    if (!file.endsWith('package.json')) {
        throw new Error('Slimming is only supported for package.json files!');
    }
    const source = await slimPackage(file);
    if (destination.endsWith('/') || destination.endsWith('.')) {
        // destination is directory
        destination = joinPath(destination, 'package.json');
    }
    return `COPY ${chown || ''} ${source} ${destination}`;
}

function applyExtendetDockerSyntaxRunIfExists(command: string, commandTokens: string[], pkg: Package): string | undefined {
    if (command.startsWith('npm run')) {
        const npmCommand = commandTokens[2];
        if(npmCommand.startsWith('$')) {
            getLogger().debug(`The npm run command '${commandTokens[2]}' looks like a variable.`);
            return ['RUN', getOptions().packageManager, 'run', npmCommand, '--if-present', ...commandTokens.slice(3)].join(' ');
        }
        if (!pkg.lernaPackage.scripts[npmCommand]) {
            getLogger().debug(`The npm run command '${commandTokens[2]}' was not found in the package '${pkg.name}'. Ignoring RUN due set '--if-exists' flag.`);
            return;
        } else {
            return `RUN ${command}`;
        }
    }
    if (command.startsWith('./')) {
        if (!existsSync(joinPath(pkg.relativePath, command.split(' ')[0]))) {
            getLogger().debug(
                `The shell command '${command.split(' ')[0]}' was not found in the package '${pkg.name}'. Ignoring RUN due set '--if-exists' flag.`,
            );
            return;
        } else {
            return `RUN ${command}`;
        }
    }
    getLogger().warn(`The '--if-exists' flag is not supported for the command '${command}' and will be ignored!`);
    return `RUN ${command}`;
}

function applyExtendetDockerSyntaxRun(step: string, pkg: Package): string | undefined {
    const [_, ifExists, command] = step.match(isRun)!;
    const commandTokens = command.split(' ');
    if (ifExists) {
        return applyExtendetDockerSyntaxRunIfExists(command, commandTokens, pkg);
    }
    return `RUN ${command}`;
}
