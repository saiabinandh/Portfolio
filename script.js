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
    let currentX = 0;
    let speed = 0;

    marqueeCard.addEventListener('mousemove', (e) => {
        const rect = marqueeCard.getBoundingClientRect();
        // Mouse X relative to container center (-1 to 1)
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        isHovering = true;
    });

    marqueeCard.addEventListener('mouseleave', () => {
        isHovering = false;
        mouseX = 0; // stop moving
    });

    marqueeCard.addEventListener('touchstart', (e) => {
        const rect = marqueeCard.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        isHovering = true;
    });

    marqueeCard.addEventListener('touchmove', (e) => {
        const rect = marqueeCard.getBoundingClientRect();
        const touch = e.touches[0];
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    }, {passive: true});

    marqueeCard.addEventListener('touchend', () => {
        isHovering = false;
        mouseX = 0;
    });

    function animateMarquee() {
        const baseSpeed = 1.0; // Slow, continuous auto-scroll speed
        let targetSpeed = baseSpeed;

        if (isHovering) {
            // Smooth mouse effect. Max speed scaled down to 5 for a "not fast" interaction
            targetSpeed = mouseX * 5; 
        }

        // Smoothly transition to the target speed
        speed += (targetSpeed - speed) * 0.05;

        currentX -= speed;

            // Calculate exact width of one full set of 5 videos + 5 gaps
            const firstVideo = marqueeTrack.children[0];
            if (firstVideo) {
                const videoWidth = firstVideo.offsetWidth;
                const gap = parseFloat(getComputedStyle(marqueeTrack).gap) || 32;
                const halfWidth = (videoWidth + gap) * 5;

                if (currentX > 0) {
                    currentX -= halfWidth;
                } else if (currentX <= -halfWidth) {
                    currentX += halfWidth;
                }

                marqueeTrack.style.transform = `translateX(${currentX}px)`;
            }

        requestAnimationFrame(animateMarquee);
    }
    
    // Kick off animation
    animateMarquee();
}
