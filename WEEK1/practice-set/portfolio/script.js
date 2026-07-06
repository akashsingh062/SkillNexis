document.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.getElementById('menu-btn');
    var menuLinks = document.getElementById('menu-links');

    if (menuBtn && menuLinks) {
        menuBtn.addEventListener('click', function() {
            menuLinks.classList.toggle('active');
        });
    }

    var form = document.getElementById('contact-form');
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');
    var successBanner = document.getElementById('success-banner');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var nameVal = nameInput.value.trim();
            var emailVal = emailInput.value.trim();
            var messageVal = messageInput.value.trim();
            
            var isValid = true;

            if (nameVal === "") {
                document.getElementById('name-error').style.display = 'block';
                nameInput.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                document.getElementById('name-error').style.display = 'none';
                nameInput.style.borderColor = '#10b981';
            }

            if (emailVal === "" || emailVal.indexOf('@') === -1 || emailVal.indexOf('.') === -1) {
                document.getElementById('email-error').style.display = 'block';
                emailInput.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                document.getElementById('email-error').style.display = 'none';
                emailInput.style.borderColor = '#10b981';
            }

            if (messageVal.length < 10) {
                document.getElementById('message-error').style.display = 'block';
                messageInput.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                document.getElementById('message-error').style.display = 'none';
                messageInput.style.borderColor = '#10b981';
            }

            if (isValid) {
                successBanner.style.display = 'block';
                form.reset();
                setTimeout(function() {
                    successBanner.style.display = 'none';
                    nameInput.style.borderColor = '#2d2d35';
                    emailInput.style.borderColor = '#2d2d35';
                    messageInput.style.borderColor = '#2d2d35';
                }, 4000);
            }
        });
    }
});
