import { promises } from 'fs';
import { getLogger } from './logger';

export interface DockerStage {
    baseImage: string;
    originalName?: string;
    name?: string;
    prepareStageName?: string;
    stepsBeforeInstall: string[];
    stepsAfterInstall: string[];
    hasInstall: boolean;
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
    const isStageFromClause = /(FROM|from) ([a-zA-Z0-9:_-]*)( as ([a-zA-Z0-9:_-]*))?/;
    for (; ; i++) {
        if (i >= steps.length) {
            return undefined;
        }
        const matching = steps[i].match(isStageFromClause);
        if (matching) {
            baseImage = matching[2];
            stageName = matching[4];
            i++;
            break;
        }
    }
    const stepsBeforeInstall: string[] = [];
    const stepsAfterInstall: string[] = [];
    let installHit = false;
    for (; i < steps.length; i++) {
        if (steps[i].match(isStageFromClause)) {
            i--;
            break;
        }
        if (steps[i].match(/RUN (npm|yarn) (i|install)/)) {
            installHit = true;
            continue;
        }
        (installHit ? stepsAfterInstall : stepsBeforeInstall).push(steps[i]);
    }
    return {
        endIndex: i,
        stage: {
            name: stageName,
            baseImage,
            stepsBeforeInstall,
            stepsAfterInstall,
            hasInstall: installHit,
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
