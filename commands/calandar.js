const axios = require('axios');
const discord = require('../discord.js');
const distance = require("jaro-winkler");
//uses jaro-winkler to find the word that is closest to what the user typed
function find_event(args){
    possibleEvents = ["Bank","Interest","Halloween","spookyFestival", "jerryWorkshop", "winter", "SeasonOfJerry", "newyear", "zoo", "darkauction"]
    args = String(args)    
    let k = 0;
    //in there so that it does not return an error if some one does not provide an argument
    let event = "zoo";
    for (i of possibleEvents){
        if (distance(i, args) > k){
            k = distance(i, args);
            event = i;
            
        }

    } 
    //not as efficient as it can be 
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
    description: "Gives the remaining time until the the next event arrives.",
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