#!/usr/bin/env node

import * as LibFs from 'mz/fs';
import * as LibPath from 'path';

import * as program from 'commander';
import * as readdirSorted from 'readdir-sorted';

const pkg = require('../package.json');

const BASE_NAME = '';

program.version(pkg.version)
    .description('file-move-dir: move sub dir files into one place')
    .option('-s, --source_dir <dir>', 'source dir')
    .option('-o, --output_dir <dir>', 'output dir')
    .option('-n, --base_name <string>', 'output base name, default is empty means only rename output files by number')
    .option('-l, --locale <string>', 'locale by which file list read from dir sorted, default is en, see https://www.npmjs.com/package/readdir-sorted')
    .parse(process.argv);

const ARGS_SOURCE_DIR = (program as any).source_dir === undefined ? undefined : (program as any).source_dir;
const ARGS_OUTPUT_DIR = (program as any).output_dir === undefined ? undefined : (program as any).output_dir;
const ARGS_OUTPUT_NAME = !(program as any).output_name ? BASE_NAME : (program as any).output_name;
const ARGS_LOCALE = (program as any).locale === undefined ? 'en' : (program as any).locale;

class FileMoveDir {

    public async run() {
        console.log('File moving starting ...');

        await this._validate();
        await this._process();
    }

    private async _validate() {
        console.log('Move validating ...');

        // validate ARGS_SOURCE_DIR
        if (ARGS_SOURCE_DIR === undefined || !(await LibFs.exists(ARGS_SOURCE_DIR)) || !(await LibFs.stat(ARGS_SOURCE_DIR)).isDirectory()) {
            console.log('Source dir is required, and must be directory, please provide -s');
            process.exit(1);
        }

        // validate ARGS_OUTPUT_DIR
        if (ARGS_OUTPUT_DIR === undefined || !(await LibFs.exists(ARGS_OUTPUT_DIR)) || !(await LibFs.stat(ARGS_OUTPUT_DIR)).isDirectory()) {
            console.log('Output dir is required, and must be directory, please provide -o');
            process.exit(1);
        }
    }

    private async _process() {
        console.log('Move processing ...');

        const dirFiles = await readdirSorted(ARGS_SOURCE_DIR, {
            locale: ARGS_LOCALE,
            numeric: true
        });

        let FILE_NUMBER = 1;

        for (const file of dirFiles) {
            const fullPath = LibPath.join(ARGS_SOURCE_DIR, file);

            if (!(await LibFs.stat(fullPath)).isDirectory()) {
                continue;
            }

            console.log(`Sub dir found: ${fullPath}`);

            const subFiles = await readdirSorted(fullPath, {
                locale: ARGS_LOCALE,
                numeric: true
            });
            for (const subFile of subFiles) {
                const subFullPath = LibPath.join(fullPath, subFile);

                if ((await LibFs.stat(subFullPath)).isFile() && subFile !== '.DS_Store') {
                    const destPath = LibPath.join(ARGS_OUTPUT_DIR, `${ARGS_OUTPUT_NAME}${FILE_NUMBER.toString().padStart(4, '0')}${LibPath.extname(subFullPath)}`);
                    await LibFs.rename(subFullPath, destPath);
                    console.log(`Moving, from ${subFullPath}, to ${destPath}`);

                    FILE_NUMBER++;
                }
            }
        }
    }

}

new FileMoveDir().run().then(_ => _).catch(_ => console.log(_));

process.on('uncaughtException', (error) => {
    console.error(`Process on uncaughtException error = ${error.stack}`);
});

process.on('unhandledRejection', (error) => {
    console.error(`Process on unhandledRejection error = ${error.stack}`);
});