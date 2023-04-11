AFRAME.registerComponent("open-ai-image-gen", {
  schema: {
    //schema contains data for request so that it's accessible to other components
    prompt: {
      type: "string",
      default: "neural ninja",
    },
    n: { type: "number", default: 1 },
    size: { type: "string", default: "1024x1024" },
  },

  init: function () {
    //initialize context and get nodes
    const CONTEXT = this;
    const networkManager = document.querySelector("#experience-manager").components["network-manager"];

    CONTEXT.updateImageGenerators = CONTEXT.updateImageGenerators.bind(CONTEXT);
    CONTEXT.generateImage = CONTEXT.generateImage.bind(CONTEXT);
    CONTEXT.imageGenerating = CONTEXT.imageGenerating.bind(CONTEXT);
    CONTEXT.imageUpdated = CONTEXT.imageUpdated.bind(CONTEXT);

    CONTEXT.screenPast = document.querySelector("#screenPast");
    CONTEXT.screenPresent = document.querySelector("#screenPresent");
    CONTEXT.screenFuture = document.querySelector("#screenFuture");

    setInterval(function () {
      CONTEXT.updateImageGenerators();
    }, 50);
  },

  updateImageGenerators: function () {
    const CONTEXT = this;
    const networkManager = document.querySelector("#experience-manager").components["network-manager"];

    if (networkManager.data.imageGenerating === true) {
      setTimeout(function () {
          networkManager.sendUpdate( {
            data: {
              imageGenerating: false,
            }
          });
          //one for each screen
          CONTEXT.imageGenerating(0, 1.9, -1.4);
          CONTEXT.imageGenerating(-50, 1.9, -1.4);
          CONTEXT.imageGenerating(50, 1.9, -1.4);
      }, 200); // a little delay to make everyone sees it turn true
    }

    if (networkManager.data.imageUpdated === true) {
      setTimeout(function () {
          networkManager.sendUpdate( {
            data: {
              imageUpdated: false,
            }
          });
          CONTEXT.imageUpdated(networkManager.data.imageUrl);
      }, 200); // a little delay to make everyone sees it turn true
    }

    if (networkManager.data.imageUrl !== "") {
      CONTEXT.imageUpdated(networkManager.data.imageUrl);
    }
  },

  generateImage: function (data) {
    const networkManager = document.querySelector("#experience-manager").components["network-manager"];
    let imageUrl = "";
    const hostname = window.location.origin;
    const CONTEXT = this;

    networkManager.sendUpdate( {
      data: {
        imageGenerating: true,
      }
    });

    fetch(hostname+"/ai_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify( {
        prompt: data.prompt,
        n: data.n,
        size: data.size
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      imageUrl = data.url;
      const networkManager = document.querySelector("#experience-manager").components["network-manager"];
      setTimeout(function () {
        networkManager.sendUpdate( {
          data: {
            imageUrl: imageUrl,
            imageUpdated: true
          }
          
        });
      }, 200); // a little delay to make everyone sees it turn true
      CONTEXT.imageUpdated(imageUrl);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    CONTEXT.imageGenerating(0, 1.9, -1.4);
    CONTEXT.imageGenerating(-50, 1.9, -1.4);
    CONTEXT.imageGenerating(50, 1.9, -1.4);
  },

  imageGenerating: function (x, y, z) {
    const CONTEXT = this;
    //the image is getting generated, so we need to show the loading circle

    //spawn a new entity with the loading circle video on it and then remove it when the image is loaded
    const loadingCircle = document.createElement("a-video");
    loadingCircle.setAttribute("src", "#loading-circle");
    loadingCircle.setAttribute("position", {x, y, z});
    loadingCircle.setAttribute("width", "1.6");
    loadingCircle.setAttribute("height", "0.9");
    loadingCircle.setAttribute("rotation", "0 0 0");
    loadingCircle.setAttribute("scale", "1.12 1.12 1.12");
    loadingCircle.setAttribute("id", "loadingCircle");
    document.querySelector("a-scene").appendChild(loadingCircle);

  },

  imageUpdated: function (imageUrl) {
    const CONTEXT = this;
    //the image is updated, so we need to remove the loading circle
    if (document.querySelector("#loadingCircle") !== null) {
      document.querySelector("#loadingCircle").remove();
    }

    let herokuUrl = "https://murmuring-falls-73541.herokuapp.com/"

    //set the image on the screens
    CONTEXT.screenPast.setAttribute("material", "src: "+ herokuUrl+imageUrl);
    CONTEXT.screenPresent.setAttribute("material", "src: "+ herokuUrl+imageUrl);
    CONTEXT.screenFuture.setAttribute("material", "src: "+ herokuUrl+imageUrl);
  },
});

