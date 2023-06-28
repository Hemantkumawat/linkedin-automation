# linkedin-automation
inviting linkedin connections for event. script to automate inviting Linkedin connections to an event. using Node.js and puppeteer

## Steps to run this project
1. Take clone from `https://github.com/Hemantkumawat/linkedin-automation.git`. 
2. Go to Project Directory.
3. open terminal into root project directory.
4. run `npm install`.
5. Create new `.env` file by copy of `example.env` file.
6. Add Linkedin username and password into `.env` file
7. Go to Your linked in account in browser/mobile app.
8. Create new Event and make post for that.
9. Copy Linkedin Event Id from Browser URL.E.g: `https://www.linkedin.com/events/${eventId}/comments/`. => eventId.
10. Got to terminal of project.
11. run `npm run start`
12. In terminal there will be prompt for "What is your linkedin Event Id ?". here provide eventId that you copied erlear. and click Enter.
13. In within few seconds browser will open and invitations will be sent automatically to your connections for provided event.

### Thanks

