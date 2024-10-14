import { CommandHandler } from './commandHandler.js';
import { homedir } from 'node:os';

export class FileManager {
    constructor(username) {
        this.username = username;
        this.commandHandler = new CommandHandler(this.username);
    }

    async start() {
        try {
            this.printWelcomeMessage();
            while (true) {
                const userInput = await this.getUserInput();
                await this.commandHandler.handleCommand(userInput);
            }
        } catch (error) {
            console.error(`Somthimg wrong with start: ${error.message}`)
        }
    }

    async getUserInput() {
        return new Promise((resolve) => {
            process.stdout.write('> ');
            process.stdin.once('data', (data) => resolve(data.toString().trim()));
        });
    }

    printWelcomeMessage() {
        console.log(`Welcome to the File Manager, ${this.username}!`);
        console.log (`You are currently in ${homedir()}`)
    }
}