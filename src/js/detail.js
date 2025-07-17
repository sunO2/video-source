// 详情页面JavaScript - 使用新的详情接口
const API_BASE_URL = 'https://5bt0.com/prod/api/v1';
const APP_ID = '83768d9ad4';
const IDENTITY = '23734adac0301bccdcb107c4aa21f96c';

// 获取视频详情
async function getVideoDetail(id) {
    const url = `${API_BASE_URL}/getVideoDetail?id=${id}&app_id=${APP_ID}&identity=${IDENTITY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching video detail:', error);
        return {};
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        showError('未找到影视资源ID');
        return;
    }
    
    await loadMovieDetail(movieId);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('Service Worker registration failed: ', registrationError);
      });
  });
}

// 加载电影详情
async function loadMovieDetail(movieId) {
    try {
        showLoading(true);
        let data = await getVideoDetail(movieId)
        if (data.success && data.data) {
            renderMovieDetail(data.data);
        } else {
            showError(data.message || '获取详情失败');
        }
    } catch (error) {
        console.error('加载详情失败:', error);
        showError('网络错误，请稍后重试');
    } finally {
        showLoading(false);
    }
}

// 渲染电影详情
function renderMovieDetail(movie) {
    // 填充基本信息
    document.getElementById('movie-title').textContent = movie.title || '未知标题';
    document.getElementById('movie-original-title').textContent = movie.otitle || '';
    document.getElementById('movie-year').textContent = movie.years || '未知';
    document.getElementById('movie-genre').textContent = movie.class || '未知';
    document.getElementById('movie-region').textContent = movie.production_area || '未知';
    document.getElementById('movie-language').textContent = movie.language || '未知';
    document.getElementById('movie-duration').textContent = movie.long_time || '未知';
    document.getElementById('movie-director').textContent = movie.director || '未知';
    if (movie.episodes && movie.episodes !== '0') {
        document.getElementById('movie-episodes').textContent = movie.episodes;
    } else {
        document.getElementById('movie-episodes').parentNode.style.display = 'none';
    }
    
    // 海报
    const posterImg = document.getElementById('movie-poster-img');
    posterImg.src = movie.image || 'https://via.placeholder.com/300x450?text=No+Image';
    posterImg.alt = movie.title || '电影海报';
    
    // 评分标签 - 条件显示
    const doubanRating = document.getElementById('douban-rating');
    const imdbRating = document.getElementById('imdb-rating');
    
    if (movie.doub_score && movie.doub_score !== '0') {
        document.getElementById('douban-score').textContent = `${movie.doub_score}`;
        doubanRating.style.display = 'flex';
    }
    
    if (movie.IMDB_score && movie.IMDB_score !== '0') {
        document.getElementById('imdb-score').textContent = `${movie.IMDB_score}`;
        imdbRating.style.display = 'flex';
    }
    
    // 演员标签
    renderCastTags(movie.performer);
    
    // 简介
    document.getElementById('movie-synopsis').textContent = movie.abstract || '暂无简介';
    
    // 渲染资源标签页
    renderResourceTabs(movie.ecca || {});
    
    // 渲染网盘资源标签页
    renderCloudResourceTabs(movie.movies_online_seed || {}, movie.movies_online_seed_type || []);
    
    // 显示详情内容
    document.getElementById('movie-detail').style.display = 'block';
}

// 渲染演员标签
function renderCastTags(performers) {
    const castContainer = document.getElementById('cast-tags');
    castContainer.innerHTML = '';
    
    if (!performers) {
        castContainer.innerHTML = '<span class="cast-tag">暂无演员信息</span>';
        return;
    }
    
    const performersList = performers.split(',').map(p => p.trim()).filter(p => p);
    performersList.forEach(performer => {
        const tag = document.createElement('span');
        tag.className = 'cast-tag';
        tag.textContent = performer;
        castContainer.appendChild(tag);
    });
}

// 渲染资源标签页
function renderResourceTabs(ecca) {
    const tabButtons = document.getElementById('resource-tab-buttons');
    const tabContents = document.getElementById('resource-tab-contents');
    
    tabButtons.innerHTML = '';
    tabContents.innerHTML = '';
    
    const categories = Object.keys(ecca);
    if (categories.length === 0) {
        tabButtons.innerHTML = '<span style="color: #b0b0b0;">暂无资源</span>';
        return;
    }
    
    categories.forEach((category, index) => {
        // 创建标签按钮
        const button = document.createElement('button');
        button.className = 'tab-button' + (index === 0 ? ' active' : '');
        button.textContent = category;
        button.dataset.category = category; // 添加 data-category 属性
        button.onclick = () => switchTab('resource', category);
        tabButtons.appendChild(button);
        console.log("创建资源标签按钮:", button);

        // 创建内容区域
        const content = document.createElement('div');
        content.id = `resource-${category}`;
        content.className = 'tab-content' + (index === 0 ? ' active' : '');
        content.dataset.category = category; // 添加 data-category 属性
        content.innerHTML = renderResourceList(ecca[category]);
        tabContents.appendChild(content);
    });
}

// 渲染网盘资源标签页
function renderCloudResourceTabs(cloudResources, resourceTypes) {
    const tabButtons = document.getElementById('cloud-tab-buttons');
    const tabContents = document.getElementById('cloud-tab-contents');
    
    tabButtons.innerHTML = '';
    tabContents.innerHTML = '';
    
    const availableTypes = resourceTypes.filter(type => cloudResources[type.value] && cloudResources[type.value].length > 0);
    
    if (availableTypes.length === 0) {
        tabButtons.innerHTML = '<span style="color: #b0b0b0;">暂无网盘资源</span>';
        return;
    }
    
    availableTypes.forEach((type, index) => {
        // 创建标签按钮
        const button = document.createElement('button');
        button.className = 'tab-button' + (index === 0 ? ' active' : '');
        button.textContent = type.label;
        button.dataset.category = type.value;
        button.onclick = () => switchTab('cloud', type.value);
        tabButtons.appendChild(button);
        console.log("创建网盘资源标签按钮:", button);
        
        // 创建内容区域
        const content = document.createElement('div');
        content.id = `cloud-${type.value}`;
        content.className = 'tab-content' + (index === 0 ? ' active' : '');
        content.innerHTML = renderCloudResourceList(cloudResources[type.value], type.label);
        tabContents.appendChild(content);
    });
}

// 切换标签页
function switchTab(type, category) {
    const prefix = type === 'resource' ? 'resource' : 'cloud';
    console.log("prefix:", prefix);
    const tabButtons = document.querySelectorAll(`#${prefix}-tab-buttons .tab-button`);
    console.log("tabButtons.length:", tabButtons.length);
    const tabContents = document.querySelectorAll(`#${prefix}-tab-contents .tab-content`);

    // 移除所有按钮和内容上的 active 类
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // 为当前点击的按钮添加 active 类
    let activeButton = null;
    tabButtons.forEach(button => {
        console.log("button.dataset.category:", button.dataset.category, "category:", category);
        if (button.dataset.category === category) {
            activeButton = button;
        }
    });
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // 为与当前点击按钮对应的面板添加 active 类
    const activeContent = document.getElementById(`${prefix}-${category}`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// 渲染资源列表
function renderResourceList(resources) {
    if (!resources || resources.length === 0) {
        return '<p style="color: #b0b0b0; padding: 20px;">暂无资源</p>';
    }
    
    return `
        <div class="resource-list">
            ${resources.map(resource => `
                <div class="resource-item glass-card">
                    <div class="resource-info">
                        <div class="resource-name">${resource.zname}</div>
                        <div class="resource-meta">
                            大小: ${resource.zsize} | 清晰度: ${resource.zqxd} | 更新时间: ${resource.ezt}
                        </div>
                    </div>
                    <div class="resource-actions">
                        <a href="${resource.zlink}" class="action-button" target="_blank">
                            <i class="material-icons" style="font-size: 16px; vertical-align: middle;">link</i>
                            磁力链接
                        </a>
                        <a href="${API_BASE_URL}/down?app_id=${APP_ID}&identity=${IDENTITY}&lx=1&id=${resource.id}" class="action-button">
                            <i class="material-icons" style="font-size: 16px; vertical-align: middle;">download</i>
                            直接下载
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 渲染网盘资源列表
function renderCloudResourceList(resources, typeName) {
    if (!resources || resources.length === 0) {
        return '<p style="color: #b0b0b0; padding: 20px;">暂无资源</p>';
    }
    
    return `
        <div class="cloud-resources">
            ${resources.map(resource => `
                <div class="cloud-resource-item glass-card">
                    <div class="cloud-resource-header">
                        <div class="cloud-icon" style="background: ${getCloudColor(resource.type)}"></div>
                        <div class="cloud-name">${resource.nickname || '匿名用户'}</div>
                    </div>
                    <div class="resource-name" style="margin-bottom: 10px;">${resource.seed_name}</div>
                    <a href="${resource.link}" class="cloud-link" target="_blank">
                        ${resource.link}
                        ${resource.code ? ` 提取码: ${resource.code}` : ''}
                    </a>
                </div>
            `).join('')}
        </div>
    `;
}

// 获取网盘颜色
function getCloudColor(type) {
    const colors = {
        'baidu': '#ff6b35',
        'quark': '#00a8ff',
        'xunlei': '#ff4757',
        '123': '#2ed573',
        'ali': '#ff6348'
    };
    return colors[type] || '#1e90ff';
}

// 显示/隐藏加载状态
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

// 显示错误信息
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('movie-detail').style.display = 'none';
}
