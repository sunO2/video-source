import { searchVideos, getRecommendedVideos } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const tabButtons = document.querySelectorAll('.custom-tab-bar .custom-tab-button');
    const tabPanels = document.querySelectorAll('.page-content .custom-tab-panel');
    const movieLists = {
        1: document.getElementById('movie-list-1'),
        2: document.getElementById('movie-list-2'),
        3: document.getElementById('movie-list-3'),
        4: document.getElementById('movie-list-4'),
        5: document.getElementById('movie-list-5'),
    };


    // Function to render movie cards
    function renderMovieCards(container, movies) {
        container.innerHTML = ''; // Clear previous results

        if (!movies || movies.length === 0) {
            container.innerHTML = '<p>没有找到相关影视资源。</p>';
            return;
        }

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'mdl-cell mdl-cell--8-col-tablet mdl-cell--12-col-phone mdl-card mdl-shadow--2dp movie-card';
            movieCard.onclick = () => {
                window.location.href = `detial.html?id=${movie.idcode || movie.id}`;
            };

            const imageUrl = movie.image || 'https://via.placeholder.com/200x300?text=No+Image'; // Placeholder for missing image
            
            // 构建评分标签HTML，只有当评分存在且大于0时才显示
            let ratingTags = '';
            if (movie.IMDB_score && movie.IMDB_score > 0) {
                ratingTags += `<span class="rating-tag imdb-tag">IMDb ${movie.IMDB_score}</span>`;
            }
            if (movie.doub_score && movie.doub_score > 0) {
                ratingTags += `<span class="rating-tag douban-tag">豆瓣 ${movie.doub_score}</span>`;
            }

            movieCard.innerHTML = `
                <div class="mdl-card__title mdl-card--expand item_image_contain" style="background: url('${imageUrl}') center / cover;">
                    ${movie.ejs ? `<div class="ejs-tag">${movie.ejs}</div>` : ''}
                </div>
                <div class="mdl-card__title-text-container">
                    <h2 class="mdl-card__title-text">${movie.title}</h2>
                </div>
                <div class="rating-tags-container">
                    ${ratingTags}
                </div>
                
            `;
            container.appendChild(movieCard);
            // Upgrade the newly added card element for MDL
            // This is still needed for MDL components within the card, like mdl-button
            if (componentHandler) {
                componentHandler.upgradeElement(movieCard);
            }
          
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
    }

    // Custom Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            // Deactivate all tabs and panels
            tabButtons.forEach(btn => btn.classList.remove('is-active'));
            tabPanels.forEach(panel => panel.classList.remove('is-active'));

            // Activate clicked tab and its corresponding panel
            event.target.classList.add('is-active');
            const targetPanelId = event.target.dataset.target;
            const targetPanel = document.getElementById(targetPanelId);
            targetPanel.classList.add('is-active');

            const categoryId = event.target.dataset.sc;
            const targetContainer = movieLists[categoryId];

            // Fetch and render recommended videos for the selected tab
            if (targetContainer.children.length === 0 || targetContainer.children[0].tagName === 'P') { // Only fetch if empty or showing "no results"
                const recommendedVideos = await getRecommendedVideos(categoryId);
                renderMovieCards(targetContainer, recommendedVideos);
            }
        });
    });

    // Initial load: fetch and display recommended videos for the first tab (电影)
    const initialCategoryId = tabButtons[0].dataset.sc;
    const initialContainer = movieLists[initialCategoryId];
    getRecommendedVideos(initialCategoryId).then(videos => {
        renderMovieCards(initialContainer, videos);
    });
    // No global upgradeDom needed as we are manually upgrading elements

    // Search functionality
    const searchContainer = document.querySelector('.search-container');
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.querySelector('.search-input');

    // 点击搜索图标显示输入框
    searchIcon.addEventListener('click', () => {
        searchContainer.classList.add('search-active');
        searchInput.classList.add('expanded');
        searchInput.focus();
    });

    // 输入框失去焦点时收起输入框
    searchInput.addEventListener('blur', () => {
        searchContainer.classList.remove('search-active');
        searchInput.classList.remove('expanded');
    });

    // 按回车键搜索
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // 获取当前激活的标签
                const activeTab = document.querySelector('.custom-tab-button.is-active');
                const categoryId = activeTab.dataset.sc;
                const targetPanelId = activeTab.dataset.target;
                const targetContainer = document.getElementById(targetPanelId).querySelector('.movie-list');
                
                // 搜索并显示结果
                const searchResults = await searchVideos(searchTerm);
                renderMovieCards(targetContainer, searchResults);
                
                // 收起搜索框
                searchContainer.classList.remove('search-active');
                searchInput.classList.remove('expanded');
                searchInput.value = '';
            }
        }
    });
});
