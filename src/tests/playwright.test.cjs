const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Log console messages from the page
  page.on('console', msg => console.log(msg.text()));

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Wait for the test results to be populated
    await page.waitForSelector('#testResults', { timeout: 30000 });

    // Wait for the "Tests Complete" message
    await page.waitForFunction(
      () => document.body.innerText.includes('Tests Complete'),
      { timeout: 30000 }
    );

    // Check for any failed tests
    const failedTests = await page.evaluate(() => {
      const results = document.getElementById('testResults').innerText;
      return results.includes('❌');
    });

    if (failedTests) {
      console.error('Playwright tests failed. Check the browser console for details.');
      const testResults = await page.locator('#testResults').innerText();
      console.log(testResults)
      process.exit(1);
    } else {
      console.log('Playwright tests passed successfully!');
    }

  } catch (error) {
    console.error('Error running Playwright tests:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();