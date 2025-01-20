# docs-converter

## Overview

`docs-converter` is a Word document to JSON converter application. It allows users to convert their Word documents into JSON format for easier manipulation and integration into various applications.

## Installation

To install the necessary dependencies, run the following command:

npm install

## Scripts

This project includes the following scripts:

- `start`: Runs the application in production mode.
- `dev`: Runs the application in development mode using nodemon for automatic restarts.

You can run these scripts using npm:

npm run start

or

npm run dev

## Dependencies

The project uses the following dependencies:

- `express`: A fast, unopinionated, minimalist web framework for Node.js.
- `mammoth`: A library for converting .docx documents into HTML and plain text.
- `multer`: A middleware for handling `multipart/form-data`, which is used for uploading files.
- `body-parser`: A middleware to parse incoming request bodies in a middleware before your handlers.
- `cors`: A package to enable Cross-Origin Resource Sharing.

## License

This project is licensed under the ISC License.
