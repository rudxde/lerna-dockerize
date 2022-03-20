import { initCommand } from '.';
import { getLogger } from '@lerna-dockerize/logger';
import { cli } from '@lerna-dockerize/cli';


cli(
    [
        initCommand,
    ],
    <string>initCommand.command,
)
    .catch(err => {
        getLogger().error(err);
        process.exit(1);
    });
