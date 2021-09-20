const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ytfps = require('ytfps');
const ffmpegPath = '/usr/bin/ffmpeg';

class DownloadMusic {   
    constructor(baseDirectory, maxDownloads) {
        this.MAX_SIMULTANEOUS_DOWNLOADS = maxDownloads;
        this.baseDirectory = baseDirectory;
        this.currentlyDownloading = 0;
    }

    logError(str)
    {
        console.log(str);
        fs.appendFileSync(this.baseDirectory+'error-log-file.txt', str, "UTF-8",{'flags': 'a'});
    }

    log(str)
    {
        console.log(str);
        fs.appendFileSync(this.baseDirectory+'log-file.txt', str, "UTF-8",{'flags': 'a'});
    }

    async getTitle(url)
    {
        let info = await ytdl.getInfo(url);
        return info.videoDetails.title;
    }
    
    download(url)
    {
        const $this = this;
        const stream = ytdl(url);
        let proc = new ffmpeg({source:stream});
        this.getTitle(url)
        .then(res => {
            $this.log(`Downloading ${res}...\n`);
            const validFilename = res.replace(/[/\\?%*:|"<>]/g, '');
            proc.setFfmpegPath(ffmpegPath);
            proc.withAudioCodec('libmp3lame')
                    .toFormat('mp3')
                    .output($this.baseDirectory + validFilename + '.mp3')
                    .on('error', function(err) {
                        $this.logError(`An error occurred: ${err.message}\n`);
                        $this.currentlyDownloading--;
                    })
                    .on('end', function() {
                        $this.log(`Processing finished! Downloaded ${res} from ${url}\n`);
                        $this.currentlyDownloading--;
                    })
                    .run()
        })
        .catch(err => {
            $this.logError(`\n${err}\n\n`);
            $this.logError(`Couldn't download audio from ${url}\n`);
            $this.currentlyDownloading--;
        });
    }
    
    async getPlaylistVideos(url)
    {
        const intermediateUrl = url.split('list=');
        const requestUrl = intermediateUrl[1].split('&')[0];
        const playlist = await ytfps(requestUrl);
        let videos = playlist.videos;
        return videos.map(video => video.url);
    }
    
    async downloadAllPlaylistVideos(playlistUrl)
    {
        let videosQueue = await this.getPlaylistVideos(playlistUrl);
        this.log(`\nStarting to download ${videosQueue.length} videos from playlist: ${playlistUrl}\n`);
        const updateDownloadsQueue = setInterval(() => {
            if(videosQueue.length === 0) clearInterval(updateDownloadsQueue);
            while(this.currentlyDownloading < this.MAX_SIMULTANEOUS_DOWNLOADS && videosQueue.length > 0)
            {
                this.currentlyDownloading++;
                this.download(videosQueue.shift());
            }
        }, 500);
    }
}

module.exports = { DownloadMusic }