const { JSDOM } = require("jsdom");
const notyf = require("notyf");

// Set up a DOM environment
const dom = new JSDOM("<!DOCTYPE html>");
global.window = dom.window;
global.document = dom.window.document;

// Create a new Notyf instance
const notyfInstance = notyf();

// Display a success message
const getSuccessMessage = (message) => {
  return notyfInstance.success("Your operation was successful!");
};

const getErrorMessage = (message) => {
  return notyfInstance.error("message", {
    duration: 3000,
    position: {
      x: "right",
      y: "top",
    },
  });
};

module.exports = {
  getSuccessMessage,
  getErrorMessage,
};
