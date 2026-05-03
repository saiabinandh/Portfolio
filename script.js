// Subtle parallax effect on the elegant liquid blobs based on mouse movement
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    const blobGold = document.querySelector('.blob-gold');
    const blobSilver = document.querySelector('.blob-silver');
    const blobDark = document.querySelector('.blob-dark');

    if (blobGold) blobGold.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    if (blobSilver) blobSilver.style.transform = `translate(-${x * 20}px, ${y * 20}px)`;
    if (blobDark) blobDark.style.transform = `translate(-${x * 40}px, -${y * 40}px)`;
});

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add elegant entrance animations for elements
const animatedElements = document.querySelectorAll('.card, .roadmap-container, .roadmap-item, .section-title, .skill-tag, .hero-content, .profile-img');
const observerOptions = {
    threshold: 0,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        }
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
    });
}, observerOptions);

animatedElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    observer.observe(el);
});

// Infinite Interactive Video Marquee (Mouse-based)
const marqueeCard = document.querySelector('.marquee-card');
const marqueeTrack = document.querySelector('.marquee-track');

if (marqueeCard && marqueeTrack) {
    let mouseX = 0; 
    let isHovering = false;
    let isVideoPlaying = false;
    let currentX = 0;
    let targetX = null;
    let speed = 0;

    // Track if any video is playing to stop the marquee and center it
    const allVideos = marqueeTrack.querySelectorAll('video');
    allVideos.forEach(v => {
        v.addEventListener('play', (e) => { 
            isVideoPlaying = true; 
            const containerRect = marqueeCard.getBoundingClientRect();
            const videoRect = e.target.getBoundingClientRect();
            const containerCenter = containerRect.width / 2;
            const videoCenter = (videoRect.left - containerRect.left) + videoRect.width / 2;
            const diff = containerCenter - videoCenter;
            targetX = currentX + diff;
        });
        v.addEventListener('pause', () => { 
            isVideoPlaying = false; 
            targetX = null;
        });
        v.addEventListener('ended', () => { 
            isVideoPlaying = false; 
            targetX = null;
        });
    });

    // Make arrows clickable for manual navigation
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    if (arrowLeft) {
        arrowLeft.addEventListener('click', (e) => {
            if (isVideoPlaying) return; // Disable if playing
            e.stopPropagation();
            targetX = currentX + 300;
        });
    }
    if (arrowRight) {
        arrowRight.addEventListener('click', (e) => {
            if (isVideoPlaying) return; // Disable if playing
            e.stopPropagation();
            targetX = currentX - 300;
        });
    }

    marqueeCard.addEventListener('mousemove', (e) => {
        if (isVideoPlaying) {
            isHovering = false;
            return;
        }
        const rect = marqueeCard.getBoundingClientRect();
        // Mouse X relative to container center (-1 to 1)
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        
        // Only trigger movement when mouse is near the left or right edges (arrows)
        if (Math.abs(mouseX) > 0.7) {
            isHovering = true;
        } else {
            isHovering = false;
        }
    });

    marqueeCard.addEventListener('mouseleave', () => {
        isHovering = false;
        mouseX = 0; // stop moving
    });

    marqueeCard.addEventListener('touchstart', (e) => {
        if (isVideoPlaying) {
            isHovering = false;
            return;
        }
        const rect = marqueeCard.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        isHovering = true;
    });

    marqueeCard.addEventListener('touchmove', (e) => {
        if (isVideoPlaying) return;
        const rect = marqueeCard.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;

        if (Math.abs(mouseX) > 0.7) {
            isHovering = true;
        } else {
            isHovering = false;
        }
    }, {passive: true});

    marqueeCard.addEventListener('touchend', () => {
        isHovering = false;
        mouseX = 0;
    });

    function animateMarquee() {
        const isMobile = window.innerWidth <= 768;
        const baseSpeed = isMobile ? 0 : 1.0; // No auto-scroll on mobile
        let targetSpeed = baseSpeed;

        if (isVideoPlaying) {
            targetSpeed = 0; // Stop if video is playing
        } else if (isHovering) {
            // Smooth mouse/touch effect
            targetSpeed = mouseX * 5; 
        }

        // Smoothly transition to the target speed
        speed += (targetSpeed - speed) * 0.05;

        // Priority 1: Centering a playing video or manual arrow slide
        if (targetX !== null) {
            currentX += (targetX - currentX) * 0.08;
            if (Math.abs(targetX - currentX) < 0.1) {
                currentX = targetX;
                if (!isVideoPlaying) targetX = null; // Only clear if not playing
            }
        } else {
            currentX -= speed;
        }

            // Calculate exact width of one full set of 5 videos + 5 gaps
            const firstVideo = marqueeTrack.children[0];
            if (firstVideo) {
                const videoWidth = firstVideo.offsetWidth;
                const gap = parseFloat(getComputedStyle(marqueeTrack).gap) || 32;
                const halfWidth = (videoWidth + gap) * 5;

                if (currentX > 0) {
                    currentX -= halfWidth;
                    if (targetX !== null) targetX -= halfWidth;
                } else if (currentX <= -halfWidth) {
                    currentX += halfWidth;
                    if (targetX !== null) targetX += halfWidth;
                }

                marqueeTrack.style.transform = `translateX(${currentX}px)`;
            }

        requestAnimationFrame(animateMarquee);
    }
    
    // Kick off animation
    animateMarquee();
}
