AFRAME.registerComponent("set-keyboard", {
  init: function () {
    var currentElement = this.el;

    const keyboard = document.querySelector("#keyboard");

    currentElement.addEventListener("click", () => {
      keyboard.setAttribute("super-keyboard", "");
      keyboard.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor; imagePath:../dist/; show:true;"
      );
    });

    keyboard.addEventListener("superkeyboardinput", () => {
      keyboard.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor; imagePath:./; value: "
      );
    });
  },
});
