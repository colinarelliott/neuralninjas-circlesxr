// Description: This script is used to play music in the museums in sequence like a "playlist"

AFRAME.registerComponent("music-player", {
    schema: {
        music: { type: "string", default: "presentMuseumMusic", oneOf: ["pastMuseumMusic", "presentMuseumMusic", "futureMuseumMusic"] },
        numero: { type: "number", default: 0 },
        currentMuseum: { type: "string", default: "present", oneOf: ["past", "present", "future"] },
    },

    init: function () {
        const THIS = this;

        //bind the functions to THIS
        THIS.changeSong = THIS.changeSong.bind(THIS);
        THIS.nowPlaying = THIS.nowPlaying.bind(THIS);
        
        //get the player
        THIS.player = document.querySelector("#Player1");

        //add a listener for when the song ends
        THIS.el.addEventListener("sound-ended", function (data) {
            console.log(data.detail);
            //if the song that ended was the one that this entity was playing
            if (data.id === THIS.music+THIS.numero) {

                //increment the song number
                if (THIS.music === 'pastMuseumMusic') { 
                    if (THIS.numero < 3) { THIS.numero++; } else { THIS.numero = 1; } //past playlist is 1-3
                }

                if (THIS.music === 'presentMuseumMusic') {
                    if (THIS.numero < 6) { THIS.numero++; } else { THIS.numero = 4; } //present playlist is 4-6
                }

                if (THIS.music === 'futureMuseumMusic') {
                    if (THIS.numero < 9) { THIS.numero++; } else { THIS.numero = 7; } //future playlist is 7-9
                }
                
                //change the song
                THIS.changeSong();
                THIS.nowPlaying(THIS.numero);
            }
        });

        THIS.changeSong();
        THIS.nowPlaying(THIS.numero);
    },

    changeSong: function () {
        const THIS = this;

        //get the player's position
        THIS.playerPos = THIS.player.getAttribute("position");

        //if the player is in the past (x < -25) and the current museum is not the past museum so that these actions are not repeated
        if (THIS.playerPos.x < -25 && THIS.currentMuseum !== 'past') {
            //set the music to pastMuseumMusic
            THIS.music = 'pastMuseumMusic';
            //set the song number to 1
            THIS.numero = 1;
            //set the src of the sound to the next song in the playlist (the past museum's song)
            THIS.el.setAttribute("circles-sound", "src:", "#pastMuseumMusic" + THIS.numero);

        } else if (THIS.playerPos.x > -25 && THIS.playerPos.x < 25 && THIS.currentMuseum !== 'present') {
            THIS.music = 'presentMuseumMusic';
            THIS.numero = 4;
            THIS.el.setAttribute("circles-sound", "src:", "#presentMuseumMusic" + THIS.numero);

        } else if (THIS.playerPos.x > 25 && THIS.currentMuseum !== 'future') {
            THIS.music = 'futureMuseumMusic';
            THIS.numero = 7;
            THIS.el.setAttribute("circles-sound", "src:", "#futureMuseumMusic" + THIS.numero);
        }
    },



    nowPlaying: function (id) {
        const songs = ["Antique Waves by Rand Aldo", "My Old Trawler by Lotus", "Partially Implied by Rand Aldo", "After Rainfall by 369", "Every Day Has a Keystone by 369", "Forest Canopy by 369", "Atoms by DEX 1200", "Frankel by Syntropy", "Peacewalker by ELFL"];
        console.log("Now playing: " + songs[id-1]);
        console.log("Music is from Epidemic Sound, licensed by Colin Elliott");

        //       SONG IDS

        // pastMuseumMusic1: 1
        // pastMuseumMusic2: 2
        // pastMuseumMusic3: 3
        // presentMuseumMusic1: 4
        // presentMuseumMusic2: 5
        // presentMuseumMusic3: 6
        // futureMuseumMusic1: 7
        // futureMuseumMusic2: 8
        // futureMuseumMusic3: 9
    },

});