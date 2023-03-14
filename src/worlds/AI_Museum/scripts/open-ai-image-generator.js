// AFRAME.registerComponent("open-ai-image-gen", {
//   schema: {
//     //schema contains data for request so that it's accessible to other components
//     prompt: {
//       type: "string",
//       default: "neural ninja",
//     },
//     n: { type: "number", default: 1 },
//     size: { type: "string", default: "1024x1024" },
//   },
//   init: function () {
//     //initialize context and get nodes
//     const CONTEXT = this;
//     CONTEXT.button = document.querySelector("#button");
//     CONTEXT.image = document.querySelector("#image-display");
//     CONTEXT.alertText = document.querySelector("#alert-text");

//     CONTEXT.el.addEventListener("click", function () {
//       console.log(document.querySelector("#image-display"));
//       CONTEXT.alertText.setAttribute("text", "value: Generating Image...");
//       setTimeout(() => {
//         CONTEXT.alertText.setAttribute("text", "value: Loading Image...");
//       }, 10000);
//       setTimeout(() => {
//         CONTEXT.alertText.setAttribute("text", "value: Image Loaded.");
//       }, 12500);

//       let responseData = {};
//       fetch("https://api.openai.com/v1/images/generations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Origin": true,
//           "Access-Control-Allow-Origin": "http://localhost:8080/",
//           Authorization: `Bearer `,
//         },
//         body: JSON.stringify({
//           prompt: CONTEXT.data.prompt,
//           n: CONTEXT.data.n,
//           size: CONTEXT.data.size,
//         }),
//       })
//         .then((response) => response.json())
//         .then((data) => (responseData = data));

//       setTimeout(() => {
//         if (CONTEXT.image && CONTEXT.image.parentNode) {
//           CONTEXT.image.parentNode.removeChild(CONTEXT.image);
//         }

//         let imageUrl = responseData.data[0].url;
//         let corsPrefix = "https://murmuring-falls-73541.herokuapp.com/";
//         corsPrefix += imageUrl;

//         let entity = document.createElement("a-entity");
//         entity.setAttribute("id", "image-display");
//         entity.setAttribute("geometry", "geometry", {
//           primitive: "BOX",
//           width: 1.1,
//           height: 1.1,
//           depth: 0.01,
//         });

//         entity.setAttribute("material", {
//           src: corsPrefix,
//         });
//         entity.setAttribute("position", "0 0 0.08");
//         entity.setAttribute("scale", "1 1 0.020");
//         entity.setAttribute("src", corsPrefix);
//         document.querySelector("#image-frame").appendChild(entity);
//       }, 10000);
//     });
//   },
// });
AFRAME.registerComponent("open-ai-image-gen", {
  schema: {
    prompt: {
      type: "string",
      default: "salvador dali typing on a mechanical keyboard",
    },
    n: { type: "number", default: 1 },
    size: { type: "string", default: "1024x1024" },
  },
  init: function () {
    const CONTEXT = this;
    CONTEXT.button = document.querySelector("#button");
    const keyboard = document.querySelector("#keyboard");
    CONTEXT.image = document.querySelector("#screenPresent");

    // CONTEXT.el.addEventListener("click", function () {
    keyboard.addEventListener("superkeyboardinput", function (event) {
      /**
             * 
             * id="image-display"
					geometry="primitive: plane; width: 1; height: 1"
					material="src: #image"
					position="0 0 0.08"
					rotation="0 0 0"
					scale="1 1 1"
             */

      let responseData = {};

      CONTEXT.data.prompt = event.detail.value;

      fetch(
        "https://api.openai.com/v1/images/generations",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Origin": true,
            "Access-Control-Allow-Origin": "http://localhost:8080/",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            prompt: CONTEXT.data.prompt,
            n: CONTEXT.data.n,
            size: CONTEXT.data.size,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => (responseData = data));
      setTimeout(() => {
        if (CONTEXT.image && CONTEXT.image.parentNode) {
          CONTEXT.image.parentNode.removeChild(CONTEXT.image);
        }

        let imageUrl = responseData.data[0].url;
        console.log(imageUrl);
        let corsPrefix = "https://murmuring-falls-73541.herokuapp.com/";
        corsPrefix += imageUrl;

        console.log(corsPrefix);
        /**
         *      id="screenPresent"
          geometry="primitive: plane; width: 1.6; height: 0.9;"
          material="src: #screensaver"
          position="0 1.9 -1.4"
          scale="1.1 1.1 1.1"
         */
      }, 10000);
    });
  },
});
