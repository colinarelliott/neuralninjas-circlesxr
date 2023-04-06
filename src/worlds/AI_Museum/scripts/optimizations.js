

AFRAME.registerComponent("optimizer", {
    schema: {
        currentMuseum: { type: "string", default: "present", oneOf: ["past", "present", "future"] },
    },

    init: function () {
        const THIS = this;

        //bind the functions to THIS
        THIS.showFuture = THIS.showFuture.bind(THIS);
        THIS.showPresent = THIS.showPresent.bind(THIS);
        THIS.showPast = THIS.showPast.bind(THIS);
        THIS.hideFuture = THIS.hideFuture.bind(THIS);
        THIS.hidePresent = THIS.hidePresent.bind(THIS);
        THIS.hidePast = THIS.hidePast.bind(THIS);

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
            THIS.showPast();
            THIS.hidePresent();
            THIS.hideFuture();

            //if the player is in the present (x > -25 and x < 25) and the current museum is not the present museum so that these actions are not repeated
        } else if (THIS.playerPos.x > -25 && THIS.playerPos.x < 25 && THIS.currentMuseum !== 'present') {
            //set the current museum to present
            THIS.currentMuseum = 'present';
            THIS.showPresent();
            THIS.hidePast();
            THIS.hideFuture();
            
            //if the player is in the future (x > 25) and the current museum is not the future museum so that these actions are not repeated
        } else if (THIS.playerPos.x > 25 && THIS.currentMuseum !== 'future') {
            //set the current museum to future
            THIS.currentMuseum = 'future';
            THIS.showFuture();
            THIS.hidePast();
            THIS.hidePresent();
        }
    },

    hidePast: function () {
        const THIS = this;
        THIS.pastMuseum.setAttribute('visible', false);

        //iterate through the past museum props and set them to invisible
        if (THIS.pastMuseumProps) {
            for (let i = 0; i < THIS.pastMuseumProps.length; i++) {
                THIS.pastMuseumProps[i].setAttribute('visible', false);
            }
        }
    },

    showPast: function () {
        const THIS = this;
        THIS.pastMuseum.setAttribute('visible', true);

        //iterate through the past museum props and set them to visible
        if (THIS.pastMuseumProps) {
            for (let i = 0; i < THIS.pastMuseumProps.length; i++) {
                THIS.pastMuseumProps[i].setAttribute('visible', true);
            }
        }
    },

    hidePresent: function () {
        const THIS = this;
        THIS.presentMuseum.setAttribute('visible', false);

        //iterate through the present museum props and set them to invisible
        if (THIS.presentMuseumProps) {
            for (let i = 0; i < THIS.presentMuseumProps.length; i++) {
                THIS.presentMuseumProps[i].setAttribute('visible', false);
            }
        }
    },

    showPresent: function () {
        const THIS = this;
        THIS.presentMuseum.setAttribute('visible', true);

        //iterate through the present museum props and set them to visible
        if (THIS.presentMuseumProps) {
            for (let i = 0; i < THIS.presentMuseumProps.length; i++) {
                THIS.presentMuseumProps[i].setAttribute('visible', true);
            }
        }
    },

    hideFuture: function () {
        const THIS = this;
        THIS.futureMuseum.setAttribute('visible', false);

        if (THIS.futureMuseumProps) {
            for (let i = 0; i < THIS.futureMuseumProps.length; i++) {
                THIS.futureMuseumProps[i].setAttribute('visible', false);
            }
        }
    },

    showFuture: function () {
        const THIS = this;
        THIS.futureMuseum.setAttribute('visible', true);

        //iterate through the future museum props and set them to visible
        if (THIS.futureMuseumProps) {
            for (let i = 0; i < THIS.futureMuseumProps.length; i++) {
                THIS.futureMuseumProps[i].setAttribute('visible', true);
            }
        }
    }
});