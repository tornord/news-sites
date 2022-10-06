chrome.runtime.onInstalled.addListener((details) => {
  console.log("news sites");
  console.log(details);

  let manifest = chrome.runtime.getManifest();
  console.log(manifest);
});

chrome.action.onClicked.addListener((tab) => {
  console("addListener", tab);
  // chrome.scripting.executeScript({
  //   target: {tabId: tab.id},
  //   files: ['content.js']
  // });
});
