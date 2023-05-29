const fs = require("fs");
const path = require("path");

function typeholder(inputID) {
  if (!document.getElementById(inputID).placeholder.includes(path.sep)) return;
  document.getElementById(inputID).value = document.getElementById(inputID).placeholder;
}

function verifyPlaceholder(placeholder) {
  if (fs.existsSync(placeholder)) { return true; } else { return false }
}

function backup(backupPath) {
  const osuDir = document.getElementById("path").value;

  if (!osuDir || !fs.existsSync(osuDir)) return 'osu_path_error';
  if (!backupPath || !fs.existsSync(backupPath)) return 'backup_path_error';
  if (!fs.lstatSync(backupPath).isDirectory || !fs.lstatSync(backupPath).isFile) return 'backup_filetype_error';

  if (osuDir.endsWith('/Songs')) {
    osuDir.replace('/Songs', '');
  }

  if (fs.existsSync(path.resolve(osuDir, './Songs'))) {
    let downloadList = "";
    fs.readdirSync(path.resolve(osuDir, './Songs')).forEach((file) => {
      const code = file.slice(0, file.indexOf(" "));
      const name = file.slice(file.indexOf(" "), file.length).replace(" ", "");

      const downloadUrl = `https://chimu.moe/d/${code}\r\n`;
      downloadList += `${code} ${name} : ${downloadUrl}`;
      downloadList = downloadList.split('/n').sort((a, b) => { return a - b }).toString(); // alphabetic order
    });
    if (fs.lstatSync(backupPath).isDirectory()) {
      var dir = backupPath
      fs.writeFileSync(path.resolve(dir, './list.txt'), downloadList, "utf8");
    } else {
      var dir = backupPath
      fs.writeFileSync(dir, downloadList, "utf8");
    }
    

    return dir // handling results on other files
  } else {
    return 'osu_path_error' // handling results on other files
  }
}

module.exports = { backup, typeholder, verifyPlaceholder };
