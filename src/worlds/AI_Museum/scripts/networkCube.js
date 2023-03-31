AFRAME.registerComponent('network-cube', {
    schema: {
        color: {type: 'string', default: 'red'},
    },
    init: function () {
        const THIS = this;
        const CUBE = this.el;
        const networkManager = document.querySelector('#experience-manager').components['network-manager'];

        CUBE.addEventListener('click', function (evt) {
            CUBE.setAttribute('material', {color: 'blue'});
            console.log("Network cube updated. Sending to server...");

            if (THIS.data.color === 'red') {
                networkManager.sendUpdate({
                    data : { cubeColor: 'blue' },
                })
            } else {
                networkManager.sendUpdate({
                    data : { cubeColor: 'red' },
                })
            }
        });
    },

    tick: function () {
        const THIS = this;
        const CUBE = this.el;
        const networkManager = document.querySelector('#experience-manager').components['network-manager'];

        THIS.data.color = networkManager.data.cubeColor;
        CUBE.setAttribute('material', {color: THIS.data.color});
    }
});