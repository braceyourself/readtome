document.getElementById("readPage").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.storage.sync.get("openai_api_key", (data) => {
      const apiKey = data.openai_api_key;
      chrome.tabs.sendMessage(tabs[0].id, { action: "readPage", apiKey: apiKey });
    });
  });
});
