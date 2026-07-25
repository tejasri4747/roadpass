# Payment folder

Keeps everything related to taking real payments in one place,
separate from the rest of the site.

- `config.js` — where your Razorpay Payment Button ID lives. Nothing
  secret or dangerous here — this ID is meant to be public, it just
  tells Razorpay which button to load.
- `razorpay-button.html` — the exact snippet to paste into
  `index.html`, with full instructions in the comments at the top.

## Order of operations

1. Create a free Razorpay account at https://razorpay.com
2. Create a Payment Button in their dashboard
3. Copy your real button ID into `config.js`
4. Copy the `<form>` block from `razorpay-button.html` into
   `index.html`, replacing the placeholder "Continue to payment"
   button
5. Commit and push — your booking form now takes real payments

## Note on going live for real money

To actually *receive* payments (not just test them), Razorpay will
ask for KYC — basic business details and a bank account to send the
money to. Until that's approved, the button works in test mode only.
