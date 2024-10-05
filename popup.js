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
                  func: simulateClicks,
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
function simulateClicks() {
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

  // First click: Select the first div with 'Foto/video' text
  const firstDivSelector =
    "div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x5yr21d";

  setTimeout(() => {
    const firstDiv = document.querySelector(firstDivSelector);

    if (!firstDiv) {
      console.log("First div not found. Aborting...");
      console.log("Current DOM structure:");
      console.log(document.body.innerHTML); // Logs the current DOM for debugging
      return;
    }

    console.log("First div found:", !!firstDiv);
    firstDiv.click();
    console.log("Clicked on the first div:", firstDiv);

    // After clicking the first div, wait and then click the 'Agregar fotos/videos' span
    setTimeout(() => {
      // XPath for the 'Agregar fotos/videos' span based on its text
      const agregarFotosVideosXPath = "//span[text()='Agregar fotos/videos']";
      const agregarFotosVideosSpan = document.evaluate(
        agregarFotosVideosXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (!agregarFotosVideosSpan) {
        console.log("'Agregar fotos/videos' span not found. Aborting...");
        console.log("Current DOM structure:");
        console.log(document.body.innerHTML); // Logs the current DOM for debugging
        return;
      }

      // Scroll the element into view to ensure it's clickable
      agregarFotosVideosSpan.scrollIntoView();

      // Ensure the element is visible and then click it
      const isVisible =
        agregarFotosVideosSpan.offsetWidth > 0 &&
        agregarFotosVideosSpan.offsetHeight > 0;

      console.log("Is 'Agregar fotos/videos' visible:", isVisible);

      if (isVisible) {
        try {
          // Focus on the element before simulating a full click
          agregarFotosVideosSpan.focus();

          // Simulate a full mouse click (mousedown, mouseup, click)
          simulateFullClick(agregarFotosVideosSpan);
          console.log(
            "Simulated full click on the 'Agregar fotos/videos' span."
          );
        } catch (err) {
          console.error("Error clicking on 'Agregar fotos/videos' span:", err);
        }
      } else {
        console.log("'Agregar fotos/videos' span is not visible or clickable.");
      }
    }, 2000); // Delay before clicking 'Agregar fotos/videos' span
  }, 1000); // Delay before interacting with the first div
}
