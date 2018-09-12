file-move-dir
=============

Move sub dir files into one place, renamed with numeric name.

## Install
```
npm install file-move-dir -g
```

## Usage
```
$ file-move-dir -h

    Usage: index [options]

    file-move-dir: move sub dir files into one place

    Options:

      -V, --version             output the version number
      -s, --source_dir <dir>    source dir
      -o, --output_dir <dir>    output dir
      -n, --base_name <string>  output base name, default is empty means only rename output files by number
      -l, --locale <string>     locale by which file list read from dir sorted, default is en, see https://www.npmjs.com/package/readdir-sorted
      -h, --help                output usage information

```

## Example
```
files:
    your_source_dir
        sub_dir1
            file1.png
            file2.png
            file3.png
        sub_dir2
            file1.txt
            file2.txt
        sub_dir3
            file1.docx
            file2.pptx

$ file-move-dir -s your_source_dir -o your_dest_dir -n file_prefix

output:
    your_dest_dir
        file_prefix0001.png
        file_prefix0002.png
        file_prefix0003.png
        file_prefix0004.txt
        file_prefix0005.txt
        file_prefix0006.docx
        file_prefix0007.pptx

```