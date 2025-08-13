import { Command } from 'commander';
import { readFileSync } from 'fs';
import { version } from '../../../package.json';

export function assignProgramCommands(program: Command) {

    var aboutCommand =
        new Command('about')
            .alias('a')
            .description('Show information about the program.')
            .action(createCredential);

    program
        .addCommand(aboutCommand);
}

function createCredential() {
    console.log(`\n| ============================================================ |
|                     confidant v${version}                         | 
| ============================================================ |`);
    const file = readFileSync('./src/presentation/about.txt', 'utf-8');

    console.log(`${file}\n`);
}
