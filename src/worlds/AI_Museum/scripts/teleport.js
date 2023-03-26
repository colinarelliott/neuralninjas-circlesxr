AFRAME.registerComponent('time-travel', { //attached to the experience-manager
    schema: {
    },
    init() {
        const CONTEXT = this;
        const buttonLeftPast = document.querySelector('#buttonLeftPast');
        const buttonRightPast = document.querySelector('#buttonRightPast');
        const buttonLeftPresent = document.querySelector('#buttonLeftPresent');
        const buttonRightPresent = document.querySelector('#buttonRightPresent');
        const buttonLeftFuture = document.querySelector('#buttonLeftFuture');
        const buttonRightFuture = document.querySelector('#buttonRightFuture');
        const player = document.querySelector('#Player1');

        //define custom DOM events
        CONTEXT.teleportForward = new CustomEvent('teleport', {
            detail: { x: 50 }
        });
        CONTEXT.teleportBackward = new CustomEvent('teleport', {
            detail: { x: -50 }
        });

        CONTEXT.clickPresentRight = new CustomEvent('button-click', {
            detail: { button: "buttonRightPresent" }
        });
        CONTEXT.clickPresentLeft = new CustomEvent('button-click', {
            detail: { button: "buttonLeftPresent" }
        });
        CONTEXT.clickPastRight = new CustomEvent('button-click', {
            detail: { button: "buttonRightPast" }
        });
        CONTEXT.clickPastLeft = new CustomEvent('button-click', {
            detail: { button: "buttonLeftPast" }
        });
        CONTEXT.clickFutureRight = new CustomEvent('button-click', {
            detail: { button: "buttonRightFuture" }
        });
        CONTEXT.clickFutureLeft = new CustomEvent('button-click', {
            detail: { button: "buttonLeftFuture" }
        });
        CONTEXT.buttonClick = new CustomEvent('button-click', {
            detail: { button: "buttonSoundOnly" }
        });

        CONTEXT.initTPpresent = new CustomEvent('initiate-teleport', {
            detail: { current: "capsulePresent" }
        });
        CONTEXT.initTPpast = new CustomEvent('initiate-teleport', {
            detail: { current: "capsulePast" }
        });
        CONTEXT.initTPfuture = new CustomEvent('initiate-teleport', {
            detail: { current: "capsuleFuture" }
        });

        //CUSTOM teleport event
        CONTEXT.el.addEventListener('teleport', function (data) {
            setTimeout(function () {
                let pos = player.getAttribute('position');
                player.setAttribute('position', `${pos.x + data.detail.x} ${pos.y} ${pos.z}`);
            }, 5000);
            console.log("teleport event triggered");
        });

        //CUSTOM button-click event
        CONTEXT.el.addEventListener('button-click', function (data) {
            //send sync event (TELEPORTATION DISABLED)
            let loc = document.querySelector("#" + data.detail.button);
            loc.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
            loc.addEventListener('animation-finished', function () {
                loc.removeAttribute('animation-mixer');
            }, { once: true }); //this animation is not playing
            console.log(loc.getAttribute('animation-mixer'));
            document.querySelector(`#${data.detail.button}Sound`).components.sound.playSound();
            console.log(`#${data.detail.button}Sound`);
            console.log("button-click event triggered");
        });

        //CUSTOM initiate-teleport event
        CONTEXT.el.addEventListener('initiate-teleport', function (data) {
            let capsuleCurrent = document.querySelector("#" + data.detail.current);
            capsuleCurrent.setAttribute('animation-mixer', 'clip: *; loop: once; clampWhenFinished: true;');
            capsuleCurrent.addEventListener('animation-finished', function () {
                capsuleCurrent.removeAttribute('animation-mixer');
            }, { once: true });
            console.log("initiate-teleport event triggered");
        });

        //BUTTON CLICK LISTENERS next troubleshooting step: if getTPAllowed is true, then allow teleportation <

        buttonLeftPast.addEventListener('click', function () {
            CONTEXT.el.dispatchEvent(CONTEXT.clickPastLeft);
        });

        buttonRightPast.addEventListener('click', function () {
            const networkManager = document.querySelector('#experience-manager').components['network-manager'];
            if (networkManager.data.tpAllowed === true) {
                networkManager.sendUpdate({
                    data: {
                        tpAllowed: false,
                        pastTP: true,
                        presentTP: true,
                    } //set tpAllowed to false in networkManager
                });
                CONTEXT.el.dispatchEvent(CONTEXT.clickPastRight);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPpast);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPpresent);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportForward);

                setTimeout(function () {
                    //set tpAllowed to true after 5 seconds in networkManager
                    networkManager.sendUpdate({
                        data: {
                            tpAllowed: true,
                            pastTP: false,
                            presentTP: false,
                        }
                    });
                }, 5000);
            }
        });

        buttonLeftPresent.addEventListener('click', function () {
            const networkManager = document.querySelector('#experience-manager').components['network-manager'];
            if (networkManager.data.tpAllowed === true) {
                networkManager.sendUpdate({
                    data: {
                        tpAllowed: false,
                        presentTP: true,
                        pastTP: true,
                    }
                });
                CONTEXT.el.dispatchEvent(CONTEXT.clickPresentLeft);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPpresent);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPpast);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportBackward);

                setTimeout(function () {
                    networkManager.sendUpdate({
                        data: {
                            tpAllowed: true,
                            presentTP: false,
                            pastTP: false,
                        }
                    });
                }, 5000);
            }
        });

        buttonRightPresent.addEventListener('click', function () {
            const networkManager = document.querySelector('#experience-manager').components['network-manager'];
            if (networkManager.data.tpAllowed === true) {
                //send data to networkManager
                networkManager.sendUpdate({
                    data: {
                        tpAllowed: false,
                        presentTP: true,
                        futureTP: true,
                    }
                });

                //trigger local events
                CONTEXT.el.dispatchEvent(CONTEXT.clickPresentRight);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPpresent);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPfuture);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportForward);

                //reset data in networkManager after 5 seconds
                setTimeout(function () {
                    networkManager.sendUpdate({
                        data: {
                            tpAllowed: true,
                            presentTP: false,
                            futureTP: false,
                        }
                    });
                }, 5000);
            }
        });

        buttonLeftFuture.addEventListener('click', function () {
            const networkManager = document.querySelector('#experience-manager').components['network-manager'];
            if (networkManager.data.tpAllowed === true) {
                networkManager.sendUpdate({
                    data: {
                        tpAllowed: false,
                        futureTP: true,
                        presentTP: true,
                    }
                });
                CONTEXT.el.dispatchEvent(CONTEXT.clickFutureLeft);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPfuture);
                CONTEXT.el.dispatchEvent(CONTEXT.initTPpresent);
                CONTEXT.el.dispatchEvent(CONTEXT.teleportBackward);

                setTimeout(function () {
                    networkManager.sendUpdate({
                        data: {
                            tpAllowed: true,
                            futureTP: false,
                            presentTP: false,
                        }
                    });
                }, 5000);
            }
        });

        buttonRightFuture.addEventListener('click', function () {
            CONTEXT.el.dispatchEvent(CONTEXT.clickFutureRight);
        });

        //END BUTTON CLICK LISTENERS
    },

    //this tick function is currently triggering the animations locally but we want it to trigger them for other players    
    tick: function () {
        const CONTEXT = this;
        const networkManager = document.querySelector('#experience-manager').components['network-manager'];

        if (networkManager.data.pastTP === true) {
            CONTEXT.el.dispatchEvent(CONTEXT.initTPpast);
            networkManager.sendUpdate({
                data: {
                    pastTP: false,
                }
            });
        }

        if (networkManager.data.presentTP === true) {
            CONTEXT.el.dispatchEvent(CONTEXT.initTPpresent);
            networkManager.sendUpdate({
                data: {
                    presentTP: false,
                }
            });
        }

        if (networkManager.data.futureTP === true) {
            CONTEXT.el.dispatchEvent(CONTEXT.initTPfuture);
            networkManager.sendUpdate({
                data: {
                    futureTP: false,
                }
            });
        }
    }
});

