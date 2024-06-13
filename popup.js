document.addEventListener("DOMContentLoaded", () => {
  const voiceSelect = document.getElementById("voiceSelect");
  const audioList = document.getElementById("audioList");

  // Load selected voice from storage
  chrome.storage.sync.get("selected_voice", (data) => {
    if (data.selected_voice) {
      voiceSelect.value = data.selected_voice;
    }
  });

  // Save selected voice to storage
  voiceSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ selected_voice: voiceSelect.value }, () => {
      console.log("Selected voice saved:", voiceSelect.value);
    });
  });

  // Load saved audios from storage
  chrome.storage.sync.get({ savedAudios: [] }, (result) => {
    const savedAudios = result.savedAudios;

    if (savedAudios.length === 0) {
      audioList.innerHTML = "<p>No saved audios found.</p>";
      return;
    }

    audioList.innerHTML = "";
    savedAudios.forEach((audio, index) => {
      const audioItem = document.createElement("div");
      audioItem.className = "audio-item";
      audioItem.innerHTML = `
        <p>Audio ${index + 1} (saved on ${new Date(audio.date).toLocaleString()})</p>
        <audio controls>
          <source src="${audio.url}" type="audio/wav">
          Your browser does not support the audio element.
        </audio>
      `;
      audioList.appendChild(audioItem);
    });
  });
});
