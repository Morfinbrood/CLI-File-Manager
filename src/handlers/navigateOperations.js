import fs from 'fs/promises';
import path from 'path';
import { homedir } from 'node:os';

const colors = {
    white: '\x1b[0m',
    green: '\x1b[32m'
}
export class NavigateOperations {

    async handleNavigateCommand(command, params) {
        switch (command) {
            case 'ls':
                await this.listFiles();
                break;
            case 'cd':
                await this.changeDirectory(params[0]);
                break;
            case 'up':
                await this.goUp();
                break;
            default:
                console.error(`Invalid input. Unknown FileNavigation command.`);
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

            await this.printFilesTable(directories.concat(regularFiles));
        } catch (error) {
            console.error('Error reading directory:', error.message);
        }
    }

    async printFilesTable(files) {
        console.log();
        const fileInfoArray = [];

        const folders = [];
        const filesList = [];
        for (const file of files) {
            const fileStat = await fs.stat(path.resolve(this.currentDirectory, file));
            const isFile = fileStat.isFile();
            const fileType = isFile ? 'file' : 'directory';
            const fileInfo = { Name: file, Type: fileType };

            if (fileType === 'directory') {
                folders.push(fileInfo);
            } else {
                filesList.push(fileInfo);
            }
        }

        folders.sort((a, b) => a.Name.localeCompare(b.Name));
        filesList.sort((a, b) => a.Name.localeCompare(b.Name));
        fileInfoArray.push(...folders, ...filesList);

        console.table(fileInfoArray, ['Name', 'Type']);
    };

    async changeDirectory(target) {
        if (target) {
            const newPath = path.resolve(this.getCurrentDirectory(), target);

            try {
                const stats = await fs.stat(newPath);
                if (stats.isDirectory()) {
                    this.setCurrentDirectory(newPath);
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

    async goUp() {
        const parentDirectory = path.resolve(this.getCurrentDirectory(), '..');
        if (parentDirectory !== this.getCurrentDirectory()) {
            this.setCurrentDirectory(parentDirectory);
        } else {
            console.error('Invalid input. Cannot go upper than root directory.');
        }
    }

}