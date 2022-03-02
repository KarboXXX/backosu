const fileDialog = require('file-dialog');
const fs = require('fs');
const Diff = require('diff');
const path = require('path');
const os = require('os')

function choosePath() {
    fileDialog({multiple: true, accept: "text/*"}).then(files => {
        if (files.length < 2) {
            fileDialog({multiple: false, accept: "text/*"}).then(files2 => {
                compare(files[0].path, files2[0].path)
            });
        } else compare(files[0].path, files[1].path);
    });
}

function compare(path1, path2) {
    var file1, file2, result = "", added = "", removed = "";
    file1 = fs.readFileSync(path1).toString()
    file2 = fs.readFileSync(path2).toString()

    if (file1 === file2) return swal.fire({ icon: "success", title: "Both files are idetical!", confirmButtonText: "Thanks!" });

    result = Diff.diffLines(file1, file2).forEach((part) => {
        if (part.added) { added += part.value.toString(); }
        if (part.removed) { removed += part.value.toString(); }
    })

    result = "[---]: " + removed + "\n\n[+++]: " + added

    let actual = path.resolve(os.homedir(), "./Downloads")
    if (!fs.existsSync(actual)) actual = os.homedir();

    var dir = path.resolve(actual, "./backup");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/compar.txt`, result, "utf8");

    return swal.fire({ icon: "success", title: dir + path.sep + "compar.txt has been created!", confirmButtonText: "Let's go!" }); 
}

module.exports = { choosePath, compare }