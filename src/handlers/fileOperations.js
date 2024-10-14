import { createReadStream, createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'node:stream/promises';
import { stdout } from 'node:process';

export class FileOperations {

    async handleFileCommand(command, params, currentDirectory) {
        this.currentDirectory = currentDirectory;
        switch (command) {
            case 'cat':
                await this.readFile(params[0]);
                break;
            case 'add':
                await this.createFile(params[0]);
                break;
            case 'rn':
                await this.renameFile(params[0], params[1]);
                break;
            case 'cp':
                await this.copyFile(params[0], params[1]);
                break;
            case 'mv':
                await this.moveFile(params[0], params[1]);
                break;
            case 'rm':
                await this.deleteFile(params[0]);
                break;
            default:
                console.error('Invalid input. Unknown operation.');
        }
    }

    async readFile(filePath) {
        try {
            const fullPath = path.resolve(this.currentDirectory, filePath);
            const fileStream = createReadStream(fullPath);

            console.log(`Content of file ${filePath}:`);
            await pipeline(fileStream, stdout, { end: false });
            console.log();
        } catch (error) {
            console.error('Error opening file:', error.message);
        }
    }

    async createFile(fileName) {
        try {
            const fullPath = path.resolve(this.currentDirectory, fileName);
            await fs.writeFile(fullPath, '');
            console.log(`File ${fileName} created successfully in ${this.currentDirectory}`);
        } catch (error) {
            console.error('Error creating file:', error.message);
        }
    }

    async renameFile(oldPath, newName) {
        try {
            const fullPath = path.resolve(this.currentDirectory, oldPath);
            const newFullPath = path.resolve(this.currentDirectory, newName);
            await fs.rename(fullPath, newFullPath);
            console.log(`File ${oldPath} renamed to ${newName}`);
        } catch (error) {
            console.error('Error renaming file:', error.message);
        }
    }

    async copyFile(sourcePath, destinationPath) {
        try {
            const sourceFullPath = path.resolve(this.currentDirectory, sourcePath);
            const destinationFullPath = path.resolve(this.currentDirectory, destinationPath);

            const readStream = createReadStream(sourceFullPath);
            const writeStream = createWriteStream(destinationFullPath);

            readStream.pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log(`File ${sourcePath} copied to ${destinationPath}`);
        } catch (error) {
            console.error('Error copying file:', error.message);
        }
    }

    async moveFile(sourcePath, destinationPath) {
        try {
            const sourceFullPath = path.resolve(this.currentDirectory, sourcePath);
            const destinationFullPath = path.resolve(this.currentDirectory, destinationPath);

            const sourceStats = await fs.stat(sourceFullPath);

            if (sourceStats.isFile()) {
                const readStream = createReadStream(sourceFullPath);
                const writeStream = createWriteStream(destinationFullPath);

                readStream.pipe(writeStream);

                await new Promise((resolve, reject) => {
                    writeStream.on('finish', async () => {
                        await fs.unlink(sourceFullPath);
                        resolve();
                    });
                    writeStream.on('error', reject);
                });

                console.log(`File ${sourcePath} moved to ${destinationPath}`);
            } else {
                console.error(`Error moving file: ${sourcePath} is a directory. Use 'cp -r' for directory copy.`);
            }
        } catch (error) {
            console.error('Error moving file:', error.message);
        }
    }

    async deleteFile(filePath) {
        try {
            const fullPath = path.resolve(this.currentDirectory, filePath);
            await fs.unlink(fullPath);
            console.log(`File ${filePath} deleted successfully`);
        } catch (error) {
            console.error('Error deleting file:', error.message);
        }
    }
}