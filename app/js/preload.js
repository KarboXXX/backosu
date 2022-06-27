const process = require('process');
const os = require('os');
const path = require("path");
const fs = require("fs");
const fileDialog = require('file-dialog');
const swal = require('sweetalert2');

const { backup, typeholder, verifyPlaceholder } = require("./js/backup.js");
const { downloadBeatmaps } = require('./js/download.js');
const { compare } = require("./js/compare.js");

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
    
    let root = path.parse(__dirname).root;
    document.getElementById("file2-compare-span").innerHTML = root;
    document.getElementById("file1-compare-span").innerHTML = root;


    if (verifyPlaceholder(placeholder)) {
      document.getElementById("path").placeholder = `${os.homedir()}/.local/share/osu-wine/OSU`;
    }
    
    if(process.getuid() == 0) {
      alert('\nYou are advised to not run with root privileges.\n');
    }
  }

  if (process.platform == "win32") {
    document.getElementById("path").placeholder = `${os.homedir}\\AppData\\Local\\osu!`;
    let root = path.parse(__dirname).root;
    document.getElementById("file2-compare-span").innerHTML = root;
    document.getElementById("file1-compare-span").innerHTML = root;
  }

  document.getElementById('searchBackup').addEventListener('click', () => {
    fileDialog({multiple: false}).then(file => {
      if (fs.readFileSync(file[0].path)) {
        swal.fire({
          icon: "warning", 
          title: "File already exists", 
          text: "Would you want to overwrite it? Not overwriting will return the file folder (not deleting it)", 
          showCancelButton: true,
          confirmButtonText: "Yes.",
          cancelButtonText: "No."
        }).then((result) => {
          if (result.dismiss == "backdrop") return;
          if (result.isConfirmed) {
            document.getElementById('backupPath').value = file[0].path.toString();
          } else {
            let ff = path.resolve(file[0].path, '..')
            document.getElementById('backupPath').value = ff.toString();
            
          };
        });
      };
    });
  });

  document.getElementById('backup-button').addEventListener('click', () => {
    backupResult = backup(document.getElementById('backupPath').value);
    let go = true;

    if (backupResult == 'osu_path_error') {
      document.getElementById('path').style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
      document.getElementById('path').style.border = '1px solid red'
      setTimeout(() => { 
        document.getElementById('path').style.animation = '';
        document.getElementById('path').style.border = '';
      }, 821)
      go = false;
    }
    
    if (backupResult == 'backup_path_error') {
      let ff = os.homedir();

      if (fs.readdirSync(path.resolve(os.homedir(), './Downloads'))) {
        ff = path.resolve(os.homedir(), './Downloads');
      }
      
      document.getElementById('backupPath').value = ff;
      go = false;
    }
    
    if (go) return swal.fire({ icon: "success", title: "list.txt has been created!", confirmButtonText: "Yay!" })
  })

  document.getElementById('search-compare-1').addEventListener('click', () => {
    fileDialog({multiple: false, accept: "text/*"}).then(file => {
      document.getElementById("fileCompare1").value = file[0].path;
    });
  })

  document.getElementById('search-compare-2').addEventListener('click', () => {
    fileDialog({multiple: false, accept: "text/*"}).then(file => {
      document.getElementById("fileCompare2").value = file[0].path;
    });
  })

  document.getElementById('check-button').addEventListener('click', () => {
    let path1 = document.getElementById("file1").value;
    let path2 = document.getElementById("file2").value;
    let warning = document.getElementById("warning");

    if (path1 == "" || path2 == "") {
      warning.style.display = "block";
      warning.innerHTML = "You forgot a file path, please enter all required file paths.";

      return;
    }
    
    document.getElementById("warning").style.display = "none";
    compare(path1, path2);

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
