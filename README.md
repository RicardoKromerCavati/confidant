![Build](https://img.shields.io/github/actions/workflow/status/ricardokromercavati/confidant/.github/workflows/build.yml?label=Build&branch=main)
![Tests](https://img.shields.io/github/actions/workflow/status/ricardokromercavati/confidant/.github/workflows/unit_tests.yml?label=Tests&branch=main)

# confidant

This is my clean and simple command line password manager!

# The why
I came up with the ideia of developing it for two reasons.  
The first one is to learn more about technologies and concepts I don't usually use at work.  
The second reason is because there are some ocasions when I can't use a consolidated password manager. And then I thought 'Why not create my own?!'  

# Details
I decided to start developing a command line tool and then upgrade it with time.

# Technologies
## Programming language and runtime
- [TypeScript](https://www.typescriptlang.org/).
- [Node.js](https://nodejs.org/en).

## Application
- [Commander](https://www.npmjs.com/package/commander).
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js).
- [Prompt Sync](https://github.com/heapwolf/prompt-sync).
- [Mikro ORM](https://github.com/mikro-orm/mikro-orm).
- [Clipboardy](https://github.com/sindresorhus/clipboardy).
- [Moment](https://github.com/moment/moment).
- [Tsyringe](https://github.com/Microsoft/tsyringe).

## Unit Tests and Test Reports
- [Jest](https://github.com/jestjs/jest).
- [TS Jest](https://github.com/kulshekhar/ts-jest).
- [Jest Junit](https://github.com/jest-community/jest-junit).

## Release
- [Semantic Release](https://github.com/semantic-release/semantic-release).
    - [Commit Analyzer](https://github.com/semantic-release/commit-analyzer).
    - [GitHub](https://github.com/semantic-release/github).
    - [Release Notes Generator](https://github.com/semantic-release/release-notes-generator).

# What it can do (for now)
- Create new item in database (with name, account name and password).  
    - There are two ways of doing the creation, the guided way, in which confidant will ask the use for all the needed information, the second way to via command line, in which the user needs to provide the arguments to the command.
- Retrieve list of created items.  
    - A simple list of the items already created.
- Retrieve password of specific item by id.  
    - Acquires password from database and copies it to the user's clipboard.
- A guided creation of passwords.  
    - It asks the user about some of the characteristics of the desired password, creates it and copies to the clipboard.
## Important
All the information is saved locally, please use carefully.
