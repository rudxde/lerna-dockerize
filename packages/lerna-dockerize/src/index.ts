import { generateCommand } from '@lerna-dockerize/generate';
import { initCommand } from '@lerna-dockerize/init';
import { getLogger } from '@lerna-dockerize/logger';
import { cli } from '@lerna-dockerize/cli';


cli(
    [
        generateCommand,
        initCommand,
    ],
    <string>generateCommand.command,
)
    .catch(err => {
        getLogger().error(err);
        process.exit(1);
    });
