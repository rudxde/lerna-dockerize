import yargs from 'yargs';
import { command } from '.'

yargs
    .wrap(process.stdout.columns)
    .command(command)
    .demandCommand()
    .argv;
