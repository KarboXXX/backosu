const fileDialog = require('file-dialog');
const fs = require('fs');
const diff = require('fast-diff');
const process = require("process");
const exePath = process.cwd();

function choosePath() {
    fileDialog({multiple: true, accept: "text/*"}).then(files => {
        // return files[0].path
        compare(files[0].path, files[1].path);
    });
}

function compare(path1, path2) {
    var file1, file2;
    file1 = fs.readFileSync(path1).toString();
    file2 = fs.readFileSync(path2).toString();

    if (file1 === file2) return swal.fire({ icon: "success", title: "Both files are idetical!", confirmButtonText: "Thanks!" }); 
    let result = diff(file1, file2);
    // console.log(result)
    // diff.INSERT === 1;
    // diff.EQUAL === 0;
    // diff.DELETE === -1;
    result = "[---]: " + result[1][1] + "\n\n[===]: " + result[2][1] + "\n\n[+++]: " + result[0][1]

    var dir = `${exePath}/backup`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/compar.txt`, result, "utf8");

    return swal.fire({ icon: "success", title: "backup/compar.txt has been created!", confirmButtonText: "Let's go!" }); 
}

module.exports = { choosePath, compare }