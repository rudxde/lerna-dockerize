import { Dockerize } from './lerna-command';
import { getLogger } from './logger';
import { loadOptions } from './options';


async function main(): Promise<void> {
    loadOptions();
    new Dockerize(process.argv);
}

main()
    .catch(err => {
        getLogger().error(err);
        process.exit(1);
    });
