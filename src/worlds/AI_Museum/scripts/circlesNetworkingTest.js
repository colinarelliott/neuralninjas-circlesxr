AFRAME.registerComponent('circles-networking-test', {
    schema: {
        color: {type: 'string', default: '#FF0000'},
    },
    init: function () {
        const THIS = this;

        const cube = document.querySelector('#network-cube');

        cube.el.addEventListener('click', function () {
            THIS.data.color = '#00FF00';
            console.log("Networking cube clicked");
        });
    },

    tick: function () {
        const THIS = this;
        const cube = document.querySelector('#network-cube');
        cube.setAttribute('material', 'color: ', THIS.data.color);
    },
});