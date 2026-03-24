document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic
    const preloader = document.getElementById('music-preloader');
    if (preloader) {
        setTimeout(() => {
            document.body.classList.add('loaded');
            // Wait for slide down transition before observing fades
            setTimeout(initScrollObserver, 800); 
        }, 1800);
    } else {
        document.body.classList.add('loaded');
        initScrollObserver();
    }

    function initScrollObserver() {
        // 1. Intersection Observer for Fade-in animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay');
                    if (delay) {
                        entry.target.style.transitionDelay = `${delay}s`;
                    }
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-in-up');
        fadeElements.forEach(el => observer.observe(el));
    }

    // 2. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Gentle Sparkles Effect
    const sparkleContainer = document.getElementById('sparkle-container');
    
    function createSparkle() {
        if (!sparkleContainer) return;

        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Randomize position and animation duration
        const startX = Math.random() * window.innerWidth;
        const duration = 10 + Math.random() * 10; // 10s to 20s
        const colorClass = Math.random() > 0.5 ? 'var(--accent-red)' : 'var(--accent-blue)';
        const size = Math.random() * 4 + 2; // 2px to 6px

        sparkle.style.left = `${startX}px`;
        sparkle.style.animationDuration = `${duration}s`;
        sparkle.style.backgroundColor = colorClass;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;

        // Small random drift horizontally
        const horizontalDrift = (Math.random() - 0.5) * 100;
        sparkle.style.transform = `translateX(${horizontalDrift}px)`;

        sparkleContainer.appendChild(sparkle);

        // Remove element after animation ends
        setTimeout(() => {
            sparkle.remove();
        }, duration * 1000);
    }

    // Create a new sparkle every few seconds
    setInterval(createSparkle, 3000);
    // Create initial batch
    for(let i = 0; i < 5; i++) {
        setTimeout(createSparkle, i * 500);
    }

    // 4. Subtle Parallax for Hero vinyl
    const vinyl = document.querySelector('.vinyl-record');
    
    // Vinyl Floating Notes
    if (vinyl) {
        function spawnVinylNote() {
            const note = document.createElement('span');
            note.classList.add('vinyl-note');
            const notes = ['♪', '♫', '♩', '♬'];
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            
            const angle = (Math.random() * Math.PI) - (Math.PI / 2); // mostly upwards
            const distance = 80 + Math.random() * 80;
            note.style.setProperty('--tx', `${Math.sin(angle) * distance}px`);
            note.style.setProperty('--ty', `-${Math.cos(angle) * distance}px`);
            
            vinyl.appendChild(note);
            setTimeout(() => note.remove(), 4000);
        }
        setInterval(spawnVinylNote, 1200);
    }

    // 5. Custom Cursor
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('custom-cursor');
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailTimer = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        trailTimer++;
        if (trailTimer % 10 === 0) {
            createTrailNote(mouseX, mouseY);
        }

        if(vinyl) {
            const relX = mouseX / window.innerWidth - 0.5;
            const relY = mouseY / window.innerHeight - 0.5;
            vinyl.style.transform = `perspective(500px) rotateX(${relY * 20}deg) rotateY(${relX * 20}deg)`;
        }
    });

    function createTrailNote(x, y) {
        const note = document.createElement('span');
        note.classList.add('cursor-trail-note');
        const notes = ['♪', '♫', '♩'];
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        
        note.style.left = `${x + offsetX}px`;
        note.style.top = `${y + offsetY}px`;
        
        document.body.appendChild(note);
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                note.style.opacity = '0';
                note.style.transform = 'translate(-50%, -20px) scale(0.5) rotate(15deg)';
            });
        });
        
        setTimeout(() => { note.remove(); }, 1000);
    }

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Reset transform when mouse leaves window
    document.documentElement.addEventListener('mouseleave', () => {
        if(vinyl) vinyl.style.transform = `perspective(500px) rotateX(0deg) rotateY(0deg)`;
        cursorDot.style.opacity = '0';
    });
    document.documentElement.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
    });

    // 6. Scroll Staff Indicator
    const staffDiv = document.createElement('div');
    staffDiv.id = 'scroll-staff';
    staffDiv.classList.add('scroll-staff');
    for(let i=0; i<5; i++) {
        const line = document.createElement('div');
        line.classList.add('staff-line-vert');
        staffDiv.appendChild(line);
    }
    document.body.appendChild(staffDiv);

    const totalNotes = 15; 
    const activeNotes = [];
    const noteChars = ['♪', '♫', '♩', '♬', '♭'];

    window.addEventListener('scroll', () => {
        const scrollRange = document.body.scrollHeight - window.innerHeight;
        let scrollPercent = scrollRange > 0 ? window.scrollY / scrollRange : 0;
        
        let targetNotes = Math.floor(scrollPercent * totalNotes);
        if(targetNotes > totalNotes) targetNotes = totalNotes;
        if(targetNotes < 0) targetNotes = 0;
        
        // Add notes
        while (activeNotes.length < targetNotes) {
            const note = document.createElement('span');
            note.classList.add('scroll-note');
            note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
            const topPos = (activeNotes.length / totalNotes) * 100;
            note.style.top = `${topPos}%`;
            const stagger = (Math.random() - 0.5) * 30;
            note.style.marginLeft = `${stagger}px`;
            
            staffDiv.appendChild(note);
            activeNotes.push(note);
            
            // tiny animation effect when appended
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    note.style.opacity = '1';
                });
            });
        }
        
        // Remove notes
        while (activeNotes.length > targetNotes) {
            const note = activeNotes.pop();
            note.style.opacity = '0';
            setTimeout(() => note.remove(), 300);
        }
    });

    // Init state
    window.dispatchEvent(new Event('scroll'));

    // 7. Background Coquette Elements
    const coquetteChars = ['🐇', '♪', '♫', '♩', '🪶', '☕️', '🦢'];
    function spawnBgElement() {
        if(document.hidden) return;

        const el = document.createElement('span');
        el.classList.add('bg-coquette-element');
        el.textContent = coquetteChars[Math.floor(Math.random() * coquetteChars.length)];
        
        const maxX = document.body.scrollWidth - 50;
        const maxY = document.body.scrollHeight - 50;
        
        el.style.left = `${Math.random() * maxX}px`;
        el.style.top = `${Math.random() * maxY}px`;
        
        // Gentle upwards drift and rotation
        const driftX = (Math.random() - 0.5) * 80;
        const driftY = (Math.random() - 0.5) * 80 - 40; 
        const rotate = (Math.random() - 0.5) * 60;
        const scale = 0.6 + Math.random() * 0.8;
        
        el.style.setProperty('--dx', `${driftX}px`);
        el.style.setProperty('--dy', `${driftY}px`);
        el.style.setProperty('--rot', `${rotate}deg`);
        el.style.setProperty('--s', `${scale}`);
        
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 12000); 
    }

    for(let i=0; i<15; i++) {
        setTimeout(spawnBgElement, Math.random() * 8000);
    }
    setInterval(spawnBgElement, 800);
});

// RSVP Submission (via Formspree)
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const feedback = contactForm.querySelector('.form-feedback');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = "Sending...";
            submitBtn.disabled = true;
            feedback.innerHTML = "";
            
            const inputs = contactForm.querySelectorAll('input, textarea');
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
                        submitBtn.innerHTML = "Sent with Love <span class='script-font'>✧</span>";
                        feedback.innerHTML = "Your note has been received. Thank you.";
                        feedback.style.color = "var(--text-main)";
                        contactForm.reset();
                    }, 1500);
                } else {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    feedback.textContent = "Failed to send note. Please try again.";
                    feedback.style.color = "var(--accent-red)";
                    inputs.forEach(input => {
                        input.disabled = false;
                        input.style.opacity = '1';
                    });
                }
            } catch (error) {
                console.error("Error submitting RSVP:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                feedback.textContent = "Network error. Please try again later.";
                feedback.style.color = "var(--accent-red)";
                inputs.forEach(input => {
                    input.disabled = false;
                    input.style.opacity = '1';
                });
            }
        });
    }
});
