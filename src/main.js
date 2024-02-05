import { FileManager } from './fileManager.js';

const args = process.argv.slice(2);
const userName = args[0].split('=')[1];

if (!userName) {
  console.error('Invalid input. Please provide a valid username using --username.');
  process.exit(1);
}

const fileManager = new FileManager(userName);

process.on('SIGINT', () => {
  console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
  process.exit(0);
});

fileManager.start();
