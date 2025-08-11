"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.asignCredentialCommands = asignCredentialCommands;
const credentialService_1 = require("../../domain/services/credentialService");
const readline = __importStar(require("readline/promises"));
const tsyringe_1 = require("tsyringe");
const node_process_1 = require("node:process");
function asignCredentialCommands(program) {
    program
        .command('create')
        .alias('cc')
        .alias('create-credential')
        .description('Create new credential')
        .argument('<Item name>', 'Meaningful name for item (required)')
        .argument('<Username>', 'Username or email used in credential (required)')
        .argument('[Password]', 'Your item password (optional - send blank and confidant will create one for you)')
        .action(createCredential);
    program
        .command('list')
        .alias('l')
        .description('Retrieve all items')
        .action(getCredentials);
    program
        .command('get')
        .alias('gp')
        .alias('get-password')
        .description('Get item password from id')
        .argument('<id>', 'Credential id')
        .action(getCredentialPasswordById);
    program
        .command('genpass')
        .alias('generate-password')
        .description('Generate new password')
        .action(createPassword);
}
async function createCredential(credentialName, username, password) {
    var credentialService = tsyringe_1.container.resolve(credentialService_1.CredentialService);
    const result = await credentialService.createCredential(credentialName, username, password);
    if (result.isSuccessful == false) {
        console.log(result.message);
        return;
    }
    console.log('Credential created successfully');
}
async function getCredentials() {
    var credentialService = tsyringe_1.container.resolve(credentialService_1.CredentialService);
    const result = await credentialService.getCredentials();
    if (result.isSuccessful == false) {
        console.log(result.message);
        return;
    }
    const foundCredentials = result.value;
    for (let index = 0; index < foundCredentials.length; index++) {
        const element = foundCredentials[index];
        let credential = { Id: element.id, CredentialName: element.credentialName, Username: element.username };
        console.log(JSON.stringify(credential));
    }
}
async function getCredentialPasswordById(idStr) {
    var credentialService = tsyringe_1.container.resolve(credentialService_1.CredentialService);
    const id = Number(idStr);
    if (isNaN(id)) {
        console.log('Please enter a numeric credential id');
        return;
    }
    const result = await credentialService.getCredentialPassword(id);
    if (!result.isSuccessful) {
        console.log(result.message);
        return;
    }
    const password = result.value;
    const clipboardy = (await Promise.resolve().then(() => __importStar(require("clipboardy")))).default;
    await clipboardy.write(password);
    console.log('Password copied to clipboard!');
}
async function createPassword() {
    var rl = readline.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
    console.log('Generate new passowrd!');
    var length = 0;
    while (length == 0) {
        var answer = await rl.question('Please choose the length from 8 to 128: ');
        const convertedLenght = Number(answer);
        if (isNaN(convertedLenght)) {
            console.log('Please write a numeric value!');
            continue;
        }
        length = convertedLenght;
        if (length < 8 || length > 128) {
            length = 0;
            console.log('Please write a numeric value from 8 to 128!');
            continue;
        }
        break;
    }
    var useNumbers = await askYesOrNoQuestion(rl, 'Would you like to include numbers? [y/n]: ');
    var useSpecialChars = await askYesOrNoQuestion(rl, 'Would you like to include special characters? [y/n]: ');
    var useUpperCaseChars = await askYesOrNoQuestion(rl, 'Would you like to include upper case characters? [y/n]: ');
    rl.close();
    const passwordResult = credentialService_1.CredentialService.generatePassword(length, useNumbers, useSpecialChars, useUpperCaseChars);
    if (!passwordResult.isSuccessful) {
        console.log(passwordResult.message);
        return;
    }
    const generatedPassword = passwordResult.value;
    const clipboardy = (await Promise.resolve().then(() => __importStar(require("clipboardy")))).default;
    await clipboardy.write(generatedPassword);
    console.log('Password was copied to your clipboard');
}
async function askYesOrNoQuestion(rl, question) {
    var tempAnswer = '';
    var result = false;
    while (tempAnswer.isNullOrWhiteSpace()) {
        var answer = await rl.question(question);
        switch (answer) {
            case 'y':
            case 'Y':
                result = true;
                tempAnswer = answer;
                break;
            case 'n':
            case 'n':
                result = false;
                tempAnswer = answer;
                break;
            default:
                tempAnswer = '';
                console.log('Invalid answer, please use \'y\' or \'n\'');
                break;
        }
    }
    return result;
}
