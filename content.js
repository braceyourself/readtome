chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readPage" || request.action === "readSelectedText") {
    const inputText = request.action === "readPage" ? document.body.innerText : request.text;
    
    fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${request.apiKey}`
      },
      body: JSON.stringify({
        model: "tts-1",
        input: inputText,
        voice: "alloy"
      })
    })
    .then(response => response.blob())
    .then(blob => {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    })
    .catch(error => console.error("Error:", error));
  }
});
