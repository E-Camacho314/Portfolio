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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide submit button, show recording in progress
        submitBtn.style.display = 'none';
        recordingStatus.classList.remove('hidden');
        
        // Disable inputs to prevent editing while "recording"
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.7';
        });

        // Simulate tape recording time (4 seconds)
        setTimeout(() => {
            recordingStatus.classList.add('hidden');
            recordingComplete.classList.remove('hidden');
            
            // Optionally, clear form after some time
            /*
            setTimeout(() => {
                form.reset();
                inputs.forEach(input => {
                    input.disabled = false;
                    input.style.opacity = '1';
                });
                submitBtn.style.display = 'inline-block';
                recordingComplete.classList.add('hidden');
            }, 5000);
            */
        }, 4000);
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
