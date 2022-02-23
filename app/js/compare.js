const fileDialog = require('file-dialog');
const fs = require('fs');
const diff = require('fast-diff');
const process = require("process");
const exePath = process.cwd();
// let exePath;
// if (process.platform != "win32" && process.platform == "linux" || process.platform == "freebsd") {
//     exePath = `/home/${require("os").userInfo().username}/Downloads`
//     if (fs.existsSync(exePath)) { return; } 
//     else { exePath = `/home/${require("os").userInfo().username}` }
//   } else if (process.platform == "win32") {
//     exePath = `C:\\Users\\${require('os').userInfo().username}`
// }

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

    let actual, bar;
    if (process.platform != "win32" && process.platform == "linux" || process.platform == "freebsd") {
        actual = `/home/${require("os").userInfo().username}/Downloads`
        bar = "/"
        if (!fs.existsSync(actual)) { actual = `/home/${require("os").userInfo().username}` }
        } if (process.platform == "win32") {  bar = "\\"; actual = `C:\\Users\\${require('os').userInfo().username}` }

    var dir = `${actual}/backup`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/compar.txt`, result, "utf8");

    return swal.fire({ icon: "success", title: dir + bar + "compar.txt has been created!", confirmButtonText: "Let's go!" }); 
}

module.exports = { choosePath, compare }