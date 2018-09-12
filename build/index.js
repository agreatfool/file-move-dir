#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const LibFs = require("mz/fs");
const LibPath = require("path");
const program = require("commander");
const readdirSorted = require("readdir-sorted");
const pkg = require('../package.json');
const BASE_NAME = '';
program.version(pkg.version)
    .description('file-move-dir: move sub dir files into one place')
    .option('-s, --source_dir <dir>', 'source dir')
    .option('-o, --output_dir <dir>', 'output dir')
    .option('-n, --base_name <string>', 'output base name, default is empty means only rename output files by number')
    .option('-l, --locale <string>', 'locale by which file list read from dir sorted, default is en, see https://www.npmjs.com/package/readdir-sorted')
    .parse(process.argv);
const ARGS_SOURCE_DIR = program.source_dir === undefined ? undefined : program.source_dir;
const ARGS_OUTPUT_DIR = program.output_dir === undefined ? undefined : program.output_dir;
const ARGS_OUTPUT_NAME = !program.output_name ? BASE_NAME : program.output_name;
const ARGS_LOCALE = program.locale === undefined ? 'en' : program.locale;
class FileMoveDir {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('File moving starting ...');
            yield this._validate();
            yield this._process();
        });
    }
    _validate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Move validating ...');
            // validate ARGS_SOURCE_DIR
            if (ARGS_SOURCE_DIR === undefined || !(yield LibFs.exists(ARGS_SOURCE_DIR)) || !(yield LibFs.stat(ARGS_SOURCE_DIR)).isDirectory()) {
                console.log('Source dir is required, and must be directory, please provide -s');
                process.exit(1);
            }
            // validate ARGS_OUTPUT_DIR
            if (ARGS_OUTPUT_DIR === undefined || !(yield LibFs.exists(ARGS_OUTPUT_DIR)) || !(yield LibFs.stat(ARGS_OUTPUT_DIR)).isDirectory()) {
                console.log('Output dir is required, and must be directory, please provide -o');
                process.exit(1);
            }
        });
    }
    _process() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Move processing ...');
            const dirFiles = yield readdirSorted(ARGS_SOURCE_DIR, {
                locale: ARGS_LOCALE,
                numeric: true
            });
            let FILE_NUMBER = 1;
            for (const file of dirFiles) {
                const fullPath = LibPath.join(ARGS_SOURCE_DIR, file);
                if (!(yield LibFs.stat(fullPath)).isDirectory()) {
                    continue;
                }
                console.log(`Sub dir found: ${fullPath}`);
                const subFiles = yield readdirSorted(fullPath, {
                    locale: ARGS_LOCALE,
                    numeric: true
                });
                for (const subFile of subFiles) {
                    const subFullPath = LibPath.join(fullPath, subFile);
                    if ((yield LibFs.stat(subFullPath)).isFile() && subFile !== '.DS_Store') {
                        const destPath = LibPath.join(ARGS_OUTPUT_DIR, `${ARGS_OUTPUT_NAME}${FILE_NUMBER.toString().padStart(4, '0')}${LibPath.extname(subFullPath)}`);
                        yield LibFs.rename(subFullPath, destPath);
                        console.log(`Moving, from ${subFullPath}, to ${destPath}`);
                        FILE_NUMBER++;
                    }
                }
            }
        });
    }
}
new FileMoveDir().run().then(_ => _).catch(_ => console.log(_));
process.on('uncaughtException', (error) => {
    console.error(`Process on uncaughtException error = ${error.stack}`);
});
process.on('unhandledRejection', (error) => {
    console.error(`Process on unhandledRejection error = ${error.stack}`);
});
//# sourceMappingURL=index.js.map