import { spawn } from 'child_process';
/**
 * Executes an Process
 *
 * @param {string} executable the application to execute
 * @param {string[]} args the args for the application
 * @param {*} [env] environment variables for child-process
 * @returns {Promise<void>} resolves the Promise, if the program has exited
 */
export function run(executable: string, args: string[], cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let childProcess = spawn(executable, args, {
            stdio: [
                'inherit',
                'inherit',
                'inherit',
            ],
            cwd: cwd,
            // shell: true,
        });
        childProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`The command '${executable} ${args.join(' ')}', exited with the unsuccessful statuscode '${code}'.`));
            }
            resolve();
        });
    });
}
