import { createReadStream, createWriteStream } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import zlib from 'zlib';

export class HashAndCompressionOperations {
    async handleHashAndCompressionCommands(command, params, currentDirectory) {
        this.currentDirectory = currentDirectory;
        switch (command) {
            case 'hash':
                await this.calculateFileHash(params[0]);
                break;
            case 'compress':
                await this.compressFile(params[0], params[1]);
                break;
            case 'decompress':
                await this.decompressFile(params[0], params[1]);
                break;
            default:
                console.error('Invalid input. Unknown operation.');
        }
    }

    async calculateFileHash(filePath) {
        try {
            const fileData = await fs.readFile(filePath);
            const hash = createHash('sha256');
            hash.update(fileData);
            console.log(`Hash for file ${filePath}: ${hash.digest('hex')}`);
        } catch (error) {
            console.log('Error calculating file hash:', error.message);
        }
    }

    async compressFile(sourcePath, destinationPath) {
        try {
            const sourceFullPath = path.resolve(this.currentDirectory, sourcePath);
            const destinationFullPath = path.resolve(this.currentDirectory, destinationPath);

            const readStream = createReadStream(sourceFullPath);
            const writeStream = createWriteStream(destinationFullPath);

            const compressStream = zlib.createBrotliCompress();
            readStream.pipe(compressStream).pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log(`File ${sourcePath} compressed to ${destinationPath}`);
        } catch (error) {
            console.error('Error compressing file:', error.message);
        }
    }

    async decompressFile(sourcePath, destinationPath) {
        try {
            const sourceFullPath = path.resolve(this.currentDirectory, sourcePath);
            const destinationFullPath = path.resolve(this.currentDirectory, destinationPath);

            const readStream = createReadStream(sourceFullPath);
            const writeStream = createWriteStream(destinationFullPath);

            const decompressStream = zlib.createBrotliDecompress();
            readStream.pipe(decompressStream).pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log(`File ${sourcePath} decompressed to ${destinationPath}`);
        } catch (error) {
            console.error('Error decompressing file:', error.message);
        }
    }
}
