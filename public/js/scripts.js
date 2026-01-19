document.addEventListener('DOMContentLoaded', () => {
    console.log("Validation script loaded!");

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const g2Form = document.getElementById('g2Form');

    // Apply relevant validation logic based on the form
    if (loginForm) {
        validateLoginForm(loginForm);
    } 

    if (signupForm) {
        validateSignupForm(signupForm);
    }

    if (g2Form) {
        validateG2Form(g2Form);
    }

//login

    function validateLoginForm(form) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        form.addEventListener('submit', (event) => {
            let isValid = true;
            clearErrors(form);

            // Validate username 
            if (usernameInput.value.trim().length < 5) {
                showError(usernameInput, 'Username must be at least 5 characters long.');
                isValid = false;
            }

            // Validate password complexity
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
            if (!passwordRegex.test(passwordInput.value)) {
                showError(passwordInput, 'Password must be 8+ characters with uppercase, lowercase, number, and special character.');
                isValid = false;
            }

            if (!isValid) event.preventDefault();
        });
    }

    //  signup
    function validateSignupForm(form) {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        form.addEventListener('submit', (event) => {
            let isValid = true;
            clearErrors(form);

            // Validate username
            if (usernameInput.value.trim().length < 5) {
                showError(usernameInput, 'Username must be at least 5 characters long.');
                isValid = false;
            }

            // Validate password complexity
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
            if (!passwordRegex.test(passwordInput.value)) {
                showError(passwordInput, 'Password must include uppercase, lowercase, number, and special character.');
                isValid = false;
            }

            // Confirm password validation
            if (passwordInput.value !== confirmPasswordInput.value) {
                showError(confirmPasswordInput, 'Passwords do not match.');
                isValid = false;
            }

            if (!isValid) event.preventDefault();
        });
    }
//g2
    function validateG2Form(form) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const licenseNumberInput = document.getElementById('licenseNumber');
        const ageInput = document.getElementById('age');
        const carMakeInput = document.getElementById('carMake');
        const carModelInput = document.getElementById('carModel');
        const carYearInput = document.getElementById('carYear');
        const carPlateInput = document.getElementById('carPlate');

        form.addEventListener('submit', (event) => {
            let isValid = true;
            clearErrors(form);

            // First Name validation 
            if (firstNameInput.value.trim() === '') {
                showError(firstNameInput, 'First name is required.');
                isValid = false;
            }

            // Last Name validation 
            if (lastNameInput.value.trim() === '') {
                showError(lastNameInput, 'Last name is required.');
                isValid = false;
            }

            // License number validation (8 alphanumeric characters)
            const licenseRegex = /^[A-Za-z0-9]{8}$/;
            if (!licenseRegex.test(licenseNumberInput.value)) {
                showError(licenseNumberInput, 'License number must be exactly 8 alphanumeric characters.');
                isValid = false;
            }

            // Age validation (18+)
            const age = parseInt(ageInput.value, 10);
            if (isNaN(age) || age < 18) {
                showError(ageInput, 'You must be 18 years or older.');
                isValid = false;
            }

            // Car Make validation 
            if (carMakeInput.value.trim() === '') {
                showError(carMakeInput, 'Car make is required.');
                isValid = false;
            }

            // Car Model validation 
            if (carModelInput.value.trim() === '') {
                showError(carModelInput, 'Car model is required.');
                isValid = false;
            }

            // Car Year validation 
            const carYear = parseInt(carYearInput.value, 10);
            if (isNaN(carYear) || carYear < 1900 || carYear > 2025) {
                showError(carYearInput, 'Car year must be between 1900 and 2025.');
                isValid = false;
            }

            // Car Plate validation 
            if (carPlateInput.value.trim() === '') {
                showError(carPlateInput, 'Car plate number is required.');
                isValid = false;
            }

            if (!isValid) event.preventDefault();
        });
    }



    // Clear previous error messages
    function clearErrors(form) {
        const errors = form.querySelectorAll('.text-danger');
        errors.forEach(error => error.remove());
    }

    // Display error messages
    function showError(input, message) {
        const error = document.createElement('small');
        error.classList.add('text-danger');
        error.textContent = message;
        input.parentElement.appendChild(error);
    }
});
