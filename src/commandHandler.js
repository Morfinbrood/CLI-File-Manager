import { FileOperations } from './handlers/fileOperations.js';
import { OSOperations } from './handlers/osOperations.js';
import { HashAndCompressionOperations } from './handlers/hashAndCompressionOperations.js';
import { NavigateOperations } from './handlers/navigateOperations.js'


export class CommandHandler {
    constructor(username) {
        this.username = username;
        this.navigateOperations = new NavigateOperations();
        this.fileOperations = new FileOperations();
        this.osOperations = new OSOperations();
        this.hashAndCompressionOperations = new HashAndCompressionOperations();
    }

    async handleCommand(command) {
        const [operation, ...params] = command.split(' ');

        switch (operation) {
            case 'ls':
            case 'cd':
            case 'up':
                await this.navigateOperations.handleNavigateCommand(operation, params);
                break;
            case 'add':
            case 'rn':
            case 'cp':
            case 'mv':
            case 'rm':
            case 'cat':
                await this.fileOperations.handleFileCommand(operation, params, this.navigateOperations.getCurrentDirectory());
                break;
            case 'os':
                await this.osOperations.handleOSCommand(params);
                break;
            case 'hash':
            case 'compress':
            case 'decompress':
                await this.hashAndCompressionOperations.handleHashAndCompressionCommands(operation, params, this.navigateOperations.getCurrentDirectory());
                break;
            case '.exit':
                await this.exitFileManager();
                break;
            default:
                console.error('Invalid input. Unknown operation.');
        }

        console.log(`You are currently in ${this.navigateOperations.getCurrentDirectory()}`);
    }

    async exitFileManager() {
        console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
        process.exit();
    }

}