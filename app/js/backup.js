const fs = require("fs");
const exePath = process.cwd();

function typeholder(inputID) {
  if (!document.getElementById(inputID).placeholder.includes('/') && !document.getElementById(inputID).placeholder.includes('\\')) { return; }
  document.getElementById(inputID).value = document.getElementById(inputID).placeholder;
}

function verifyPlaceholder(placeholder) {
  if (fs.existsSync(placeholder)) { return true; }
  if (!fs.existsSync(placeholder)) { return false; }
}

function backup() {
  const osuDir = document.getElementById("path").value;
  let actual;
    if (process.platform != "win32" && process.platform == "linux" || process.platform == "freebsd") {
      actual = `/home/${require("os").userInfo().username}/Downloads`
      if (!fs.existsSync(actual)) { actual = `/home/${require("os").userInfo().username}` }
    } if (process.platform == "win32") { actual = `C:\\Users\\${require('os').userInfo().username}` }

  if (osuDir.endsWith('/Songs')) {
    osuDir.replace('/Songs', '');
  }

  if (fs.existsSync(`${osuDir}/Songs`)) {
    let downloadList = "";
    fs.readdirSync(`${osuDir}/Songs`).forEach((file) => {
      const code = file.slice(0, file.indexOf(" "));
      const name = file.slice(file.indexOf(" "), file.length).replace(" ", "");

      const downloadUrl = `https://storage.ripple.moe/d/${code}\r\n`;

      downloadList += `${code} ${name} : ${downloadUrl}`;
    });

    var dir = `${actual}/backup`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.writeFileSync(`${dir}/list.txt`, downloadList, "utf8");
    }

    return dir
  } else {
    return 'error'
  }
}

module.exports = { backup, typeholder, verifyPlaceholder };
