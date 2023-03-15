AFRAME.registerComponent("set-keyboard", {
  schema: {
    keyboardValue: { type: "string", default: "" },
  },

  init: function () {
    const CONTEXT = this;
    //Get the elements we need
    const keyboard = document.querySelector("#keyboard");
    const imageGenerator = document.querySelector("[open-ai-image-gen]").components['open-ai-image-gen'];

    console.log(keyboard.childNodes);

    //When the user presses enter on the keyboard, generate an image
    keyboard.addEventListener("superkeyboardinput", () => {
      imageGenerator.generateImage({
        prompt: CONTEXT.data.keyboardValue,
        n: 1,
        size: "1024x1024",
      });
    });
  },

  tick: function () {
    const CONTEXT = this;
    CONTEXT.keyboardValue = keyboard.getAttribute("value");
  },
});
