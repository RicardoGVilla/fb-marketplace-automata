chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "https://www.facebook.com/login" });
});
