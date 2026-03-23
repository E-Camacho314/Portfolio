document.addEventListener('DOMContentLoaded', () => {
    // 0. Startup Preloader
    const preloader = document.getElementById('cassette-preloader');
    if (preloader) {
        setTimeout(() => {
            document.body.classList.add('loaded');
            setTimeout(startNameSequence, 500); 
        }, 3500);
    } else {
        document.body.classList.add('loaded');
        startNameSequence();
    }

    // 1. Set current date in the header format
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    // Using a simple YYYY-MM-DD format commonly seen in case files
    if (dateElement) dateElement.textContent = today.toISOString().split('T')[0];

    // 2. Typewriter & Decrypt effect for the Name
    function startNameSequence() {
        const typeWriterElement = document.querySelector('.typewriter-text');
        if(!typeWriterElement) return;
        
        const textToType = typeWriterElement.getAttribute('data-text'); 
        const cursor = document.querySelector('.cursor');
        const chars = "!<>-_\\\\/[]{}—=+*^?#________";
        
        // Wait a small bit for the cassette glitch to pop
        setTimeout(() => {
            let iterations = 0;
            const interval = setInterval(() => {
                typeWriterElement.textContent = textToType.split("")
                    .map((letter, index) => {
                        if(letter === " ") return " ";
                        if (index < iterations) { return textToType[index]; }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");

                if (iterations >= textToType.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if(cursor) cursor.style.display = 'none';
                    }, 3000);
                }
                iterations += 1/3; 
            }, 50);
        }, 800);
    }

    // 3. Form submission simulation (recording tape mode)
    const form = document.getElementById('contact-form');
    if (form) {
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
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
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
    }

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

    // 5. Tape Pos Scroll Indicator
    const tapeDiv = document.createElement('div');
    tapeDiv.classList.add('tape-scroll-indicator');
    tapeDiv.innerHTML = '[TAPE_POS: <span id="tape-pos">0000</span>]';
    document.body.appendChild(tapeDiv);
    
    const tapePosElement = document.getElementById('tape-pos');
    
    function updateTapeScroll() {
        const scrollRange = document.body.scrollHeight - window.innerHeight;
        let scrollPercent = 0;
        if (scrollRange > 0) {
            scrollPercent = window.scrollY / scrollRange;
        }
        if (scrollPercent < 0) scrollPercent = 0;
        if (scrollPercent > 1) scrollPercent = 1;
        // Tape from 0000 to 4500 (representing a 45 min tape length)
        tapePosElement.textContent = Math.floor(scrollPercent * 4500).toString().padStart(4, '0');
    }
    
    window.addEventListener('scroll', updateTapeScroll);
    updateTapeScroll();

    // 6. Odd Symbols Cursor Trail
    let mouseX = 0, mouseY = 0;
    let trailTimer = 0;
    const glitchChars = ['#', '%', '&', '█', '▓', '▒', '░', ']', '[', '?', 'Δ', 'Ω', 'X', 'ERROR'];

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        trailTimer++;
        if (trailTimer % 5 === 0) {
            createGlitchTrail(mouseX, mouseY);
        }
    });

    function createGlitchTrail(x, y) {
        const symbol = document.createElement('span');
        symbol.classList.add('cursor-trail-glitch');
        symbol.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        
        symbol.style.left = `${x + offsetX}px`;
        symbol.style.top = `${y + offsetY}px`;
        
        document.body.appendChild(symbol);
        setTimeout(() => symbol.remove(), 800);
    }

    // 7. Background Random Symbols
    function spawnBgSymbol() {
        if(document.hidden) return;

        const symbol = document.createElement('span');
        symbol.classList.add('bg-symbol');
        symbol.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        
        const maxX = document.body.scrollWidth - 50;
        const maxY = document.body.scrollHeight - 50;
        
        symbol.style.left = `${Math.random() * maxX}px`;
        symbol.style.top = `${Math.random() * maxY}px`;
        
        const scale = 0.5 + Math.random() * 2;
        symbol.style.transform = `scale(${scale})`;
        
        document.body.appendChild(symbol);
        setTimeout(() => symbol.remove(), 4000); 
    }

    for(let i=0; i<30; i++) {
        setTimeout(spawnBgSymbol, Math.random() * 3000);
    }
    setInterval(spawnBgSymbol, 150);
});