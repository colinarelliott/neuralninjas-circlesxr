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
    CONTEXT.generateImage(CONTEXT.data);
  },

  generateImage: function (data) {
    let imageUrl = "";
    let herokuUrl = "https://murmuring-falls-73541.herokuapp.com/"
    const hostname = "https://c89e-174-89-124-148.ngrok.io"
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

    //downloadImage(imageUrl);

    setTimeout(() => {
      CONTEXT.screenPast.setAttribute("material", "src: "+ herokuUrl+imageUrl);
      CONTEXT.screenPresent.setAttribute("material", "src: "+ herokuUrl+imageUrl);
      CONTEXT.screenFuture.setAttribute("material", "src: "+ herokuUrl+imageUrl);
    }, 10000);
  },
});