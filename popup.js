document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("selected_voice", (data) => {
    if (data.selected_voice) {
      document.getElementById("voiceSelect").value = data.selected_voice;
    }
  });

  document.getElementById("voiceSelect").addEventListener("change", () => {
    const selectedVoice = document.getElementById("voiceSelect").value;
    chrome.storage.sync.set({ selected_voice: selectedVoice });
  });
});
