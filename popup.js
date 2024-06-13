document.addEventListener("DOMContentLoaded", () => {
  const audioList = document.getElementById("audioList");

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
