// ============================================
// GERMAN STUDY MATERIALS - DISPLAY SYSTEM
// ============================================

let allStudyData = {};

// DOM Elements
let studyContainer;
let studyTitle;
let studyContent;
let homeContainer;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Study materials page loaded');
    
    // Initialize DOM element references
    studyContainer = document.getElementById('studyContainer');
    studyTitle = document.getElementById('studyTitle');
    studyContent = document.getElementById('studyContent');
    homeContainer = document.getElementById('homeContainer');
    
    // Get the topic from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic');
    
    console.log('URL parameter "topic":', topic);
    
    // If no parameter, show home page
    if (!topic) {
        console.log('No parameter found, showing home page');
        showHomePage();
        return;
    }
    
    // Otherwise, load the topic
    console.log('Parameter found, loading topic:', topic);
    await loadTopic(topic);
});

// ============================================
// LOAD TOPIC
// ============================================
async function loadTopic(topic) {
    // Hide home page
    if (homeContainer) {
        homeContainer.style.display = 'none';
    }
    
    // Show study container
    if (studyContainer) {
        studyContainer.style.display = 'block';
    }
    
    try {
        // Load study content from JSON
        const response = await fetch('study-content.json');
        if (!response.ok) {
            throw new Error('Failed to load study-content.json');
        }
        
        allStudyData = await response.json();
        
        // Check if topic exists
        if (!allStudyData[topic]) {
            showError(`Topic "${topic}" not found. Please check the URL parameter.`);
            return;
        }
        
        const topicData = allStudyData[topic];
        
        // Display the topic
        displayTopic(topicData);
        
    } catch (error) {
        console.error('Error loading topic:', error);
        showError('Error loading study materials. Please refresh the page.');
    }
}

// ============================================
// DISPLAY TOPIC
// ============================================
function displayTopic(topicData) {
    // Set title
    if (studyTitle) {
        studyTitle.textContent = topicData.title;
    }
    
    // Clear content
    if (studyContent) {
        studyContent.innerHTML = '';
    }
    
    // Display based on type
    if (topicData.type === 'simple-table') {
        displayTable(topicData);
    } else {
        showError('Unknown content type: ' + topicData.type);
    }
}

// ============================================
// DISPLAY TABLE
// ============================================
function displayTable(topicData) {
    const table = document.createElement('table');
    table.className = 'study-table';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    topicData.columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body with data rows
    const tbody = document.createElement('tbody');
    
    topicData.rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    // Append to content container
    if (studyContent) {
        studyContent.appendChild(table);
    }
}

// ============================================
// SHOW HOME PAGE
// ============================================
function showHomePage() {
    // Hide study container
    if (studyContainer) {
        studyContainer.style.display = 'none';
    }
    
    // Show home container
    if (homeContainer) {
        homeContainer.style.display = 'flex';
    }
    
    // Create home page content
    const h1 = document.createElement('h1');
    h1.textContent = 'German Study Materials';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = 'Choose a topic to study';
    
    const topicsList = document.createElement('div');
    topicsList.className = 'topics-list';
    
    // Add loading message initially
    topicsList.innerHTML = '<div style="text-align: center; color: #6B7280;">Loading topics...</div>';
    
    homeContainer.appendChild(h1);
    homeContainer.appendChild(subtitle);
    homeContainer.appendChild(topicsList);
    
    // Fetch study-content.json to get all topics
    fetch('study-content.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load study-content.json');
            }
            return response.json();
        })
        .then(data => {
            const topics = Object.keys(data);
            const topicsList = document.querySelector('.topics-list');
            
            if (!topicsList) {
                console.error('Topics list container not found');
                return;
            }
            
            // Clear loading message
            topicsList.innerHTML = '';
            
            if (topics.length === 0) {
                topicsList.innerHTML = '<div class="error-message">No topics available.</div>';
                return;
            }
            
            // Create a card for each topic
            topics.forEach(topicKey => {
                const topicData = data[topicKey];
                createTopicCard(topicKey, topicData.title, topicsList);
            });
        })
        .catch(error => {
            console.error('Error loading topics:', error);
            const topicsList = document.querySelector('.topics-list');
            if (topicsList) {
                topicsList.innerHTML = '<div class="error-message">Error loading topics. Please refresh the page.</div>';
            }
        });
}

// ============================================
// CREATE TOPIC CARD
// ============================================
function createTopicCard(topicKey, topicTitle, container) {
    const card = document.createElement('a');
    card.href = `?topic=${topicKey}`;
    card.className = 'topic-card';
    
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = topicTitle;
    
    card.appendChild(title);
    container.appendChild(card);
}

// ============================================
// SHOW ERROR
// ============================================
function showError(message) {
    if (studyContent) {
        studyContent.innerHTML = `<div class="error-message">${message}</div>`;
    }
    
    if (studyTitle) {
        studyTitle.textContent = 'Error';
    }
    
    // Show study container
    if (studyContainer) {
        studyContainer.style.display = 'block';
    }
    
    // Hide home container
    if (homeContainer) {
        homeContainer.style.display = 'none';
    }
}

