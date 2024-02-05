import fs from 'fs/promises';
import path from 'path';

export class NavigateOperations {

    async handleNavigateCommand(command, params, currentDirectory) {
        this.currentDirectory = currentDirectory;
        switch (command) {
            case 'ls':
                this.listFiles();
                break;
            case 'cd':
                this.changeDirectory(params[0]);
                break;
            case 'up':
                this.goUp();
            default:
                console.error('Invalid input. Unknown os command.');
        }
    }

    async listFiles() {
        try {
            const files = await fs.readdir(this.currentDirectory);
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
            const filePath = path.join(this.currentDirectory, file);
            const stats = await fs.stat(filePath);
            const type = stats.isDirectory() ? 'directory' : 'file';

            const formattedIndex = (index + 1).toString().padEnd(6);
            const formattedName = file.padEnd(30);
            const formattedType = type.padEnd(15);

            console.log(`${formattedIndex}${formattedName}${formattedType}`);
        }
    }

    async changeDirectory(target) {
        if (target) {
            const newPath = path.resolve(this.currentDirectory, target);

            try {
                const stats = await fs.stat(newPath);
                if (stats.isDirectory()) {
                    this.currentDirectory = newPath;
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
        const parentDirectory = path.resolve(this.currentDirectory, '..');
        if (parentDirectory !== this.currentDirectory) {
            this.currentDirectory = parentDirectory;
            console.log(`You are currently in ${this.currentDirectory}`);
        } else {
            console.error('Invalid input. Cannot go upper than root directory.');
        }
    }

}