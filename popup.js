document.getElementById("testButton").addEventListener("click", () => {
  console.log("Test button clicked!");
  alert("Button clicked!");

  // Get the current active tab and update its URL to the Facebook Marketplace Create Item page
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    chrome.tabs.update(
      currentTab.id,
      { url: "https://www.facebook.com/marketplace/create/item" },
      function (tab) {
        console.log("Updated current tab with ID:", tab.id);

        // Ensure the page is fully loaded before injecting the script
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener); // Remove listener after the script is injected

            // After the tab URL is updated, inject the script to simulate the Tab and Enter key presses
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: tabAndEnterActions,
              },
              (results) => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Injection failed: ",
                    chrome.runtime.lastError.message
                  );
                } else {
                  console.log("Injection succeeded", results);
                }
              }
            );
          }
        });
      }
    );
  });
});

function tabAndEnterActions() {
  console.log("Script injected into the page context");

  // Check when the document is fully loaded
  const checkReadyState = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(checkReadyState); // Stop checking once the page is ready
      console.log("Page fully loaded, simulating tab and enter");

      // Simulate Tab key presses
      function simulateTabPress() {
        const event = new KeyboardEvent("keydown", {
          key: "Tab",
          keyCode: 9,
          which: 9,
          bubbles: true,
        });

        for (let i = 0; i < 11; i++) {
          document.dispatchEvent(event);
        }
      }

      // Define and Simulate Enter key press
      function simulateEnterPress() {
        console.log(
          "Focused element before Enter press:",
          document.activeElement
        );

        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
        });

        document.dispatchEvent(enterEvent);
        console.log("Enter key press simulated");
      }

      simulateTabPress();
      setTimeout(simulateEnterPress, 500); // Adjust delay as needed
    }
  }, 100); // Check every 100ms if the page is fully loaded
}

// Injection part remains the same
document.getElementById("testButton").addEventListener("click", () => {
  console.log("Test button clicked!");
  alert("Button clicked!");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    chrome.tabs.update(
      currentTab.id,
      { url: "https://www.facebook.com/marketplace/create/item" },
      function (tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: tabAndEnterActions,
              },
              (results) => {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Injection failed: ",
                    chrome.runtime.lastError.message
                  );
                } else {
                  console.log("Injection succeeded", results);
                }
              }
            );
          }
        });
      }
    );
  });
});
