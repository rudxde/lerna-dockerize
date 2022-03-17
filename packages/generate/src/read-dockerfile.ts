import { promises } from 'fs';
import { getLogger } from '@lerna-dockerize/logger';
import Parser from 'yargs-parser';

interface IInstallOptions {
    ci: boolean | undefined;
    onlyProduction: boolean;
    ignoreScripts: boolean;
}

export interface DockerStage {
    baseImage: string;
    plattform?: string;
    originalName?: string;
    name?: string;
    prepareStageName?: string;
    stepsBeforeInstall: string[];
    stepsAfterInstall: string[];
    install?: IInstallOptions;
}


export async function readDockerfile(path: string): Promise<DockerStage[]> {
    const dockerfile = (await promises.readFile(path)).toString();
    const steps = splitInSteps(dockerfile);
    const result = [];
    let currentStep = 0;
    while (true) {
        const readStageResult = readStage(steps, currentStep);
        if (!readStageResult) {
            break;
        }
        currentStep = readStageResult.endIndex + 1;
        result.push(readStageResult.stage);
    }
    if (result.length === 0) {
        getLogger().warn(`The dockerfile '${path}' appears to be empty.`);
    }
    return result;
}

export function readStage(steps: string[], startIndex: number): { stage: DockerStage; endIndex: number } | undefined {
    let i = startIndex;
    let baseImage;
    let stageName;
    let plattform;
    const isStageFromClause = /(FROM|from)(\s--platform=(\S+))? ([a-zA-Z0-9:_\-@.\/]*)( as ([a-zA-Z0-9:_-]*))?/;
    for (; ; i++) {
        if (i >= steps.length) {
            return undefined;
        }
        const matching = steps[i].match(isStageFromClause);
        if (matching) {
            plattform = matching[3];
            baseImage = matching[4];
            stageName = matching[6];
            i++;
            break;
        }
    }
    const stepsBeforeInstall: string[] = [];
    const stepsAfterInstall: string[] = [];
    let installHit: IInstallOptions | undefined = undefined;
    for (; i < steps.length; i++) {
        if (steps[i].match(isStageFromClause)) {
            i--;
            break;
        }
        const matchesInstall = steps[i].match(/RUN (npm|yarn) (i|install|ci)((\s-?-?\S+((\s|=)\S+)?)*)/);
        if (matchesInstall) {
            const [_, npm, install, parameters] = matchesInstall;
            const isDependencyInstall = parameters.split(' ').filter(x => !!x && !x.startsWith('-')).length !== 0;
            if (!isDependencyInstall) {
                installHit = {
                    ci: undefined,
                    ignoreScripts: false,
                    onlyProduction: false,
                    ...parseInstallParameters(parameters),
                    ...(install === 'ci' ? { ci: true } : {}),
                };
                continue;
            }
        }
        (installHit ? stepsAfterInstall : stepsBeforeInstall).push(steps[i]);
    }
    return {
        endIndex: i,
        stage: {
            name: stageName,
            plattform: plattform,
            baseImage,
            stepsBeforeInstall,
            stepsAfterInstall,
            install: installHit,
        },
    };
}

export function splitInSteps(content: string): string[] {
    const result: string[] = [];
    const lines = content.split('\n');
    let currentStep = '';
    for (let i = 0; i < lines.length; i++) {
        currentStep += lines[i];
        // check if is multiline step
        if (lines[i].endsWith('\\')) {
            currentStep += '\n';
            continue;
        }
        result.push(currentStep);
        currentStep = '';
    }
    return result
        .filter(Boolean); // filter empty lines
}

function parseInstallParameters(params: string): Partial<IInstallOptions> {
    const parsed = Parser(params);
    return {
        ci: parsed.ci,
        ignoreScripts: parsed.ignoreScripts ?? false,
        onlyProduction: parsed.production || parsed.only === 'production',
    };
}
