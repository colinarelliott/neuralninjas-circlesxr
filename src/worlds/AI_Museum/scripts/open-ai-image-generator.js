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

    /*
    CONTEXT.alertText.setAttribute("text", "value: Generating Image...");
    setTimeout(() => {
      CONTEXT.alertText.setAttribute("text", "value: Loading Image...");
    }, 10000);
    setTimeout(() => {
      CONTEXT.alertText.setAttribute("text", "value: Image Loaded.");
    }, 12500); 
    COMMENTED THIS OUT FOR NOW, ADD BACK LATER*/




/* OLD CODE

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
      }, 10000);
    });
  },
});
         
*/