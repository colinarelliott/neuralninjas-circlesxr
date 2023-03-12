AFRAME.registerComponent('timeTravel', {
    schema: {
        connected: { type: 'boolean', default: false }, //this is a flag to indicate if we are connected to the messaging system
        synchEventName: { type: 'string', default: 'timeTravel_event' }, //this is the name of the event we will use to sync the time travel buttons if necessary
    },
    init() {
        const CONTEXT = this;
        CONTEXT.socket = null;
        const buttonLeftPast = document.querySelector('#buttonLeftPast');
        const buttonRightPast = document.querySelector('#buttonRightPast');
        const buttonLeftPresent = document.querySelector('#buttonLeftPresent');
        const buttonRightPresent = document.querySelector('#buttonRightPresent');
        const buttonLeftFuture = document.querySelector('#buttonLeftFuture');
        const buttonRightFuture = document.querySelector('#buttonRightFuture');
        const player = document.querySelector('#player');

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function () {
            CONTEXT.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT.data.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT.socket.id + " in room:" + CIRCLES.getCirclesRoom() + ' in world:' + CIRCLES.getCirclesWorld());

            buttonLeftPast.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonLeftPast-selected', { id: CONTEXT.socket.id });
            });

            buttonRightPast.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonRightPast-selected', { id: CONTEXT.socket.id });
            });

            buttonLeftPresent.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonLeftPresent-selected', { id: CONTEXT.socket.id });
            });

            buttonRightPresent.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonRightPresent-selected', { id: CONTEXT.socket.id });
            });

            buttonLeftFuture.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonLeftFuture-selected', { id: CONTEXT.socket.id });
            });

            buttonRightFuture.addEventListener('click', function () {
                CONTEXT.socket.emit('buttonRightFuture-selected', { id: CONTEXT.socket.id });
            });

            CONTEXT.socket.on('teleport', function (data) {
                if (CONTEXT.socket.id == data.id) {
                    setTimeout(
                        function () {
                            let pos = player.getAttribute('position');
                            player.setAttribute('position', `${pos.x + data.x} ${pos.y} ${pos.z}`);
                        }, 5000);
                }
            });

            CONTEXT.socket.on('button-click', function (data) {
                let loc = document.querySelector(`#${data.button}`);
                loc.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
                loc.addEventListener('animation-finished', function () {
                    loc.removeAttribute('animation-mixer');
                }, { once: true });
                document.querySelector(`#${data.button}Sound`).components.sound.playSound();
            });

            CONTEXT.socket.on('initiate-teleport', function (data) {
                if (CONTEXT.socket.id == data.id) {
                    let pos = player.getAttribute('position');
                    player.setAttribute('position', `${pos.x + data.x} ${pos.y} ${pos.z}`);
                }
            });

            CONTEXT.socket.on(CONTEXT.data.synchEventName, function (data) {
                console.log("received timeTravel_event: " + JSON.stringify(data));
                CONTEXT.socket.emit(CONTEXT.data.synchEventName, { room: CIRCLES.getCirclesRoom(), world: CIRCLES.getCirclesWorld() });
            });
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
})*/

