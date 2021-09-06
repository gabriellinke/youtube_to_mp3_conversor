const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ytfps = require('ytfps');
const readline = require("readline");
 
const MAX_SIMULTANEOUS_DOWNLOADS = 4;
let baseDirectory = '../../Gabriel/Músicas/';

let videosQueue = [];
let currentlyDownloading = 0;

async function getTitle(url)
{
    let info = await ytdl.getInfo(url);
    return info.videoDetails.title;
}

function download(url)
{
    const stream = ytdl(url)
    let proc = new ffmpeg({source:stream});
    getTitle(url)
    .then(res => {
        log(`Downloading ${res}...\n`);
        const validFilename = res.replace(/[/\\?%*:|"<>]/g, '');
        proc.setFfmpegPath('/usr/bin/ffmpeg');
        proc.withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .output(baseDirectory + validFilename + '.mp3')
                .on('error', function(err) {
                    log(`An error occurred: ${err.message}\n`);
                    currentlyDownloading--;
                })
                .on('end', function() {
                    log(`Processing finished! Downloaded ${res} from ${url}\n`);
                    currentlyDownloading--;
                })
                .run()
    })
    .catch(err => {
        log(`\n${err}\n\n`);
        log(`Couldn't download audio from ${url}\n`);
        currentlyDownloading--;
    });
}

async function getPlaylistVideos(url)
{
    const intermediateUrl = url.split('list=');
    const requestUrl = intermediateUrl[1].split('&')[0];
    const playlist = await ytfps(requestUrl);
    let videos = playlist.videos;
    return videos.map(video => video.url);
}

async function downloadAllPlaylistVideos(playlistUrl)
{
    videosQueue = await getPlaylistVideos(playlistUrl);
    log(`\nStarting to download ${videosQueue.length} videos from playlist: ${playlistUrl}\n`);
    let updateDownloadsQueue = setInterval(function() {
        if(videosQueue.length === 0) clearInterval(updateDownloadsQueue);
        while(currentlyDownloading < MAX_SIMULTANEOUS_DOWNLOADS && videosQueue.length > 0)
        {
            currentlyDownloading++;
            download(videosQueue.shift());
        }
    }, 500);
}

function log(str)
{
    console.log(str);
    fs.appendFileSync(baseDirectory+'log-file.txt', str, "UTF-8",{'flags': 'a'});
}

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
    rl.question("Deseja realizar a conversão de um vídeo ou de uma playlist?\n1: Vídeo\n2: Playlist\n\n", function (answer) {
        if(answer == 1) {
            console.log(`\nVocê escolheu vídeo. Qual o link do vídeo?\n`);
            rl.question("URL: ", function (answer) {
                download(answer);
                rl.close();
            });
        }
        else if(answer == 2) {
            console.log(`Você escolheu playlist. Qual o link da playlist?\n`);
            rl.question("URL: ", function (answer) {
                downloadAllPlaylistVideos(answer);
                rl.close();
            });
        }
        else {
            console.log(`Entrada inválida`);
            rl.close();
        }
    });
})
