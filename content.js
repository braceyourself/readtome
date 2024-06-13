chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readPage") {
    const textContent = document.body.innerText;
    fetch("https://api.openai.com/v1/engines/whisper-1/transcriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${request.apiKey}`
      },
      body: JSON.stringify({ text: textContent })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert("Whisper AI says: " + data.transcription);
    })
    .catch(error => console.error("Error:", error));
  } else if (request.action === "readSelectedText") {
    fetch("https://api.openai.com/v1/engines/whisper-1/transcriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${request.apiKey}`
      },
      body: JSON.stringify({ text: request.text })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const utterance = new SpeechSynthesisUtterance(data.transcription);
      speechSynthesis.speak(utterance);
    })
    .catch(error => console.error("Error:", error));
  }
});
