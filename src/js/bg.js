document.addEventListener('DOMContentLoaded', () => {
    const emojiContainer = document.getElementById('emoji-container');
    const emojis = ['📱', '☎️', '📺', '🛢', '🔫', '🐻', '🐞', '🌗', '🔞', '🆘', '👏', '🚣‍♂️', '🤣', '🤡', '😉', '😆', '😍', '😖'];
    const emojiElements = [];

    function createEmoji() {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.fontSize = `${Math.random() * 2 + 2}rem`;
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = `${Math.random() * 100}%`;
        emoji.style.animation = `drift ${Math.random() * 10 + 5}s infinite`;
        emoji.style.setProperty('--drift-x', `${Math.random() * 200 - 100}px`);
        emoji.style.setProperty('--drift-y', `${Math.random() * 200 - 100}px`);
        emojiContainer.appendChild(emoji);
        emojiElements.push(emoji);

        
    }

    function explodeEmoji(emoji) {
        const emojiRect = emoji.getBoundingClientRect();
        // 根据表情大小决定粒子数量，例如，表情面积越大，粒子越多
        const numParticles = Math.floor((emojiRect.width * emojiRect.height) / 10) + 50; // 基础数量 + 根据面积增加

        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            const size = Math.random() * 3 + 1; // 粒子大小随机，使其更小
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.borderRadius = '50%'; // 使粒子变为圆形
            // 随机颜色，更鲜艳的颜色组合
            const colors = ['#FF4500', '#FFD700', '#ADFF2F', '#1E90FF', '#FF1493', '#8A2BE2', '#FFFFFF'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 初始位置随机偏移，模拟烟花扩散
            const initialOffsetX = (Math.random() - 0.5) * emojiRect.width;
            const initialOffsetY = (Math.random() - 0.5) * emojiRect.height;
            particle.style.left = `${emojiRect.x + emojiRect.width / 2 + initialOffsetX}px`;
            particle.style.top = `${emojiRect.y + emojiRect.height / 2 + initialOffsetY}px`;
            
            emojiContainer.appendChild(particle);

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 25 + 20; // 粒子速度随机，使其更快
            const velocityX = speed * Math.cos(angle);
            const velocityY = speed * Math.sin(angle);

            particle.style.animation = `particle ${Math.random() * 0.6 + 0.2}s forwards`; // 进一步缩短动画时间
            particle.style.setProperty('--velocity-x', `${velocityX}px`);
            particle.style.setProperty('--velocity-y', `${velocityY}px`);

            setTimeout(() => {
                particle.remove();
            }, 800); // 进一步缩短粒子存在时间
        }

        // 只有当emoji仍然存在于数组中时才移除
        const index = emojiElements.indexOf(emoji);
        if (index > -1) {
            emojiElements.splice(index, 1);
        }
        emoji.remove(); // 从DOM中移除
    }

    for (let i = 0; i < 20; i++) {
        createEmoji();
    }

    setInterval(createEmoji, 2000);

    function checkOverlap() {
        // 遍历emojiElements的副本，避免在遍历时修改原数组
        const currentEmojis = [...emojiElements]; 
        for (let i = 0; i < currentEmojis.length; i++) {
            const emoji1 = currentEmojis[i];
            // 检查emoji1是否仍然存在于DOM中，并且没有被移除
            if (!emoji1 || !emoji1.parentNode) {
                continue;
            }
            const emojiRect1 = emoji1.getBoundingClientRect();

            for (let j = i + 1; j < currentEmojis.length; j++) {
                const emoji2 = currentEmojis[j];
                // 检查emoji2是否仍然存在于DOM中，并且没有被移除
                if (!emoji2 || !emoji2.parentNode) {
                    continue;
                }
                const emojiRect2 = emoji2.getBoundingClientRect();

                if (emojiRect1.x < emojiRect2.x + emojiRect2.width &&
                    emojiRect1.x + emojiRect1.width > emojiRect2.x &&
                    emojiRect1.y < emojiRect2.y + emojiRect2.height &&
                    emojiRect1.y + emojiRect1.height > emojiRect2.y) {
                    explodeEmoji(emoji1);
                    explodeEmoji(emoji2);
                }
            }
        }
    }

    setInterval(checkOverlap, 100);
});
