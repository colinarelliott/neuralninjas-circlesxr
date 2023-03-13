AFRAME.registerComponent('timeTravel', {
    schema: {
        connected: { type: 'boolean', default: false }, //this is a flag to indicate if we are connected to the messaging system
        synchEventName: { type: 'string', default: 'timeTravel_event' }, //this is the name of the event we will use to sync the time travel buttons if necessary
        teleportAllowed: { type: 'boolean', default: true }, //this is a flag to indicate if we are connected to the messaging system
    },
    init() {
        const CONTEXT = this;
        //set socket to null to be filled in when connection is established
        CONTEXT.socket = null;
        const buttonLeftPast = document.querySelector('#buttonLeftPast');
        const buttonRightPast = document.querySelector('#buttonRightPast');
        const buttonLeftPresent = document.querySelector('#buttonLeftPresent');
        const buttonRightPresent = document.querySelector('#buttonRightPresent');
        const buttonLeftFuture = document.querySelector('#buttonLeftFuture');
        const buttonRightFuture = document.querySelector('#buttonRightFuture');
        const player = document.querySelector('#camera');

        //CIRCLES connection event. get the web socket and add click listeners. Basically this is the client side code
        CONTEXT.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function () {
            CONTEXT.socket = CIRCLES.getCirclesWebsocket();
            console.log(CONTEXT.socket);
            CONTEXT.data.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT.socket.id + " in room:" + CIRCLES.getCirclesRoom() + ' in world:' + CIRCLES.getCirclesWorld());

            buttonLeftPast.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonLeftPast-selected', { id: CONTEXT.socket.id });
                if (CONTEXT.data.teleportAllowed) {
                    CONTEXT.socket.emit('button-click', { button: 'buttonLeftPast'});
                    console.log("buttonLeftPast-selected");
                    //NO TELEPORT, JUST SOUND
                }
            });

            buttonRightPast.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonRightPast-selected', { id: CONTEXT.socket.id });
                if (CONTEXT.data.teleportAllowed) {
                    CONTEXT.data.teleportAllowed = false;
                    //SYNC EVENT GOES HERE
                    CONTEXT.socket.emit('button-click', { button: 'buttonRightPast'});
                    console.log("buttonRightPast-selected");
                    //TELEPORT TO THE PRESENT
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsulePast" });
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsulePresent" });
                    CONTEXT.socket.emit('teleport', {id: CONTEXT.socket.id, x: 10});
                }
            });

            buttonLeftPresent.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonLeftPresent-selected', { id: CONTEXT.socket.id });
                if (CONTEXT.data.teleportAllowed) {
                    CONTEXT.data.teleportAllowed = false;
                    CONTEXT.socket.emit('button-click', { button: 'buttonLeftPresent'});
                    console.log("buttonLeftPresent-selected");
                    //TELEPORT TO THE PAST
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsulePresent" });
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsulePast" });
                    CONTEXT.socket.emit('teleport', {id: CONTEXT.socket.id, x: -10});
                }
            });

            buttonRightPresent.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonRightPresent-selected', { id: CONTEXT.socket.id });
                if (CONTEXT.data.teleportAllowed) {
                    CONTEXT.data.teleportAllowed = false;
                    CONTEXT.socket.emit('button-click', { button: 'buttonRightPresent'});
                    console.log("buttonRightPresent-selected");
                    //TELEPORT TO THE FUTURE
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsulePresent" });
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsuleFuture" });
                    CONTEXT.socket.emit('teleport', {id: CONTEXT.socket.id, x: 10});
                }
            });

            buttonLeftFuture.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonLeftFuture-selected', { id: CONTEXT.socket.id });
                if (CONTEXT.data.teleportAllowed) {
                    CONTEXT.data.teleportAllowed = false;
                    CONTEXT.socket.emit('button-click', { button: 'buttonLeftFuture'});
                    console.log("buttonLeftFuture-selected");
                    //TELEPORT TO THE PRESENT
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsuleFuture" });
                    CONTEXT.socket.emit('initiate-teleport', { current: "capsulePresent" });
                    CONTEXT.socket.emit('teleport', {id: CONTEXT.socket.id, x: -10});
                }
            });

            buttonRightFuture.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonRightFuture-selected', { id: CONTEXT.socket.id });
                if (CONTEXT.data.teleportAllowed) {
                    CONTEXT.socket.emit('button-click', { button: 'buttonRightFuture'});
                    console.log("buttonRightFuture-selected");
                    //NO TELEPORT, JUST SOUND
                }
            });
        });

        //CUSTOM teleport enable event
        CONTEXT.socket.on('enable-teleportation', function (data) {
            CONTEXT.data.teleportAllowed = true;
            console.log("teleportation enabled");
        });

        //CUSTOM teleport event
        CONTEXT.socket.on('teleport', function (data) {
            if (CONTEXT.socket.id == data.id) {
                setTimeout(
                    function () {
                        let pos = player.getAttribute('position');
                        player.setAttribute('position', `${pos.x + data.x} ${pos.y} ${pos.z}`);
                    }, 5000);
            }
        });
        
        //CUSTOM button-click event
        CONTEXT.socket.on('button-click', function (data) {
            let loc = document.querySelector(`#${data.button}`);
            loc.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
            loc.addEventListener('animation-finished', function () {
                loc.removeAttribute('animation-mixer');
            }, { once: true });
            document.querySelector(`#${data.button}Sound`).components.sound.playSound();
        });

        //CUSTOM initiate-teleport event
        CONTEXT.socket.on('initiate-teleport', function (data) {
            let capsuleCurrent = document.querySelector(`#${data.current}`);
            capsuleCurrent.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
            capsuleCurrent.addEventListener('animation-finished', function () {
                capsuleCurrent.removeAttribute('animation-mixer');
                CONTEXT.socket.emit('enable-teleportation');
            }, { once: true });
        });

        //unused sync
        CONTEXT.socket.on(CONTEXT.data.synchEventName, function (data) {
            console.log("received timeTravel_event: " + JSON.stringify(data));
            CONTEXT.socket.emit(CONTEXT.data.synchEventName, { room: CIRCLES.getCirclesRoom(), world: CIRCLES.getCirclesWorld() });
        });
    },
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

