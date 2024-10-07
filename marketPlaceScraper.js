const puppeteer = require("puppeteer");
const fs = require("fs");
require("dotenv").config();



(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-notifications",
      "--disable-session-crashed-bubble",
    ],
  });

  const page = await browser.newPage();

  // Load cookies from the environment-specified file path
  const cookiesFilePath = process.env.COOKIES_PATH;
  console.log(`Cookies file path: ${cookiesFilePath}`);

  if (fs.existsSync(cookiesFilePath)) {
    // Read and set cookies from the specified file
    const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
    await page.setCookie(...cookies);
  } else {
    console.log(`Cookies file not found at: ${cookiesFilePath}`);
  }

  // Load cookies from JSON file
  const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));

  await page.setCookie(...cookies);

  // Navigate to the specific Facebook page
  await page.goto("https://www.facebook.com/ArteyDecoracionencemento", {
    waitUntil: "networkidle2", // Wait until the page fully loads
  });

  // Check if we're on the login page by waiting for the email input field
  const loginSelector = 'input[name="email"]';

  let isLoginPage;
  try {
    // Try to find the email input field
    await page.waitForSelector(loginSelector, { timeout: 5000 });
    isLoginPage = true; // If we find the email input, we're on the login page
  } catch (e) {
    isLoginPage = false; // If we don't find it, we're already logged in
  }

  if (isLoginPage) {
    console.log("Login page detected, performing login steps...");

    // Type the email address into the email input field from .env
    await page.type('input[name="email"]', process.env.FB_EMAIL); // Use email from .env

    // Find the password input field and type the password from .env
    await page.waitForSelector('input[name="pass"]');
    await page.type('input[name="pass"]', process.env.FB_PASSWORD);

    // Press the "Enter" key to submit the login form
    await page.keyboard.press("Enter");

    // Wait for navigation to complete after login
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    console.log("Login complete.");
  } else {
    console.log(
      "Already logged in or not on the login page. Skipping login steps."
    );
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Search for the span with the text '¿Qué estás pensando?' and click it
  const wasClicked = await page.evaluate(() => {
    const thinkingField = [...document.querySelectorAll("span")].find((span) =>
      span.textContent.includes("¿Qué estás pensando?")
    );
    if (thinkingField) {
      thinkingField.click();
      return true; // Return true if the element was found and clicked
    } else {
      return false; // Return false if the element wasn't found
    }
  });

  if (wasClicked) {
    console.log("Successfully clicked the '¿Qué estás pensando?' element.");
  } else {
    console.log("Element '¿Qué estás pensando?' not found.");
  }

  // // Second click: Target the 'Agregar fotos/videos' div
  // const secondClickSelector =
  //   "div.x1n2onr6.x1ja2u2z.x9f619.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x5yr21d";
  // await page.waitForSelector(secondClickSelector);
  // await page.click(secondClickSelector);
  // console.log("Clicked on 'Agregar fotos/videos'.");

  console.log("Facebook opened and actions completed with existing session.");

  // Close the browser
  await browser.close();
})();
