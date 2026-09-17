# Playwright E2E — Event Creation & Booking Test

An end-to-end UI test written with Playwright (JavaScript) against the
[EventHub](https://eventhub.rahulshettyacademy.com) practice application.

The test covers a complete user journey: an admin creates a new event, a booking
is made for that event, and the seat count is verified to drop by exactly one.

## What the test does

1. Logs in with a reusable `login()` helper
2. Creates a new event from the admin panel with a unique title (`Test Event ${Date.now()}`)
3. Finds that event card on the Events page and records the current seat count
4. Opens the booking form and confirms a booking for 1 ticket
5. Captures the booking reference from the confirmation screen
6. Verifies the booking appears under **My Bookings** with the matching reference and event title
7. Returns to the Events page and asserts the seat count is exactly one lower

## Tech

- Playwright Test
- JavaScript (ES modules)
- Chromium

## Locator strategies used

The test intentionally mixes Playwright's locator types:

| Strategy | Example |
|---|---|
| Placeholder | `getByPlaceholder('you@email.com')` |
| Label | `getByLabel('Total Seats')` |
| Test ID | `getByTestId('event-card')` |
| Role | `getByRole('link', { name: /Browse Events/ })` |
| ID | `locator('#add-event-btn')` |
| CSS class | `locator('.confirm-booking-btn')` |
| Filtering | `cards.filter({ hasText: eventTitle })` |

## Setup

```bash
git clone https://github.com/sushma-tk/Playwright-E2E-Event-Creation-Test.git
cd Playwright-E2E-Event-Creation-Test
npm install
npx playwright install
```

Register an account at https://eventhub.rahulshettyacademy.com, then update the
credentials at the top of the spec file:

```javascript
const userEmail   = 'email@gmail.com';
const userPassword= 'password@1234'; 
```

## Running

```bash
npx playwright test              # headless
npx playwright test --headed     # watch it run
npx playwright show-report       # open the HTML report
```

## Notes

- Every run creates a new event with a timestamped title, so tests don't collide
  with each other or with existing data.
- The event date is generated 45 days ahead by a `futureDateValue()` helper
  rather than hardcoded, so the test won't break over time.
