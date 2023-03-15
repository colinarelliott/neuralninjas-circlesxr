AFRAME.registerComponent("set-keyboard", {
  schema: {
    keyboardValue: { type: "string", default: "" },
  },

  init: function () {
    const CONTEXT = this;
    //Get the elements we need
    const keyboard = document.querySelector("#keyboard");
    const keyboardComponent = document.querySelector("#keyboard").components["super-keyboard"];
    const imageGenerator = document.querySelector("[open-ai-image-gen]").components['open-ai-image-gen'];
    const scene = document.querySelector("a-scene");

    keyboard.addEventListener("superkeyboardchange", () => {
      //the text changed, update the big prompt text?
    });

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
      keyboardComponent.data.show = true;
      keyboard.setAttribute("visible", true);
    });
  },

  tick: function () {
    const CONTEXT = this; 
    const keyboardComponent = document.querySelector("#keyboard").components["super-keyboard"];
    CONTEXT.data.keyboardValue = keyboardComponent.data.value;
  },
});
