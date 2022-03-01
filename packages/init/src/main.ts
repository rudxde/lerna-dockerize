import { IInitArgs } from './args';
import { promises as fsPromises, existsSync } from 'fs';
import { join as joinPath } from 'path';
import { spawn } from 'child_process';
// import type { Ora } from 'ora';
import { detectIdent } from './detect-ident';
export async function main(args: IInitArgs): Promise<void> {
    // const spinner = (await import('ora')).default('Installing lerna-dockerize').start();
    try {
        await installLernaDockerize(args);
        await addTemplates(args);
        await addConfig(args);
        await addScripts(args);
        // spinner.succeed();
    } catch (err) {
        if (!(err instanceof Error)) {
            console.error(err);
            return;
        }
        console.error(err);
        // spinner.fail(err.message);
    }
}


async function installLernaDockerize(args: IInitArgs): Promise<void> {
    const packageJsonPath = joinPath(args.workingDirectory ?? process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
        throw new Error(`No package.json was found. Please run this command in a project directory!`);
    }
    // spinner.text = `Installing lerna-dockerize over ${args.packageManager}`;
    const packageJson = await fsPromises.readFile(packageJsonPath, 'utf8');
    const packageJsonObject = JSON.parse(packageJson);
    if (packageJsonObject['dependencies']?.['lerna-dockerize']) {
        return;
    }
    if (packageJsonObject['devDependencies']?.['lerna-dockerize']) {
        return;
    }
    const executable = process.platform === 'win32' ? args.packageManager + '.cmd' : args.packageManager;
    let installProcess = spawn(
        executable, ['install', ...(args.installAsDevDependency ? ['--save'] : ['--save-dev']), 'lerna-dockerize'],
        {
            cwd: args.workingDirectory ?? process.cwd(),
            stdio: 'pipe',
        });
    await new Promise<void>((resolve, reject) => {
        installProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`The installation of lerna-dockerize failed, the process exited with the unsuccessful statuscode '${code}'.`));
            }
            resolve();
        });
    });
}

async function addTemplates(args: IInitArgs): Promise<void> {
    const baseDockerfileSrc = joinPath(__dirname, '../../templates/Dockerfile.base');
    const templateDockerfileSrc = joinPath(__dirname, '../../templates/Dockerfile.template');
    const baseDockerfileDest = joinPath(args.workingDirectory ?? process.cwd(), args.baseDockerfileName);
    const templateDockerfileDest = joinPath(args.workingDirectory ?? process.cwd(), args.templateDockerFileName);
    await fsPromises.copyFile(baseDockerfileSrc, baseDockerfileDest);
    await fsPromises.copyFile(templateDockerfileSrc, templateDockerfileDest);
}

async function addConfig(args: IInitArgs): Promise<void> {
    const lernaConfigPath = joinPath(args.workingDirectory ?? process.cwd(), 'lerna.json');
    if (!existsSync(lernaConfigPath)) {
        throw new Error(`No lerna.json was found. Please run this command in a project directory!`);
    }
    const lernaConfig = await fsPromises.readFile(lernaConfigPath, 'utf8');
    const lernaConfigObject = JSON.parse(lernaConfig);
    if (!lernaConfigObject['lerna-dockerize']) {
        lernaConfigObject['lerna-dockerize'] = {};
    }
    lernaConfigObject['lerna-dockerize'] = {
        'templateDockerfileName': args.templateDockerFileName,
        'baseDockerfileName': args.baseDockerfileName,
    };
    const indentation = detectIdent(lernaConfig);
    await fsPromises.writeFile(lernaConfigPath, JSON.stringify(lernaConfigObject, undefined, indentation));
}

async function addScripts(args: IInitArgs): Promise<void> {
    const packageJsonPath = joinPath(args.workingDirectory ?? process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
        throw new Error(`No package.json was found. Please run this command in a project directory!`);
    }
    const packageJson = await fsPromises.readFile(packageJsonPath, 'utf8');
    const packageJsonObject = JSON.parse(packageJson);

    const indentation = detectIdent(packageJson);
    await fsPromises.writeFile(packageJsonPath, JSON.stringify(packageJsonObject, undefined, indentation));
}
