import { Dockerize } from './lerna-command';
import { loadOptions } from './options';


async function main(): Promise<void> {
    loadOptions();
    new Dockerize(process.argv);
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
