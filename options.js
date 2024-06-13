document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("openai_api_key", (data) => {
    document.getElementById("apiKey").value = data.openai_api_key || "";
  });

  document.getElementById("saveKey").addEventListener("click", () => {
    const apiKey = document.getElementById("apiKey").value;
    chrome.storage.sync.set({ openai_api_key: apiKey }, () => {
      alert("API Key saved");
    });
  });
});
