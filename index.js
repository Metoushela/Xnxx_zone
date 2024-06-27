document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('searchQuery').value.trim();
    if (searchQuery) {
        fetchVideos(searchQuery);
    } else {
        alert('Please enter a search query.');
    }
});

async function fetchVideos(query) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '<p>Loading...</p>';
    try {
        const response = await fetch(`https://joshweb.click/api/xsearch?q=${query}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayVideos(data.result.result);
    } catch (error) {
        resultsContainer.innerHTML = '<p>Error loading videos. Please try again later.</p>';
        console.error('Error fetching videos:', error);
    }
}

function displayVideos(videos) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p>No videos found.</p>';
        return;
    }

    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';

        const title = document.createElement('h3');
        title.textContent = video.title;

        const info = document.createElement('p');
        info.textContent = video.info;

        
        const thumbnail = document.createElement('img');
        thumbnail.src = 'placeholder.jpg'; 
        thumbnail.className = 'thumbnail';
        thumbnail.alt = 'Thumbnail';

        
        videoCard.addEventListener('mouseover', () => {
            thumbnail.src = video.thumbnail_url; 
        });

        
        videoCard.addEventListener('mouseout', () => {
            thumbnail.src = 'placeholder.jpg'; 
        });

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', () => {
            openModal(video.link, video.thumbnail_url); 
        });

        videoCard.appendChild(thumbnail); 
        videoCard.appendChild(title);
        videoCard.appendChild(info);
        videoCard.appendChild(downloadButton);
        resultsContainer.appendChild(videoCard);
    });
}

function openModal(videoUrl, thumbnailUrl) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';

    
    fetchVideoQualities(videoUrl, thumbnailUrl);
}

async function fetchVideoQualities(videoUrl, thumbnailUrl) {
    const qualityOptionsContainer = document.getElementById('qualityOptions');
    qualityOptionsContainer.innerHTML = '<p>Loading...</p>';
    try {
        const response = await fetch(`https://joshweb.click/api/xdl?q=${videoUrl}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayQualityOptions(data.result.files, data.result.image); 
    } catch (error) {
        qualityOptionsContainer.innerHTML = '<p>Error loading video qualities. Please try again later.</p>';
        console.error('Error fetching video qualities:', error);
    }
}

function displayQualityOptions(files, image) {
    const qualityOptionsContainer = document.getElementById('qualityOptions');
    qualityOptionsContainer.innerHTML = '';

 
    const thumbnailModal = document.createElement('img');
    thumbnailModal.src = image; 
    thumbnailModal.className = 'thumbnail-modal';
    thumbnailModal.alt = 'Thumbnail';

    const modalContent = document.querySelector('.modal-content');
    modalContent.insertBefore(thumbnailModal, modalContent.firstChild); 

    if (files.low) {
        const lowQualityButton = document.createElement('button');
        lowQualityButton.textContent = 'Download Low Quality';
        lowQualityButton.addEventListener('click', () => {
            window.open(files.low, '_blank');
        });
        qualityOptionsContainer.appendChild(lowQualityButton);
    }

    if (files.high) {
        const highQualityButton = document.createElement('button');
        highQualityButton.textContent = 'Download High Quality';
        highQualityButton.addEventListener('click', () => {
            window.open(files.high, '_blank');
        });
        qualityOptionsContainer.appendChild(highQualityButton);
    }

    if (files.HLS) {
        const hlsQualityButton = document.createElement('button');
        hlsQualityButton.textContent = 'Download HLS Quality';
        hlsQualityButton.addEventListener('click', () => {
            window.open(files.HLS, '_blank');
        });
        qualityOptionsContainer.appendChild(hlsQualityButton);
    }
}

document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    // Clear thumbnail in modal on close
    const thumbnailModal = document.querySelector('.thumbnail-modal');
    if (thumbnailModal) {
        thumbnailModal.remove();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('mousedown', event => {
        if (event.target.className === 'video-card') {
            const previewImage = document.createElement('img');
            previewImage.src = event.target.querySelector('img').src;
            previewImage.className = 'preview-image';
            event.target.appendChild(previewImage);
        }
    });

    document.addEventListener('mouseup', event => {
        const previewImage = document.querySelector('.preview-image');
        if (previewImage) {
            previewImage.remove();
        }
    });
});