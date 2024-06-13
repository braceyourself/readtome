chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");

  chrome.contextMenus.create({
    id: "readSelectedText",
    title: "Read Selected Text with Whisper AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readSelectedText") {
    chrome.storage.sync.get("openai_api_key", (data) => {
      const apiKey = data.openai_api_key;
      console.log("Sending message to tab with API key:", apiKey);
      chrome.tabs.sendMessage(tab.id, { action: "readSelectedText", text: info.selectionText, apiKey: apiKey });
    });
  }
});
