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

      // Create loading container element
      const loadingContainer = document.createElement("div");
      loadingContainer.style.position = "fixed";
      loadingContainer.style.top = "10px";
      loadingContainer.style.left = "50%";
      loadingContainer.style.transform = "translateX(-50%)";
      loadingContainer.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent background
      loadingContainer.style.padding = "20px";
      loadingContainer.style.borderRadius = "8px";
      loadingContainer.style.zIndex = "9999";
      loadingContainer.style.color = "#ffffff"; // White text color
      loadingContainer.style.textAlign = "center";
      loadingContainer.id = "loadingContainer";

      // Create loading icon element
      const loadingIcon = document.createElement("div");
      loadingIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="margin: auto; display: block; shape-rendering: auto;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#ffffff" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
        </circle>
        <circle cx="50" cy="50" r="23" stroke-width="8" stroke="#aaaaaa" stroke-dasharray="36.12831551628262 36.12831551628262" stroke-dashoffset="36.12831551628262" fill="none" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;-360 50 50"></animateTransform>
        </circle>
      </svg>`;

      // Create loading message element
      const loadingMessage = document.createElement("div");
      loadingMessage.innerText = "The voice you are hearing is AI and not human.";
      loadingMessage.style.marginTop = "10px";

      // Create stop button element
      const stopButton = document.createElement("button");
      stopButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/><rect x="9" y="9" width="6" height="6" fill="white"/></svg>`;
      stopButton.style.position = "absolute";
      stopButton.style.top = "10px";
      stopButton.style.right = "10px";
      stopButton.style.backgroundColor = "transparent";
      stopButton.style.border = "none";
      stopButton.style.cursor = "pointer";

      loadingContainer.appendChild(stopButton);
      loadingContainer.appendChild(loadingIcon);
      loadingContainer.appendChild(loadingMessage);
      document.body.appendChild(loadingContainer);

      console.log("Loading icon, message, and stop button added to the page:", loadingContainer);

      const audio = new Audio();

      stopButton.addEventListener("click", () => {
        audio.pause();
        audio.currentTime = 0;
        document.body.removeChild(loadingContainer); // Remove loading icon, message, and stop button
        console.log("Audio stopped and loading container removed.");
      });

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
        audio.src = audioUrl;
        audio.play();
        audio.onended = () => {
          document.body.removeChild(loadingContainer); // Remove loading icon, message, and stop button when audio ends
          console.log("Loading icon, message, and stop button removed after audio ended.");
        };
      })
      .catch(error => {
        document.body.removeChild(loadingContainer);  // Remove loading icon, message, and stop button in case of error
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      });
    });
  }
});
