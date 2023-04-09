//simple slide incrementer script


/*

AFRAME.registerComponent('slide-timer', {
    schema: {
        slideNum: {type: 'number', default: 1},
        duration: {type: 'number', default: 1000},
        numberOfSlides: {type: 'number', default: 10},
    },

    init: function () {
        const THIS = this;

        THIS.incrementSlide = THIS.incrementSlide.bind(THIS);
        THIS.decrementSlide = THIS.decrementSlide.bind(THIS);
        THIS.resetSlide = THIS.resetSlide.bind(THIS);
        
        //throttle the tick to 1000ms
        THIS.tick = AFRAME.utils.throttleTick(THIS.tick, THIS.data.duration);
    },

    tick: function () {
        const THIS = this;

        console.log("slide: " + THIS.data.slideNum);

        if (THIS.data.slideNum < THIS.data.numberOfSlides) { 
            THIS.incrementSlide(); 
        } else { 
            THIS.resetSlide();
        };
    },

    update : function () {
        const THIS = this;
        const billboard = document.querySelector('#UseCaseBillboard');

        let copy = billboard.cloneNode(true);
        copy.setAttribute('material', 'src: #UseCase' + THIS.data.slideNum);
        billboard.parentNode.replaceChild(copy, billboard);
    },

    incrementSlide: function () {
        const THIS = this;
        THIS.data.slideNum++;
    },

    decrementSlide: function () {
        const THIS = this;
        THIS.data.slideNum--;
    },

    resetSlide: function () {
        const THIS = this;
        THIS.data.slideNum = 1;
    }
});

*/