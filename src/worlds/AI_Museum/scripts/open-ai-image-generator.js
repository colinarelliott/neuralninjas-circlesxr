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
    CONTEXT.generateImage = CONTEXT.generateImage.bind(CONTEXT);
    CONTEXT.screenPast = document.querySelector("#screenPast");
    CONTEXT.screenPresent = document.querySelector("#screenPresent");
    CONTEXT.screenFuture = document.querySelector("#screenFuture");
    CONTEXT.generateImage(CONTEXT.data); //generates the ninja image at the beginning. can be removed later!
  },

  generateImage: function (data) {
    let imageUrl = "";
    let herokuUrl = "https://murmuring-falls-73541.herokuapp.com/"
    const hostname = window.location.origin;
    const CONTEXT = this;

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
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    //just in case we want to download it...
    async function downloadImage(imageSrc) {
      const image = await fetch(imageSrc);
      const imageBlog = await image.blob();
      const imageURL = URL.createObjectURL(imageBlog);
    
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    //spawn a new entity with the loading circle video on it and then remove it when the image is loaded
    const loadingCircle = document.createElement("a-video");
    loadingCircle.setAttribute("src", "#loading-circle");
    loadingCircle.setAttribute("position", "0 1.9 -1.4");
    loadingCircle.setAttribute("width", "1.6");
    loadingCircle.setAttribute("height", "0.9");
    loadingCircle.setAttribute("rotation", "0 0 0");
    loadingCircle.setAttribute("scale", "1.12 1.12 1.12");
    loadingCircle.setAttribute("id", "loadingCircle");
    document.querySelector("a-scene").appendChild(loadingCircle);

    setTimeout(() => {
      //set the image on the screens
      CONTEXT.screenPast.setAttribute("material", "src: "+ herokuUrl+imageUrl);
      CONTEXT.screenPresent.setAttribute("material", "src: "+ herokuUrl+imageUrl);
      CONTEXT.screenFuture.setAttribute("material", "src: "+ herokuUrl+imageUrl);
    }, 10000);

    setTimeout(() => {
      //remove the loading circle
      document.querySelector("#loadingCircle").remove();
    }, 11000);
  },
});

