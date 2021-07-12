import { Dockerize } from './lerna-command';
import { getLogger } from './logger';
import { loadOptions } from './options';


async function main(): Promise<void> {
    await loadOptions();
    new Dockerize({composed: ''});
}

main()
    .catch(err => {
        getLogger().error(err);
        process.exit(1);
    });
