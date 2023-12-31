import dotenv from "dotenv";
import inquirer from "inquirer";
import puppeteer from "puppeteer";

dotenv.config();

async function sendEventInvitations() {
  const eventId = await askEventId();
  // eventId = "testevent7079339831931133952";
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const { LINKEDIN_USERNAME, LINKEDIN_PASSWORD } = process.env;


  await page.waitForTimeout(randomNumber());
  // Login to LinkedIn
  console.log("Login to LinkedIn");
  await page.goto("https://www.linkedin.com/login");
  await page.type("#username", LINKEDIN_USERNAME);
  await page.type("#password", LINKEDIN_PASSWORD);
  await Promise.all([
    page.waitForNavigation(),
    page.click(".btn__primary--large"),
  ]);

  // Go to the event page
  await page.waitForTimeout(randomNumber());
  console.log("Going to the event page");
  await page.goto(`https://www.linkedin.com/events/${eventId}/comments/`, {
    timeout: 60000,
  });

  await page.waitForTimeout(randomNumber());
  // Get the "Share" button and click it
  console.log('Clicking on "Share" button');
  await page.waitForSelector(".artdeco-button--primary");
  await page.click(".artdeco-button--primary");

  await page.waitForTimeout(randomNumber());
  // Get the "Invite connections" button and click it
  console.log('Clicking on "Invite connections" button');
  // Wait for the ul element to be visible
  await page.waitForSelector('ul[aria-labelledby="share-on-linkedin"]');
  // Click on the first li element within the ul
  await page.evaluate(() => {
    const ul = document.querySelector(
      'ul[aria-labelledby="share-on-linkedin"]'
    );
    const firstLi = ul.querySelector("li");
    firstLi.click();
  });

  // Wait for the connections dialog to appear
  console.log("Waiting for the connections dialog to appear");
  await page.waitForTimeout(randomNumber());
  await page.waitForSelector(".artdeco-modal__content");

  let connectionsCount = await loadConnections(page);
  if (connectionsCount <= 0) {
    console.log(
      "You should have atleast 1 Connection in you linkedin profile to send event invitation"
    );
    await browser.close();
    return;
  }

  console.log("Select all connections");
  await page.waitForTimeout(randomNumber());
  await page.waitForSelector(".invitee-picker__result-item");
  await page.waitForTimeout(randomNumber());
  await page.click(".invitee-picker__result-item");

  // Click on "Invite x" button
  // Wait for the button element to be visible
  await page.waitForTimeout(randomNumber());
  await page.waitForSelector(".invitee-picker__footer button");
  // Click on the button
  await page.waitForTimeout(randomNumber());
  await page.click(".invitee-picker__footer button");

  // Close the browser
  console.log("Closing the browser");
  await browser.close();
}

async function loadConnections(page, totalConnections = undefined) {
  await page.waitForTimeout(randomNumber());
  await page.waitForSelector(".scaffold-finite-scroll__load-button");
  await page.click(".scaffold-finite-scroll__load-button");

  let connections = await page.$$(".invitee-picker__result-item");
  console.log("CONNECTIONS:::", connections.length);

  if (connections.length == totalConnections) {
    console.log("Total Connections is::", connections.length);
    return connections.length;
  }
  console.log("Inside recursive logic");
  return await loadConnections(page, connections.length);
}

const askEventId = async () => {
  const answers = await inquirer.prompt([
    {
      message: "What is your linkedin Event Id ?",
      name: "eventId",
      type: "string",
    },
  ]);
  console.log(`Linkedin Event Id is:: ${answers.eventId}!`);
  return answers.eventId;
};

// Generate a random number between min and max (inclusive)
const randomNumber = () => Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

sendEventInvitations()
  .then(() => console.log("Event invitations sent successfully!"))
  .catch((error) => console.error("Error sending event invitations:", error));
