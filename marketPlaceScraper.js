const puppeteer = require("puppeteer");

(async () => {
  // Launch Google Chrome instead of the default Chromium
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", 
    headless: false, // Ensure it's not headless so you can see the browser
    defaultViewport: null, // Adjust viewport for better visibility
    args: ["--start-maximized"], // Start browser maximized
  });

  const page = await browser.newPage();

  // Navigate to the desired Facebook page
  await page.goto("https://www.facebook.com/ArteyDecoracionencemento/", {
    waitUntil: "networkidle2",
  });

  // Wait for the input field to be available and type into it
  await page.waitForSelector('input[placeholder="¿Qué estás pensando?"]', {
    visible: true,
  });
  await page.click('input[placeholder="¿Qué estás pensando?"]');

  // Type "test" into the input field
  await page.type('input[placeholder="¿Qué estás pensando?"]', "test");

  // Wait for some time to observe the changes (optional)
  await page.waitForTimeout(6000);

  await browser.close(); // Close the browser once done
})();
