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

// Function to click '¿Qué estás pensando?' and then the pop-up field, then type the message
function simulateTypingAndClickThinkingField() {
  console.log("Script injected and execution started");

  const message = `*** *¡¡¡HEEEY REDUCCIONNN DE PRECIOOO!!!* ***
  PARA QUE PUEDAS ADORNAR Y DAR UN AMBIENTE PLACENTERO A TU JARDIN EN ESTA NAVIDAD!!!
  JUEGO DE MESA DE CEMENTO CON 3 BANCAS CURVAS, ENCHAPADO CON CERÁMICA 2 O 3 COLORES. 
  MESA--1.10 M DIÁMETRO 
  BANCAS-- 1.20 M  X 0.45 M ALTO X 0.40 M ANCHO.
  ****NUEVO PRECIO CON CERAMICA****:
  ($$259.99!!!!!!))
  SIN CERÁMICA:
  (($$240.00!!!))
  ( PRECIOS SI DESEA IVA , SERIA + IVA!!) 
  *PREGUNTE POR PRECIO DE SOMBRILLA SI DESEA.*
  ¡¡¡¡¡ACEPTAMOS PAGOS CON TARJETA 3% ADICIONAL. !!!!!!`;

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
            console.log("Message typed. Now clicking on the image link...");

            // click the image after the text is typed
            clickOnImage();
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

  // Function to add images
  function clickOnImage() {
    const imgElement = document.querySelector(
      'img[src="https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/74AG-EvEtBm.png?_nc_eui2=AeEMLb8vU8hVVQURl12ihKENjLWb3nZ8TcaMtZvednxNxgvbUp_EWpkxCD3alixhknT6weOGZ0PqCNBbIhsvdiop"]'
    );

    if (imgElement) {
      imgElement.click();
      console.log("Clicked on the image link:", imgElement);
    } else {
      console.log("Image link not found.");
    }
  }
}
