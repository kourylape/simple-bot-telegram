# Simple Push Notification Bot for Telegram

This setups a simple webhook that can be used by a Telegram Bot to send messages and is easily deployed to [Fly.io](https://fly.io/). This can useful to send messages from CLI, APIs, crons, etc.

## Setup

### 1) Create a Telegram Bot

If you haven't created a [Telegram](https://telegram.org/) account yet, go ahead and do that. Then you can create a bot by following the steps below; for me details checkout the [Telegram Bot](https://core.telegram.org/bots) documentation.

1. Open a chat with [@botfather](https://t.me/botfather)
2. Create your bot with `/newbot`
3. Grab your Auth Token, it should look something like `110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw`. You'll need to add this as a [secret in Fly.io](https://fly.io/docs/reference/secrets/#setting-secrets).
4. Use `/setcommands` to create a new `/chat` command. `chat - Get your unique Chat ID` should be good enough.
5. (OPTIONAL) You can disable allowing the bot to join groups with `/setjoingroups`

### 2) Create a Fly.io App

Since this repo includes a Dockerfile, it's very simply to create a new Fly.io app. You'll only need to [install the flyctl](https://fly.io/docs/hands-on/install-flyctl/) command-line utility.


Once it's installed, you simply have to run `fly launch` and walk through the prompts on screen to setup the new app. You'll also need to set the `AUTH` and `SECRET` secret.

- `AUTH` is the auth token from Telegram for the first step.
- `SECRET` is used to prevent unwated access to your Fly.io app.

Finally, you can run `fly deploy -a <FLY_APP_NAME> --remote-only` to deploy a new release for your Fly.io app not even requiring you to have Docker installed locally.

### 3) Create a Webhook

You'll need the authentication token and secret for your Bot.

```bash
curl --request POST \
  --url https://api.telegram.org/bot<token>/setWebhook \
  --header 'content-type: application/json' \
  --data '{
    "url": "https://<YOUR_PUBLIC_FLY_APP>/<YOUR_SECRET>",
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
  --url https://<YOUR_PUBLIC_FLY_APP>/<YOUR_SECRET>/<CHAT_ID> \
  --header 'content-type: application/json' \
  --data '{ "message": "<YOUR_MESSAGE_TEXT>" }'
```
