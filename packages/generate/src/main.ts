import { IGenerateArgs } from './args';
import { Dockerize } from './lerna-command';

export async function main(args: IGenerateArgs): Promise<void> {
    new Dockerize(args);
}
