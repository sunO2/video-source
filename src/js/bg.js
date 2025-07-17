document.addEventListener('DOMContentLoaded', () => {
    const emojiContainer = document.getElementById('emoji-container');
    const emojis = ['📱', '☎️', '📺', '🛢', '🔫', '🐻', '🐞', '🌗', '🔞', '🆘', '👏', '🚣‍♂️', '🤣', '🤡', '😉', '😆', '😍', '😖'];
    const numEmojis = 20; // 减少表情符号的数量以优化性能

    function createEmoji() {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = 'absolute';
        emoji.style.fontSize = `${Math.random() * 2 + 2}rem`;
        
        // 设置初始位置在屏幕底部中央
        // 设置初始位置在屏幕底部中央，并使用 transform
        emoji.style.left = '0'; // 初始left设置为0，通过transform控制位置
        emoji.style.top = '0'; // 初始top设置为0，通过transform控制位置
        emoji.style.transform = 'translate3d(calc(50vw - 50%), 100vh, 0)'; // 居中并放置在屏幕底部

        // 随机最终位置 (使用像素值或视口单位，以便更好地控制)
        const targetX = Math.random() * (window.innerWidth - 50); // 随机X坐标，避免超出屏幕
        const targetY = Math.random() * (window.innerHeight * 0.8 - 50); // 随机Y坐标，避免太靠近底部

        // 应用喷射动画
        emoji.style.animation = `spray-and-fix 3s forwards ease-out`;
        emoji.style.setProperty('--target-x-px', `${targetX}px`); // 使用像素值
        emoji.style.setProperty('--target-y-px', `${targetY}px`); // 使用像素值
        const initialSpeed = Math.random() * 100 + 150; // 初始速度范围
        const angle = (Math.random() * Math.PI / 2) + Math.PI / 4; // 喷射角度在 45 到 135 度之间
        const initialVelocityX = initialSpeed * Math.cos(angle);
        const initialVelocityY = initialSpeed * Math.sin(angle);

        emoji.style.setProperty('--initial-velocity-x', `${initialVelocityX}px`);
        emoji.style.setProperty('--initial-velocity-y', `${initialVelocityY}px`);
        emoji.style.setProperty('--target-x-px', `${targetX}px`);
        emoji.style.setProperty('--target-y-px', `${targetY}px`);

        emojiContainer.appendChild(emoji);
    }

    // 页面加载后一次性创建所有表情符号
    for (let i = 0; i < numEmojis; i++) {
        // 错开创建时间，形成喷射效果
        setTimeout(() => {
            createEmoji();
        }, i * 100); 
    }
});
