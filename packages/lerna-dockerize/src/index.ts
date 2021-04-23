import { Dockerize } from './lerna-command';


async function main() {
    new Dockerize(process.argv);
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
