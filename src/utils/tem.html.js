"use strict";

const htmlEmailToken = () => {
  return `
    <html>
      <head>
        <title>Email Token</title>
      </head>
      <body>
        <h1>Your email token
        </h1>
        <p>Use the following token to verify your email address:</p>
        <h2 style="color: blue;">{{TOKEN}}</h2>
        <p>This token is valid for 10 minutes.</p>
      </body>
    </html>
  `;
};

module.exports = {
  htmlEmailToken,
};
