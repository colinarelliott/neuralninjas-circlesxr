//simple slide incrementer script

//attached to the wrapper around the billboard

AFRAME.registerComponent('slide-timer', {
    schema: {
        currentSlide: {type: 'number', default: 1},
        duration: {type: 'number', default: 1000},
        numberOfSlides: {type: 'number', default: 10},
        billboardID: {type: 'string', default: 'UseCaseBillboard'}
    },

    init: function () {
        const THIS = this;

        THIS.incrementSlide = THIS.incrementSlide.bind(THIS);
        THIS.decrementSlide = THIS.decrementSlide.bind(THIS);
        THIS.resetSlide = THIS.resetSlide.bind(THIS);
        THIS.changeSlide = THIS.changeSlide.bind(THIS);

        THIS.data.currentSlide = 1;

        THIS.billboardWrapper = THIS.el;

        THIS.billboard = document.querySelector('#' + THIS.data.billboardID);

        //setup timers
        setInterval(THIS.incrementSlide, THIS.data.duration);
        setTimeout( function() {
            if (THIS.data.currentSlide < THIS.data.numberOfSlides) {
                setInterval(THIS.changeSlide, THIS.data.duration);
            }
        }, 50);
    },

    /* I don't understand why this function doesn't work but it keeps randomly crashing
    tick: function () {
        const THIS = this;

        THIS.billboard = document.querySelector('#UseCaseBillboard');

        if (THIS.data.currentSlide > THIS.data.numberOfSlides) {
            THIS.resetSlide();
        }

        if (THIS.data.currentSlide < 1) {
            THIS.resetSlide();
        }

        if (THIS.data.currentSlide < THIS.data.numberOfSlides) {
            THIS.incrementSlide();
        }

        console.log("changing slide to: " + THIS.data.currentSlide);

        let copy = THIS.billboard.cloneNode(true);
        copy.setAttribute('material', 'src: #UseCase' + THIS.data.currentSlide);
        THIS.billboard.parentNode.removeChild(THIS.billboard);
        THIS.billboardWrapper.appendChild(copy);
    }, */

    changeSlide: function () {
        const THIS = this;

        let billboard = document.querySelector('#UseCaseBillboard');

        if (THIS.data.currentSlide > THIS.data.numberOfSlides) { THIS.resetSlide(); }

        let copy = billboard.cloneNode(true);
        copy.setAttribute('material', 'src: #UseCase' + THIS.data.currentSlide);
        billboard.parentNode.removeChild(billboard);
        THIS.el.appendChild(copy);
    },

    incrementSlide: function () {
        const THIS = this;
        THIS.data.currentSlide++;
    },

    decrementSlide: function () {
        const THIS = this;
        THIS.data.currentSlide--;
    },

    resetSlide: function () {
        const THIS = this;
        THIS.data.currentSlide = 1;
    }
});