/**
 * 安知鱼主题 - 关于我页面 JavaScript
 * 实现各种动画和交互效果
 */

(function() {
    'use strict';

    // 工具函数
    const utils = {
        // 节流函数
        throttle: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 检查元素是否在视口内
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // 检查元素是否部分可见
        isPartiallyVisible: function(element) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (rect.bottom > 0 && rect.top < windowHeight) &&
                   (rect.right > 0 && rect.left < windowWidth);
        },

        // 缓动函数
        easeOutQuart: function(t) {
            return 1 - (--t) * t * t * t;
        }
    };

    // 数字计数动画
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('.statistic-item .number');
            this.animatedCounters = new Set();
            this.init();
        }

        init() {
            this.setupIntersectionObserver();
        }

        setupIntersectionObserver() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.animatedCounters.has(entry.target)) {
                            this.animateCounter(entry.target);
                            this.animatedCounters.add(entry.target);
                        }
                    });
                }, {
                    threshold: 0.5
                });

                this.counters.forEach(counter => {
                    observer.observe(counter);
                });
            } else {
                // 降级处理：滚动监听
                window.addEventListener('scroll', utils.throttle(() => {
                    this.counters.forEach(counter => {
                        if (utils.isPartiallyVisible(counter) && !this.animatedCounters.has(counter)) {
                            this.animateCounter(counter);
                            this.animatedCounters.add(counter);
                        }
                    });
                }, 100));
            }
        }

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'), 10);
            const duration = 2000; // 2秒动画
            const startTime = performance.now();
            const startValue = 0;

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 使用缓动函数
                const easedProgress = utils.easeOutQuart(progress);
                const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
                
                element.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // 技能图标动画
    class SkillIconAnimation {
        constructor() {
            this.skillIcons = document.querySelectorAll('.tags-group-icon, .skill-icon');
            this.init();
        }

        init() {
            this.skillIcons.forEach((icon, index) => {
                // 添加延迟动画
                icon.style.animationDelay = `${index * 0.1}s`;
                
                // 鼠标悬停效果
                icon.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
                icon.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            });
        }

        handleMouseEnter(event) {
            const icon = event.target.closest('.tags-group-icon, .skill-icon');
            if (icon) {
                icon.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
                icon.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
            }
        }

        handleMouseLeave(event) {
            const icon = event.target.closest('.tags-group-icon, .skill-icon');
            if (icon) {
                icon.style.transform = '';
                icon.style.boxShadow = '';
            }
        }
    }

    // 卡片悬停效果
    class CardHoverEffect {
        constructor() {
            this.cards = document.querySelectorAll('.author-content-item');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                card.addEventListener('mouseenter', this.handleCardEnter.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
                // 移除mousemove事件监听器，去掉倾斜特效
            });
        }

        handleCardEnter(event) {
            const card = event.currentTarget;
            card.style.transition = 'all 0.3s ease';
            // 简单的向上移动效果，符合安知鱼官方风格
            card.style.transform = 'translateY(-2px)';
        }

        handleCardLeave(event) {
            const card = event.currentTarget;
            card.style.transform = 'translateY(0px)';
        }
    }

    // 文字动画效果
    class TextAnimation {
        constructor() {
            this.animatedTexts = document.querySelectorAll('.aboutsiteTips .mask span');
            this.currentIndex = 0;
            this.init();
        }

        init() {
            if (this.animatedTexts.length === 0) return;
            
            // 初始化状态 - 第一个文字显示
            this.resetAllTexts();
            this.showText(0);
            
            // 开始自动轮播
            this.startAutoRotation();
        }

        resetAllTexts() {
            this.animatedTexts.forEach((text) => {
                text.removeAttribute('data-show');
                text.removeAttribute('data-up');
                text.classList.remove('first-tips');
                // 重置为默认状态（隐藏在下方）
                text.style.transform = 'translateY(0px)';
                text.style.transition = '';
            });
        }

        showText(index) {
            if (index >= this.animatedTexts.length) return;
            
            // 隐藏所有文字
            this.animatedTexts.forEach((text, i) => {
                if (i === index) {
                    // 当前显示的文字：从下方滑入
                    text.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    text.style.transform = 'translateY(-100%)';
                    text.classList.add('first-tips');
                } else if (i === (index - 1 + this.animatedTexts.length) % this.animatedTexts.length) {
                    // 上一个文字：向上滑出
                    text.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    text.style.transform = 'translateY(-200%)';
                    text.classList.remove('first-tips');
                } else {
                    // 其他文字：隐藏在下方
                    text.style.transition = 'transform 0.3s ease';
                    text.style.transform = 'translateY(0px)';
                    text.classList.remove('first-tips');
                }
            });
        }

        startAutoRotation() {
            setInterval(() => {
                this.currentIndex = (this.currentIndex + 1) % this.animatedTexts.length;
                this.showText(this.currentIndex);
            }, 2500); // 稍微延长切换时间，让动画更清晰
        }
    }

    // Hello动画控制
    class HelloAnimation {
        constructor() {
            this.helloSection = document.querySelector('.hello-about');
            this.cursor = document.querySelector('.cursor');
            this.shapes = document.querySelectorAll('.shapes .shape');
            this.init();
        }

        init() {
            this.setupMouseTracking();
            this.setupShapeAnimation();
        }

        setupMouseTracking() {
            // 仅在非移动端启用鼠标跟踪
            if (this.helloSection && this.cursor && window.innerWidth > 768) {
                this.helloSection.addEventListener('mousemove', (event) => {
                    const rect = this.helloSection.getBoundingClientRect();
                    const x = event.clientX - rect.left - 10;
                    const y = event.clientY - rect.top - 10;
                    
                    this.cursor.style.transform = `translate(${x}px, ${y}px)`;
                });

                this.helloSection.addEventListener('mouseleave', () => {
                    this.cursor.style.transform = 'translate(50%, 50%)';
                });
            }
        }

        setupShapeAnimation() {
            this.shapes.forEach((shape, index) => {
                shape.style.animationDelay = `${index * 2}s`;
                
                // 仅在非移动端启用鼠标悬停效果
                if (window.innerWidth > 768) {
                    // 鼠标悬停时改变动画
                    shape.addEventListener('mouseenter', () => {
                        shape.style.animationPlayState = 'paused';
                        shape.style.transform = 'scale(1.2) rotate(45deg)';
                    });

                    shape.addEventListener('mouseleave', () => {
                        shape.style.animationPlayState = 'running';
                        shape.style.transform = '';
                    });
                }
            });
        }
    }



    // 平滑滚动
    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            // 为所有内部链接添加平滑滚动
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    }

    // 性能优化：懒加载
    class LazyLoader {
        constructor() {
            this.images = document.querySelectorAll('img[src]');
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            this.loadImage(img);
                            imageObserver.unobserve(img);
                        }
                    });
                });

                this.images.forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }

        loadImage(img) {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '0';
            
            const tempImg = new Image();
            tempImg.onload = () => {
                img.style.opacity = '1';
            };
            tempImg.src = img.src;
        }
    }

    // 主题色切换（可选功能）
    class ThemeToggle {
        constructor() {
            this.isDark = false;
            this.init();
        }

        init() {
            // 可以添加主题切换按钮
            this.createToggleButton();
        }

        createToggleButton() {
            const button = document.createElement('button');
            button.innerHTML = '🌙';
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.right = '20px';
            button.style.zIndex = '1000';
            button.style.padding = '10px';
            button.style.borderRadius = '50%';
            button.style.border = 'none';
            button.style.background = 'rgba(255, 255, 255, 0.9)';
            button.style.cursor = 'pointer';
            button.style.fontSize = '20px';
            button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            button.style.transition = 'all 0.3s ease';

            button.addEventListener('click', () => {
                this.toggleTheme();
                button.innerHTML = this.isDark ? '☀️' : '🌙';
            });

            document.body.appendChild(button);
        }

        toggleTheme() {
            this.isDark = !this.isDark;
            document.body.style.filter = this.isDark ? 'invert(1) hue-rotate(180deg)' : '';
        }
    }

    // 初始化所有功能
    function initializeApp() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                startApp();
            });
        } else {
            startApp();
        }
    }

    function startApp() {
        try {
            // 初始化各个模块
            new CounterAnimation();
            new SkillIconAnimation();
            new CardHoverEffect();
            new TextAnimation();
            // new ScrollRevealAnimation(); // 已移除，改用CSS动画
            new HelloAnimation();
            new SmoothScroll();
            new LazyLoader();
            new ThemeToggle();

            // 添加CSS动画样式
            addDynamicStyles();
            
            console.log('🎉 安知鱼主题关于我页面初始化完成！');
        } catch (error) {
            console.error('❌ 初始化过程中出现错误:', error);
        }
    }

    // 动态添加CSS动画
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes textBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .author-content-item:hover .author-content-item-tips {
                transform: translateY(-2px);
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // 启动应用
    initializeApp();

})();