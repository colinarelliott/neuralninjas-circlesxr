AFRAME.registerComponent('time-travel', {
    schema: {
        connected: { type: 'boolean', default: false }, //this is a flag to indicate if we are connected to the messaging system
        synchEventName: { type: 'string', default: 'timeTravel_event' }, //this is the name of the event we will use to sync the time travel buttons if necessary
        teleportAllowed: { type: 'boolean', default: true }, //this is a flag to indicate if we are connected to the messaging system
        pastCapsuleAnimation: { type: 'boolean', default: false }, //this is the name of the event we will use to sync the time travel buttons if necessary
        presentCapsuleAnimation: { type: 'boolean', default: false }, //this is the name of the event we will use to sync the time travel buttons if necessary
        futureCapsuleAnimation: { type: 'boolean', default: false }, //this is the name of the event we will use to sync the time travel buttons if necessary
        buttonSound: { type: 'boolean', default: false }, //this is the name of the event we will use to sync the time travel buttons if necessary
    },
    init() {
        const CONTEXT = this;
        //set socket to null to be filled in when connection is established
        CONTEXT.socket = null;
        //get the elements we need to interact with
        const buttonLeftPast = document.querySelector('#buttonLeftPast');
        const buttonRightPast = document.querySelector('#buttonRightPast');
        const buttonLeftPresent = document.querySelector('#buttonLeftPresent');
        const buttonRightPresent = document.querySelector('#buttonRightPresent');
        const buttonLeftFuture = document.querySelector('#buttonLeftFuture');
        const buttonRightFuture = document.querySelector('#buttonRightFuture');
        const player = document.querySelector('#Player1');

        //define custom DOM events
        CONTEXT.enableTeleportation = new CustomEvent('enable-teleportation');

        CONTEXT.teleportForward = new CustomEvent('teleport', {
            detail: {x: 50}
        });
        CONTEXT.teleportBackward = new CustomEvent('teleport', {
            detail: {x: -50}
        });

        CONTEXT.clickPresentRight = new CustomEvent('button-click', { 
            detail: {button: "buttonRightPresent"}
        });
        CONTEXT.clickPresentLeft = new CustomEvent('button-click', {
            detail: {button: "buttonLeftPresent"}
        });
        CONTEXT.clickPastRight = new CustomEvent('button-click', {
            detail: {button: "buttonRightPast"}
        });
        CONTEXT.clickPastLeft = new CustomEvent('button-click', {
            detail: {button: "buttonLeftPast"}
        });
        CONTEXT.clickFutureRight = new CustomEvent('button-click', {
            detail: {button: "buttonRightFuture"}
        });
        CONTEXT.clickFutureLeft = new CustomEvent('button-click', {
            detail: {button: "buttonLeftFuture"}
        });
        CONTEXT.buttonClick = new CustomEvent('button-click', {
            detail: {button: "buttonSoundOnly"}
        });

        CONTEXT.initTPpresent = new CustomEvent('initiate-teleport', {
            detail: {current: "capsulePresent"}
        });
        CONTEXT.initTPpast = new CustomEvent('initiate-teleport', {
            detail: {current: "capsulePast"}
        });
        CONTEXT.initTPfuture = new CustomEvent('initiate-teleport', {
            detail: {current: "capsuleFuture"}
        });

        //CIRCLES connection event, bind the socket to CONTEXT
        CONTEXT.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function () {
            CONTEXT.socket = CIRCLES.getCirclesWebsocket();
            console.log("SOCKET HERE: "+CONTEXT.socket);
            console.log(CONTEXT.socket);
            CONTEXT.data.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT.socket.id);

            //RECEIVE SYNC EVENTS
            CONTEXT.socket.on(CONTEXT.data.synchEventName, function (data) { 
                CONTEXT.data.teleportAllowed = data.teleportAllowed; //receive sync event & sync
                CONTEXT.data.pastCapsuleAnimation = data.pastCapsuleAnimation; //receive sync event & sync
                CONTEXT.data.presentCapsuleAnimation = data.presentCapsuleAnimation; //receive sync event & sync
                CONTEXT.data.futureCapsuleAnimation = data.futureCapsuleAnimation; //receive sync event & sync
                CONTEXT.data.buttonSound = data.buttonSound; //receive sync event & sync
            });

            //CIRCLES SYNC REQUEST EVENT
            setTimeout(function () {
                CONTEXT.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {
                    room:CIRCLES.getCirclesGroupName(), 
                    world:CIRCLES.getCirclesWorldName()
                });
            }, 1000); //wait a second to make sure we are connected... might want to make this random?

            //CIRCLES SYNC DATA EVENT
            CONTEXT.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function (data) {
                CONTEXT.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {
                    room:CIRCLES.getCirclesGroupName(),
                    world:CIRCLES.getCirclesWorldName(),
                    data: {
                        teleportAllowed: CONTEXT.data.teleportAllowed,
                        pastCapsuleAnimation: CONTEXT.data.pastCapsuleAnimation,
                        presentCapsuleAnimation: CONTEXT.data.presentCapsuleAnimation,
                        futureCapsuleAnimation: CONTEXT.data.futureCapsuleAnimation,
                        buttonSound: CONTEXT.data.buttonSound
                    }});
            });
        });

        //CUSTOM teleport enable event
        CONTEXT.el.addEventListener('enable-teleportation', function () {
            CONTEXT.data.teleportAllowed = true;
            //send sync event (TELEPORTATION ENABLED)
            CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
            console.log("enable teleportation event triggered");
        });

        //CUSTOM teleport event
        CONTEXT.el.addEventListener('teleport', function (data) {
            setTimeout( function () {
                let pos = player.getAttribute('position');
                player.setAttribute('position', `${pos.x + data.detail.x} ${pos.y} ${pos.z}`);
            }, 5000);
            console.log("teleport event triggered");
        });
        
        //CUSTOM button-click event
        CONTEXT.el.addEventListener('button-click', function (data) {
            //send sync event (TELEPORTATION DISABLED)
            CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
            let loc = document.querySelector("#" + data.detail.button);
                loc.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true; duration: 100;');
                loc.addEventListener('animation-finished', function () {
                    loc.removeAttribute('animation-mixer');
                }, { once: true });
                console.log(loc.getAttribute('animation-mixer'));
                document.querySelector(`#${data.detail.button}Sound`).components.sound.playSound();
                console.log(`#${data.detail.button}Sound`);
                console.log("button-click event triggered");
        });

        //CUSTOM initiate-teleport event
        CONTEXT.el.addEventListener('initiate-teleport', function (data) {
            let capsuleCurrent = document.querySelector("#"+data.detail.current);
            capsuleCurrent.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
            capsuleCurrent.addEventListener('animation-finished', function () {
                capsuleCurrent.removeAttribute('animation-mixer');
                CONTEXT.el.dispatchEvent(CONTEXT.enableTeleportation);
            }, { once: true });
            console.log("initiate-teleport event triggered");
        });

        //BUTTON CLICK LISTENERS

        buttonLeftPast.addEventListener('click', function () {
            if (CONTEXT.data.teleportAllowed === true) {
                CONTEXT.data.buttonSound = true;
                CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
            }
        });

        buttonRightPast.addEventListener('click', function () {
            if (CONTEXT.data.teleportAllowed === true) {
                CONTEXT.data.teleportAllowed = false;
                CONTEXT.data.pastCapsuleAnimation = true;
                CONTEXT.data.presentCapsuleAnimation = true;
                CONTEXT.data.buttonSound = true;
                CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportForward);
            }
        });

        buttonLeftPresent.addEventListener('click', function () {
            if (CONTEXT.data.teleportAllowed === true) {
                CONTEXT.data.teleportAllowed = false;
                CONTEXT.data.pastCapsuleAnimation = true;
                CONTEXT.data.presentCapsuleAnimation = true;
                CONTEXT.data.buttonSound = true;
                CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportBackward);
            }
        });

        buttonRightPresent.addEventListener('click', function () {
            if (CONTEXT.data.teleportAllowed === true) {
                CONTEXT.data.teleportAllowed = false;
                CONTEXT.data.presentCapsuleAnimation = true;
                CONTEXT.data.futureCapsuleAnimation = true;
                CONTEXT.data.buttonSound = true;
                CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportForward);
            }
        });

        buttonLeftFuture.addEventListener('click', function () {
            if (CONTEXT.data.teleportAllowed === true) {
                CONTEXT.data.teleportAllowed = false;
                CONTEXT.data.presentCapsuleAnimation = true;
                CONTEXT.data.futureCapsuleAnimation = true;
                CONTEXT.data.buttonSound = true;
                CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportBackward);
            }
        });

        buttonRightFuture.addEventListener('click', function () {
            if (CONTEXT.data.teleportAllowed === true) {
                CONTEXT.data.buttonSound = true;
                CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
            }
        });

        //END BUTTON CLICK LISTENERS
    },

    tick: function () {
        const CONTEXT = this;
        if (CONTEXT.data.pastCapsuleAnimation === true) {
            CONTEXT.el.dispatchEvent(CONTEXT.initTPpast);
            CONTEXT.data.pastCapsuleAnimation = false;
            CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
        }
        if (CONTEXT.data.presentCapsuleAnimation === true) {
            CONTEXT.el.dispatchEvent(CONTEXT.initTPpresent);
            CONTEXT.data.presentCapsuleAnimation = false;
            CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
        }
        if (CONTEXT.data.futureCapsuleAnimation === true) {
            CONTEXT.el.dispatchEvent(CONTEXT.initTPfuture);
            CONTEXT.data.futureCapsuleAnimation = false;
            CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
        }
        if (CONTEXT.data.buttonSound === true) {
            CONTEXT.el.dispatchEvent(CONTEXT.buttonClick);
            CONTEXT.data.buttonSound = false;
            CONTEXT.socket.emit(CONTEXT.data.synchEventName, CONTEXT.data);
        }
    }
});

/*
'use strict';
const ascene = document.querySelector('a-scene');

const buttonLeftPast = document.querySelector('#buttonLeftPast');
const buttonRightPast = document.querySelector('#buttonRightPast');
const buttonLeftPresent = document.querySelector('#buttonLeftPresent');
const buttonRightPresent = document.querySelector('#buttonRightPresent');
const buttonLeftFuture = document.querySelector('#buttonLeftFuture');
const buttonRightFuture = document.querySelector('#buttonRightFuture');

const player = document.querySelector('#player');

let id = "";


AFRAME.registerComponent('experience-manager', {
    init: function () {
        const socket = io();

        socket.on('connect', (userData) => {

            buttonLeftPast.addEventListener('click', function () {
                socket.emit('buttonLeftPast-selected', { id: id });
            });
            buttonRightPast.addEventListener('click', function () {
                socket.emit('buttonRightPast-selected', { id: id });
            });
            buttonLeftPresent.addEventListener('click', function () {
                socket.emit('buttonLeftPresent-selected', { id: id });
            });
            buttonRightPresent.addEventListener('click', function () {
                socket.emit('buttonRightPresent-selected', { id: id });
            });
            buttonLeftFuture.addEventListener('click', function () {
                socket.emit('buttonLeftFuture-selected', { id: id });
            });
            buttonRightFuture.addEventListener('click', function () {
                socket.emit('buttonRightFuture-selected', { id: id });
            });

            id= socket.id;

        });

        socket.on('teleport', (data) => {
            if (id == data.id) {
                setTimeout(
                    function () {
                        let pos = player.getAttribute('position');
                        player.setAttribute('position', `${pos.x + data.x} ${pos.y} ${pos.z}`);
                    }, 5000);
            }
        });

        socket.on('button-click', (data) => {

            let loc = document.querySelector(`#${data.button}`);

            loc.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
            loc.addEventListener('animation-finished', function () {
                loc.removeAttribute('animation-mixer');
            }, { once: true });
            document.querySelector(`#${data.button}Sound`).components.sound.playSound();

        });


        socket.on('initiate-teleport', (data) => {
            console.log("In initiate teleport");
            let capsuleCurrent = document.querySelector(`#${data.current}`);

            capsuleCurrent.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
            capsuleCurrent.addEventListener('animation-finished', function () {
                capsuleCurrent.removeAttribute('animation-mixer');
                socket.emit('enable-teleportation');
            }, { once: true });

        });
    }
})

  //BEGIN DYLAN'S SERVER CODE

  // ENABLE TELEPORTATION
  socket.on('enable-teleportation', (data) => {
    teleportationOpen = true;
  });


  // PAST LEFT
  socket.on('buttonLeftPast-selected', (data) => {
    console.log(data.id);
    if (teleportationOpen) {
      console.log("buttonLeftPast");
      io.emit('button-click', { button: "buttonLeftPast" });
    }
    else
      console.log(teleportationOpen);
  });

  //PAST RIGHT
  socket.on('buttonRightPast-selected', (data) => {
    if (teleportationOpen) {
      teleportationOpen = false;
      console.log("buttonRightPast");
      io.emit('button-click', { button: "buttonRightPast" });
      io.emit('initiate-teleport', { current: "capsulePast" });
      io.emit('initiate-teleport', { current: "capsulePresent" });
      io.emit('teleport', { id: data.id, x: 10 });
    }
    else
      console.log(teleportationOpen);
  });

  //PRESENT LEFT
  socket.on('buttonLeftPresent-selected', (data) => {
    if (teleportationOpen) {
      teleportationOpen = false;
      console.log("buttonLeftPresent");
      io.emit('button-click', { button: "buttonLeftPresent" });
      io.emit('initiate-teleport', { current: "capsulePresent" });
      io.emit('initiate-teleport', { current: "capsulePast" });
      io.emit('teleport', { id: data.id, x: -10 });
    }
    else
      console.log(teleportationOpen);
  });

  //PRESENT RIGHT
  socket.on('buttonRightPresent-selected', (data) => {
    if (teleportationOpen) {
      teleportationOpen = false;
      console.log("buttonRightPresent");
      io.emit('button-click', { button: "buttonRightPresent" });
      io.emit('initiate-teleport', { current: "capsulePresent" });
      io.emit('initiate-teleport', { current: "capsuleFuture" });
      io.emit('teleport', { id: data.id, x: 10 });
    }
    else
      console.log(teleportationOpen);
  });

  //FUTURE LEFT
  socket.on('buttonLeftFuture-selected', (data) => {
    if (teleportationOpen) {
      teleportationOpen = false;
      console.log("buttonLeftFuture");
      io.emit('button-click', { button: "buttonLeftFuture" });
      io.emit('initiate-teleport', { current: "capsuleFuture" });
      io.emit('initiate-teleport', { current: "capsulePresent" });
      io.emit('teleport', { id: data.id, x: -10 });
    }
    else
      console.log(teleportationOpen);
  });

  //FUTURE RIGHT
  socket.on('buttonRightFuture-selected', (data) => {
    if (teleportationOpen) {
      console.log("buttonRightFuture");
      io.emit('button-click', { button: "buttonRightFuture" });
    }
    else
      console.log(teleportationOpen);
  });

  //END DYLAN'S SERVER CODE

*/

