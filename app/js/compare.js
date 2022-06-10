const fileDialog = require('file-dialog');
const fs = require('fs');
const Diff = require('diff');
const path = require('path');
const os = require('os')

function compare(path1, path2) {
    var file1, file2, result = "", added = "", removed = "";
    file1 = fs.readFileSync(path1).toString()
    file2 = fs.readFileSync(path2).toString()
    
    result = Diff.diffLines(file1, file2).forEach((part) => {
        if (part.added) { added += part.value.toString(); }
        if (part.removed) { removed += part.value.toString(); }
    })
    
    if (file1 == file2 || added == "" && removed == "") {
        return swal.fire({
            icon: "success", 
            title: "Both files are idetical!", 
            confirmButtonText: "Thanks!" 
        });
    }

    result = `[---]: ${removed} \n\n[+++]: ${added}`

    let actual = path.resolve(os.homedir(), "./Downloads")
    if (!fs.existsSync(actual)) actual = os.homedir();

    var dir = path.resolve(actual, "./backup");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}/compar.txt`, result, "utf8");

    return swal.fire({
        icon: "success", 
        title: `${dir}${path.sep}compar.txt has been created!`, 
        confirmButtonText: "Let's go!" 
    }); 
}

module.exports = { compare }