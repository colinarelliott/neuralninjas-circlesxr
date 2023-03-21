AFRAME.registerComponent("keep-keyboard", {
  init: function () {
    let el = this.el;
    const keyboard = document.querySelector("#keyboard");
    const keyboardPast = document.querySelector("#keyboardPast");
    const keyboardFuture = document.querySelector("#keyboardFuture");

    el.addEventListener("click", () => {
      console.log("Clicked");
      keyboard.setAttribute("super-keyboard", "");
      keyboard.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor;imagePath:./assets/images/; show:true;"
      );
    });
    el.addEventListener("click", () => {
      console.log("Clicked");
      keyboardPast.setAttribute("super-keyboard", "");
      keyboardPast.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor;imagePath:./assets/images/; show:true;"
      );
    });
    el.addEventListener("click", () => {
      console.log("Clicked");
      keyboardFuture.setAttribute("super-keyboard", "");
      keyboardFuture.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor;imagePath:./assets/images/; show:true;"
      );
    });
  },
});
