const url = require('url')
const fs = require('fs');
const fileDialog = require('file-dialog');
const path = require('path');
const Q = require('q'); // you forgot to put a ; in this line
const os = require('os');

var link = "", filename = ""
var urlExpression = /[\w@:%.+~#=]{1,256}\.[\w0-9()]{1,6}\b([\w()@:%+.~#?&\/=]*)?/g
// var nameExpression = /[^ 0-9][^0-9!{}?`'@:%._\+~#=][ 0-9\w\-\_(){][^0-9:,/\n.'`´~^;{}@:%._\+~#=]+[^0-9https:/\^\w.@:%._\+~#=]/g
var nameExpression = /[^0-9:?!\n][, (){}\[\]\w@']+[^https:\/\\0-9a-z.][^0-9][^:]+/g

function download(uri, filename) {
    var protocol = url.parse(uri).protocol.slice(0, -1);
    var deferred = Q.defer();
    var onError = function (e) { fs.unlink(filename); deferred.reject(e); }

    require(protocol).get(uri, function(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
            var fileStream = fs.createWriteStream(filename);
            fileStream.on('close', deferred.resolve);
            fileStream.on('error', onError);
            response.pipe(fileStream);
        } else if (response.headers.location) {
            deferred.resolve(download(response.headers.location, filename));
        } else {
            deferred.reject(new Error(response.statusCode + ' ' + response.statusMessage));
        }
    }).on('error', onError);
};

function downloadBeatmaps(tr = require('./app/js/translation.en.us.json')) {
    var dir = "", folder = ""
    fileDialog({multiple: false, accept: "text/*"}).then((files) => {
        let list = files[0].path;
        let name = fs.readFileSync(list).toString().split(/[\n]/g);

        name.forEach((v, i, a) => {
            let u = v.match(urlExpression)
            let n = v.match(nameExpression)
            if (v == undefined || v == null || v == 'null') return;
            if (u == null || n == null) return;

            link = "http://" + u[0];
            filename = n[0].replace(/[<>:"\/\|?*]/g, '-');
            if (filename.endsWith(' ') || filename.endsWith('-')) filename = filename.slice(0, -1);
            if (filename.startsWith(' ') || filename.startsWith('-')) filename = filename.slice(1);

            dir = path.resolve(os.homedir(), './Downloads', './downloadedMaps');
            if (!fs.existsSync(path.resolve(os.homedir(), './Downloads'))) { dir = path.resolve(os.homedir(), './downloadedMaps') }
            if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
            folder = dir;
            dir = path.resolve(dir, filename + ".osz")
            folder = folder.toString().replace(/[,]/g, '')

            download(link, dir);
        })
        swal.fire({icon: "success", title: tr["download-js"]["swal-fire-title"], text: tr["download-js"]["swal-fire-text"] + folder.toString().replace(/[,]/g, '')});
    })
}

module.exports = { downloadBeatmaps }
