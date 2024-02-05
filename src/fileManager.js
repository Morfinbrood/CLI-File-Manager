import { CommandHandler } from './commandHandler.js';

export class FileManager {
    constructor(username) {
        this.username = username;
        this.commandHandler = new CommandHandler(this.username);
    }

    async start() {
        this.printWelcomeMessage();

        while (true) {
            const userInput = await this.getUserInput();
            await this.commandHandler.handleCommand(userInput);
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
    }
}