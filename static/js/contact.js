/* -------------------------------------------------------------
   Rajdeepsinh Zala - Premium Developer Portfolio Contact Form Script
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Selector Option Interactive Event
    const options = document.querySelectorAll('.selector-option');
    const hiddenServiceInput = document.getElementById('selected-service');

    if (options.length > 0 && hiddenServiceInput) {
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                // Remove active classes from all options
                options.forEach(o => {
                    o.classList.remove('whatsapp-selected');
                });
                
                // Add active classes to the clicked option
                opt.classList.add('whatsapp-selected');
                
                // Update hidden input value
                hiddenServiceInput.value = opt.getAttribute('data-value');
            });
        });
    }

    // 2. AJAX Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = document.getElementById('submit-btn-text');
    const successModal = document.getElementById('success-modal');
    const successCard = document.getElementById('success-card');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (contactForm && submitBtn && submitBtnText) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Loading state
            submitBtn.disabled = true;
            const originalBtnHTML = submitBtnText.innerHTML;
            
            submitBtnText.innerHTML = `
                Sending message...
                <svg class="animate-spin h-5 w-5 text-white inline-block ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            `;

            // Prepare payload
            const payload = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                phone: document.getElementById('user-phone').value,
                subject: document.getElementById('user-subject').value,
                service: hiddenServiceInput ? hiddenServiceInput.value : "General Inquiry",
                message: document.getElementById('user-message').value
            };

            // Retrieve Django CSRF token if present
            const csrfToken = getCookie('csrftoken');

            // Send POST request
            fetch('/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken && { 'X-CSRFToken': csrfToken })
                },
                body: JSON.stringify(payload)
            })
            .then(async response => {
                let data;
                try {
                    data = await response.json();
                } catch (e) {
                    data = {};
                }
                if (!response.ok) {
                    throw new Error(data.error || 'Server response error');
                }
                return data;
            })
            .then(data => {
                showSuccessPopup();
            })
            .catch(error => {
                console.error("Submission error:", error);
                showErrorPopup(error.message);
            })
            .finally(() => {
                // Restore submit button state
                submitBtn.disabled = false;
                submitBtnText.innerHTML = originalBtnHTML;
            });
        });
    }

    let isSubmissionSuccessful = false;

    // 3. Success & Error modal interactions
    function showSuccessPopup() {
        if (successModal && successCard) {
            isSubmissionSuccessful = true;

            // Reset modal styles to Success theme
            const iconBg = document.getElementById('modal-icon-bg');
            const iconSuccess = document.getElementById('modal-icon-success');
            const iconError = document.getElementById('modal-icon-error');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const closeBtn = document.getElementById('close-modal-btn');

            if (iconBg) {
                iconBg.className = "w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-8 shadow-lg animate-float-fast";
            }
            if (iconSuccess) iconSuccess.classList.remove('hidden');
            if (iconError) iconError.classList.add('hidden');
            if (modalTitle) {
                modalTitle.innerText = "Message Sent!";
                modalTitle.className = "text-3xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent";
            }
            if (modalMessage) {
                modalMessage.innerText = "Thank you for getting in touch! Your message was delivered successfully to Rajdeepsinh, and we have registered your request. You will be contacted shortly.";
            }
            if (closeBtn) {
                closeBtn.innerText = "Back to Portfolio";
            }

            successModal.classList.remove('pointer-events-none', 'opacity-0');
            successModal.classList.add('pointer-events-auto', 'opacity-100');
            successCard.classList.remove('scale-95');
            successCard.classList.add('scale-100');

            // Reset form fields
            if (contactForm) contactForm.reset();
            
            // Reset option selectors
            options.forEach(o => {
                o.classList.remove('whatsapp-selected');
            });
            if (hiddenServiceInput) hiddenServiceInput.value = "General Inquiry";
        }
    }

    function showErrorPopup(message) {
        if (successModal && successCard) {
            isSubmissionSuccessful = false;

            // Update modal styles to Error theme
            const iconBg = document.getElementById('modal-icon-bg');
            const iconSuccess = document.getElementById('modal-icon-success');
            const iconError = document.getElementById('modal-icon-error');
            const modalTitle = document.getElementById('modal-title');
            const modalMessage = document.getElementById('modal-message');
            const closeBtn = document.getElementById('close-modal-btn');

            if (iconBg) {
                iconBg.className = "w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center mx-auto mb-8 shadow-lg animate-float-fast";
            }
            if (iconSuccess) iconSuccess.classList.add('hidden');
            if (iconError) iconError.classList.remove('hidden');
            if (modalTitle) {
                modalTitle.innerText = "Submission Failed";
                modalTitle.className = "text-3xl font-black mb-3 bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent";
            }
            if (modalMessage) {
                modalMessage.innerText = message || "An error occurred while sending your message. Please check your network connection or try again later.";
            }
            if (closeBtn) {
                closeBtn.innerText = "Close & Edit";
            }

            successModal.classList.remove('pointer-events-none', 'opacity-0');
            successModal.classList.add('pointer-events-auto', 'opacity-100');
            successCard.classList.remove('scale-95');
            successCard.classList.add('scale-100');
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (successModal && successCard) {
                successCard.classList.remove('scale-100');
                successCard.classList.add('scale-95');
                successModal.classList.remove('pointer-events-auto', 'opacity-100');
                successModal.classList.add('pointer-events-none', 'opacity-0');
                
                // Redirect back to home ONLY if successful
                if (isSubmissionSuccessful) {
                    window.location.href = "/";
                }
            }
        });
    }

    // Helper: Django CSRF Reader
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
