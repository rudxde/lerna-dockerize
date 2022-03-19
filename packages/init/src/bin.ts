import { initCommand } from '.';
import { getLogger } from '@lerna-dockerize/logger';
import { cli } from '@lerna-dockerize/cli';


cli([
    initCommand,
])
    .catch(err => {
        getLogger().error(err);
        process.exit(1);
    });
