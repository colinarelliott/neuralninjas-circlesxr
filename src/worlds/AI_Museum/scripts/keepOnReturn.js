AFRAME.registerComponent("keep-keyboard", {
  init: function () {
    let el = this.el;
    const buttonBox = document.querySelector("#button-box");
    const keyboard = buttonBox.querySelector("#keyboard");

    buttonBox.addEventListener("click", () => {
      console.log("Clicked");
      keyboard.setAttribute("super-keyboard", "");
      keyboard.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor;imagePath:./assets/images/; show:true;"
      );
    });
  },
});
