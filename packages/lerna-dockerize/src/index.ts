import { Dockerize } from './lerna-command';


async function main(): Promise<void> {
    new Dockerize(process.argv);
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
