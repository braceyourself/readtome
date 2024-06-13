chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readPage" || request.action === "readSelectedText") {
    const inputText = request.action === "readPage" ? document.body.innerText : request.text;
    
    // Create loading icon element
    const loadingIcon = document.createElement("img");
    loadingIcon.src = chrome.runtime.getURL("icons/loading.gif");  // Make sure you have loading.gif in the icons directory
    loadingIcon.style.position = "fixed";
    loadingIcon.style.top = "10px";
    loadingIcon.style.right = "10px";
    loadingIcon.style.zIndex = "9999";
    document.body.appendChild(loadingIcon);

    fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${request.apiKey}`
      },
      body: JSON.stringify({
        model: "tts-1",
        input: inputText,
        voice: request.voice
      })
    })
    .then(response => response.blob())
    .then(blob => {
      document.body.removeChild(loadingIcon);  // Remove loading icon
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    })
    .catch(error => {
      document.body.removeChild(loadingIcon);  // Remove loading icon in case of error
      console.error("Error:", error);
    });
  }
});
