<h1>YouTube to mp3 converter</h1>


## :bookmark: About
If you want to get a mp3 file from a YouTube video, this is the program that you need! This program can convert a single YouTube video into a mp3 file, or it can download a whole playlist to you, and you only have to give it the YouTube link!

## :gear: Requirements
  - It is **required** to have **[Node.js](https://nodejs.org/en/)** installed on your computer 
  - Also, you **must** have a package manager either **[NPM](https://www.npmjs.com/)** or **[Yarn](https://yarnpkg.com/)**
  - You **must** have **[FFmpeg](https://ffmpeg.org/)** installed on your computer

## :construction_worker: Setup
  Before you start to use the YouTube to mp3 converter, you have to setup some variables at the code. First, at the DownloadMusic.js file, you'll have to set the variable ffmpegPath to have the path to the FFmpeg installation at your computer. At Linux, you can check where it's installed using the command `whereis ffmpeg`. Then, you'll need to set a base directory to where the downloaded mp3 files will be placed. To do it, at the main.js file, you'll have to set the baseDirectory variable to have the path to the base directory. This path need to be relative to where the code is placed.

## :computer: Usage
  Now that everything is setted up, you can start to convert your videos!
  
```sh
  $ cd youtube_to_mp3_converter
  # Installing dependencies
  $ yarn # or npm install
  
  # Starting application
  $ node main.js
````
Once you are running the program, it will ask you what's the destination folder for the mp3 files. If you want to save it at the base directory just press Enter, if you want to save it in another directory, type it's name at the terminal and then press Enter.

The next step is to choose if you want to convert a single video or to download a full playlist. To choose video type 1 and to choose playlist type 2.

At the last step, you'll have to paste the video or playlist URL and press Enter. Once the Enter is pressed, the download will begin. While the files are being downloaded, you can follow the process through the terminal. When the download is finished, you can also check the log files, at the log-file.txt file you will be able to see which videos were downloaded and at the error-log-file.txt file you'll be able to see if any error ocurred while downloading and which video originated the error.

## :memo: License

This project is under MIT License. See the [LICENSE](LICENSE) file for more details.

