const fs = require("fs");
const exePath = process.cwd();
console.info(exePath)

function typeholder(inputID) {
  if (!document.getElementById(inputID).placeholder.includes('/') && !document.getElementById(inputID).placeholder.includes('\\'))
  { return; }
  document.getElementById(inputID).value = document.getElementById(inputID).placeholder;
}

function verifyPlaceholder(placeholder) {
  if (fs.existsSync(placeholder)) { return true; }
  if (!fs.existsSync(placeholder)) { return false; }
}

function backup() {
  const osuDir = document.getElementById("path").value;
  // const message = document.getElementById("message");

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

    var dir = `${exePath}/backup`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.writeFileSync(`${dir}/list.txt`, downloadList, "utf8");
    }

    return 'success'
  } else {
    return 'error'
  }
}

module.exports = { backup, typeholder, verifyPlaceholder };
