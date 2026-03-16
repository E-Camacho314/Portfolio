document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current date in the header format
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    // Using a simple YYYY-MM-DD format commonly seen in case files
    dateElement.textContent = today.toISOString().split('T')[0];

    // 2. Typewriter effect for the Name
    const typeWriterElement = document.querySelector('.typewriter-text');
    const textToType = typeWriterElement.getAttribute('data-text');
    typeWriterElement.textContent = ''; // clear initial content just in case
    
    let charIndex = 0;
    const cursor = document.querySelector('.cursor');

    function typeWriter() {
        if (charIndex < textToType.length) {
            typeWriterElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            // Random delay to simulate real mechanical typing
            const delay = Math.random() * 120 + 30;
            setTimeout(typeWriter, delay);
        } else {
            // Typing complete, hide cursor after a couple of seconds
            setTimeout(() => {
                if(cursor) cursor.style.display = 'none';
            }, 3000);
        }
    }

    // Start typing after 1 second for dramatic effect
    setTimeout(typeWriter, 1000);

    // 3. Form submission simulation (recording tape mode)
    const form = document.getElementById('contact-form');
    const recordingStatus = document.getElementById('recording-status');
    const recordingComplete = document.getElementById('recording-complete');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Gather the form data BEFORE disabling inputs
        const formData = new FormData(form);

        // Hide submit button, show recording in progress
        submitBtn.style.display = 'none';
        recordingStatus.classList.remove('hidden');
        
        // Disable inputs to prevent editing while "recording"
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.7';
        });

        try {
            const response = await fetch("https://formspree.io/f/xaqppaew", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Simulate tape recording time (minimum 2 seconds for effect)
                setTimeout(() => {
                    recordingStatus.classList.add('hidden');
                    recordingComplete.classList.remove('hidden');
                    
                    form.reset();
                }, 2000);
            } else {
                recordingStatus.classList.add('hidden');
                submitBtn.style.display = 'inline-block';
                submitBtn.textContent = "[RECORDING FAILED - TRY AGAIN]";
                inputs.forEach(input => {
                    input.disabled = false;
                    input.style.opacity = '1';
                });
            }
        } catch (error) {
            console.error("Error submitting statement:", error);
            recordingStatus.classList.add('hidden');
            submitBtn.style.display = 'inline-block';
            submitBtn.textContent = "[RECORDING FAILED - TRY AGAIN]";
            inputs.forEach(input => {
                input.disabled = false;
                input.style.opacity = '1';
            });
        }
    });

    // 4. Glitch effect on hover for Case Files
    const caseFiles = document.querySelectorAll('.case-file');
    
    caseFiles.forEach(file => {
        file.addEventListener('mouseenter', () => {
            // Randomly trigger the flicker keyframe defined in CSS
            file.style.animation = 'flicker 0.4s ease-in-out';
            setTimeout(() => {
                file.style.animation = ''; // Reset
            }, 400);
        });
    });
});
