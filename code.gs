// Serve the web app
function doGet() {
    return HtmlService.createHtmlOutputFromFile('Index')
        .setTitle('Đăng ký Giải chạy Jogging Quảng Công Biển Gọi')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Function to handle form submission via POST request
function doPost(e) {
    try {
        // Parse incoming data from the frontend
        const { sex, name, email, tel, culy, sizeType, size, questions, total } = JSON.parse(e.postData.contents);

        // Validate required fields
        if (!sex || !name || !email || !tel || !culy || !sizeType || !size) {
            return ContentService.createTextOutput(
                JSON.stringify({ success: false, message: "Vui lòng điền đầy đủ thông tin bắt buộc." })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return ContentService.createTextOutput(
                JSON.stringify({ success: false, message: "Email không hợp lệ." })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // Validate phone number (basic example)
        const phoneRegex = /^[0-9]{10,11}$/; // Assumes 10-11 digits
        if (!phoneRegex.test(tel)) {
            return ContentService.createTextOutput(
                JSON.stringify({ success: false, message: "Số điện thoại không hợp lệ." })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // Process form data and save to Spreadsheet
        const formData = {
            sex: sex,
            name: name,
            email: email,
            tel: tel,
            culy: culy,
            sizeType: sizeType,
            size: size,
            questions: questions,
            total: total
        };

        const result = processForm(formData);

        // Return response based on processForm result
        if (result.success) {
            return ContentService.createTextOutput(
                JSON.stringify({
                    success: true,
                    message: "Đăng ký thành công!",
                    redirect: result.redirect
                })
            ).setMimeType(ContentService.MimeType.JSON);
        } else {
            return ContentService.createTextOutput(
                JSON.stringify({
                    success: false,
                    message: result.message
                })
            ).setMimeType(ContentService.MimeType.JSON);
        }
    } catch (error) {
        // Handle unexpected errors
        Logger.log(error); // Log error for debugging
        return ContentService.createTextOutput(
            JSON.stringify({ success: false, message: "Đã xảy ra lỗi. Vui lòng thử lại sau." })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

// Process form data and save to Spreadsheet
function processForm(formData) {
    try {
        // Get the active spreadsheet and sheet
        const ss = SpreadsheetApp.openById("132JA2nZ1rwwuUBcAMVce7YcsrDZSW2sVrWICKkm5WEI");
        let sheet = ss.getSheetByName('Form Đăng ký');

        // Create sheet if it doesn't exist
        if (!sheet) {
            sheet = ss.insertSheet('Form Đăng ký');
            sheet.appendRow([
                'Timestamp', 'Code-ID', 'Danh xưng', 'Họ tên', 'Email', 'SĐT', 'Cự ly', 'Kiểu áo', 'Size', 'Tổng tiền', 'Câu hỏi'
            ]);
        }

        // Generate a random Code-ID
        const codeId = 'REG' + Math.floor(100000 + Math.random() * 900000);

        // Prepare data for the sheet
        const timestamp = new Date();
        const totalAmount = formData.total ? parseFloat(formData.total.replace(/,/g, '')) : 0; // Remove commas and convert to number
        const rowData = [
            timestamp,               // Timestamp
            codeId,                  // Code-ID
            formData.sex,            // Danh xưng
            formData.name,           // Họ tên
            formData.email,          // Email
            formData.tel,            // SĐT
            formData.culy,           // Cự ly
            formData.sizeType,       // Kiểu áo
            formData.size,           // Size
            totalAmount,             // Tổng tiền
            formData.questions       // Câu hỏi
        ];

        // Append data to the sheet
        sheet.appendRow(rowData);

        // Build the payment URL
        const paymentAppUrl = 'https://script.google.com/a/macros/racehue.com/s/AKfycbwHYqBM1WaNeTwOcXz4ewxBFFhf5DcQqhMkoY4rOaV2IKxy7T6hOsDRFofHNTW7qQSF/exec';
        const formattedTotal = totalAmount.toFixed(0); // Format total as integer
        const url = `${paymentAppUrl}?codeId=${codeId}&sex=${encodeURIComponent(formData.sex)}&name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&tel=${formData.tel}&culy=${formData.culy}&sizeType=${formData.sizeType}&size=${formData.size}&total=${formattedTotal}`;

        return {
            success: true,
            redirect: url
        };
    } catch (error) {
        Logger.log(error); // Log error for debugging
        return {
            success: false,
            message: 'Đã xảy ra lỗi: ' + error.message
        };
    }
}
