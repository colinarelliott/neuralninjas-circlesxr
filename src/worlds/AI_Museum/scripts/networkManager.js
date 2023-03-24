//This component will act as a layer between the circles networking and our custom scripts

AFRAME.registerComponent('network-manager', {
    schema: {
        socketID: {type: 'string', default: ''},
        world: {type: 'string', default: ''},
        room: {type: 'string', default: ''},

        //INSERT ALL VARIABLES TO BE SYNCED HERE... also further down...
        cubeColor: {type: 'string', default: 'red'},
    },

    init: function () {
        //initialize the main variables of this component
        const THIS = this;
        THIS.socket = null;
        THIS.data.socketID = '';
        THIS.data.world = '';
        THIS.data.room = '';

        //bind functions to THIS
        THIS.ticker = THIS.ticker.bind(THIS);
        THIS.sendUpdate = THIS.sendUpdate.bind(THIS);

        setInterval(function() {
            THIS.ticker();
        }, 500);
        
        //listen for the connection to the socket
        THIS.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            console.log("Connected to the circles socket successfully"); //TODO: remove this
            console.log(CIRCLES.getCirclesWebsocket());

            //map the socket to the context of this component
            THIS.socket = CIRCLES.getCirclesWebsocket();
            THIS.data.socketID = THIS.socket.id;
            THIS.data.world = CIRCLES.getCirclesWorldName();
            THIS.data.room = CIRCLES.getCirclesGroupName();

            //request a sync of the data after a random delay
            setTimeout(function() {
                console.log("Requesting sync data from the circles socket...");
                THIS.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, SEND IT 
            // (FORMAT: {data, room, world})
            THIS.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(requestData) {
                console.log("Received request for sync data from the circles socket, sending...");
                if (requestData.room === THIS.data.room && requestData.world === THIS.data.world) { //if the request is for our room and world
                    //emit the whole schema to be synced
                    let responseData = THIS.data;
                    THIS.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {data: responseData, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //RECEIVE sync data from others (assuming all others is the same for now)
            THIS.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(syncData) {
                console.log("Received sync data from the circles socket, updating local data...");
                //if the sync data is for our world
                if (syncData.world === THIS.data.world) {
                    
                    //INSERT ALL VARIABLES TO BE SYNCED HERE... also in the schema and below
                    THIS.data.cubeColor = syncData.data.cubeColor;
                    //END SYNC VARIABLES

                }
            });

            //if we disconnect, reset the socket and world
            THIS.socket.on('disconnect', function() {
                console.log("Disconnected from the circles socket");
                THIS.data.socketID = '';
                THIS.data.world = '';
                THIS.data.room = '';
            });
        });
    },

    //send the update to the circles socket via this function
    sendUpdate(updateData) {
        const THIS = this;

        //INSERT ALL VARIABLES TO BE SYNCED HERE... also in the schema and above
        THIS.data.cubeColor = updateData.data.cubeColor;

        //send the update to the circles socket
        let dataToUpdate = THIS.data;
        THIS.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {data: dataToUpdate, room: THIS.data.room, world: THIS.data.world});
    },

    //this function is called every 500ms, so far just for debug
    ticker: function () {
        const THIS = this;
        console.log(THIS.data);
    },
});