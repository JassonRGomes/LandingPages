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
        },
        'boat': {
            title: 'Boat Detailing',
            price: 'Custom Quote',
            time: 'Varies',
            desc: 'Comprehensive marine detailing to restore and protect your boat. We handle hull cleaning, oxidation removal, gel coat polishing, and marine ceramic coatings to keep your vessel protected from harsh water elements.',
            bg: 'assets/boat.png',
            included: [
                'Hull wash and decontamination',
                'Oxidation and water spot removal',
                'Gel coat compounding and polishing',
                'Marine ceramic coating or sealant',
                'Interior vinyl seating cleaned and UV protected',
                'Non-skid deck cleaning'
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

    // ==========================================
    // Excellence Gallery Logic
    // ==========================================
    const galleryData = {
        'interiors': {
            title: 'Car Interiors',
            images: ['assets/inter1.png', 'assets/inter2.png', 'assets/inter3.png', 'assets/inter4.png', 'assets/inter5.png', 'assets/inter6.png']
        },
        'beforeafter': {
            title: 'Before and After',
            images: ['assets/ba1.png', 'assets/ba2.png', 'assets/ba3.png', 'assets/ba4.png', 'assets/ba5.png', 'assets/ba6.png']
        },
        'exterior': {
            title: 'Exterior and Detailing',
            images: ['assets/ecd1.png', 'assets/ecd2.png', 'assets/ecd3.png', 'assets/ecd4.png', 'assets/ecd5png.png', 'assets/ecd6.png', 'assets/ecd7.png', 'assets/ecd8.png', 'assets/ecd9.png', 'assets/ecd10.png', 'assets/ecd11.png', 'assets/ecd12.png']
        }
    };

    const gModal = document.getElementById('gallery-modal');
    const gModalTitle = document.getElementById('gallery-modal-title');
    const gTrack = document.getElementById('gallery-track');
    const gPrev = document.getElementById('gallery-prev');
    const gNext = document.getElementById('gallery-next');
    const gDots = document.getElementById('gallery-dots');
    const gClose = document.querySelector('.gallery-close');
    const gBackdrop = document.querySelector('.gallery-backdrop');
    
    let currentGallery = [];
    let currentSlide = 0;

    const renderGallery = () => {
        gTrack.innerHTML = '';
        gDots.innerHTML = '';
        currentGallery.forEach((src, index) => {
            // Slide Item
            const slide = document.createElement('div');
            slide.className = 'carousel-slide-item';
            
            // Image Wrapper (for accurate logo positioning)
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-img-wrapper';

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Gallery Image ${index + 1}`;
            img.className = 'gallery-main-img';
            img.addEventListener('click', () => openLightbox(index));
            
            imgWrapper.appendChild(img);
            slide.appendChild(imgWrapper);
            gTrack.appendChild(slide);

            // Dot
            const dot = document.createElement('div');
            dot.className = 'dot';
            if(index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            gDots.appendChild(dot);
        });
        updateGalleryPosition();
    };

    const updateGalleryPosition = () => {
        gTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    const goToSlide = (index) => {
        currentSlide = index;
        updateGalleryPosition();
    };

    const nextSlide = () => {
        if (currentSlide < currentGallery.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // wrap around
        }
        updateGalleryPosition();
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = currentGallery.length - 1; // wrap around
        }
        updateGalleryPosition();
    };

    let currentGalleryCategory = '';

    const openGallery = (galleryId) => {
        const data = galleryData[galleryId];
        if(!data || !gModal) return;
        gModalTitle.textContent = data.title;
        currentGallery = data.images;
        currentGalleryCategory = galleryId;
        currentSlide = 0;
        renderGallery();
        gModal.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    const closeGallery = () => {
        if(!gModal) return;
        gModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', () => {
            openGallery(card.getAttribute('data-gallery'));
        });
    });

    // Explicitly bind the "View More" buttons to ensure they work on all devices
    document.querySelectorAll('.btn-gallery-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent duplicate firing if card also registers the click
            const card = btn.closest('.gallery-card');
            if (card) {
                openGallery(card.getAttribute('data-gallery'));
            }
        });
    });

    if(gClose) gClose.addEventListener('click', closeGallery);
    if(gBackdrop) gBackdrop.addEventListener('click', closeGallery);
    if(gNext) gNext.addEventListener('click', nextSlide);
    if(gPrev) gPrev.addEventListener('click', prevSlide);


    // ==========================================
    // Lightbox Logic
    // ==========================================
    const lbModal = document.getElementById('lightbox-modal');
    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');
    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');
    const lbBackdrop = document.getElementById('lightbox-backdrop');

    let lbIndex = 0;

    const openLightbox = (index) => {
        lbIndex = index;
        updateLightboxImage();
        lbModal.classList.add('active');
    };

    const closeLightbox = () => {
        lbModal.classList.remove('active');
    };

    const updateLightboxImage = () => {
        lbImg.src = currentGallery[lbIndex];
    };

    const lbNextImage = () => {
        if (lbIndex < currentGallery.length - 1) {
            lbIndex++;
        } else {
            lbIndex = 0;
        }
        updateLightboxImage();
    };

    const lbPrevImage = () => {
        if (lbIndex > 0) {
            lbIndex--;
        } else {
            lbIndex = currentGallery.length - 1;
        }
        updateLightboxImage();
    };

    if(lbClose) lbClose.addEventListener('click', closeLightbox);
    if(lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if(lbNext) lbNext.addEventListener('click', lbNextImage);
    if(lbPrev) lbPrev.addEventListener('click', lbPrevImage);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (lbModal && lbModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lbNextImage();
            if (e.key === 'ArrowLeft') lbPrevImage();
        } else if (gModal && gModal.classList.contains('active')) {
            if (e.key === 'Escape') closeGallery();
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        }
    });

    // Touch Support for Gallery Carousel
    let touchStartX = 0;
    let touchEndX = 0;
    
    if(gTrack) {
        gTrack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        gTrack.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
    }

    const handleSwipe = () => {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    };

    // Touch Support for Lightbox
    let lbTouchStartX = 0;
    let lbTouchEndX = 0;

    if(lbImg) {
        lbImg.addEventListener('touchstart', e => {
            lbTouchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        lbImg.addEventListener('touchend', e => {
            lbTouchEndX = e.changedTouches[0].screenX;
            if (lbTouchEndX < lbTouchStartX - 50) lbNextImage();
            if (lbTouchEndX > lbTouchStartX + 50) lbPrevImage();
        }, {passive: true});
    }

    // ==========================================
    // Pricing Carousel Logic
    // ==========================================
    const pTrack = document.getElementById('pricing-track');
    const pDotsContainer = document.getElementById('pricing-dots');
    const pPrev = document.getElementById('pricing-prev');
    const pNext = document.getElementById('pricing-next');
    
    if (pTrack) {
        const serviceKeys = Object.keys(servicesData);
        let currentPriceSlide = 0;
        let priceAutoPlayInterval;

        // Generate Cards
        serviceKeys.forEach((key, index) => {
            const data = servicesData[key];
            
            const wrapper = document.createElement('div');
            wrapper.className = 'pricing-card-wrapper';
            
            const card = document.createElement('div');
            card.className = `pricing-card glass-panel ${key === 'full' ? 'featured' : ''}`;
            card.style.backgroundImage = `url('${data.bg}')`;
            
            let html = '';
            if (key === 'full') {
                html += `<div class="ribbon"><span style="color: #ff3333;">Best Value</span> <span style="color: #FFD700;">★</span></div>`;
            }
            
            // Format price string to match design (e.g. "From $99")
            let priceDisplay = data.price;
            if (data.price.includes('$')) {
                const parts = data.price.split('$');
                priceDisplay = `${parts[0]}<span>$</span>${parts[1]}`;
            }

            html += `
                <h3>${data.title}</h3>
                <div class="price">${priceDisplay}</div>
                <ul class="features">
            `;
            
            // Take first 4 actual items (excluding bold headers) for the short pricing list
            const listItems = data.included.filter(i => !i.includes('<b>')).slice(0, 4);
            listItems.forEach(item => {
                html += `<li>${item}</li>`;
            });
            
            const smsBody = encodeURIComponent(`Hello I would like to book the ${data.title} service.`);
            html += `
                </ul>
                <a href="sms:+19453644215?body=${smsBody}" class="${key === 'full' ? 'btn-primary' : 'btn-primary-outline'}">Choose Service</a>
            `;
            
            card.innerHTML = html;
            wrapper.appendChild(card);
            pTrack.appendChild(wrapper);

            // Dot
            if (pDotsContainer) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                if(index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToPriceSlide(index);
                    resetPriceAutoPlay();
                });
                pDotsContainer.appendChild(dot);
            }
        });

        const getCardsPerView = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 4;
        };

        const updatePricePosition = () => {
            const cardsPerView = getCardsPerView();
            const wrapperWidth = pTrack.querySelector('.pricing-card-wrapper').offsetWidth;
            pTrack.style.transform = `translateX(-${currentPriceSlide * wrapperWidth}px)`;
            
            // Recalculate max dots based on cards per view
            const maxSlide = serviceKeys.length - cardsPerView;
            
            if (pDotsContainer) {
                const dots = pDotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    dot.style.display = index <= maxSlide ? 'block' : 'none';
                    dot.classList.toggle('active', index === currentPriceSlide);
                });
            }
        };

        window.addEventListener('resize', updatePricePosition);

        const goToPriceSlide = (index) => {
            currentPriceSlide = index;
            updatePricePosition();
        };

        const nextPriceSlide = () => {
            const maxSlide = serviceKeys.length - getCardsPerView();
            currentPriceSlide = (currentPriceSlide < maxSlide) ? currentPriceSlide + 1 : 0;
            updatePricePosition();
        };

        const prevPriceSlide = () => {
            const maxSlide = serviceKeys.length - getCardsPerView();
            currentPriceSlide = (currentPriceSlide > 0) ? currentPriceSlide - 1 : maxSlide;
            updatePricePosition();
        };

        if (pNext) {
            pNext.addEventListener('click', () => {
                nextPriceSlide();
                resetPriceAutoPlay();
            });
        }
        if (pPrev) {
            pPrev.addEventListener('click', () => {
                prevPriceSlide();
                resetPriceAutoPlay();
            });
        }

        // Auto-play logic
        const startPriceAutoPlay = () => {
            priceAutoPlayInterval = setInterval(nextPriceSlide, 8000); // 8 seconds for slower speed
        };
        const stopPriceAutoPlay = () => {
            clearInterval(priceAutoPlayInterval);
        };
        const resetPriceAutoPlay = () => {
            stopPriceAutoPlay();
            startPriceAutoPlay();
        };

        // Pause on hover or touch
        const pContainer = document.querySelector('.pricing-carousel-container');
        if (pContainer) {
            pContainer.addEventListener('mouseenter', stopPriceAutoPlay);
            pContainer.addEventListener('mouseleave', startPriceAutoPlay);
            pContainer.addEventListener('touchstart', stopPriceAutoPlay, {passive: true});
            pContainer.addEventListener('touchend', startPriceAutoPlay, {passive: true});
        }

        updatePricePosition();
        startPriceAutoPlay();
    }
});
