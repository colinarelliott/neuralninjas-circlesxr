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

    const keyboardComponent =
      document.querySelector("#keyboard").components["super-keyboard"];
    const keyboardPastComponent =
      document.querySelector("#keyboardPast").components["super-keyboard"];
    const keyboardFutureComponent =
      document.querySelector("#keyboardFuture").components["super-keyboard"];
    const imageGenerator = document.querySelector("[open-ai-image-gen]")
      .components["open-ai-image-gen"];
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
    keyboardPast.addEventListener("superkeyboardchange", () => {
      //the text changed, update the big prompt text?
    });

    //When the user presses enter on the keyboard, generate an image
    keyboardPast.addEventListener("superkeyboardinput", (data) => {
      //ask open-ai-image-gen to generate an image
      imageGenerator.generateImage({
        prompt: CONTEXT.data.keyboardPastValue,
        n: 1,
        size: "1024x1024",
      });
      //IDK HOW TO GET THE KEYBOARD TO STOP DISSAPEARING! I'M GONNA GO TO BED.
      keyboardPastComponent.data.value = "";
      CONTEXT.data.keyboardPastValue = "";
      keyboardPastComponent.data.show = true;
      keyboardPast.setAttribute("visible", true);
    });
    keyboardFuture.addEventListener("superkeyboardchange", () => {
      //the text changed, update the big prompt text?
    });

    //When the user presses enter on the keyboard, generate an image
    keyboardFuture.addEventListener("superkeyboardinput", (data) => {
      //ask open-ai-image-gen to generate an image
      imageGenerator.generateImage({
        prompt: CONTEXT.data.keyboardFutureValue,
        n: 1,
        size: "1024x1024",
      });
      //IDK HOW TO GET THE KEYBOARD TO STOP DISSAPEARING! I'M GONNA GO TO BED.
      keyboardFutureComponent.data.value = "";
      CONTEXT.data.keyboardFutureValue = "";
      keyboardFutureComponent.data.show = true;
      keyboardFuture.setAttribute("visible", true);
    });
  },

  tick: function () {
    const CONTEXT = this;
    const keyboardComponent =
      document.querySelector("#keyboard").components["super-keyboard"];
    CONTEXT.data.keyboardValue = keyboardComponent.data.value;
    const keyboardPastComponent =
      document.querySelector("#keyboardPast").components["super-keyboard"];
    CONTEXT.data.keyboardPastValue = keyboardPastComponent.data.value;
    const keyboardFutureComponent =
      document.querySelector("#keyboardFuture").components["super-keyboard"];
    CONTEXT.data.keyboardFutureValue = keyboardFutureComponent.data.value;
  },
});
