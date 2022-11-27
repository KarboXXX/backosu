const process = require('process');
const os = require('os');
const path = require("path");
const fs = require("fs");
const fileDialog = require('file-dialog');
const swal = require('sweetalert2');

var tr = require('./js/translation.en.us.json');

const { backup, typeholder, verifyPlaceholder } = require("./js/backup.js");
const { downloadBeatmaps } = require('./js/download.js');
const { compare } = require("./js/compare.js");

var placeholder = { valid: false, clickedtimes: 0 };
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
  } catch (err) { console.error('fallback: oops, unable to copy', err); }
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
    let placeholderr = `${os.homedir()}/.local/share/osu-wine/OSU`;
    
    let root = path.parse(__dirname).root;
    document.getElementById("file2-compare-span").innerHTML = root;
    document.getElementById("file1-compare-span").innerHTML = root;


    if (verifyPlaceholder(placeholderr)) {
      document.getElementById("path").placeholder = placeholderr;
      placeholder.valid = true;
    }
    
    if(process.getuid() == 0) {
      alert('\n' + tr['preload-js']['getuid-alert'] + '\n');
    }
  }

  if (process.platform == "win32") {
    if (verifyPlaceholder(placeholderr)) {
      document.getElementById("path").placeholder = `${os.homedir}\\AppData\\Local\\osu!`;
      placeholder.valid = true;
    } else { 
      placeholder.valid = false;
    }
    let root = path.parse(__dirname).root;
    document.getElementById("file2-compare-span").innerHTML = root;
    document.getElementById("file1-compare-span").innerHTML = root;
  }

  document.getElementById('searchBackup').addEventListener('click', () => {
    fileDialog({multiple: false}).then(file => {
      if (fs.readFileSync(file[0].path)) {
        swal.fire({
          icon: "warning", 
          title: tr['preload-js']['swal-fire-title'], 
          text: tr['preload-js']['swal-fire-text'], 
          showCancelButton: true,
          confirmButtonText: tr['preload-js']['swal-fire-confirmButtonText'],
          cancelButtonText: tr['preload-js']['swal-fire-cancelButtonText']
        }).then((result) => {
          if (result.dismiss == "backdrop") return;
          if (result.isConfirmed) {
            document.getElementById('backupPath').value = file[0].path.toString();
          } else {
            let ff = path.resolve(file[0].path, '..')
            document.getElementById('backupPath').value = ff.toString();
            
          }
        })
      }
    })
  })

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
    }
    
    if (go) return swal.fire({
      icon: "success", 
      title: tr['preload-js']['go-swal-fire-title'], 
      confirmButtonText: tr['preload-js']['go-swal-fire-confirmButtonText'] 
    })
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
    let path1 = document.getElementById("fileCompare1").value;
    let path2 = document.getElementById("fileCompare2").value;
    let warning = document.getElementById("warning");

    if (path1 == "" || path2 == "") {
      warning.style.display = "block";
      warning.innerHTML = tr['preload-js']['warning-check-button'];

      return;
    }
    
    document.getElementById("warning").style.display = "none";
    compare(path1, path2, tr);

  })

  document.getElementById('path').addEventListener('click', () => {
    if (placeholder.clickedtimes <= 0) { typeholder('path'); placeholder.clickedtimes+=1; }
  })

  document.getElementById('download-button').addEventListener('click', () => {
    downloadBeatmaps(tr);
  })

  document.getElementById('lang-us').addEventListener('click', () => {
    tr = require('./js/translation.en.us.json');
    langLoader(tr);
  })

  document.getElementById('lang-br').addEventListener('click', () => {
    tr = require('./js/translation.pt-br.json');
    langLoader(tr);
  })

  document.getElementById('github').addEventListener('click', () => {
    swal.fire({
      icon: "info", 
      title: tr['preload-js']['github-title'], 
      text: tr['preload-js']['github-text'], 
      showCancelButton: true,
      confirmButtonText: tr['preload-js']['github-confirmButtonText'],
      cancelButtonText: tr['preload-js']['github-cancelButtonText']
    }).then((result) => {
      if (result.dismiss == "backdrop") return;
      if (result.isDismissed && result.dismiss == "cancel") {
        swal.fire(
          tr['preload-js']['github-then-title'],
          tr['preload-js']['github-then-text'],
          'success'
        ); copyTextToClipboard("https://github.com/KarboXXX")
      } else {
        if (result.isConfirmed) {
          require('electron').shell.openExternal("https://github.com/KarboXXX")
        }
      }
    })
  })
})

// language selector omg!1!!11 :3
function langLoader(tr) {
  document.getElementsByClassName("h1")[0].innerHTML = tr["index-html"]["header-h1"];
  document.getElementsByClassName("h4")[0].innerHTML = tr["index-html"]["h4-0"];
  document.getElementsByClassName("h4")[1].innerHTML = tr["index-html"]["h4-1"];
  document.getElementById("h5-card").innerHTML = tr["index-html"]["h5-card"];
  document.getElementById("backup-button").innerHTML = tr["index-html"]["backup-button"];
  document.getElementById("searchBackup").innerHTML = tr["index-html"]["searchBackup"];
  document.getElementById("compareButton").innerHTML = tr["index-html"]["compareButton"];
  document.getElementById("check-button").innerHTML = tr["index-html"]["check-button"];
  document.getElementById("download-button").innerHTML = tr["index-html"]["download-button"];
  
  document.getElementById("search-compare-1").innerHTML = tr["index-html"]["search-compare"];
  document.getElementById("search-compare-2").innerHTML = tr["index-html"]["search-compare"];
  
  if (!placeholder.valid) document.getElementById("path").placeholder = tr["index-html"]["placeholder-path"];

  document.getElementById("fileCompare1").placeholder = tr["index-html"]["fileCompare-placeholder"];
  document.getElementById("fileCompare2").placeholder = tr["index-html"]["fileCompare-placeholder"];
  document.getElementById("backupPath").placeholder = tr["index-html"]["backupPath-placeholder"];

}