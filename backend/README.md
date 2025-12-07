## Using Stripe CLI for Local Development

To effectively test and develop your application with Stripe integration, you can use the Stripe CLI (Command Line Interface). The Stripe CLI allows you to simulate webhook events, manage your Stripe account, and perform various operations directly from your terminal.

### Installation
1. **Install Stripe CLI**: Follow the installation instructions for your operating system from the official Stripe CLI documentation: [Stripe CLI Installation](https://stripe.com/docs/stripe-cli#install).
2. **Authenticate**: After installation, authenticate the CLI with your Stripe account by running:
   ```
   stripe login
   ```
   This will open a browser window for you to log in to your Stripe account.

### Using Stripe CLI
- **Listen for Webhooks**: To listen for webhook events and forward them to your local
- server, run:
   ```
   stripe listen --forward-to localhost:8080/payment/webhook
   ```
- **Trigger Events**: You can trigger specific events to test your webhook handling. For example, to trigger a `checkout.session.completed` event, run:
   ```
   stripe trigger checkout.session.completed --override data.object.id=<session_id>
   ```
