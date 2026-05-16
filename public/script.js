document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    // Change navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Ensure the video plays (sometimes browsers block autoplay)
    const video = document.getElementById('bg-video');
    if (video) {
        video.play().catch(error => {
            console.log("Video autoplay was prevented by browser. User interaction needed.", error);
        });

        // Force loop for mobile browsers using timeupdate hack
        video.addEventListener('timeupdate', () => {
            // If we are within 0.2 seconds of the end, restart
            if (video.duration && video.currentTime >= video.duration - 0.2) {
                video.currentTime = 0;
                video.play();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Testimonials Carousel functionality
    const track = document.querySelector('.carousel-track');
    let slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    let currentIndex = 0;

    const moveToSlide = (index) => {
        if (slides.length === 0) return;
        track.style.transform = `translateX(-${index * 100}%)`;
    };

    if (slides.length > 0) {
        nextButton.addEventListener('click', () => {
            if (currentIndex >= slides.length - 1) {
                currentIndex = 0; // Loop back to start
            } else {
                currentIndex++;
            }
            moveToSlide(currentIndex);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex <= 0) {
                currentIndex = slides.length - 1; // Loop back to end
            } else {
                currentIndex--;
            }
            moveToSlide(currentIndex);
        });
    }

    // Add New Review Form functionality
    const reviewForm = document.getElementById('add-review-form');
    
    // Load saved reviews from localStorage
    const savedReviews = JSON.parse(localStorage.getItem('excellence-reviews') || '[]');
    savedReviews.forEach(review => {
        const newSlide = document.createElement('div');
        newSlide.className = 'review-card glass-panel carousel-slide';
        newSlide.innerHTML = `
            <div class="reviewer">
                <div class="avatar" style="background: ${review.color};">${review.initials}</div>
                <div class="info">
                    <h4>${review.name}</h4>
                    <span class="stars" style="color: #FBBC05;">${review.starsHtml}</span>
                </div>
            </div>
            <p>"${review.text}"</p>
        `;
        if (track) track.appendChild(newSlide);
    });
    
    if (track) {
        slides = Array.from(track.children);
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('review-name').value;
            const rating = parseInt(document.getElementById('review-rating').value);
            const text = document.getElementById('review-text').value;

            // Generate initials
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            
            // Generate stars string
            let starsHtml = '';
            for (let i = 0; i < 5; i++) {
                if (i < rating) starsHtml += '★';
                else starsHtml += '☆';
            }

            // Random color for avatar background
            const colors = ['#4285F4', '#34A853', '#EA4335', '#FBBC05', '#9C27B0', '#00BCD4'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            // Save to localStorage
            const reviewObj = { name, rating, text, initials, color: randomColor, starsHtml };
            const existingReviews = JSON.parse(localStorage.getItem('excellence-reviews') || '[]');
            existingReviews.push(reviewObj);
            localStorage.setItem('excellence-reviews', JSON.stringify(existingReviews));

            // Create new slide element
            const newSlide = document.createElement('div');
            newSlide.className = 'review-card glass-panel carousel-slide';
            newSlide.innerHTML = `
                <div class="reviewer">
                    <div class="avatar" style="background: ${randomColor};">${initials}</div>
                    <div class="info">
                        <h4>${name}</h4>
                        <span class="stars" style="color: #FBBC05;">${starsHtml}</span>
                    </div>
                </div>
                <p>"${text}"</p>
            `;

            // Append to track
            track.appendChild(newSlide);

            // Update slides array
            slides = Array.from(track.children);

            // Move carousel to the new review
            currentIndex = slides.length - 1;
            moveToSlide(currentIndex);

            // Reset form and notify user
            reviewForm.reset();
            alert('Thank you for your review!');
        });
    }
});
