// Optimized Google Apps Script for User Registration

// Function to handle form submission
function doPost(e) {
  try {
    // Parse incoming data from the frontend
    const { name, email, password } = JSON.parse(e.postData.contents);

    // Validate input fields
    if (!name || !email || !password) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: "All fields are required." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: "Invalid email format." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Password strength check (basic example)
    if (password.length < 6) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, message: "Password must be at least 6 characters long." })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Save data to Google Sheets (acting as a database)
    const sheet = SpreadsheetApp.openById("132JA2nZ1rwwuUBcAMVce7YcsrDZSW2sVrWICKkm5WEI").getSheetByName("Users");
    sheet.appendRow([name, email, password]); // Note: Hash passwords in production

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Registration successful!" })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Handle unexpected errors
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: "An error occurred. Please try again later." })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
