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
const program = require("commander");
const pkg = require('../package.json');
const BASE_NAME = '';
program.version(pkg.version)
    .description('file-move-dir: move sub dir files into one place')
    .option('-s, --source_dir <dir>', 'source dir')
    .option('-o, --output_dir <dir>', 'output dir')
    .option('-n, --base_name <string>', 'output base name, default is empty means only rename output files by number')
    .parse(process.argv);
const ARGS_SOURCE_DIR = program.source_dir === undefined ? undefined : program.source_dir;
const ARGS_OUTPUT_DIR = program.output_dir === undefined ? undefined : program.output_dir;
const ARGS_OUTPUT_NAME = !program.output_name ? BASE_NAME : program.output_name;
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