require('dotenv').config();
const Discord = require("discord.js")
const client = new Discord.Client();
const cron = require("node-cron");
const YouTube = require('youtube-live-chat');

var tokenarr = ['YOUTUBE_TOKEN1','YOUTUBE_TOKEN2']
ArrayRoops(tokenarr, 120000, function(key, value){
  const yt = new YouTube('YOUTUBE_CHANNEL_ID', value);
  yt.on('ready', () => {
  yt.listen(3000)
  })

  yt.on('message', data => {
  console.log("AUT:   " + data.authorDetails.displayName + "MSG:  " + data.snippet.displayMessage)
  })

  yt.on('error', error => {
  console.error(error)
  })
});

function ArrayRoops(array, time, fun){
    this.length = array.length;
    this.counts = 0;
    this.Timer = setInterval(() => {
        this.key = this.counts;
        this.value = array[this.key];
        fun(this.key, this.value);
        this.counts ++;
        if(this.length <= this.counts){
            this.counts = 0;
            clearInterval(this.Timer);
        }
    }, time);
}

client.login(process.env.DISCORD_TOKEN);
