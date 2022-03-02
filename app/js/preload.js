const process = require("process");
const { backup, typeholder, verifyPlaceholder } = require("./js/backup.js");
const { choosePath } = require('./js/compare.js');
const { downloadBeatmaps } = require('./js/download.js');
const swal = require('sweetalert2');
const path = require("path");
const os = require('os');

let bar = path.sep
var placeholder = { clickedtimes: 0 };
let backupResult;

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('fallback: copying text command was ' + msg);
  } catch (err) { console.error('fallback: oops, unable to copy', err); };
  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) { fallbackCopyTextToClipboard(text); return; }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) { console.error('Async: Could not copy text: ', err); });
}

// C:\Users\<Username>\AppData\Local\osu!
// /home/<Username>/.local/share/osu-wine/OSU
// process.platform === "win32"
// require("os").userInfo().username

window.addEventListener('load', () => {
  if (process.platform != "win32" && process.platform == "linux" || process.platform == "freebsd") {
    let placeholder = `/home/${os.userInfo().username}/.local/share/osu-wine/OSU`;
    if (verifyPlaceholder(placeholder)) {
      document.getElementById("path").placeholder = `${os.homedir()}/.local/share/osu-wine/OSU`;
    }
    if(process.getuid() == 0) {
      alert('\nYou are advised to not run with root privileges.\n');
    }
  }

  if (process.platform == "win32") {
    document.getElementById("path").placeholder = `${os.homedir}\\AppData\\Local\\osu!`;
  }

  document.getElementById('backup-button').addEventListener('click', () => {
    backupResult = backup();
    if (backupResult == 'error') {
      document.getElementById('path').style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
      document.getElementById('path').style.border = '1px solid red'
      setTimeout(() => {
        swal.fire({ icon: "error", title: "Something went wrong.", confirmButtonText: ":/"});
      }, 1000)
      setTimeout(() => { 
        document.getElementById('path').style.animation = '';
        document.getElementById('path').style.border = '';
      }, 821)
    } else {
      swal.fire({ icon: "success", title: backupResult + bar + "list.txt has been created!", confirmButtonText: "Yay!" })
    }
  })

  document.getElementById('check-button').addEventListener('click', () => {
    choosePath();
  })

  document.getElementById('path').addEventListener('click', () => {
    if (placeholder.clickedtimes <= 0) { typeholder('path'); placeholder.clickedtimes+=1; }
  })

  document.getElementById('download-button').addEventListener('click', () => {
    downloadBeatmaps()
  })

  document.getElementById('github').addEventListener('click', () => {
    swal.fire({
      icon: "info", 
      title: "KarboXXX's github page", 
      text: "Do you want to copy the URL, or open it on your browser?", 
      showCancelButton: true,
      confirmButtonText: "Open",
      cancelButtonText: "Copy"
    }).then((result) => {
      if (result.dismiss == "backdrop") return;
      if (result.isDismissed && result.dismiss == "cancel") {
        swal.fire(
          'Copied',
          'URL copied to clipboard.',
          'success'
        ); copyTextToClipboard("https://github.com/KarboXXX")
      } else {
        if (result.isConfirmed) {
          require('electron').shell.openExternal("https://github.com/KarboXXX")
        }
      }
    });
  })

})
