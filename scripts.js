// LocalStorage key for tracking downloads
const STORAGE_KEY = 'fivemGraphicsPacksData';

// Sample data for graphics packs with MediaFire links
let graphicsPacks = [
    {
        id: 1, // Unique ID for each pack
        name: "+200 FPS FUZZY PACK",
        version: "1.0.0",
        description: "Credit .gg/fuzzy",
        downloads: 0, // Will be tracked automatically
        date: "5/29/2025", // When the pack was added
        size: 161.71, // Size in MB
        mediafireUrl: "https://www.mediafire.com/file/qr2w842wwenja1d/Fuzzy_Bundle_2024.rar/file",
        previews: [
            "assets/previews/fuzzy.jpg",
            "assets/previews/fuzzy2.jpg"
        ]
    },
{
        id: 1, // Unique ID for each pack
        name: "+200 FPS FUZZY PACK",
        version: "1.0.0",
        description: "Credit .gg/fuzzy",
        downloads: 0, // Will be tracked automatically
        date: "5/29/2025", // When the pack was added
        size: 161.71, // Size in MB
        mediafireUrl: "https://www.mediafire.com/file/qr2w842wwenja1d/Fuzzy_Bundle_2024.rar/file",
        previews: [
            "assets/previews/fuzzy.jpg",
            "assets/previews/fuzzy2.jpg"
        ]
    },
    // Add more packs as needed
];

// DOM Elements
const packContainer = document.getElementById('packContainer');
const navLinks = document.querySelectorAll('.hacker-nav a');
const sections = document.querySelectorAll('.section');
const packModal = document.getElementById('packModal');
const closeBtn = document.querySelector('.close-btn');
const datetimeElement = document.getElementById('datetime');
const lastUpdateElement = document.getElementById('lastUpdate');
const totalPacksElement = document.getElementById('totalPacks');
const totalDownloadsElement = document.getElementById('totalDownloads');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load download counts from localStorage
    loadDownloadCounts();
    
    // Render packs
    renderPacks();
    
    // Set up navigation
    setupNavigation();
    
    // Set up modal
    setupModal();
    
    // Update datetime
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Update stats
    updateStats();
});

// Load download counts from localStorage
function loadDownloadCounts() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const downloadCounts = JSON.parse(savedData);
            graphicsPacks.forEach(pack => {
                if (downloadCounts[pack.id]) {
                    pack.downloads = downloadCounts[pack.id];
                }
            });
        } catch (e) {
            console.error("Error loading download counts:", e);
        }
    }
}

// Save download counts to localStorage
function saveDownloadCounts() {
    const downloadCounts = {};
    graphicsPacks.forEach(pack => {
        downloadCounts[pack.id] = pack.downloads;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(downloadCounts));
}

// Render all packs
function renderPacks() {
    packContainer.innerHTML = '';
    
    if (graphicsPacks.length === 0) {
        packContainer.innerHTML = '<p class="no-packs">No graphics packs available at this time.</p>';
        return;
    }
    
    // Sort by newest first
    const sortedPacks = [...graphicsPacks].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedPacks.forEach(pack => {
        const packCard = document.createElement('div');
        packCard.className = 'pack-card';
        packCard.dataset.id = pack.id;
        
        packCard.innerHTML = `
            <div class="pack-card-content">
                <div class="pack-preview">
                    ${pack.previews.length > 0 ? 
                        `<img src="${pack.previews[0]}" alt="${pack.name} Preview">` : 
                        '<i class="fas fa-image" style="font-size: 2rem; color: #333;"></i>'}
                </div>
                <h3 class="pack-name">${pack.name}</h3>
                <p class="pack-version">v${pack.version}</p>
                <p class="pack-description">${pack.description}</p>
                <div class="pack-meta">
                    <span><i class="fas fa-download"></i> ${pack.downloads.toLocaleString()}</span>
                    <span><i class="fas fa-file-archive"></i> ${pack.size} MB</span>
                    <span><i class="fas fa-external-link-alt"></i> MediaFire</span>
                </div>
            </div>
        `;
        
        packCard.addEventListener('click', () => openModal(pack));
        packContainer.appendChild(packCard);
    });
}

// Set up navigation
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.dataset.section;
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// Set up modal
function setupModal() {
    closeBtn.addEventListener('click', () => {
        packModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === packModal) {
            packModal.style.display = 'none';
        }
    });
}

// Open modal with pack details
function openModal(pack) {
    document.getElementById('modalPackName').textContent = pack.name;
    document.getElementById('modalPackVersion').textContent = `v${pack.version}`;
    document.getElementById('modalPackDescription').textContent = pack.description;
    document.getElementById('modalPackDownloads').textContent = pack.downloads.toLocaleString();
    document.getElementById('modalPackDate').textContent = pack.date;
    document.getElementById('modalPackSize').textContent = pack.size;
    
    const previewContainer = document.getElementById('modalPackPreview');
    previewContainer.innerHTML = '';
    
    pack.previews.forEach(preview => {
        const img = document.createElement('img');
        img.src = preview;
        img.alt = `${pack.name} Preview`;
        previewContainer.appendChild(img);
    });
    
    const downloadBtn = document.getElementById('modalDownloadBtn');
    if (pack.mediafireUrl) {
        downloadBtn.href = pack.mediafireUrl;
        downloadBtn.onclick = function(e) {
            // Increment download count
            pack.downloads++;
            saveDownloadCounts();
            updateStats();
            
            // Open MediaFire link in new tab
            window.open(pack.mediafireUrl, '_blank');
        };
    } else {
        downloadBtn.href = '#';
        downloadBtn.onclick = function(e) {
            e.preventDefault();
            alert('Download link not available. Please contact the site administrator.');
        };
    }
    
    packModal.style.display = 'block';
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    datetimeElement.textContent = `SYSTEM TIME: ${now.toLocaleDateString('en-US', options)}`;
}

// Update stats
function updateStats() {
    lastUpdateElement.textContent = new Date().toLocaleDateString();
    totalPacksElement.textContent = graphicsPacks.length;
    totalDownloadsElement.textContent = graphicsPacks.reduce((sum, pack) => sum + pack.downloads, 0).toLocaleString();
}