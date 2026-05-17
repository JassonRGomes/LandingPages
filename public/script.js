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

    // Ensure the video plays (Safari Mobile can be extremely strict)
    const video = document.getElementById('bg-video');
    if (video) {
        // Explicitly set properties that Safari requires
        video.defaultMuted = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        
        // Try to play
        let playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Safari blocked autoplay. Waiting for interaction.", error);
                
                // Fallback for Safari strict mode
                const forcePlay = () => {
                    video.volume = 0; // Completely silence the video
                    video.play();
                    window.removeEventListener('touchstart', forcePlay);
                    window.removeEventListener('touchmove', forcePlay);
                    window.removeEventListener('click', forcePlay);
                    window.removeEventListener('scroll', forcePlay);
                };
                window.addEventListener('touchstart', forcePlay, { once: true });
                window.addEventListener('touchmove', forcePlay, { once: true });
                window.addEventListener('click', forcePlay, { once: true });
                window.addEventListener('scroll', forcePlay, { once: true });
            });
        }

        // Force loop for mobile browsers using timeupdate hack
        video.addEventListener('timeupdate', () => {
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
                // Adjust for fixed header height
                const headerOffset = 120; // 120px works perfectly for both desktop and mobile
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
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

    // ==========================================
    // Services Modal Logic
    // ==========================================
    const servicesData = {
        'inout': {
            title: 'In & Out Detail',
            price: 'From $99',
            time: '1hr 30min',
            desc: 'With our In & Out Service, your vehicle receives a thorough clean which is designed to tackle day-to-day dust and dirt, while maintaining your car presentable and comfortable for regular driving.',
            bg: 'assets/inout.png',
            included: [
                '<b>Exterior:</b>',
                'Foaming hand soap wash',
                'Tire dressing applied',
                'Door jambs',
                'Fuel compartment wiped down',
                '<br><b>Interior:</b>',
                'Light surface cleaning',
                'Cupholders detailed',
                'Windows cleaned',
                'Full vacuuming'
            ]
        },
        'shine': {
            title: 'Shine Detail',
            price: 'From $179.00',
            time: '2hrs 30min',
            desc: 'With our Shine Detail services, we specialize in delivering a deep and thorough clean that revitalizes your entire vehicle. Our process is designed to restore your carpets to a fresh, like-new condition while bringing a brilliant shine to your paintwork. We also take care of your interior by renewing the color and finish of leather and plastic surfaces, ensuring they look vibrant and well-maintained. With our expertise, your car not only regains its original beauty but also achieves a lasting, refreshed appearance.',
            bg: 'assets/shine.png',
            included: [
                '<b>Exterior:</b>',
                'Hand wash with foaming cleanser',
                'Plastics treated with UV protection',
                'Ceramic wax applied to paintwork',
                'Tire gloss finish',
                'Thorough cleaning of door jambs and fuel compartment',
                '<br><b>Interior:</b>',
                'Plastic and leather areas thoroughly cleaned and treated with premium conditioner',
                'Leather seats nourished with conditioner',
                'Carpets and mats shampooed',
                'Full interior vacuuming'
            ]
        },
        'full': {
            title: 'Excellence Detail',
            price: 'From $299.00',
            time: '4hrs 30min',
            desc: 'Our Excellence Detail package is the ultimate full-service option, combining the best of both interior and exterior care. This comprehensive treatment includes a clay bar application for effective paintwork decontamination, ensuring a smooth, clean surface ready for enhanced shine and long-lasting protection. At the same time, your interior receives a deep clean and full sanitization, leaving it fresh, hygienic, and revitalized. It’s the ideal choice for those who want their vehicle restored and protected inside and out.',
            bg: 'assets/full.png',
            included: [
                '<b>Exterior:</b>',
                'Foam hand wash',
                'Plastics treated with UV protection',
                'Paintwork clay bar decontamination',
                'Hand wax for shine and 6 months protection',
                'Tires dressed with shine',
                'Engine bay cleaned',
                'Thorough wipe-down of door jambs and fuel cap area',
                '<br><b>Interior:</b>',
                'Fabric seats deeply shampooed and cleaned with extractor machine',
                'Plastic and leather surfaces detailed and protected',
                'Leather treated with conditioner',
                'Complete vacuuming',
                'Deep carpet shampooing'
            ]
        },
        'interior': {
            title: 'Premium Interior Detail',
            price: 'From $169.00',
            time: '3hrs 30min',
            desc: 'Our Premium Interior Detail service is a comprehensive deep clean designed to restore and refresh your vehicle’s interior. This process includes advanced decontamination techniques that target and eliminate stubborn odors, remove stains, and address built-up dirt and grime. By focusing on every surface and hard-to-reach area, this service not only enhances the appearance of your interior but also helps create a healthier, fresher environment.',
            bg: 'assets/interior.png',
            included: [
                'Thorough vacuuming of all carpets, mats, seats, and hard-to-reach areas including pet hair',
                'Deep shampooing of seats with advanced extraction for stain and odor removal',
                'Carpet shampooing and extraction',
                'Cup holders meticulously detailed',
                'Leather and plastic surfaces deep cleaned and protected',
                'Steamer decontamination cleaning',
                'Interior glass cleaned streak-free',
                'Air vents thoroughly cleaned'
            ]
        },
        'enhancer': {
            title: 'Shine Enhancer',
            price: 'From $399.00',
            time: '5hrs',
            desc: 'Bring out the shine on your vehicle’s exterior with our Shine Enhancer. This all-inclusive service combines deep cleaning, polishing, and protective treatments designed to maximize shine and safeguard your vehicle’s paint.',
            bg: 'assets/enhancer.png',
            included: [
                'Thorough exterior hand wash',
                'Clay bar treatment to refine the paint surface',
                'Tire dressing and rim detailing',
                'Exterior glass cleaning',
                '3-in-1 polish compound applied with orbital foam pad machine',
                'Complete spray-on sealant',
                'Scratch reduction up to 50%'
            ]
        },
        'paint': {
            title: '3 Stage Paint Correction',
            price: 'From $699.00',
            time: '8hrs',
            desc: 'The process moves through three specialized stages: an aggressive compound to tackle deep flaws, a refining polish to restore clarity, and a final ultra-fine polish to achieve a flawless mirror-like shine. Between each phase, IPA wipe-downs ensure every correction is precise and authentic.',
            bg: 'assets/paint.png',
            included: [
                'Thorough exterior hand wash',
                'Clay bar treatment',
                'Tire dressing and rim detailing',
                'Exterior glass cleaning',
                '3-stage paint correction using rotary and orbital polishers',
                'Spray-on sealant for 6 months protection',
                'Scratch reduction up to 85%'
            ]
        },
        'ceramic': {
            title: 'Excellence Ceramic Coating',
            price: 'From $799.00',
            time: '8hrs',
            desc: 'Ceramic coating is a liquid polymer applied to your vehicle’s paint that bonds at a molecular level, creating a durable protective layer. It enhances shine, repels water and dirt, makes cleaning easier, and helps shield the paint from UV rays, chemicals, and minor scratches for years instead of months.',
            bg: 'assets/ceramic.png',
            included: [
                'Thorough exterior hand wash',
                'Clay bar treatment',
                'Tire dressing and rim detailing',
                'Exterior glass cleaning',
                '3-in-1 polish compound with orbital foam pad machine'
            ]
        }
    };

    const modal = document.getElementById('service-modal');
    const modalBg = document.getElementById('modal-bg');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalTime = document.getElementById('modal-time');
    const modalDesc = document.getElementById('modal-desc');
    const modalList = document.getElementById('modal-list');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalBookBtn = document.getElementById('modal-book-btn');

    const openModal = (serviceId) => {
        const data = servicesData[serviceId];
        if (!data || !modal) return;

        // Populate Data
        modalTitle.textContent = data.title;
        modalPrice.textContent = data.price;
        modalTime.textContent = data.time;
        modalDesc.textContent = data.desc;
        modalBg.style.backgroundImage = `url('${data.bg}')`;

        // Populate List
        modalList.innerHTML = '';
        data.included.forEach(item => {
            // Check if item is just a bold section header
            if (item.startsWith('<') && item.endsWith('>')) {
                const li = document.createElement('li');
                li.innerHTML = item;
                li.style.listStyle = 'none';
                li.style.paddingLeft = '0';
                // Remove the bullet dot via class or inline style
                li.className = 'no-bullet';
                modalList.appendChild(li);
            } else {
                const li = document.createElement('li');
                li.innerHTML = item;
                modalList.appendChild(li);
            }
        });

        // Show Modal
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    // Event Listeners for "Read More" buttons
    document.querySelectorAll('.btn-read-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceId = btn.getAttribute('data-service');
            if (serviceId) {
                e.preventDefault();
                openModal(serviceId);
            }
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalBookBtn) {
        modalBookBtn.addEventListener('click', () => {
            closeModal(); // Close modal before scrolling
        });
    }

});
