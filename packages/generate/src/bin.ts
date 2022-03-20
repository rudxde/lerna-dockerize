import { generateCommand } from '.';
import { getLogger } from '@lerna-dockerize/logger';
import { cli } from '@lerna-dockerize/cli';


cli(
    [
        generateCommand,
    ],
    <string>generateCommand.command,
)
    .catch(err => {
        getLogger().error(err);
        process.exit(1);
    });
