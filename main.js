const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ytfps = require('ytfps');
 
const readline = require("readline");

async function getTitle(url)
{
    var info = await ytdl.getInfo(url);
    return info.videoDetails.title;
}

function download(url)
{
    const stream = ytdl(url)
    let proc = new ffmpeg({source:stream});
    console.log('Downloading...')

    getTitle(url)
    .then(res => {
        console.log(res);
        proc.setFfmpegPath('/usr/bin/ffmpeg');
        proc.withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .output(baseDirectory + res + '.mp3')
                .on('error', function(err) {
                    console.log('An error occurred: ' + err.message);
                })
                .on('end', function() {
                    console.log('Processing finished !');
                })
                .run()
    })
    .catch(err => console.log(err));
}

async function getPlaylistVideos(url)
{
    const intermediateUrl = url.split('list=');
    const requestUrl = intermediateUrl[1].split('&')[0];
    ytfps(requestUrl).then(playlist => {
        let videos = playlist.videos;
        videos = videos.map(video => video.url);
        console.log(videos);
        return videos
    }).catch(err => {
        throw err;
    });
}

const baseDirectory = './Downloads/';
const playlistUrl = 'https://www.youtube.com/playlist?list=FLMDnT9-ZItXB2gF--WbhhlA';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Deseja realizar a conversão de um vídeo ou de uma playlist?\n1: Vídeo\n2: Playlist\n\n", function (answer) {
    if(answer == 1) {
        console.log(`\nVocê escolheu vídeo. Qual o link do vídeo?\n`);
        rl.question("URL: ", function (answer) {
            download(answer);
            rl.close();
        });
    }
    else if(answer == 2)
        console.log(`Você escolheu playlist`);
    else
        console.log(`Entrada inválida`);
  });

// getPlaylistVideos('https://www.youtube.com/playlist?list=FLMDnT9-ZItXB2gF--WbhhlA');
// getPlaylistVideos('https://www.youtube.com/watch?v=PEbJ4qLiMu0&list=PL71B8152559FA2805&index=4&ab_channel=UKFDubstep');
// download('https://www.youtube.com/watch?v=3r26y--evIw&list=PL71B8152559FA2805&index=6&ab_channel=UKFDubstep');