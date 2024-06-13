chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);

  if (request.action === "readPage" || request.action === "readSelectedText") {
    const inputText = request.action === "readPage" ? document.body.innerText : request.text;
    console.log("Input text:", inputText);

    chrome.storage.sync.get("selected_voice", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching selected_voice:", chrome.runtime.lastError);
        return;
      }

      const voice = data.selected_voice || "alloy"; // Default to "alloy" if no voice is selected
      console.log("Using voice:", voice);

      // Create loading icon element
      const loadingIcon = document.createElement("img");
      loadingIcon.src = chrome.runtime.getURL("icons/loading.gif");  // Ensure loading.gif is in the icons directory
      loadingIcon.style.position = "fixed";
      loadingIcon.style.top = "10px";
      loadingIcon.style.right = "10px";
      loadingIcon.style.zIndex = "9999";
      loadingIcon.id = "loadingIcon";
      document.body.appendChild(loadingIcon);
      console.log("Loading icon added to the page.");

      fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${request.apiKey}`
        },
        body: JSON.stringify({
          model: "tts-1",
          input: inputText,
          voice: voice
        })
      })
      .then(response => response.blob())
      .then(blob => {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          document.body.removeChild(loadingIcon); // Remove loading icon when audio ends
          console.log("Loading icon removed after audio ended.");
        };
      })
      .catch(error => {
        document.body.removeChild(loadingIcon);  // Remove loading icon in case of error
        console.error("Error:", error);
      });
    });
  }
});
