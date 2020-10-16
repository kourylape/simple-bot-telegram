# Simple Push Notification Bot for Telegram

This setups a simple webhook that can be used by a Telegram Bot to send messages and is easily deployed to [Heroku](https://www.heroku.com/). This can useful to send messages from CLI, APIs, crons, etc.

## Setup

### 1) Create a Telegram Bot

If you haven't created a [Telegram](https://telegram.org/) account yet, go ahead and do that. Then you can create a bot by following the steps below; for me details checkout the [Telegram Bot](https://core.telegram.org/bots) documentation.

1. Open a chat with [@botfather](https://t.me/botfather)
2. Create your bot with `/newbot`
3. Grab your Auth Token, it should look something like `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`. You'll need to add this as a config variable in Heroku.
4. Use `/setcommands` to create a new `/chat` command. `chat - Get your unique Chat ID` should be good enough.
5. (OPTIONAL) You can disable allowing the bot to join groups with `/setjoingroups`

### 2) Create a Heroku App

It's up to you how you want to create your Heroku app - either on the web, or via the [CLI](https://devcenter.heroku.com/articles/creating-apps). You can also intergrate [Heroku with GitHub](https://devcenter.heroku.com/articles/github-integration) to automcatically deploy.

You'll need to do is create [config vars](https://devcenter.heroku.com/articles/config-vars) for the auth token and secret. You will also need to add [Redis](https://devcenter.heroku.com/articles/heroku-redis) as an add-on.

If using the CLI:

```bash
heroku config:set AUTH=110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
heroku config:set SECRET=A1B2C3D4E5
heroku addons:create heroku-redis:hobby-dev -a your-app-name
```

Once the config variables are setup, you can then deploy the appliation to Heroku.

Note: You can also use a `.env` file if you want to use test this locally.

### 3) Create a Webhook

You'll need the authentication token and secret for your Bot.

```bash
curl --request POST \
  --url https://api.telegram.org/bot<token>/setWebhook \
  --header 'content-type: application/json' \
  --data '{
    "url": "https://<YOUR_HEROKU_APP_ID>.herokuapp.com/<YOUR_SECRET>",
    "max_connections": "20",
    "allowed_updates": ["message"]
}'
```

### 4) Get your Chat ID

1. Open a chat with your bot and send the `/chat` command. You'll get a message back with your unique chat ID. This will be used to send messages from the bot.

## Usage

To send a message you just need your `chat_id`.

```bash
curl --request POST \
  --url https://<YOUR_HEROKU_APP_ID>.herokuapp.com/<YOUR_SECRET>/<CHAT_ID> \
  --header 'content-type: application/json' \
  --data '{ "message": "<YOUR_MESSAGE_TEXT>" }'
```
