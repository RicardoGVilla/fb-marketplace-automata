document.getElementById("testButton").addEventListener("click", () => {
  console.log("Test button clicked!");
  alert("Button clicked!");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];

    if (currentTab && currentTab.id) {
      console.log(
        "Navigating to https://www.facebook.com/ArteyDecoracionencemento/"
      );

      // Update the tab to navigate to the target Facebook page
      chrome.tabs.update(
        currentTab.id,
        { url: "https://www.facebook.com/ArteyDecoracionencemento/" },
        function (tab) {
          // Wait for the page to load completely before injecting the script
          chrome.tabs.onUpdated.addListener(function listener(
            tabId,
            changeInfo
          ) {
            if (tabId === currentTab.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);

              console.log("Page loaded, injecting script...");

              // Inject the script to interact with elements on the page
              chrome.scripting.executeScript(
                {
                  target: { tabId: currentTab.id },
                  func: simulateTypingAndClickThinkingField,
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
    } else {
      console.error("No active tab found.");
    }
  });
});

// Function to interact with specific elements and simulate actions with delays
function simulateTypingAndClickThinkingField() {
  console.log("Script injected and execution started");

  // Define the simulateFullClick function here
  function simulateFullClick(element) {
    const mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    const mouseUpEvent = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    const clickEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    // Dispatch the events in order
    element.dispatchEvent(mouseDownEvent);
    element.dispatchEvent(mouseUpEvent);
    element.dispatchEvent(clickEvent);

    console.log("Simulated full click on element");
  }

  // First click: Select and click the first div with 'Foto/video' text
  const firstDivSelector =
    "div.x6s0dn4.x78zum5.xl56j7k.x1rfph6h.x6ikm8r.x10wlt62";

  // Second click: Replace this with the new element
  const secondClickSelector =
    "div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x5yr21d";

  setTimeout(() => {
    const firstDiv = document.querySelector(firstDivSelector);

    if (!firstDiv) {
      console.log("First div not found. Aborting...");
      return;
    }

    console.log("First div found:", !!firstDiv);
    firstDiv.click();
    console.log("Clicked on the first div:", firstDiv);

    setTimeout(() => {
      const secondElement = document.querySelector(secondClickSelector);

      if (!secondElement) {
        console.log("Second element not found. Aborting...");
        return;
      }

      // Scroll the element into view to ensure it's clickable
      secondElement.scrollIntoView();

      // Ensure the element is visible and then click it
      const isVisible =
        secondElement.offsetWidth > 0 && secondElement.offsetHeight > 0;

      console.log("Is second element visible:", isVisible);

      if (isVisible) {
        try {
          // Focus on the element before simulating a full click
          secondElement.focus();

          // Simulate a full mouse click (mousedown, mouseup, click)
          simulateFullClick(secondElement);
          console.log("Simulated full click on the second element.");
        } catch (err) {
          console.error("Error clicking on the second element:", err);
        }
      } else {
        console.log("Second element is not visible or clickable.");
      }
    }, 2000); // Delay before clicking the second element
  }, 1000); // Delay to ensure page elements have loaded
}
