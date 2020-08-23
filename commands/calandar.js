const axios = require('axios');
const discord = require('../discord.js');
const distance = require("jaro-winkler");
//uses jaro-winkler to find the word that is closest to what the user typed
function find_event(args){
    possibleEvents = ["Bank","Interest","Halloween","spookyFestival", "jerryWorkshop", "winter", "SeasonOfJerry", "newyear", "zoo", "darkauction"]
    let k = 0;
    let event = "";
    for (i of possibleEvents){
        if (distance(String(i), String(args)) > k){
            k = distance(String(i), String(args));
            event = i;
            
        }

    } 
    //Uhhhh there is 1000000% a better way to do this but right now I fucking hate this bitch ass script so this will do 
    if (event == "Bank" || event == "Interest" ){
        return "bank/interest";
    }
    else if(event == "Halloween"){

        return "spookyFestival";
    }
    else if(event == "SeasonOfJerry"){
        return "winter";
    }
    else{
        return event;
    }
}



module.exports = {
    aliases: ["c", "calendar"],
    description: "calendar still testing",
    run: async (client, msg, args) => {
        event = find_event(args);
        //using axio and InventiveTalent's API to give me the time might cache it later idk
        axios.get('https://hypixel-api.inventivetalent.org/api/skyblock/' + event + "/estimate")
        .then(function (response){
            msg.channel.createMessage(discord.embed(msg, event + " event will be at: " + response.data.estimateRelative));
        })
        
        
    },
    usage: "<event>"
}