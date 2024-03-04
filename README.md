# BOT Telegram

This is a telegram bot for the use of ... TODO:täydennä

## Core Stack

- **Node.js** - [nodejs.org](http://nodejs.org/)
- **Telegraf** - [telegraf.js.org](https://telegraf.js.org/#/)
- **Mongo DB** - [mongodb.github.io/node-mongodb-native](https://mongodb.github.io/node-mongodb-native/)

## Quick Start

Clone project and install dependencies:
```bash
git clone https://github.com/arttukauppinen/summer-body-bot.git
cd summer-body-bot
npm install
```

Start the server (optional if running without docker):
```bash
```

Run tests (tester apps):
```bash
```

## Project Structure
```
.
├── controllers/                        # Handles different aspects of bot interactions 
|   ├── create-team-controller.js
|   ├── start-controller.js
|   └── weekly-points-controller.js
├── models/                             # Contains Mongoose models for the application's data structure
|   ├── team-model.js
|   └── user-model.js
├── services/                           # Business logic services for handling database operations
|   ├── point-service.js
|   ├── team-service.js
|   └── user-service.js
├── utils/                              # Utility functions and shared code
|   └── texts.js                        # Text messages used by the bot
├── bot.js                              # Telegram bot setup and middleware
├── config.js                           # Configuration settings for the application, such as environment variable management
├── database.js                         # Database connection and configuration
├── index.js                            # Entry point of the application to launch the bot
└── jobs.js                             # Scheduled jobs and repetitive tasks handling

```

## License 
Copyright (c) 2024

TODO: onks tarpeellinen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.