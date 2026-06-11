const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const errors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
    console.log(`[Console]: ${msg.text()}`);
  });

  page.on('response', response => {
    // Ignore external Cloudinary calls for OK status if we only want our API
    if (!response.ok()) {
      networkErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log("Navigating to Login Page...");
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    
    console.log("Logging in as Admin...");
    await page.type('input[placeholder="Email"]', 'admin@officy.com');
    await page.type('input[placeholder="Password"]', 'password123');
    await page.click('button.auth-submit');
    await page.waitForResponse(response => response.url().includes('/api/auth/callback/credentials') && response.status() === 200);
    await new Promise(r => setTimeout(r, 1000)); // Wait for redirect

    console.log("Navigating to Admin Products...");
    await page.goto('http://localhost:3000/admin/products', { waitUntil: 'networkidle2' });
    
    console.log("Filling form...");
    await page.type('input[placeholder="Product Name"]', 'Test QA Product');
    await page.type('input[placeholder="Price"]', '150');
    await page.type('input[placeholder="Category"]', 'Office QA');
    await page.type('input[placeholder="Description"]', 'This is a test product for QA verification.');

    console.log("Uploading image...");
    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) throw new Error("File input not found");
    
    await fileInput.uploadFile(path.join(__dirname, 'public/products/executive-chair.png'));
    
    // Wait for the loader to disappear or for success
    console.log("Waiting for upload to complete...");
    // Just wait 5 seconds for Cloudinary to respond to be safe
    await new Promise(r => setTimeout(r, 5000));
    
    console.log("Saving product...");
    // Click the save button using evaluate
    const success = await page.evaluate(() => {
      const formBtn = document.querySelector('.admin-form button.button--dark');
      if (formBtn) {
        formBtn.click();
        return true;
      }
      return false;
    });

    if (!success) {
      const html = await page.content();
      console.log("PAGE HTML:", html);
      throw new Error("Add Product button not found");
    }
    
    // Wait for it to appear in the list
    await new Promise(r => setTimeout(r, 3000));

    console.log("Navigating to Storefront Products Page...");
    await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle2' });
    
    const content = await page.content();
    if (!content.includes('Test QA Product')) {
      throw new Error("Product not found on storefront!");
    }
    console.log("Product successfully found on storefront.");

    console.log("Navigating to Product Detail Page...");
    await page.evaluate(() => {
      const link = document.querySelector('.product-card__title-row a');
      if (link) {
        link.click();
      } else {
        console.log("FULL HTML:", document.body.innerHTML);
        throw new Error("Product link not found");
      }
    });
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Testing Add to Cart...");
    const actionButtons = await page.$$('button');
    let cartBtn;
    for (const btn of actionButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Add to Cart')) cartBtn = btn;
    }
    
    if (cartBtn) {
      await cartBtn.click();
    } else {
      throw new Error("Add to Cart button not found");
    }
    
    // Wait a sec for toast
    await new Promise(r => setTimeout(r, 1000));
    
    const pageText = await page.evaluate(() => document.body.innerText);
    if (!pageText.includes('Added to cart')) {
      throw new Error("Add to Cart toast did not appear.");
    }
    console.log("Add to cart successful.");
    
    console.log("\n=== TEST COMPLETED SUCCESSFULLY ===");

  } catch (error) {
    console.error("\n=== TEST FAILED ===");
    console.error(error);
  } finally {
    if (errors.length > 0) {
      console.log("\nBrowser Console Errors:", errors);
    }
    if (networkErrors.length > 0) {
      console.log("\nNetwork Errors:", networkErrors);
    }
    await browser.close();
  }
})();
