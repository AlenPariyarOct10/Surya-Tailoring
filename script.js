document.addEventListener('DOMContentLoaded', () => {
    
    /* ==================================
       Page Loader
    ================================== */
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    /* ==================================
       Header Scroll & Active Links
    ================================== */
    const header = document.getElementById('header');
    const backToTop = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        // Header styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active link switching
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    /* ==================================
       Mobile Menu Toggle
    ================================== */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    const navCta = document.querySelector('.nav-cta');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navCta.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navCta.classList.remove('active');
        });
    });

    /* ==================================
       Scroll Reveal Animations
    ================================== */
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // Trigger on load

    /* ==================================
       Swiper Slider for Products
    ================================== */
    const swiper = new Swiper('.products-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            }
        }
    });

    /* ==================================
       Three.js Hero Background - Animated Floating Images
    ================================== */
    function initHeroThreeJS() {
        const container = document.getElementById('hero-canvas');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Create floating fabric/image planes with movement
        const imageUrls = [
            'assets/img/suit.png',
            'assets/img/shirt.png',
            'assets/img/school-uniform.png',
            'assets/img/org-uniform.png'
        ];

        const textureLoader = new THREE.TextureLoader();
        const planes = [];
        let loadedCount = 0;

        imageUrls.forEach((url, index) => {
            textureLoader.load(url, (texture) => {
                loadedCount++;
                
                const geometry = new THREE.PlaneGeometry(2, 2.5);
                const material = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    transparent: true,
                    opacity: 0.7
                });
                const plane = new THREE.Mesh(geometry, material);

                // Position planes in a circular pattern with different depths
                const angle = (index / imageUrls.length) * Math.PI * 2;
                const distance = 5;
                plane.position.x = Math.cos(angle) * distance;
                plane.position.y = Math.sin(angle) * distance - 1;
                plane.position.z = Math.sin(angle) * 3 + index;
                
                // Store animation properties
                plane.userData = {
                    baseX: plane.position.x,
                    baseY: plane.position.y,
                    baseZ: plane.position.z,
                    rotationSpeed: 0.002 + Math.random() * 0.002,
                    floatSpeed: 0.5 + Math.random() * 0.5,
                    floatAmount: 0.5 + Math.random() * 1,
                    angle: angle,
                    orbitalSpeed: 0.0005 + Math.random() * 0.0005
                };

                planes.push(plane);
                scene.add(plane);
            }, undefined, (error) => {
                console.log('Texture load error:', url);
            });
        });

        // Golden particles background
        const geometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xD4AF37, // Gold
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);

        camera.position.z = 8;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        let time = 0;

        function animate() {
            requestAnimationFrame(animate);

            targetX = mouseX * 0.0005;
            targetY = mouseY * 0.0005;

            // Animate particles
            particlesMesh.rotation.y += 0.0003;
            particlesMesh.rotation.x += 0.0001;
            particlesMesh.rotation.x += 0.02 * (targetY - particlesMesh.rotation.x);
            particlesMesh.rotation.y += 0.02 * (targetX - particlesMesh.rotation.y);

            time += 0.01;

            // Animate each image plane
            planes.forEach((plane) => {
                // Orbital motion
                plane.userData.angle += plane.userData.orbitalSpeed;
                const orbitDistance = 5;
                const newX = Math.cos(plane.userData.angle) * orbitDistance;
                const newY = Math.sin(plane.userData.angle) * orbitDistance;

                // Floating motion
                const floatY = Math.sin(time * plane.userData.floatSpeed) * plane.userData.floatAmount;

                plane.position.x = newX + mouseX * 0.0002;
                plane.position.y = newY + floatY + mouseY * 0.0002;
                plane.position.z = plane.userData.baseZ + Math.cos(time * 0.5) * 1;

                // Rotation for dynamic effect
                plane.rotation.z += plane.userData.rotationSpeed;
                plane.rotation.x = Math.sin(time * 0.3) * 0.3;
                plane.rotation.y = Math.cos(time * 0.4) * 0.3;

                // Opacity pulse
                plane.material.opacity = 0.5 + Math.sin(time * 1.5) * 0.3;
            });

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    initHeroThreeJS();

    /* ==================================
       Three.js Showcase Section - Enhanced 3D Fabric View
    ================================== */
    function initShowcaseThreeJS() {
        const container = document.getElementById('showcase-canvas');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xD4AF37, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 1);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        // Load and display product image on a 3D cloth-like surface
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load('assets/img/suit.png', (texture) => {
            // Create a cloth-like mesh
            const geometry = new THREE.ClothGeometry(20, 20);
            const material = new THREE.MeshStandardMaterial({ 
                map: texture,
                metalness: 0.1,
                roughness: 0.6,
                wireframe: false
            });
            
            const fabric = new THREE.Mesh(geometry, material);
            scene.add(fabric);
        });

        // Add wireframe overlay for detail
        const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 128, 32);
        const wireframeGeom = new THREE.WireframeGeometry(geometry);
        const wireframeInfo = new THREE.LineBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.15 });
        const wireframe = new THREE.LineSegments(wireframeGeom, wireframeInfo);
        scene.add(wireframe);

        camera.position.z = 6;

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
        });

        container.addEventListener('mousemove', (e) => {
            if(isDragging) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };

                wireframe.rotation.y += deltaMove.x * 0.01;
                wireframe.rotation.x += deltaMove.y * 0.01;
            }
            previousMousePosition = { x: e.offsetX, y: e.offsetY };
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch support
        container.addEventListener('touchstart', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, {passive:true});

        container.addEventListener('touchmove', (e) => {
            if(isDragging) {
                const deltaMove = {
                    x: e.touches[0].clientX - previousMousePosition.x,
                    y: e.touches[0].clientY - previousMousePosition.y
                };

                wireframe.rotation.y += deltaMove.x * 0.01;
                wireframe.rotation.x += deltaMove.y * 0.01;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }, {passive:true});

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        function animate() {
            requestAnimationFrame(animate);
            if(!isDragging) {
                wireframe.rotation.y += 0.005;
                wireframe.rotation.x += 0.002;
            }
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            if (container) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        });
    }

    // Custom cloth geometry for fabric visualization
    THREE.ClothGeometry = class extends THREE.BufferGeometry {
        constructor(width = 1, height = 1) {
            super();
            
            const vertices = [];
            const indices = [];
            
            for (let y = 0; y <= height; y++) {
                for (let x = 0; x <= width; x++) {
                    vertices.push(
                        (x / width) * 2 - 1,
                        (y / height) * 2 - 1,
                        Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.3
                    );
                }
            }
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const a = y * (width + 1) + x;
                    const b = a + 1;
                    const c = a + (width + 1);
                    const d = c + 1;
                    
                    indices.push(a, c, b);
                    indices.push(b, c, d);
                }
            }
            
            this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            this.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
            this.computeVertexNormals();
        }
    };

    initShowcaseThreeJS();

    /* ==================================
       Form Submission
    ================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            
            // Simulate network request
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.backgroundColor = '#25D366';
                btn.style.color = '#fff';
                btn.style.borderColor = '#25D366';
                
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style = '';
                }, 3000);
            }, 1500);
        });
    }
});
