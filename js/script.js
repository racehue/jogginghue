// script.js
function updateTotal() {
    const culySelect = document.getElementById("culy");
    const sizeTypeSelect = document.getElementById("sizeType");
    const totalInput = document.getElementById("total");
    const culyPrice = culySelect.value ? parseInt(culySelect.options[culySelect.selectedIndex].getAttribute("data-price")) : 0;
    const sizeTypePrice = sizeTypeSelect.value ? parseInt(sizeTypeSelect.options[sizeTypeSelect.selectedIndex].getAttribute("data-price")) : 0;
    const total = culyPrice + sizeTypePrice;
    totalInput.value = total.toLocaleString('vi-VN');
}

function updateSizeOptions() {
    const sizeTypeSelect = document.getElementById("sizeType");
    const sizeSelect = document.getElementById("size");
    sizeSelect.innerHTML = '<option value="">-- Chọn size áo --</option>';
    sizeSelect.disabled = !sizeTypeSelect.value;
    if (sizeTypeSelect.value === "Nam") {
        sizeSelect.add(new Option("S", "S"));
        sizeSelect.add(new Option("M", "M"));
        sizeSelect.add(new Option("L", "L"));
        sizeSelect.add(new Option("XL", "XL"));
        sizeSelect.add(new Option("XXL", "XXL"));
    } else if (sizeTypeSelect.value === "Nữ") {
        sizeSelect.add(new Option("XS", "XS"));
        sizeSelect.add(new Option("S", "S"));
        sizeSelect.add(new Option("M", "M"));
        sizeSelect.add(new Option("L", "L"));
        sizeSelect.add(new Option("XL", "XL"));
    } else if (sizeTypeSelect.value === "Trẻ em") {
        sizeSelect.add(new Option("2XS", "2XS"));
        sizeSelect.add(new Option("XS", "XS"));
        sizeSelect.add(new Option("S", "S"));
        sizeSelect.add(new Option("M", "M"));
    }
}

document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    // Check form validity
    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }
    // Collect form data
    const formData = {
        sex: document.getElementById('sex').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        tel: document.getElementById('tel').value,
        culy: document.getElementById('culy').value,
        sizeType: document.getElementById('sizeType').value,
        size: document.getElementById('size').value,
        questions: document.getElementById('questions').value,
        total: document.getElementById('total').value.replace(/,/g, '') // Remove commas
    };
    // Disable submit button and show loading spinner
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const submitSuccessMessage = document.getElementById('submitSuccessMessage');
    const submitErrorMessage = document.getElementById('submitErrorMessage');
    submitBtn.disabled = true;
    loadingSpinner.classList.remove('d-none');
    submitSuccessMessage.classList.add('d-none');
    submitErrorMessage.classList.add('d-none');
    try {
        // Send data to Google Apps Script backend
        const response = await fetch('https://script.google.com/macros/s/AKfycbwJU6BZUe4dPxl2ydiJ9GKdMzjRMACn4lO6p5DhcnrYY3ePhEXTzqHhCirbV25hABb_/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        // Handle success or failure
        if (result.success) {
            submitSuccessMessage.classList.remove('d-none');
            this.reset();
            this.classList.remove('was-validated');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            submitErrorMessage.textContent = `${result.message}`;
            submitErrorMessage.classList.remove('d-none');
        }
    } catch (error) {
        submitErrorMessage.textContent = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        submitErrorMessage.classList.remove('d-none');
    } finally {
        submitBtn.disabled = false;
        loadingSpinner.classList.add('d-none');
    }
});