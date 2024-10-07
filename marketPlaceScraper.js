const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // userDataDir: "./user_data", // Specify the directory path to store user data
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

  if (fs.existsSync(cookiesFilePath)) {
    // Read and set cookies from the specified file
    const cookies = JSON.parse(fs.readFileSync(cookiesFilePath, "utf8"));
    await page.setCookie(...cookies);
  } else {
    console.log(`Cookies file not found at: ${cookiesFilePath}`);
  }

  // Load cookies from JSON file
  const cookies = JSON.parse(fs.readFileSync("cookies.json", "utf8"));

  // Set cookies on the page
  await page.setCookie(...cookies);

  await page.goto("https://www.facebook.com");

  // Type the email address into the email input field from .env
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', process.env.FB_EMAIL); // Use email from .env

  // Find the password input field and type the password from .env
  await page.waitForSelector('input[name="pass"]');
  await page.type('input[name="pass"]', process.env.FB_PASSWORD);
  
  // Find the password input field and type the password
  await page.waitForSelector('input[name="pass"]'); // Wait for the password field to be available
  await page.type('input[name="pass"]', "Sompopo1"); // Type password

  // Press the "Enter" key to submit the login form
  await page.keyboard.press("Enter");

  // Wait for navigation to complete
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  console.log("Login complete.");
  console.log("Facebook opened with existing session.");

  await browser.close();
})();
