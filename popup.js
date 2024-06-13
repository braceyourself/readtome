document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["openai_api_key", "selected_voice"], (data) => {
    if (data.selected_voice) {
      document.getElementById("voiceSelect").value = data.selected_voice;
    }
  });

  document.getElementById("voiceSelect").addEventListener("change", () => {
    const selectedVoice = document.getElementById("voiceSelect").value;
    chrome.storage.sync.set({ selected_voice: selectedVoice });
  });

  document.getElementById("readPage").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.storage.sync.get(["openai_api_key", "selected_voice"], (data) => {
        const apiKey = data.openai_api_key;
        const voice = data.selected_voice || "alloy";
        chrome.tabs.sendMessage(tabs[0].id, { action: "readPage", apiKey: apiKey, voice: voice });
      });
    });
  });
});
