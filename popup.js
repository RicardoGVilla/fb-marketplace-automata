// When the button with ID "testButton" is clicked, open Facebook login page
document.getElementById("testButton").addEventListener("click", () => {
  console.log("Test button clicked!");
  alert("Button clicked!");

  // Open Facebook login page in a new tab
  chrome.tabs.create({ url: "https://www.facebook.com/login" });
});
