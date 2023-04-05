

AFRAME.registerComponent("optimizer", {
    schema: {
        currentMuseum: { type: "string", default: "present", oneOf: ["past", "present", "future"] },
    },

    init: function () {
        const THIS = this;

        THIS.player = document.querySelector("#Player1");
        THIS.pastMuseum = document.querySelector("#museumPast");
        THIS.presentMuseum = document.querySelector("#museumPresent");
        THIS.futureMuseum = document.querySelector("#museumFuture");
        THIS.pastMuseumProps = document.querySelectorAll(".pastProp");
        THIS.presentMuseumProps = document.querySelectorAll(".presentProp");
        THIS.futureMuseumProps = document.querySelectorAll(".futureProp");

        //get the player's position
        THIS.playerPos = THIS.player.getAttribute('position');

        //Throttle the tick function to run every 100ms
        THIS.tick = AFRAME.utils.throttleTick(THIS.tick, 100, THIS); 
    },

    tick: function () {
        const THIS = this;

        //if the player is in the past (x < -25) and the current museum is not the past museum so that these actions are not repeated
        if (THIS.playerPos.x < -25 && THIS.currentMuseum !== 'past') {
            //set the current museum to past
            THIS.currentMuseum = 'past';
            //set the past museum to visible and the present and future museums to invisible
            THIS.pastMuseum.setAttribute('visible', true);
            THIS.presentMuseum.setAttribute('visible', false);
            THIS.futureMuseum.setAttribute('visible', false);

            //iterate through the past museum props and set them to visible
            if (THIS.pastMuseumProps) {
                for (let i = 0; i < THIS.pastMuseumProps.length; i++) {
                    THIS.pastMuseumProps[i].setAttribute('visible', true);
                }
            }
            //iterate through the present museum props and set them to invisible
            if (THIS.presentMuseumProps) {
                for (let i = 0; i < THIS.presentMuseumProps.length; i++) {
                    THIS.presentMuseumProps[i].setAttribute('visible', false);
                }
            }
            //iterate through the future museum props and set them to invisible
            if (THIS.futureMuseumProps) {
                for (let i = 0; i < THIS.futureMuseumProps.length; i++) {
                    THIS.futureMuseumProps[i].setAttribute('visible', false);
                }
            }
            //if the player is in the present (x > -25 and x < 25) and the current museum is not the present museum so that these actions are not repeated
        } else if (THIS.playerPos.x > -25 && THIS.playerPos.x < 25 && THIS.currentMuseum !== 'present') {
            //set the current museum to present
            THIS.currentMuseum = 'present';
            //set the past museum to invisible and the present and future museums to visible
            THIS.pastMuseum.setAttribute('visible', false);
            THIS.presentMuseum.setAttribute('visible', true);
            THIS.futureMuseum.setAttribute('visible', false);
            //iterate through the past museum props and set them to invisible
            if (THIS.pastMuseumProps) {
                for (let i = 0; i < THIS.pastMuseumProps.length; i++) {
                    THIS.pastMuseumProps[i].setAttribute('visible', false);
                }
            }
            //iterate through the present museum props and set them to visible
            if (THIS.presentMuseumProps) {
                for (let i = 0; i < THIS.presentMuseumProps.length; i++) {
                    THIS.presentMuseumProps[i].setAttribute('visible', true);
                }
            }
            //iterate through the future museum props and set them to invisible
            if (THIS.futureMuseumProps) {
                for (let i = 0; i < THIS.futureMuseumProps.length; i++) {
                    THIS.futureMuseumProps[i].setAttribute('visible', false);
                }
            }
            //if the player is in the future (x > 25) and the current museum is not the future museum so that these actions are not repeated
        } else if (THIS.playerPos.x > 25 && THIS.currentMuseum !== 'future') {
            //set the current museum to future
            THIS.currentMuseum = 'future';
            //set the past museum to invisible and the present and future museums to visible
            THIS.pastMuseum.setAttribute('visible', false);
            THIS.presentMuseum.setAttribute('visible', false);
            THIS.futureMuseum.setAttribute('visible', true);
            //iterate through the past museum props and set them to invisible
            if (THIS.pastMuseumProps) {
                for (let i = 0; i < THIS.pastMuseumProps.length; i++) {
                    THIS.pastMuseumProps[i].setAttribute('visible', false);
                }
            }
            //iterate through the present museum props and set them to invisible
            if (THIS.presentMuseumProps) {
                for (let i = 0; i < THIS.presentMuseumProps.length; i++) {
                    THIS.presentMuseumProps[i].setAttribute('visible', false);
                }
            }
            //iterate through the future museum props and set them to visible
            if (THIS.futureMuseumProps) {
                for (let i = 0; i < THIS.futureMuseumProps.length; i++) {
                    THIS.futureMuseumProps[i].setAttribute('visible', true);
                }
            }
        }
    },

});