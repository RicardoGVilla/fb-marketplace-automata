document.getElementById("testButton").addEventListener("click", () => {
  console.log("Test button clicked!");
  alert("Button clicked!");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];

    chrome.tabs.update(
      currentTab.id,
      { url: "https://www.facebook.com/ArteyDecoracionencemento/" },
      function (tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);

            console.log("Page loaded, injecting script...");

            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
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
  });
});

// Function to click '¿Qué estás pensando?' and then the pop-up field, then type the message, and click the new element
function simulateTypingAndClickThinkingField() {
  console.log("Script injected and execution started");

  const message = `*** *¡¡¡HEEEY`;

  // Search for the span with the text '¿Qué estás pensando?' and click it
  const thinkingField = [...document.querySelectorAll("span")].find((span) =>
    span.textContent.includes("¿Qué estás pensando?")
  );

  if (thinkingField) {
    thinkingField.click();
    console.log("Clicked on '¿Qué estás pensando?' field:", thinkingField);

    // Add delay before clicking the pop-up input field
    setTimeout(() => {
      const popUpInput = document.querySelector(
        'div[aria-label="¿Qué estás pensando?"]'
      );

      if (popUpInput) {
        popUpInput.click();
        console.log("Clicked on pop-up input field:", popUpInput);

        // After clicking, start typing the message with a delay for human-like typing
        setTimeout(() => {
          typeLikeHuman(popUpInput, message).then(() => {
            console.log("Message typed. Now clicking the next element...");

            // Click the new target element after typing is complete
            clickNewTargetElement();
          });
        }, 500); // Delay before typing starts
      } else {
        console.log("Pop-up input field not found.");
      }
    }, 1000); // Delay to wait for the pop-up to fully render
  } else {
    console.log("'¿Qué estás pensando?' field not found.");
  }

  // Function to simulate human typing by adding each character with a delay
  async function typeLikeHuman(element, text) {
    for (let i = 0; i < text.length; i++) {
      document.execCommand("insertText", false, text[i]);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the typing speed
    }

    console.log("Typing completed.");
  }

  // Function to click the new target image element
  async function clickNewTargetElement() {
    const imgElement = document.querySelector(
      'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/74AG-EvEtBm.png?_nc_eui2=AeEMLb8vU8hVVQURl12ihKENjLWb3nZ8TcaMtZvednxNxgvbUp_EWpkxCD3alixhknT6weOGZ0PqCNBbIhsvdiop"]'
    );

    if (imgElement) {
      imgElement.click();
      console.log("Clicked on the image element:", imgElement);
    } else {
      console.log("Image element not found.");
    }
  }
}
