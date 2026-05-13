<<<<<<< HEAD
# Nicolas_Garcia_playwright-saucedemo
Build a Playwright automation suite in TypeScript targeting SauceDemo (https://www.saucedemo.com), a publicly hosted e-commerce practice application. 
=======
# SauceDemo E2E Automation Suite

Playwright + TypeScript end-to-end test suite for [SauceDemo](https://www.saucedemo.com) — Nuaav coding exercise submission.

---

## Prerequisites

| Requirement | Version                       | Check command |
| ----------- | ----------------------------- | ------------- |
| **Node.js** | ≥ 18 LTS (recommended 20 LTS) | `node -v`     |
| **npm**     | ≥ 9                           | `npm -v`      |

```bash
# 1. Install project dependencies
npm install


# 🏃 2. How to Run All Tests

To run the full suite in headless mode (default):

```bash
npx playwright test
```

## 📋 Expected Output

You will see a summary in the console indicating that the authentication setup ran first, followed by the tests in parallel:

```plaintext
Running 45 tests using 2 workers

  ✓   1 [setup] › tests\auth\auth.setup.ts:17:6 › authenticate as standard_user (3.7s)
  ✓   2 …\login.spec.ts:29:3 › Login — Authentication › standard_user can log in and reach inventory page (1.1s)
  ✓   3 … tests\auth\login.spec.ts:35:3 › Login — Authentication › locked_out_user sees an error message (952ms)
  ✓   4 … tests\auth\login.spec.ts:41:3 › Login — Authentication › wrong password shows an error message (854ms)
  ✓   5 …s\auth\login.spec.ts:47:3 › Login — Authentication › empty credentials shows a validation error (917ms)
  ✓   
```

# 🎯 3. Running Specific Tests

Want to test just one functionality? It’s very simple:

### **By file**

```bash
npx playwright test tests/auth/login.spec.ts
```

### **By test name**

```bash
npx playwright test -g "standard_user can log in"
```

Pro Tip: Use `--headed` to see the browser in action or `--project=chromium` for a specific browser.

# 📊 4. Viewing the HTML Report

After each run, Playwright generates a detailed report. To open it:

```bash
npx playwright show-report
```

This report includes:

- ✅ Detailed steps of each test.
- ❌ Automatic screenshots in case of failure (located in `test-results/`).
- ⏱️ Execution times for each step.

# 🧠 5. Design Decisions

For this challenge, I implemented a robust Page Object Model (POM) architecture that separates selector logic from test execution, making maintenance easier. I used Test Fixtures to automatically inject pages into tests, eliminating the need to manually instantiate objects in each `beforeEach`. Test isolation is ensured through the use of independent browser contexts, while efficiency is maximized with `storageState`, performing a single login for the main flow. Given the time limit, I prioritized coverage of critical business flows (Login and Checkout) and stability over exhaustive coverage of minor edge cases.

# 👨‍🏫 Onboarding a Junior Engineer

## ⚡ 0.5 Quick Guide: "Understanding the Core Axis"
Welcome to the team. Imagine this framework as a car factory:
- `pages/`: These are the blueprints of the parts. If a button on the website changes its ID, you come here (e.g., `login.page.ts`) and fix it.
- `tests/`: This is the test track. Here we verify that the car runs and brakes.
- `fixtures/`: This is the assistant that hands you the car already assembled. You don’t need to worry about how the page was built, the test receives it ready to use.

### Flow

```plaintext
The test requests a page -> The fixture provides it -> The test executes actions using the page methods.
```

## 🧪 1. How to Create a New Test

1. Identify if you need a new page in `pages/`. If not, use the existing ones.
2. Create a `.spec.ts` file in the corresponding folder inside `tests/`.
3. Import `test` from our fixtures file (not from Playwright core) to access the automatic objects.
4. Write your flow using the POM methods.

## 🛠️ 2. What Happens If Something Fails?

### Check the Report

Run:

```bash
npx playwright show-report
```

### Look at the Screenshot

In `test-results/` you will see exactly what the user saw at failure time.

### Data Pollution
`how you would prevent test data pollution in a shared public environment like SauceDemo`



1.	Each test prepares its own state. In beforeEach, every test sets up the data it needs — it never assumes another test has already done it. If I need 3 products in the cart, I add them within that same test. Period.
2.	Playwright handles the rest. SauceDemo resets the cart on every new session, and Playwright creates a fresh browser context per test loaded from storageState. We don’t write manual cleanup logic — the framework takes care of it for us.
Never depend on data that another test might delete.

---



## Project Structure

```
playwright-saucedemo/
├── playwright.config.ts          # Browsers, timeouts, reporters, projects
├── package.json
├── tsconfig.json
├── data/
│   └── users.ts                  # Centralised user credentials (data-driven)
├── fixtures/
│   └── base.fixture.ts           # Custom test.extend<PageFixtures>
├── pages/
│   ├── login.page.ts             # LoginPage POM
│   ├── inventory.page.ts         # InventoryPage POM
│   ├── cart.page.ts              # CartPage POM
│   ├── checkout.page.ts          # CheckoutPage POM
│   └── header.page.ts            # HeaderPage POM (shared component)
├── tests/
│   ├── auth/
│   │   ├── auth.setup.ts         # Saves storageState to .auth/
│   │   └── login.spec.ts         # Login form validation tests
│   ├── inventory/
│   │   └── inventory.spec.ts     # Product catalogue & sorting tests
│   ├── cart/
│   │   └── cart.spec.ts          # Add/remove cart items tests
│   ├── checkout/
│   │   └── checkout.spec.ts      # 3-step checkout flow tests
│   └── lead/
│       └── performance.spec.ts   # performance_glitch_user latency test
├── .auth/                        # Generated — gitignored
└── test-results/                 # Generated — gitignored
```

---

## NPM Scripts

```bash
npm test              # npx playwright test
npm run test:headed   # npx playwright test --headed
npm run test:ui       # npx playwright test --ui
npm run report        # npx playwright show-report
```

Developed with ❤️ by Nicolas Garcia Gonzalez - Systems Engineer/Qa Engineer.

>>>>>>> 0edf7b9 (feat: complete E2E test suite with POM architecture, storageState, and custom fixtures)
