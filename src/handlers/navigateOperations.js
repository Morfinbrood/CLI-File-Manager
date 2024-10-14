import fs from 'fs/promises';
import path from 'path';
import { homedir } from 'node:os';


const colors = {
    white: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
}
export class NavigateOperations {

    async handleNavigateCommand(command, params) {
        switch (command) {
            case 'ls':
                this.listFiles();
                break;
            case 'cd':
                this.changeDirectory(params[0]);
                break;
            case 'up':
                this.goUp();
                break;
            default:
                console.error(`${colors.red}Invalid input. Unknown FileNavigation command.${colors.white}`);
        }
    }

    getCurrentDirectory() {
        if (!this.currentDirectory) {
            this.setCurrentDirectory(homedir())
        };
        return this.currentDirectory || homedir();
    }

    setCurrentDirectory(newPath) {
        this.currentDirectory = newPath
    }

    async listFiles() {
        try {
            const files = await fs.readdir(this.getCurrentDirectory());
            const directories = [];
            const regularFiles = [];

            for (const file of files) {
                const filePath = path.join(this.currentDirectory, file);
                const stats = await fs.stat(filePath);

                if (stats.isDirectory()) {
                    directories.push(file);
                } else {
                    regularFiles.push(file);
                }
            }

            console.log('\nDirectories:');
            console.log('-------------------------------------------');
            await this.printFiles(directories.concat(regularFiles));

            console.log('-------------------------------------------\n');
        } catch (error) {
            console.error('Error reading directory:', error.message);
        }
    }

    async printFiles(files) {
        console.log('Index\tName\t\t\tType');
        console.log('-------------------------------------------');

        for (const [index, file] of files.entries()) {
            const filePath = path.join(this.getCurrentDirectory(), file);
            const stats = await fs.stat(filePath);
            const type = stats.isDirectory() ? 'directory' : 'file';

            const formattedIndex = (index + 1).toString().padEnd(6);
            const formattedName = file.padEnd(30);
            const formattedType = type.padEnd(15);

            console.log(`${formattedIndex}${colors.green}${formattedName}${formattedType}${colors.white}`);
        }
    }

    async changeDirectory(target) {
        if (target) {
            const newPath = path.resolve(this.getCurrentDirectory(), target);

            console.log(`newPath = ${newPath}`)
            try {
                const stats = await fs.stat(newPath);
                if (stats.isDirectory()) {
                    this.setCurrentDirectory(newPath);
                    console.log(`You are currently in ${this.currentDirectory}`);
                } else {
                    console.error('Invalid input. Not a directory.');
                }
            } catch (error) {
                console.error('Invalid input. Directory does not exist.');
            }
        }
        else {
            console.error('Invalid input. Need path for CD command');
        }

    }

    goUp() {
        const parentDirectory = path.resolve(this.getCurrentDirectory(), '..');
        if (parentDirectory !== this.getCurrentDirectory()) {
            this.setCurrentDirectory(parentDirectory);
        } else {
            console.error('Invalid input. Cannot go upper than root directory.');
        }
    }

}