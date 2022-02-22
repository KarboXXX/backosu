const process = require("process");
const exePath = process.cwd();
const { backup, typeholder, verifyPlaceholder } = require("./js/backup.js");
const { choosePath, compare } = require('./js/compare.js');
const swal = require('sweetalert2')

var placeholder = { clickedtimes: 0 };

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

window.addEventListener('load', () => { // at page load, detect the User's OS to change placeholder 
  if (process.platform != "win32" && process.platform == "linux" || process.platform == "freebsd") {
    let placeholder = `/home/${require("os").userInfo().username}/.local/share/osu-wine/OSU`
    if (verifyPlaceholder(placeholder)) {
      document.getElementById("path").placeholder = `/home/${require("os").userInfo().username}/.local/share/osu-wine/OSU`;
    }



    if(process.getuid() == 0) {
      alert('\nYou are advised to not run with root privileges.\n');
    }
  }

  if (process.platform == "win32") {
    document.getElementById("path").placeholder = `C:\\Users\\${require('os').userInfo().username}\\AppData\\Local\\osu!`;
  }

  document.getElementById('backup').addEventListener('click', () => {
    if (backup() == 'error') {
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
      swal.fire({ icon: "success", title: "backup/list.txt has been created!", confirmButtonText: "Yay!" })
    }
  })

  document.getElementById('check').addEventListener('click', () => {
    choosePath();
  })

  document.getElementById('path').addEventListener('click', () => {
    if (placeholder.clickedtimes <= 0) { typeholder('path'); placeholder.clickedtimes+=1; }
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
