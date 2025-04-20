// 主题切换功能
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// 从localStorage获取主题设置
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// AI对话功能
const chatMessages = document.querySelector('.chat-messages');
const userInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-message');

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const bubble = document.createElement('div');
    bubble.className = `bubble ${role}`;
    bubble.textContent = content;
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 初始化聊天模块
const ChatModule = (() => {
    const messages = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    function saveMessages() {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
    
    function addMessage(role, content) {
        const message = { role, content, timestamp: new Date().toISOString() };
        messages.push(message);
        saveMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage('user', message);
        userInput.value = '';
        
        try {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history: messages })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            addMessage('assistant', data.reply);
        } catch (error) {
            console.error('发送消息失败:', error);
            addMessage('assistant', `发送失败: ${error.message}`);
        }
    }
    
    function init() {
        // 恢复历史消息
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.role}`;
            
            const bubble = document.createElement('div');
            bubble.className = `bubble ${msg.role}`;
            bubble.textContent = msg.content;
            
            messageDiv.appendChild(bubble);
            chatMessages.appendChild(messageDiv);
        });
        
        // 事件监听
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        
        // 历史记录按钮
        document.getElementById('show-history').addEventListener('click', () => {
            alert(JSON.stringify(messages, null, 2));
        });
        
        // 清空聊天按钮
        document.getElementById('clear-chat').addEventListener('click', () => {
            messages.length = 0;
            localStorage.removeItem('chatHistory');
            chatMessages.innerHTML = '';
        });
    }
    
    return { init };
})();

// 初始化聊天模块
ChatModule.init();



// 技能标签数据
const skills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Vue.js',
    'HTML5', 'CSS3', 'Git', 'Docker', 'AI'
];

// 添加技能标签
const skillTags = document.querySelector('.skill-tags');
skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    skillTags.appendChild(tag);
});

// 轮播图图片数据
const swiperImages = [
    'imgs/img_163.jpg',
    'imgs/img_168.jpg',
    'imgs/img_170.jpg',
    'imgs/img_171.jpg',
    'imgs/img_174.jpg'
];

// 预加载图片
function preloadImages(images) {
    return Promise.all(images.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = reject;
            img.src = src;
        });
    }));
}

// 初始化轮播图
async function initSwiper() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    
    try {
        // 等待图片预加载完成
        await preloadImages(swiperImages);
        
        // 清空现有轮播项
        swiperWrapper.innerHTML = '';
        
        // 添加轮播图片
        swiperImages.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<img src="${src}" alt="轮播图片">`;
            swiperWrapper.appendChild(slide);
        });

        // 初始化Swiper
        const swiper = new Swiper('.swiper', {
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            keyboard: {
                enabled: true,
            },
            on: {
                touchEnd: function () {
                    if (!this.autoplay.running) {
                        this.autoplay.start();
                    }
                }
            }
        });
    } catch (error) {
        console.error('图片加载失败:', error);
    }
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', initSwiper);

// 模拟博客数据
const blogPosts = [
    {
        title: '深入理解JavaScript异步编程',
        category: '前端开发',
        date: '2024-01-15',
        summary: '探讨JavaScript中的异步编程模式，包括回调、Promise和async/await...',
        content: '# 深入理解JavaScript异步编程\n\n异步编程是JavaScript中的重要概念...',
    },
    {
        title: 'AI在Web开发中的应用',
        category: 'AI技术',
        date: '2024-01-10',
        summary: '探索如何将人工智能技术集成到Web应用中...',
        content: '# AI在Web开发中的应用\n\n随着AI技术的发展...',
    },
];

// 渲染博客文章
const blogGrid = document.querySelector('.blog-grid');

function renderBlogPosts(posts) {
    blogGrid.innerHTML = '';
    posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'col-md-6 col-lg-4';
        article.innerHTML = `
            <div class="blog-card">
                <h3>${post.title}</h3>
                <div class="meta">
                    <span class="category">${post.category}</span>
                    <span class="date">${post.date}</span>
                </div>
                <p>${post.summary}</p>
                <button class="btn btn-primary">阅读更多</button>
            </div>
        `;
        blogGrid.appendChild(article);
    });
}

renderBlogPosts(blogPosts);









// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});