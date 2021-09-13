const fs = require('fs');
const readline = require("readline");
const { DownloadMusic } = require('./DownloadMusic');
let baseDirectory = '../../Gabriel/Músicas/';
let maxDownloads = 4;
let Backend;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

rl.question("Qual a pasta de destino dos arquivos?\n", function (answer) {
    if(answer != '')
    {
        baseDirectory = baseDirectory + answer + '/';
        if (!fs.existsSync(baseDirectory)) fs.mkdirSync(baseDirectory, { recursive: true });
    }
    Backend = new DownloadMusic(baseDirectory, maxDownloads);
    
    rl.question("Deseja realizar a conversão de um vídeo ou de uma playlist?\n1: Vídeo\n2: Playlist\n\n", function (answer) {
        if(answer == 1) {
            console.log(`\nVocê escolheu vídeo. Qual o link do vídeo?\n`);
            rl.question("URL: ", function (answer) {
                Backend.download(answer);
                rl.close();
            });
        }
        else if(answer == 2) {
            console.log(`Você escolheu playlist. Qual o link da playlist?\n`);
            rl.question("URL: ", function (answer) {
                Backend.downloadAllPlaylistVideos(answer);
                rl.close();
            });
        }
        else {
            console.log(`Entrada inválida`);
            rl.close();
        }
    });
})
