AFRAME.registerComponent("set-keyboard", {
  schema: {
    keyboardValue: { type: "string", default: "" },
  },

  init: function () {
    const THIS = this;
    //Get keyboard
    const keyboard = document.querySelector("#keyboard");

    //Some addresses for the other child elements of the keyboard if we need to modify them
    //const inputBar = document.querySelector("#keyboard").childNodes[1];
    //const inputBar2 = document.querySelector("#keyboard").childNodes[2];

    console.log(keyboard.childNodes);

    //This function triggers when enter is pressed on the keyboard
    keyboard.addEventListener("superkeyboardinput", () => {
      //code for input send to server
    });
  },

  tick: function () {
    const THIS = this;
    THIS.keyboardValue = keyboard.getAttribute("value");
  },
});
