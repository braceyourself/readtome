chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);

  if (request.action === "readPage" || request.action === "readSelectedText") {
    const inputText = request.action === "readPage" ? document.body.innerText : request.text;
    console.log("Input text:", inputText);

    chrome.storage.sync.get("selected_voice", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error fetching selected_voice:", chrome.runtime.lastError);
        alert("Error fetching selected voice.");
        return;
      }

      const voice = data.selected_voice || "alloy"; // Default to "alloy" if no voice is selected
      console.log("Using voice:", voice);

      if (!request.apiKey) {
        alert("No API key provided. Please set your OpenAI API key in the extension options.");
        return;
      }

      // Create loading icon element
      const loadingIcon = document.createElement("div");
      loadingIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#000" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
        </circle>
        <circle cx="50" cy="50" r="23" stroke-width="8" stroke="#aaa" stroke-dasharray="36.12831551628262 36.12831551628262" stroke-dashoffset="36.12831551628262" fill="none" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;-360 50 50"></animateTransform>
        </circle>
      </svg>`;
      loadingIcon.style.position = "fixed";
      loadingIcon.style.top = "10px";
      loadingIcon.style.right = "10px";
      loadingIcon.style.zIndex = "9999";
      loadingIcon.id = "loadingIcon";
      document.body.appendChild(loadingIcon);
      console.log("Loading icon added to the page:", loadingIcon);

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
      .then(response => {
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        return response.blob();
      })
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
        alert(`Error: ${error.message}`);
      });
    });
  }
});
