import os from 'os';

export class OSOperations {

    async handleOSCommand(params) {
        switch (params[0]) {
            case '--EOL':
                this.printEOL();
                break;
            case '--cpus':
                this.printCPUsInfo();
                break;
            case '--homedir':
                this.printHomeDirectory();
                break;
            case '--username':
                this.printSystemUsername();
                break;
            case '--architecture':
                this.printCPUArchitecture();
                break;
            default:
                console.error('Invalid input. Unknown os command.');
        }
    }

    printEOL() {
        console.log(`End-Of-Line (EOL): ${os.EOL}`);
    }

    printCPUsInfo() {
        const cpus = os.cpus();

        console.log('CPUs Information:');
        console.log('------------------');

        cpus.forEach((cpu, index) => {
            console.log(`CPU ${index + 1}:`);
            console.log(`  Model: ${cpu.model}`);
            console.log(`  Speed: ${cpu.speed} MHz`);
        });
    }

    printHomeDirectory() {
        console.log(`Home Directory: ${os.homedir()}`);
    }

    printSystemUsername() {
        console.log(`System Username: ${os.userInfo().username}`);
    }

    printCPUArchitecture() {
        console.log(`CPU Architecture: ${os.arch()}`);
    }

}