class PayFlowApp {
            constructor() {
                this.init();
            }

            init() {
                this.setupScrollEffects();
                this.setupDemoInteractions();
                this.setupCounters();
                this.setupTabInteractions();
                this.setupMobileMenu();
            }

            setupScrollEffects() {
                window.addEventListener('scroll', () => {
                    const winHeight = window.innerHeight;
                    const docHeight = document.documentElement.scrollHeight;
                    const scrollTop = window.pageYOffset;
                    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
                    
                    document.querySelector('.scroll-progress').style.width = scrollPercent + '%';

                    const backToTop = document.querySelector('.back-to-top');
                    if (scrollTop > 300) {
                        backToTop.classList.add('show');
                    } else {
                        backToTop.classList.remove('show');
                    }
                });

                document.querySelector('.back-to-top').addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            setupDemoInteractions() {
                const paymentMethods = document.querySelectorAll('.payment-method');
                const paymentForms = document.querySelectorAll('.payment-form');
                const payNowBtn = document.querySelector('.pay-now-btn');

                paymentMethods.forEach(method => {
                    method.addEventListener('click', () => {
                        paymentMethods.forEach(m => m.classList.remove('active'));
                        method.classList.add('active');
                        
                        const methodType = method.getAttribute('data-method');
                        paymentForms.forEach(form => {
                            form.classList.remove('active');
                            if (form.id === `${methodType}-form`) {
                                form.classList.add('active');
                            }
                        });
                    });
                });

                payNowBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.processPayment();
                });
            }

            processPayment() {
                const payNowBtn = document.querySelector('.pay-now-btn');
                const originalText = payNowBtn.innerHTML;
                
                payNowBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                payNowBtn.disabled = true;

                setTimeout(() => {
                    payNowBtn.innerHTML = '<i class="fas fa-check me-2"></i>Payment Successful!';
                    payNowBtn.className = 'btn btn-success w-100 mt-4';
                    this.showToast('Payment processed successfully!');
                    
                    setTimeout(() => {
                        payNowBtn.innerHTML = originalText;
                        payNowBtn.className = 'btn btn-primary w-100 mt-4 pay-now-btn';
                        payNowBtn.disabled = false;
                    }, 3000);
                }, 2000);
            }

            setupCounters() {
                const counters = document.querySelectorAll('.stat-counter');
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                });

                counters.forEach(counter => observer.observe(counter));
            }

            animateCounter(element) {
                const target = parseFloat(element.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                        clearInterval(timer);
                    } else {
                        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
                    }
                }, 16);
            }

            setupTabInteractions() {
                const tabButtons = document.querySelectorAll('.solution-tabs .nav-link');
                
                tabButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        tabButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                    });
                });
            }

            setupMobileMenu() {
                const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth < 992) {
                            navbarToggler.classList.add('collapsed');
                            navbarCollapse.classList.remove('show');
                        }
                    });
                });
            }

            showToast(message) {
                const toast = document.createElement('div');
                toast.className = 'toast-notification';
                toast.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="fas fa-check-circle text-success me-3"></i>
                        <div>
                            <strong>Success</strong>
                            <p class="mb-0">${message}</p>
                        </div>
                    </div>
                `;

                document.body.appendChild(toast);
                setTimeout(() => toast.classList.add('show'), 100);
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 4000);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new PayFlowApp();
        });

        document.querySelectorAll('.payment-form input').forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim() === '') {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        });