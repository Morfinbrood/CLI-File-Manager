import fs from 'fs/promises';
import path from 'path';
import { Readable, Writable, pipeline } from 'stream';
import { createReadStream } from 'fs';



export default class Cli_input_manager {
    constructor() {
        const args = process.argv.slice(2);
        const argSeparator = '=';
        const argNameUserName = '--username';

        if (args[0]) {
            const argsParsed = args[0].split(argSeparator);
            if (argsParsed[0] === argNameUserName) {
                this.username = argsParsed[1];
                this.startFileManager();
                return this;
            }
        }
        console.error('Invalid input. Please start the program with --username argument.');
    }

    startFileManager() {
        console.log(`Welcome to the File Manager, ${this.username}!`);

        this.currentDirectory = process.cwd();
        console.log(`You are currently in ${this.currentDirectory}`);

        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (input) => {
            input = input.trim().split(' ');

            const command = input[0];
            const params = input.slice(1);

            switch (command) {
                case 'ls':
                    this.listFiles();
                    break;
                case 'cd':
                    this.changeDirectory(params[0]);
                    break;
                case 'cat':
                    this.readFile(params[0]);
                    break;
                // case 'add':
                //   createFile(params[0]);
                //   break;
                // case 'rn':
                //   renameFile(params[0], params[1]);
                //   break;
                // case 'cp':
                //   copyFile(params[0], params[1]);
                //   break;
                // case 'mv':
                //   moveFile(params[0], params[1]);
                //   break;
                // case 'rm':
                //   deleteFile(params[0]);
                //   break;
                // case 'os':
                //   getOSInfo(params[0]);
                //   break;
                // case 'hash':
                //   calculateHash(params[0]);
                //   break;
                // case 'compress':
                //   compressFile(params[0], params[1]);
                //   break;
                // case 'decompress':
                //   decompressFile(params[0], params[1]);
                //   break;
                case 'up':
                    this.goUp();
                    break;
                case '.exit':
                    this.exitFileManager();
                    break;
                default:
                    console.error('Invalid input. Unknown operation.');
            }
        });

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

    async listFiles() {
        try {
            const files = await fs.readdir(this.currentDirectory);

            console.log('\nIndex\tName\t\t\tType');
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

            console.log('-------------------------------------------\n');
        } catch (error) {
            console.error('Error reading directory:', error.message);
        }
    }

    exitFileManager() {
        console.log(`Thank you for using File Manager, ${this.username}, goodbye!`);
        process.exit();
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

}