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

            console.log("Page loaded, injecting script...");

            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: simulateTypingAndEnter,
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

// Function to type 'Mesa Barata' and press Enter
function simulateTypingAndEnter() {
  console.log("Script injected and execution started");

  // Try to focus the specific input field based on its 'type' attribute
  const targetInput = document.querySelector('input[type="text"]'); // Adjust selector if needed
  if (targetInput) {
    targetInput.focus();
    console.log("Target input field focused:", targetInput);

    // Type 'Mesa Barata' in the input field
    targetInput.value = "Mesa Barata";

    // Trigger an input event to simulate real typing
    const inputEvent = new Event("input", { bubbles: true });
    targetInput.dispatchEvent(inputEvent);

    console.log("Typed 'Mesa Barata' in the input field");

    // Simulate Enter key press
    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
    });
    document.dispatchEvent(enterEvent);
    console.log("Enter key press dispatched");
  } else {
    console.log("No input field found to focus.");
  }
}