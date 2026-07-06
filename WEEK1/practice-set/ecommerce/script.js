document.addEventListener('DOMContentLoaded', function() {
    var menuBtn = document.getElementById('menu-btn');
    var menuLinks = document.getElementById('menu-links');

    if (menuBtn && menuLinks) {
        menuBtn.addEventListener('click', function() {
            menuLinks.classList.toggle('active');
        });
    }

    var cartCount = 0;
    var cartCounter = document.getElementById('cart-counter');
    var addBtns = document.querySelectorAll('.add-to-cart');
    var toast = document.getElementById('toast-alert');
    var toastText = document.getElementById('toast-text');
    var toastTimer;

    addBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var name = btn.getAttribute('data-name');
            cartCount++;
            
            if (cartCounter) {
                cartCounter.textContent = cartCount;
            }

            if (toast && toastText) {
                toastText.textContent = name + " added to cart!";
                toast.classList.add('active');
                
                clearTimeout(toastTimer);
                toastTimer = setTimeout(function() {
                    toast.classList.remove('active');
                }, 3000);
            }
        });
    });

    var newsForm = document.getElementById('newsletter-form');
    var emailField = document.getElementById('email-field');
    var newsError = document.getElementById('news-error');
    var newsSuccess = document.getElementById('news-success');

    if (newsForm && emailField) {
        newsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var emailVal = emailField.value.trim();
            
            if (emailVal === "" || emailVal.indexOf('@') === -1 || emailVal.indexOf('.') === -1) {
                if (newsError) newsError.style.display = 'block';
                emailField.style.borderColor = '#ef4444';
            } else {
                if (newsError) newsError.style.display = 'none';
                emailField.style.borderColor = '#10b981';
                
                if (newsSuccess) {
                    newsSuccess.style.display = 'block';
                }
                newsForm.reset();
                
                setTimeout(function() {
                    if (newsSuccess) newsSuccess.style.display = 'none';
                    emailField.style.borderColor = '#23232b';
                }, 4000);
            }
        });
    }
});
