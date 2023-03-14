AFRAME.registerComponent("set-keyboard", {
  schema: {
    keyboardValue: { type: "string", default: "" },
  },

  init: function () {
    //Get keyboard
    const keyboard = document.querySelector("#keyboard");

    //Get input bar
    //const inputBar = document.querySelector("#keyboard").childNodes[1];
    //const inputBar2 = document.querySelector("#keyboard").childNodes[2];

    console.log(keyboard.childNodes);

    //On input event
    keyboard.addEventListener("superkeyboardinput", () => {
      keyboard.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor; imagePath:./; value: "
      );
    });
  },

  tick: function () {
    const THIS = this;
    this.keyboardValue = keyboard.getAttribute("value");
  },
});
