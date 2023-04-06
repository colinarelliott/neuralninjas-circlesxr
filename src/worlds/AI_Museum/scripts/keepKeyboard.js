AFRAME.registerComponent("keep-keyboard", {
  init: function () {
    let el = this.el;
    const keyboard = document.querySelector("#keyboard");
    const keyboardPast = document.querySelector("#keyboardPast");
    const keyboardFuture = document.querySelector("#keyboardFuture");

    //listen for a click on the PRESENT keyboard, set the keyboard to show
    el.addEventListener("click", () => {
      keyboard.setAttribute("super-keyboard", "");
      keyboard.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor;imagePath:./assets/images/; show:true;"
      );
    });

    //listen for a click on the PAST keyboard, set the keyboard to show
    el.addEventListener("click", () => {
      keyboardPast.setAttribute("super-keyboard", "");
      keyboardPast.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor;imagePath:./assets/images/; show:true;"
      );
    });

    //listen for a click on the FUTURE keyboard, set the keyboard to show
    el.addEventListener("click", () => {
      keyboardFuture.setAttribute("super-keyboard", "");
      keyboardFuture.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor;imagePath:./assets/images/; show:true;"
      );
    });

    //RESPAWN the keyboard when it is closed
    keyboard.addEventListener("superkeyboardinput", () => {
      keyboard.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor; imagePath:./; value: "
      );
    });
    //RESPAWN the keyboard when it is closed (future)
    keyboardFuture.addEventListener("superkeyboardinput", () => {
      keyboardFuture.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor; imagePath:./; value: "
      );
    });
    //RESPAWN the keyboard when it is closed (past)
    keyboardPast.addEventListener("superkeyboardinput", () => {
      keyboardPast.setAttribute(
        "super-keyboard",
        "hand: #mouseCursor; imagePath:./; value: "
      );
    });
  },
});
