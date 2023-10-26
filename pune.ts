#!/usr/bin/env node

import { program } from 'commander';
import { execa } from 'execa';
import fs from 'fs';
import * as packageJson from './package.json' with { type: "json" };
program.version('1.0.0');

program
    .command('init')
    .description('Initialize a new testing environment')
    .action(async () => {
        try {
            await execa('npm', [
                'i',
                '-D',
                '@testing-library/jest-dom',
                '@testing-library/react',
                '@testing-library/user-event',
                'jest',
                'jest-environment-jsdom',
                'ts-jest',
                'eslint-plugin-jest-dom',
                'eslint-plugin-testing-library',
            ]);

            fs.writeFileSync(
                'jest.config.js',
                `module.exports = {
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};`
            );

            fs.writeFileSync('jest.setup.js', "import '@testing-library/jest-dom';");

            if (!fs.existsSync('__tests__')) {
                fs.mkdirSync('__tests__');
            }

            let updatedPackageJson = { ...packageJson };
            updatedPackageJson.scripts.test = 'jest';
            updatedPackageJson.scripts['test:watch'] = 'jest --watchAll';
            fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

            console.log('Test environment initialized successfully.');
        } catch (error: any) {
            console.error('An error occurred:', error.message);
        }
    });

program
    .command('run')
    .description('Run tests using Jest')
    .action(() => {
        execa('npm', ['run', 'test'], { stdio: 'inherit' });
    });

program.parse(process.argv);
