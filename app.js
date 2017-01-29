let restify = require('restify');
let builder = require('botbuilder');
let createServer = require("auto-sni");

// Get secrets from server environment
let connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Create bot
let bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {

    //respond with user's message
    session.send("You said " + session.message.text);
});

createServer.https = restify;
let server = createServer({
    email: '<your-email>', // Emailed when certificates expire.
    agreeTos: true, // Required for letsencrypt.
    restify: true, // using restify
    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
    domains: ["<your-domain>"], // List of accepted domain names. (You can use nested arrays to register bundles with LE)
    forceSSL: true, // Make this false to disable auto http->https redirects (default true).
    redirectCode: 301, // If forceSSL is true, decide if redirect should be 301 (permanent) or 302 (temporary). Defaults to 302
    ports: {
        http: 3977, // Optionally override the default http port.
        https: 3978 // // Optionally override the default https port.
    }
});

// Handle Bot Framework messages
server.post('/api/messages', connector.listen());

server.once("listening", () => {
    console.log('%s listening to %s', server.name, server.url);
});