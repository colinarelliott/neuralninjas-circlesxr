//This component will act as a layer between the circles networking and our custom scripts

AFRAME.registerComponent('network-manager', {
    schema: {
    },

    init: function () {
        const THIS = this;
        THIS.socket = null;
        THIS.socket = CIRCLES.getCirclesWebsocket(); //Register the socket to the context of this component

        //listen for the connection to the socket
        THIS.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            console.log("Connected to the circles socket successfully");
            console.log(data);
        });
    },

    tick: function () {
        const THIS = this;
    },
});