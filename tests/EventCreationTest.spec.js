import { test, expect } from '@playwright/test';
 
const url      = 'https://eventhub.rahulshettyacademy.com'

// ── Credentials 
const userEmail   = 'sushma.tacholi@gmail.com';
const userPassword= 'Sushma@1234'; 
 
// ── Login Helpers 
async function login(page) {
  await page.goto(`${url}/login`);
 
  // Located by placeholder
  await page.getByPlaceholder('you@email.com').fill(userEmail);
 
  // Located by label
  await page.getByLabel('Password').fill(userPassword);
 
  // Located by id
  await page.locator('#login-btn').click();
 
  // Located by Role
  await expect(page.getByRole('link',{name: 'Browse Events →'})).toBeVisible();
  await page.waitForLoadState("networkidle");
}
 
 
// ── Test 
test('create event via UI, book it, and verify seat reduction', async ({ page }) => {
 
  // Log in 
  await login(page);
 
  // ── Create a new event via the admin form 
  // go to Event creation  page
  await page.goto(`${url}/admin/events`);
 
  // Unique title 
  const eventTitle = `Test Event ${Date.now()}`;
  await page.locator('#event-title-input').fill(eventTitle);
  
  await page.locator('#admin-event-form textarea').fill('Playwright test event');
  await page.getByLabel('City').fill('San Jose');
  await page.getByLabel('Venue').fill('Events Center');
 
  // datetime-local input 
  await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');
 
  await page.getByLabel('Price ($)').fill('80');
  await page.getByLabel('Total Seats').fill('100');
  await page.locator('#add-event-btn').click();
 
  // Wait for success 
  await expect(page.getByText('Event created!')).toBeVisible();
  console.log(`Created event: "${eventTitle}"`);
 
  // ── Go to Events page and find the newly created card 
  await page.goto(`${url}/events`);
 
  const eventCards = page.getByTestId('event-card');
  await expect(eventCards.first()).toBeVisible();
 
  // Scan all visible event cards for the one matching our created title
  const targetCard = eventCards.filter({ hasText: eventTitle }).first();
  await expect(targetCard).toBeVisible({ timeout: 5000 });
 
  // Capture seat count before booking
  const seatsBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText());
  console.log(`Seats before booking: ${seatsBeforeBooking}`);
 
  // click on book now
  await targetCard.getByTestId('book-now-btn').click();
 
  // ── Fill the booking form 
  // Quantity defaults to 1 — verify via id
  const ticketCount = page.locator('#ticket-count');
  await expect(ticketCount).toHaveText('1');
 
  await page.getByLabel('Full Name').fill('Test Student1');
  await page.locator('#customer-email').fill('test.student1@example.com');
  await page.getByPlaceholder('+91 98765 43210').fill('1234567890');
  await page.locator('.confirm-booking-btn').click();
 
  // ── Verify booking confirmation
  const bookingRefEl = page.locator('.booking-ref').first();
  await expect(bookingRefEl).toBeVisible();
 
  const bookingRef = (await bookingRefEl.innerText()).trim();
  expect(bookingRef.charAt(0)).toBe(eventTitle.trim().charAt(0).toUpperCase());
 
  console.log(`Booking confirmed. Ref: ${bookingRef}`);
 
  // ── Verify booking appears in My Bookings ────────────────────────
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${url}/bookings`);
  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();
 
  // Find the card that contains our booking ref 
  const matchingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRef }) });
  await expect(matchingCard).toBeVisible();
 
  // Verify event title also appears in the same card
  await expect(matchingCard).toContainText(eventTitle);
 
  console.log(`Booking card found in My Bookings for ref: ${bookingRef}`);
 
  // ── Verify seat count reduced on Events page ─────────────────────
  await page.goto(`${url}/events`);
  await expect(eventCards.first()).toBeVisible();
 
  // Find the same event by title
  const updatedCard  = eventCards.filter({ hasText: eventTitle }).first();
  await expect(updatedCard).toBeVisible();
 
  const seatsAfterBooking = parseInt(await updatedCard.getByText('seat').first().innerText());
  console.log(`Seats after booking: ${seatsAfterBooking}`);
 
  // Booked 1 ticket — count must drop by exactly 1
  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});