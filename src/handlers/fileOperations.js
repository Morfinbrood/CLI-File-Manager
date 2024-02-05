import fs from 'fs/promises';
import path from 'path';

export class FileOperations {

    async handleFileCommand(command, params, currentDirectory) {
        this.currentDirectory = currentDirectory;
        switch (command) {
            case 'cat':
                this.readFile(params[0]);
                break;
            case 'add':
                this.createFile(params[0]);
                break;
            case 'rn':
                this.renameFile(params[0], params[1]);
                break;
            case 'cp':
                this.copyFile(params[0], params[1]);
                break;
            case 'mv':
                this.moveFile(params[0], params[1]);
                break;
            case 'rm':
                this.deleteFile(params[0]);
                break;
            default:
                console.error('Invalid input. Unknown operation.');
        }
    }

    async readFile(filePath) {
        try {
            const fullPath = path.resolve(this.currentDirectory, filePath);
            console.log(fullPath);
            const fileStream = createReadStream(fullPath);

            fileStream.on('error', (error) => {
                console.error('Error reading file:', error.message);
            });

            fileStream.pipe(process.stdout);

            console.log(`Content of file ${filePath}:`);
        } catch (error) {
            console.error('Error opening file:', error.message);
        }
    }

    async createFile(fileName) {
        try {
            const fullPath = path.resolve(this.currentDirectory, fileName);
            console.log (fullPath);
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