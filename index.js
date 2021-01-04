require('dotenv').config();
const Discord = require("discord.js")
const client = new Discord.Client();
const YouTube = require('youtube-live-chat');
const googleTTS = require('google-tts-api');


client.on("message", async message => {
  if (message.content === 'bot.join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('Please join the voice channel first.');
    }
  }

  if (message.content === 'bot.leave') {
    message.member.voice.channel.leave();
    message.channel.send(`Left from ${message.member.voice.channel.name}`)  
  }
});

const yt = new YouTube("YOUTUBE_STREAMER_ID" , process.env.YOUTUBE_TOKEN);
  yt.on('ready', () => {
  yt.listen(1000)
  })

  yt.on('message', data => {
  let superchatmsg;
  if (data.snippet.displayMessage.includes("from")){
    if(data.snippet.displayMessage.includes(":")){
      if(data.snippet.displayMessage.includes(data.authorDetails.displayName)){
        superchatmsg = data.snippet.displayMessage.split(': "')[1]
        console.log(superchatmsg)
        client.channels.cache.get('DISCORD_CHANNEL_ID').send("スーパーチャットを受信しました")
        const url = googleTTS.getAudioUrl(data.authorDetails.displayName + "さんからのスーパーチャット "+ superchatmsg, {
          lang: 'ja-JP',
          slow: false,
          host: 'https://translate.google.com',
        });
        console.log(url);
        if (superchatmsg.length > 200){
          return
        }
        client.on('message', async message => {
          if (message.content.includes("スーパーチャットを受信しました")) {
            if (message.member.voice.channel) {
              const connection = await message.member.voice.channel.join();
              connection.play(url)
            }
          }
        });
      }
    }
  }
  client.channels.cache.get('DISCORD_CHANNEL_ID').send(
    {embed: {
      author: {
        name: data.authorDetails.displayName, 
        icon_url: data.authorDetails.profileImageUrl,
      },
      description: data.snippet.displayMessage,
      timestamp: data.snippet.publishedAt
    }}
  )
  })
  
  yt.on('error', error => {
  console.error(error)
  })

client.login(process.env.DISCORD_TOKEN);
