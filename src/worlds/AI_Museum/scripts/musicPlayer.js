// Description: This script is used to play music in the museums in sequence like a "playlist"

AFRAME.registerComponent("music-player", {
    schema: {
        music: { type: "string", default: "", oneOf: ["pastMuseumMusic", "presentMuseumMusic", "futureMuseumMusic"] },
        numero: { type: "number", default: 0 },
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
            //if the song that ended was the one that this entity was playing
            if (data.detail.name === "sound") {

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
        if (THIS.playerPos.x < -25 && THIS.music !== 'pastMuseumMusic') {
            THIS.nowPlaying(THIS.numero);
            //set the music to pastMuseumMusic
            THIS.music = 'pastMuseumMusic';
            //set the song number to 1
            THIS.numero = 1;
            //set the src of the sound to the next song in the playlist (the past museum's song)
            THIS.el.setAttribute("sound", "src: #pastMuseumMusic" + THIS.numero);

        } else if (THIS.playerPos.x > -25 && THIS.playerPos.x < 25 && THIS.music !== 'presentMuseumMusic') {
            THIS.nowPlaying(THIS.numero);
            THIS.music = 'presentMuseumMusic';
            THIS.numero = 4;
            THIS.el.setAttribute("sound", "src: #presentMuseumMusic" + THIS.numero);

        } else if (THIS.playerPos.x > 25 && THIS.music !== 'futureMuseumMusic') {
            THIS.nowPlaying(THIS.numero);
            THIS.music = 'futureMuseumMusic';
            THIS.numero = 7;
            THIS.el.setAttribute("sound", "src: #futureMuseumMusic" + THIS.numero);
        }

        //remove the sound component so that the sound can be played again
        THIS.el.removeAttribute("sound");
        //add the sound component back
        THIS.el.setAttribute("sound", "src: #"+THIS.music+THIS.numero+"; autoplay: true; loop: false; volume: 0.02;");
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