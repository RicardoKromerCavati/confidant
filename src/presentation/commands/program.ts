import { Command } from 'commander';

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
    //TODO Make it beautiful.
    console.log('About');
}
