const puppeteer = require("puppeteer");
require("dotenv").config();

async function sendEventInvitations() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const { LINKEDIN_USERNAME, LINKEDIN_PASSWORD } = process.env;
  // Login to LinkedIn
  await page.goto("https://www.linkedin.com/login");
  await page.type("#username", LINKEDIN_USERNAME); // Replace with your LinkedIn username
  await page.type("#password", LINKEDIN_PASSWORD); // Replace with your LinkedIn password
  await Promise.all([
    page.waitForNavigation(),
    page.click(".btn__primary--large"),
  ]);

  // Go to the event page
  await page.goto("https://www.linkedin.com/events/your-event-url"); // Replace with the URL of your event

  // Get the "Invite connections" button and click it
  await page.waitForSelector(".artdeco-button--primary");
  await page.click(".artdeco-button--primary");

  // Wait for the connections dialog to appear
  await page.waitForSelector(".artdeco-modal__content");

  // Get the list of connections
  const connections = await page.$$('[data-control-name="invite_profile"]');

  // Iterate through connections and send invitations
  for (let connection of connections) {
    // Click the "Invite" button
    await connection.click('[data-control-name="invite"]');

    // Wait for the invitation to be sent
    await page.waitForTimeout(500);

    // Close the connection profile dialog
    await page.click(".artdeco-modal__dismiss");

    // Wait for the dialog to close
    await page.waitForTimeout(500);
  }

  // Close the browser
  await browser.close();
}

sendEventInvitations()
  .then(() => console.log("Event invitations sent successfully!"))
  .catch((error) => console.error("Error sending event invitations:", error));
