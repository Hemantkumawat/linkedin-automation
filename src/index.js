const puppeteer = require("puppeteer");
require("dotenv").config();

async function sendEventInvitations(eventId) {
  if(eventId == undefined){
    eventId = "testevent7079309015771492352";
  }
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const { LINKEDIN_USERNAME, LINKEDIN_PASSWORD } = process.env;

  // Login to LinkedIn
  console.log("Login to LinkedIn")
  await page.goto("https://www.linkedin.com/login");
  await page.type("#username", LINKEDIN_USERNAME);
  await page.type("#password", LINKEDIN_PASSWORD);
  await Promise.all([
    page.waitForNavigation(),
    page.click(".btn__primary--large"),
  ]);

  // Go to the event page
  console.log("Going to the event page");
  await page.goto(`https://www.linkedin.com/events/${eventId}/comments/`, { timeout: 60000 });

  // Get the "Invite connections" button and click it
  console.log("Clicking on \"Invite connections\" button")
  await page.waitForSelector(".artdeco-button--primary", { timeout: 60000 });
  await page.click(".artdeco-button--primary");

  // Wait for the connections dialog to appear
  console.log("Waiting for the connections dialog to appear")
  await page.waitForSelector(".artdeco-modal__content");

  // Get the list of connections
  console.log("Geting the list of connections")
  const connections = await page.$$('[data-control-name="invite_profile"]');
  console.timeLog("Connections List",connections);

  // Iterate through connections and send invitations
  console.log("Iterating through connections and sending invitations...")
  for (let connection of connections) {
    // Click the "Invite" button
    console.log("Clicking the \"Invite\" button")
    await connection.click('[data-control-name="invite"]');

    // Wait for the invitation to be sent
    console.log("Waiting for the invitation to be sent")
    await page.waitForTimeout(500);

    // Close the connection profile dialog
    console.log("Closing the connection profile dialog")
    await page.click(".artdeco-modal__dismiss");

    // Wait for the dialog to close
    console.log("Waiting for the dialog to close")
    await page.waitForTimeout(500);
  }

  // Close the browser
  console.log("Closing the browser")
  await browser.close();
}

sendEventInvitations()
  .then(() => console.log("Event invitations sent successfully!"))
  .catch((error) => console.error("Error sending event invitations:", error));
