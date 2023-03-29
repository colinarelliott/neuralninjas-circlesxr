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

        //get the navmesh entity
        THIS.navMesh = document.querySelector('#navmesh');
        //set the properties of the navmesh to the present museum
        THIS.navMesh.setAttribute('scale', '0.8 0.8 0.8');
        THIS.navMesh.setAttribute('position', '0 0 0')
        THIS.navMesh.setAttribute('gltf-model', '#present-nav-mesh');
        THIS.navMesh.setAttribute('visible', 'true');
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
            THIS.navMesh.setAttribute('scale', '0.6 0.6 0.6');
            THIS.navMesh.setAttribute('position', '-50 0 0')
            THIS.navMesh.setAttribute('gltf-model', '#past-nav-mesh');
            console.log("PAST NAVMESH LOADED");
        } else if (THIS.playerPos.x > -25 && THIS.playerPos.x < 25) {
            //set the properties of the navmesh to the present museum
            THIS.navMesh.setAttribute('scale', '0.8 0.8 0.8');
            THIS.navMesh.setAttribute('position', '0 0 0')
            THIS.navMesh.setAttribute('gltf-model', '#present-nav-mesh');
            console.log("PRESENT NAVMESH LOADED");
        } else if (THIS.playerPos.x > 25) {
            //set the properties of the navmesh to the future museum
            THIS.navMesh.setAttribute('scale', '1 1 1');
            THIS.navMesh.setAttribute('position', '50 0 0')
            THIS.navMesh.setAttribute('gltf-model', '#future-nav-mesh');
            console.log("FUTURE NAVMESH LOADED");
        }
    }
});