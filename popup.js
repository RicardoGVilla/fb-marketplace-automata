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
                func: simulateTypingAndClickAddPhotos,
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



// Function to type 'Mesa Barata' and click on the 'Add photos' button
function simulateTypingAndClickAddPhotos() {
  console.log("Script injected and execution started");

  // Try to focus the specific input field based on its 'type' attribute
  const targetInput = document.querySelector('input[type="text"]'); // Adjust selector if needed
  if (targetInput) {
    targetInput.focus();
    console.log("Target input field focused:", targetInput);

    // Type 'Dining Table' in the input field
    targetInput.value = "Dining Table";

    // Trigger an input event to simulate real typing
    const inputEvent = new Event("input", { bubbles: true });
    targetInput.dispatchEvent(inputEvent);

    console.log("Typed 'Dining Table' in the input field");

    // Now, click the 'Add photos' button based on the selector
    const addPhotosButton = document.querySelector(
      'div[role="button"] span:contains("Add photos")'
    );
    if (addPhotosButton) {
      addPhotosButton.click();
      console.log("Clicked on 'Add photos' button");
    } else {
      console.log("Add photos button not found.");
    }

    // Simulate Enter key press (if needed)
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
