//a script to swap out the ID (and therefore the geometry) of the navmesh based on the player's position in the world

//NAV MESH MODEL IDS
//past-nav-mesh
//present-nav-mesh
//future-nav-mesh

//NAV MESH ENTITY ID
//navmesh

AFRAME.registerComponent('nav-mesh-handler', {
    schema: {
    },
    init: function () {
        const THIS = this;

        //bind the createNavMesh function to THIS
        THIS.createNavMesh = THIS.createNavMesh.bind(THIS);

        //get the navmesh entity
        THIS.navMesh = document.querySelector('#navmesh');
        //set the properties of the navmesh to the present museum

        //get the player entity
        THIS.player = document.querySelector('#Player1');
    },

    tick: function () {
        const THIS = this;

        //get the player's position
        THIS.playerPos = THIS.player.getAttribute('position');

        console.log(THIS.playerPos.x);
        
        if (THIS.playerPos.x < -25) {
            //set the properties of the navmesh to the past museum
            THIS.navMesh.parentNode.removeChild(THIS.navMesh);
            THIS.createNavMesh('-50 0.02 0', '0.6 0.6 0.6', '#past-nav-mesh');
            console.log("PAST NAVMESH LOADED");
        } else if (THIS.playerPos.x > -25 && THIS.playerPos.x < 25) {
            //set the properties of the navmesh to the present museum
            THIS.navMesh.parentNode.removeChild(THIS.navMesh);
            THIS.createNavMesh('0 0.02 0', '0.8 0.8 0.8', '#present-nav-mesh');
            console.log("PRESENT NAVMESH LOADED");
        } else if (THIS.playerPos.x > 25) {
            //set the properties of the navmesh to the future museum
            THIS.navMesh.parentNode.removeChild(THIS.navMesh);
            THIS.createNavMesh('50 0.02 0', '1 1 1', '#future-nav-mesh');
            console.log("FUTURE NAVMESH LOADED");
        }
    },

    createNavMesh: function (position, scale, model) {
        const THIS = this;

        //create the navmesh entity
        THIS.navMesh = document.createElement('a-entity');
        THIS.navMesh.setAttribute('id', 'navmesh');
        THIS.navMesh.setAttribute('scale', scale);
        THIS.navMesh.setAttribute('position', position)
        THIS.navMesh.setAttribute('gltf-model', model);
        THIS.navMesh.setAttribute('visible', 'true');

        //add the navmesh entity to the scene
        THIS.el.sceneEl.appendChild(THIS.navMesh);
    },
});