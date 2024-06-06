# Interview Task 2 - Web Server and Website

## Your Task

Create a web server and website with some basic functionality. This task should take under an hour to complete.

## Requirements

### Root Endpoint ("/")

- The website should have one web page accessible at the root endpoint.
- This page should display a number count and a button.
- The count should start at 0 and persist across page reloads.
- The button should increment the count by one.

### Increment Endpoint ("/increment")

- The website should have a POST route on the "/increment" endpoint.
- This route should increment the count by a value passed in the body of the request.
- It should then return the new count.
- This route should be used by the button to increment the count.
- This route should validate the body and return an error when the body is invalid.

### Count Endpoint ("/count")

- The website should have a GET route on the "/count" endpoint.
- This route should return the current count.

### Development Constraints

- DO NOT use any UI framework like React or Vue. Use only vanilla JavaScript (or TypeScript), HTML, and CSS.

## Setup

The only required setup to start the server should be:

```sh
npm install
npm start
```
