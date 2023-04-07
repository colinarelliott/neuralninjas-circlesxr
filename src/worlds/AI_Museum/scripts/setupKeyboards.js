AFRAME.registerComponent("set-keyboard", {
  schema: {
    keyboardValue: { type: "string", default: "" },
    keyboardPastValue: { type: "string", default: "" },
    keyboardFutureValue: { type: "string", default: "" },
  },

  init: function () {
    const CONTEXT = this;
    //Get the elements we need
    const keyboard = document.querySelector("#keyboard");
    const keyboardPast = document.querySelector("#keyboardPast");
    const keyboardFuture = document.querySelector("#keyboardFuture");

    //bind the networkSync function to the CONTEXT
    CONTEXT.networkSync = CONTEXT.networkSync.bind(CONTEXT);

    const keyboardComponent =
      document.querySelector("#keyboard").components["super-keyboard"];
    const keyboardPastComponent =
      document.querySelector("#keyboardPast").components["super-keyboard"];
    const keyboardFutureComponent =
      document.querySelector("#keyboardFuture").components["super-keyboard"];
    const imageGenerator = 
      document.querySelector("[open-ai-image-gen]").components["open-ai-image-gen"];

    /*keyboard.addEventListener("superkeyboardchange", () => {
      setTimeout(CONTEXT.networkSync(), 200);
    });*/

    //When the user presses enter on the keyboard, generate an image
    keyboard.addEventListener("superkeyboardinput", (data) => {
      //ask open-ai-image-gen to generate an image
      imageGenerator.generateImage({
        prompt: CONTEXT.data.keyboardValue,
        n: 1,
        size: "1024x1024",
      });
      //IDK HOW TO GET THE KEYBOARD TO STOP DISSAPEARING! I'M GONNA GO TO BED.
      keyboardComponent.data.value = "";
      CONTEXT.data.keyboardValue = "";
      keyboardComponent.data.show = false;
    });

    //When the user presses enter on the keyboard, generate an image
    keyboardPast.addEventListener("superkeyboardinput", (data) => {
      //ask open-ai-image-gen to generate an image
      imageGenerator.generateImage({
        prompt: CONTEXT.data.keyboardPastValue,
        n: 1,
        size: "1024x1024",
      });
      keyboardPastComponent.data.value = "";
      CONTEXT.data.keyboardPastValue = "";
      keyboardPastComponent.data.show = false;
    });

    keyboardFuture.addEventListener("superkeyboardchange", () => {
      setTimeout(CONTEXT.networkSync(), 200);
    });

    //When the user presses enter on the keyboard, generate an image
    keyboardFuture.addEventListener("superkeyboardinput", (data) => {
      //ask open-ai-image-gen to generate an image
      imageGenerator.generateImage({
        prompt: CONTEXT.data.keyboardFutureValue,
        n: 1,
        size: "1024x1024",
      });
      keyboardFutureComponent.data.value = "";
      CONTEXT.data.keyboardFutureValue = "";
      keyboardFutureComponent.data.show = false;
    });

    //throttle the tick function
    CONTEXT.tick = AFRAME.utils.throttleTick(CONTEXT.tick, 100, this);
  },

  networkSync : function (data) {
    const CONTEXT = this;
    const networkManager = document.querySelector("#experience-manager").components["network-manager"];

    /*
    //Send the keyboard value to the server
    networkManager.sendUpdate({
      data: { 
        //data to update
      },
    });*/
  },

  tick: function () {
    const CONTEXT = this;

    const keyboardComponent =
      document.querySelector("#keyboard").components["super-keyboard"];
    const keyboardPastComponent =
      document.querySelector("#keyboardPast").components["super-keyboard"];
    const keyboardFutureComponent =
      document.querySelector("#keyboardFuture").components["super-keyboard"];
    
    CONTEXT.data.keyboardValue = keyboardComponent.data.value;
    CONTEXT.data.keyboardPastValue = keyboardPastComponent.data.value;
    CONTEXT.data.keyboardFutureValue = keyboardFutureComponent.data.value;
  },
});
