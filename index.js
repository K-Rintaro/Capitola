require('dotenv').config();
const Discord = require("discord.js")
const client = new Discord.Client();
const fetch = require("node-fetch")
const cron = require('node-cron');
const Keyv = require("keyv")
const lasttime = new Keyv("db.sqlite", {table: 'lasttime'})
lasttime.on('error', err => console.log('Keyv connection error:' + err))

const liveid = "YouTube_Live_id"
const url = 'https://www.googleapis.com/youtube/v3/videos'+
    '?part=liveStreamingDetails'+
    `&id=${liveid}`+
    `&key=${process.env.YOUTUBE_TOKEN}`
    
cron.schedule('*/20 * * * * *', async () => {
   const reponse = await fetch(url);
   const json = await reponse.json()
   let msgid = json.items[0].liveStreamingDetails.activeLiveChatId

   if(typeof msgid == "undefined"){
       console.log("YouTube API request maybe reached the daily limit or the live id is not right.\nYouTube APIリクエストが一日の限度量に達したか、設定いただいたLIVE IDが間違っている場合があります。")
   }else{
    let url2 = 'https://www.googleapis.com/youtube/v3/liveChat/messages'+
    `?liveChatId=${msgid}`+
    '&part=id,snippet,authorDetails'+
    '&maxResults=2000'+
    `&key=${process.env.YOUTUBE_TOKEN}`

    const reponse2 = await fetch(url2);
    const json2 = await reponse2.json()
    const limit = Object.keys(json2['items']).length - 1
    console.log(limit)
    let lastmsgtime = await lasttime.get('data')
    if (typeof lastmsgtime == undefined){
        lastmsgtime = new Date(json2.items[0].snippet.publishedAt)
    }
    console.log("last time is:" + lastmsgtime)
    for (let i = 0; i < limit; i++){
        let nowmsgtime = new Date(json2.items[i].snippet.publishedAt)
        console.log(nowmsgtime)
        await lasttime.set('data', new Date(json2.item[limit].snippet.publishedAt))
        if(nowmsgtime > lastmsgtime){
            let chatmsg = json2.items[i].snippet.displayMessage
        }else{
            return
        }
    }
   }
})
client.login(process.env.DISCORD_TOKEN);
