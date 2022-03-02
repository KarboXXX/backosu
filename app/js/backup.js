const fs = require("fs");
const os = require("os");
const path = require("path");

function typeholder(inputID) {
  if (!document.getElementById(inputID).placeholder.includes(path.sep)) return;
  document.getElementById(inputID).value = document.getElementById(inputID).placeholder;
}

function verifyPlaceholder(placeholder) {
  if (fs.existsSync(placeholder)) { return true; } else { return false }
}

function backup() {
  const osuDir = document.getElementById("path").value;
  let actual = path.resolve(os.homedir(), './Downloads');
  if (!fs.existsSync(actual)) actual = os.homedir();

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

    var dir = path.resolve(actual, `./Downloads/backup`);
    if (!fs.existsSync(path.resolve(dir, '../'))) dir = path.resolve(actual, './backup')
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir); }
    fs.writeFileSync(`${dir}/list.txt`, downloadList, "utf8");

    return dir // handling results on other files
  } else {
    return 'error' // handling results on other files
  }
}

module.exports = { backup, typeholder, verifyPlaceholder };
