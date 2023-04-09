//simple slide incrementer script

AFRAME.registerComponent('slide-timer', {
    schema: {
        slide: {type: 'number', default: 1},
        duration: {type: 'number', default: 1000},
        numberOfSlides: {type: 'number', default: 10},
    },

    init: function () {
        const THIS = this;

        THIS.incrementSlide = THIS.incrementSlide.bind(THIS);
        THIS.decrementSlide = THIS.decrementSlide.bind(THIS);
        THIS.resetSlide = THIS.resetSlide.bind(THIS);

        THIS.slide = 1;

        THIS.billboard = this.el;
    },

    tick: function () {
        const THIS = this;

        if (THIS.data.slide < THIS.data.numberOfSlides) { 
            THIS.incrementSlide(); 
        } else { 
            THIS.resetSlide();
        };

        let copy = THIS.billboard.cloneNode(true);
        copy.setAttribute('material', 'src: #UseCase' + THIS.data.slide);
        THIS.billboard.parentNode.removeChild(THIS.billboard);
        THIS.billboard = copy;
    },

    incrementSlide: function () {
        const THIS = this;
        THIS.data.slide++;
    },

    decrementSlide: function () {
        const THIS = this;
        THIS.data.slide--;
    },

    resetSlide: function () {
        const THIS = this;
        THIS.data.slide = 1;
    }
});