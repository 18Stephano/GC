// ============================================
// GERMAN VOCABULARY QUIZ - ENHANCED VERSION
// ============================================

/**
 * Quiz Data - Loaded from questions.json based on URL parameter
 */
let exercises = [];
let allQuestionsData = {};

// ============================================
// STATE MANAGEMENT
// ============================================
let answeredCount = 0;
let submitted = false;
let selectedAnswers = {};
let startTime = null;
let currentQuestionIndex = 0;
let shuffledOptionsMap = {}; // Store shuffled option order for each question ID

// ============================================
// DOM ELEMENTS (initialized in DOMContentLoaded)
// ============================================
let progressText;
let totalQuestionsDisplay;
let questionsContainer;
let questionSidebar;
let submitBtn;
let prevBtn;
let nextBtn;
let submitButtonsContainer;
let resetBtn;
let quizForm;
let resultsPanel;
let quizSection;
let finalScore;
let resultsTitle;
let resultsMessage;

// ============================================
// AUTOSAVE FUNCTIONALITY (localStorage)
// ============================================
let currentQuestionSet = null;

function getStorageKey(questionSet) {
    return `german-quiz-${questionSet}`;
}

function saveQuizState(questionSet) {
    try {
        const state = {
            questionSet: questionSet,
            questionIds: exercises.map(q => q.id), // Save shuffled order
            selectedAnswers: selectedAnswers,
            currentQuestionIndex: currentQuestionIndex,
            startTime: startTime,
            answeredCount: answeredCount,
            submitted: submitted
        };
        localStorage.setItem(getStorageKey(questionSet), JSON.stringify(state));
    } catch (error) {
        console.error('Error saving quiz state:', error);
    }
}

function loadQuizState(questionSet) {
    try {
        const saved = localStorage.getItem(getStorageKey(questionSet));
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading quiz state:', error);
    }
    return null;
}

function clearQuizState(questionSet) {
    try {
        localStorage.removeItem(getStorageKey(questionSet));
    } catch (error) {
        console.error('Error clearing quiz state:', error);
    }
}

// ============================================
// ROUTING LAYER (NEW - ADDED AT TOP)
// ============================================
let allContentData = {}; // For study materials content

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script loaded, routing...');
    
    // Route to correct view
    await routeToCorrectView();
});

async function routeToCorrectView() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // If no parameters = home page
    if (!urlParams.toString()) {
        console.log('No parameters, showing home page');
        await showHomePageNavigation();
        return;
    }
    
    // If view=quiz or has 'set' parameter = quiz view
    if (urlParams.get('view') === 'quiz' || urlParams.has('set')) {
        console.log('Quiz view detected');
        // initializeExistingQuiz will handle getting quizSet from section or legacy 'set' param
        await initializeExistingQuiz(null);
        return;
    }
    
    // Check navigation level
    const level = urlParams.get('level');
    const week = urlParams.get('week');
    const tag = urlParams.get('tag');
    const section = urlParams.get('section');
    
    if (level && week && tag && section) {
        // Full path: show individual section content
        console.log('Section content view:', level, week, tag, section);
        await showSectionPage(level, week, tag, section);
        return;
    }
    
    if (level && week && tag) {
        // Show sections list
        console.log('Sections list page:', level, week, tag);
        await showSectionsPage(level, week, tag);
        return;
    }
    
    if (level && week) {
        // Show tags list
        console.log('Tags page:', level, week);
        await showTagsPage(level, week);
        return;
    }
    
    if (level) {
        // Show weeks list
        console.log('Weeks page:', level);
        await showWeeksPage(level);
        return;
    }
    
    // Fallback: show home page
    await showHomePageNavigation();
}

// ============================================
// INITIALIZATION - EXISTING QUIZ CODE (WRAPPED)
// ============================================
async function initializeExistingQuiz(questionSet) {
    console.log('initializeExistingQuiz called with:', questionSet);
    
    // Initialize DOM element references (EXISTING CODE)
    progressText = document.getElementById('progressText');
    totalQuestionsDisplay = document.getElementById('totalQuestionsDisplay');
    questionsContainer = document.getElementById('questionsContainer');
    questionSidebar = document.getElementById('questionSidebar');
    submitBtn = document.getElementById('submitBtn');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    submitButtonsContainer = document.getElementById('submitButtonsContainer');
    resetBtn = document.getElementById('resetBtn');
    quizForm = document.getElementById('quizForm');
    resultsPanel = document.getElementById('resultsPanel');
    quizSection = document.getElementById('quizSection');
    finalScore = document.getElementById('finalScore');
    resultsTitle = document.getElementById('resultsTitle');
    resultsMessage = document.getElementById('resultsMessage');
    
    // Hide other views
    const homePageContainer = document.getElementById('homePageContainer');
    if (homePageContainer) homePageContainer.style.display = 'none';
    const studyMaterialsContainer = document.getElementById('studyMaterialsContainer');
    if (studyMaterialsContainer) studyMaterialsContainer.style.display = 'none';
    
    // Handle new URL structure with section parameter
    if (!questionSet) {
        const urlParams = new URLSearchParams(window.location.search);
        questionSet = urlParams.get('set');
        
        // If no 'set' param, try to get from section
        if (!questionSet) {
            const level = urlParams.get('level');
            const week = urlParams.get('week');
            const tag = urlParams.get('tag');
            const section = urlParams.get('section');
            
            if (level && week && tag && section) {
                try {
                    const response = await fetch('content.json');
                    allContentData = await response.json();
                    const sectionData = allContentData?.levels?.[level]?.weeks?.[`w${week}`]?.tags?.[`t${tag}`]?.sections?.[parseInt(section) - 1];
                    if (sectionData && sectionData.quizSet) {
                        questionSet = sectionData.quizSet;
                    }
                } catch (error) {
                    console.error('Error loading content.json:', error);
                }
            }
        }
    }
    
    if (!questionSet) {
        console.error('No question set specified');
        return;
    }
    
    // Load quiz (EXISTING FUNCTION - DO NOT MODIFY)
    await loadQuiz(questionSet);
}

// Separate function to load the quiz
async function loadQuiz(questionSet) {
    console.log('loadQuiz() called with:', questionSet);
    
    // Hide all other views
    const homePageContainer = document.getElementById('homePageContainer');
    if (homePageContainer) {
        homePageContainer.style.display = 'none';
        console.log('Home page container hidden');
    }
    const studyMaterialsContainer = document.getElementById('studyMaterialsContainer');
    if (studyMaterialsContainer) {
        studyMaterialsContainer.style.display = 'none';
        console.log('Study materials container hidden');
    }
    const oldHomeContainer = document.querySelector('.home-container');
    if (oldHomeContainer) {
        oldHomeContainer.style.display = 'none';
    }
    
    // Show quiz container and sidebar FIRST so user sees something
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
        quizContainer.style.display = 'block';
        console.log('Quiz container shown');
    } else {
        console.error('Quiz container not found!');
    }
    if (questionSidebar) {
        questionSidebar.style.display = 'flex';
    }
    
    // Keep body styles centered for quiz (don't override CSS centering)
    // document.body.style.alignItems = 'flex-start';
    // document.body.style.justifyContent = 'flex-start';
    
    // Ensure questionsContainer exists and is ready
    if (!questionsContainer) {
        console.error('questionsContainer not found!');
        return;
    }
    
    currentQuestionSet = questionSet;
    
    // Reset shuffled options map for fresh randomization
    shuffledOptionsMap = {};
    
    // Load questions from JSON
    console.log('Loading questions...');
    await loadQuestions(questionSet);
    console.log('Questions loaded, count:', exercises.length);
    
    // Check if questions loaded successfully
    if (exercises.length === 0) {
        console.error('No questions loaded!');
        if (questionsContainer) {
            questionsContainer.innerHTML = '<div class="error-message">No questions available for this set. Please check the URL parameter.</div>';
        }
        return;
    }
    
    // ALWAYS shuffle questions fresh - don't restore order from localStorage
    // This ensures questions are in random order on every page load
    exercises = shuffleArray(exercises);
    
    // Try to restore saved state (answers, position, etc.) but NOT question order
    const savedState = loadQuizState(questionSet);
    if (savedState && savedState.selectedAnswers) {
        // Restore answers and progress, but keep the newly shuffled question order
        selectedAnswers = savedState.selectedAnswers || {};
        currentQuestionIndex = savedState.currentQuestionIndex || 0;
        startTime = savedState.startTime || Date.now();
        answeredCount = savedState.answeredCount || Object.keys(selectedAnswers).length;
        submitted = savedState.submitted || false;
        
        // Make sure currentQuestionIndex is within bounds
        if (currentQuestionIndex >= exercises.length) {
            currentQuestionIndex = 0;
        }
    } else {
        // No saved state, start fresh
        startTime = Date.now();
        selectedAnswers = {};
        currentQuestionIndex = 0;
        answeredCount = 0;
        submitted = false;
    }
    
    // Update total questions display
    if (totalQuestionsDisplay) {
        totalQuestionsDisplay.textContent = exercises.length;
    }
    
    // Now render everything
    createQuestionSidebar();
    renderQuestions();
    updateNavigation();
    updateProgress();
    attachEventListeners();
    
    // Save initial state
    saveQuizState(questionSet);
}

// ============================================
// HOME PAGE
// ============================================
// ============================================
// HOME PAGE NAVIGATION (NEW - REPLACES OLD showHomePage)
// ============================================
async function showHomePageNavigation() {
    console.log('showHomePageNavigation() called');
    
    // Hide all other views
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) quizContainer.style.display = 'none';
    if (questionSidebar) questionSidebar.style.display = 'none';
    const studyMaterialsContainer = document.getElementById('studyMaterialsContainer');
    if (studyMaterialsContainer) studyMaterialsContainer.style.display = 'none';
    
    // Show home page container
    const homePageContainer = document.getElementById('homePageContainer');
    if (homePageContainer) {
        homePageContainer.style.display = 'block';
    }
    
    // Update body styles for home page
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';
    
    // Clear and populate home page
    if (homePageContainer) {
        homePageContainer.innerHTML = '<div style="text-align: center; color: #6B7280;">Loading...</div>';
    }
    
    try {
        const response = await fetch('content.json');
        if (!response.ok) throw new Error('Failed to load content.json');
        allContentData = await response.json();
        
        renderHomePage(allContentData);
    } catch (error) {
        console.error('Error loading content:', error);
        if (homePageContainer) {
            homePageContainer.innerHTML = '<div class="error-message">Error loading content. Please refresh the page.</div>';
        }
    }
}

function renderHomePage(contentData) {
    const homePageContainer = document.getElementById('homePageContainer');
    if (!homePageContainer) return;
    
    homePageContainer.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'home-header';
    
    const h1 = document.createElement('h1');
    h1.textContent = 'German Club';
    header.appendChild(h1);
    
    const hr = document.createElement('hr');
    header.appendChild(hr);
    
    homePageContainer.appendChild(header);
    
    // Create levels container
    const levelsContainer = document.createElement('div');
    levelsContainer.className = 'levels-container';
    
    // Render each level as a simple card
    const levels = contentData.levels || {};
    Object.keys(levels).forEach(levelKey => {
        const level = levels[levelKey];
        const levelCard = createSimpleLevelCard(levelKey, level);
        levelsContainer.appendChild(levelCard);
    });
    
    homePageContainer.appendChild(levelsContainer);
}

function createSimpleLevelCard(levelKey, levelData) {
    const card = document.createElement('a');
    card.href = `?level=${levelKey}`;
    card.className = 'level-card';
    card.style.cursor = 'pointer';
    
    const header = document.createElement('div');
    header.className = 'level-header';
    
    const emoji = document.createElement('span');
    emoji.className = 'level-emoji';
    emoji.textContent = '📚';
    
    const name = document.createElement('span');
    name.className = 'level-name';
    name.textContent = levelData.name;
    
    header.appendChild(emoji);
    header.appendChild(name);
    card.appendChild(header);
    
    return card;
}

// ============================================
// WEEKS PAGE (NEW)
// ============================================
async function showWeeksPage(level) {
    console.log('showWeeksPage() called for level:', level);
    
    // Hide other views
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) quizContainer.style.display = 'none';
    if (questionSidebar) questionSidebar.style.display = 'none';
    const studyMaterialsContainer = document.getElementById('studyMaterialsContainer');
    if (studyMaterialsContainer) studyMaterialsContainer.style.display = 'none';
    
    // Show home page container
    const homePageContainer = document.getElementById('homePageContainer');
    if (homePageContainer) {
        homePageContainer.style.display = 'block';
    }
    
    // Update body styles
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';
    
    try {
        // Load content if not already loaded
        if (!allContentData.levels) {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error('Failed to load content.json');
            allContentData = await response.json();
        }
        
        const levelData = allContentData?.levels?.[level];
        
        if (!levelData) {
            if (homePageContainer) {
                homePageContainer.innerHTML = '<div class="error-message">Level not found.</div>';
            }
            return;
        }
        
        renderWeeksPage(level, levelData);
        
    } catch (error) {
        console.error('Error loading weeks page:', error);
        const homePageContainer = document.getElementById('homePageContainer');
        if (homePageContainer) {
            homePageContainer.innerHTML = '<div class="error-message">Error loading content. Please refresh the page.</div>';
        }
    }
}

function renderWeeksPage(level, levelData) {
    const homePageContainer = document.getElementById('homePageContainer');
    if (!homePageContainer) return;
    
    homePageContainer.innerHTML = '';
    
    // Breadcrumb
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.innerHTML = `<a href="index.html">Home</a> <span> > </span> <span>${levelData.name}</span>`;
    breadcrumb.style.textAlign = 'center';
    breadcrumb.style.marginBottom = '32px';
    homePageContainer.appendChild(breadcrumb);
    
    // Header
    const header = document.createElement('div');
    header.className = 'home-header';
    
    const h1 = document.createElement('h1');
    h1.textContent = levelData.name;
    header.appendChild(h1);
    
    const hr = document.createElement('hr');
    header.appendChild(hr);
    
    homePageContainer.appendChild(header);
    
    // Weeks container
    const weeksContainer = document.createElement('div');
    weeksContainer.className = 'levels-container';
    
    const weeks = levelData.weeks || {};
    Object.keys(weeks).forEach(weekKey => {
        const week = weeks[weekKey];
        const weekCard = createWeekCard(level, weekKey, week);
        weeksContainer.appendChild(weekCard);
    });
    
    homePageContainer.appendChild(weeksContainer);
}

function createWeekCard(level, weekKey, weekData) {
    const card = document.createElement('a');
    card.href = `?level=${level}&week=${weekKey.replace('w', '')}`;
    card.className = 'level-card';
    card.style.cursor = 'pointer';
    
    const header = document.createElement('div');
    header.className = 'level-header';
    
    const emoji = document.createElement('span');
    emoji.className = 'level-emoji';
    emoji.textContent = '📅';
    
    const name = document.createElement('span');
    name.className = 'level-name';
    name.textContent = weekData.name;
    
    header.appendChild(emoji);
    header.appendChild(name);
    card.appendChild(header);
    
    return card;
}

// ============================================
// TAGS PAGE (NEW)
// ============================================
async function showTagsPage(level, week) {
    console.log('showTagsPage() called for:', level, week);
    
    // Hide other views
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) quizContainer.style.display = 'none';
    if (questionSidebar) questionSidebar.style.display = 'none';
    const studyMaterialsContainer = document.getElementById('studyMaterialsContainer');
    if (studyMaterialsContainer) studyMaterialsContainer.style.display = 'none';
    
    // Show home page container
    const homePageContainer = document.getElementById('homePageContainer');
    if (homePageContainer) {
        homePageContainer.style.display = 'block';
    }
    
    // Update body styles
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';
    
    try {
        // Load content if not already loaded
        if (!allContentData.levels) {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error('Failed to load content.json');
            allContentData = await response.json();
        }
        
        const levelData = allContentData?.levels?.[level];
        const weekData = levelData?.weeks?.[`w${week}`];
        
        if (!weekData) {
            const homePageContainer = document.getElementById('homePageContainer');
            if (homePageContainer) {
                homePageContainer.innerHTML = '<div class="error-message">Week not found.</div>';
            }
            return;
        }
        
        renderTagsPage(level, week, levelData, weekData);
        
    } catch (error) {
        console.error('Error loading tags page:', error);
        const homePageContainer = document.getElementById('homePageContainer');
        if (homePageContainer) {
            homePageContainer.innerHTML = '<div class="error-message">Error loading content. Please refresh the page.</div>';
        }
    }
}

function renderTagsPage(level, week, levelData, weekData) {
    const homePageContainer = document.getElementById('homePageContainer');
    if (!homePageContainer) return;
    
    homePageContainer.innerHTML = '';
    
    // Breadcrumb
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.innerHTML = `
        <a href="index.html">Home</a>
        <span> > </span>
        <a href="?level=${level}">${levelData.name}</a>
        <span> > </span>
        <span>${weekData.name}</span>
    `;
    breadcrumb.style.textAlign = 'center';
    breadcrumb.style.marginBottom = '32px';
    homePageContainer.appendChild(breadcrumb);
    
    // Header
    const header = document.createElement('div');
    header.className = 'home-header';
    
    const h1 = document.createElement('h1');
    h1.textContent = weekData.name;
    header.appendChild(h1);
    
    const hr = document.createElement('hr');
    header.appendChild(hr);
    
    homePageContainer.appendChild(header);
    
    // Tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'levels-container';
    
    const tags = weekData.tags || {};
    Object.keys(tags).forEach(tagKey => {
        const tag = tags[tagKey];
        const tagCard = createTagCardSimple(level, week, tagKey, tag);
        tagsContainer.appendChild(tagCard);
    });
    
    homePageContainer.appendChild(tagsContainer);
}

function createTagCardSimple(level, week, tagKey, tagData) {
    const card = document.createElement('a');
    card.href = `?level=${level}&week=${week}&tag=${tagKey.replace('t', '')}`;
    card.className = 'level-card';
    card.style.cursor = 'pointer';
    
    const header = document.createElement('div');
    header.className = 'level-header';
    
    const emoji = document.createElement('span');
    emoji.className = 'level-emoji';
    emoji.textContent = '📝';
    
    const name = document.createElement('span');
    name.className = 'level-name';
    name.textContent = tagData.title;
    
    header.appendChild(emoji);
    header.appendChild(name);
    card.appendChild(header);
    
    return card;
}

// ============================================
// SECTIONS PAGE (NEW)
// ============================================
async function showSectionsPage(level, week, tag) {
    console.log('showSectionsPage() called for:', level, week, tag);
    
    // Hide other views
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) quizContainer.style.display = 'none';
    if (questionSidebar) questionSidebar.style.display = 'none';
    const studyMaterialsContainer = document.getElementById('studyMaterialsContainer');
    if (studyMaterialsContainer) studyMaterialsContainer.style.display = 'none';
    
    // Show home page container
    const homePageContainer = document.getElementById('homePageContainer');
    if (homePageContainer) {
        homePageContainer.style.display = 'block';
    }
    
    // Update body styles
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';
    
    try {
        // Load content if not already loaded
        if (!allContentData.levels) {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error('Failed to load content.json');
            allContentData = await response.json();
        }
        
        const levelData = allContentData?.levels?.[level];
        const weekData = levelData?.weeks?.[`w${week}`];
        const tagData = weekData?.tags?.[`t${tag}`];
        
        if (!tagData) {
            const homePageContainer = document.getElementById('homePageContainer');
            if (homePageContainer) {
                homePageContainer.innerHTML = '<div class="error-message">Tag not found.</div>';
            }
            return;
        }
        
        renderSectionsPage(level, week, tag, levelData, weekData, tagData);
        
    } catch (error) {
        console.error('Error loading sections page:', error);
        const homePageContainer = document.getElementById('homePageContainer');
        if (homePageContainer) {
            homePageContainer.innerHTML = '<div class="error-message">Error loading content. Please refresh the page.</div>';
        }
    }
}

function renderSectionsPage(level, week, tag, levelData, weekData, tagData) {
    const homePageContainer = document.getElementById('homePageContainer');
    if (!homePageContainer) return;
    
    homePageContainer.innerHTML = '';
    
    // Breadcrumb
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.innerHTML = `
        <a href="index.html">Home</a>
        <span> > </span>
        <a href="?level=${level}">${levelData.name}</a>
        <span> > </span>
        <a href="?level=${level}&week=${week}">${weekData.name}</a>
        <span> > </span>
        <span>${tagData.title}</span>
    `;
    breadcrumb.style.textAlign = 'center';
    breadcrumb.style.marginBottom = '32px';
    homePageContainer.appendChild(breadcrumb);
    
    // Header
    const header = document.createElement('div');
    header.className = 'home-header';
    
    const h1 = document.createElement('h1');
    h1.textContent = tagData.title;
    header.appendChild(h1);
    
    const hr = document.createElement('hr');
    header.appendChild(hr);
    
    homePageContainer.appendChild(header);
    
    // Sections container
    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'levels-container';
    
    const sections = tagData.sections || [];
    sections.forEach((section, index) => {
        const sectionCard = createSectionCard(level, week, tag, index + 1, section);
        sectionsContainer.appendChild(sectionCard);
    });
    
    homePageContainer.appendChild(sectionsContainer);
}

function createSectionCard(level, week, tag, sectionNum, sectionData) {
    const card = document.createElement('a');
    card.href = `?level=${level}&week=${week}&tag=${tag}&section=${sectionNum}`;
    card.className = 'level-card';
    card.style.cursor = 'pointer';
    
    const header = document.createElement('div');
    header.className = 'level-header';
    
    const emoji = document.createElement('span');
    emoji.className = 'level-emoji';
    emoji.textContent = '📖';
    
    const name = document.createElement('span');
    name.className = 'level-name';
    name.textContent = sectionData.sectionTitle;
    
    header.appendChild(emoji);
    header.appendChild(name);
    card.appendChild(header);
    
    // Show subtitle if exists
    if (sectionData.sectionSubtitle) {
        const subtitle = document.createElement('div');
        subtitle.style.marginTop = '12px';
        subtitle.style.color = '#6B7280';
        subtitle.style.fontSize = '14px';
        subtitle.textContent = sectionData.sectionSubtitle;
        card.appendChild(subtitle);
    }
    
    return card;
}

// ============================================
// INDIVIDUAL SECTION PAGE (RENAMED from showStudyMaterials)
// ============================================
async function showSectionPage(level, week, tag, section) {
    console.log('showSectionPage called:', level, week, tag, section);
    
    // Hide other views
    const homePageContainer = document.getElementById('homePageContainer');
    if (homePageContainer) homePageContainer.style.display = 'none';
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) quizContainer.style.display = 'none';
    if (questionSidebar) questionSidebar.style.display = 'none';
    
    // Show study materials container
    const studyMaterialsContainer = document.getElementById('studyMaterialsContainer');
    if (studyMaterialsContainer) {
        studyMaterialsContainer.style.display = 'block';
    }
    
    // Update body styles
    document.body.style.alignItems = 'flex-start';
    document.body.style.justifyContent = 'flex-start';
    
    try {
        // Load content if not already loaded
        if (!allContentData.levels) {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error('Failed to load content.json');
            allContentData = await response.json();
        }
        
        const levelData = allContentData?.levels?.[level];
        const weekData = levelData?.weeks?.[`w${week}`];
        const tagData = weekData?.tags?.[`t${tag}`];
        const sectionData = tagData?.sections?.[parseInt(section) - 1];
        
        if (!sectionData) {
            showStudyError('Section not found. Please check the URL parameters.');
            return;
        }
        
        renderSectionPage(level, week, tag, section, levelData, weekData, tagData, sectionData);
        
    } catch (error) {
        console.error('Error loading section page:', error);
        showStudyError('Error loading study materials. Please refresh the page.');
    }
}

function renderSectionPage(level, week, tag, section, levelData, weekData, tagData, sectionData) {
    // Render breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <a href="index.html">Home</a>
            <span> > </span>
            <a href="?level=${level}">${levelData.name}</a>
            <span> > </span>
            <a href="?level=${level}&week=${week}">${weekData.name}</a>
            <span> > </span>
            <a href="?level=${level}&week=${week}&tag=${tag}">${tagData.title}</a>
            <span> > </span>
            <span>${sectionData.sectionTitle}</span>
        `;
    }
    
    // Render section title
    const pageTitle = document.getElementById('studyPageTitle');
    if (pageTitle) pageTitle.textContent = sectionData.sectionTitle;
    
    // Render section subtitle
    const pageSubtitle = document.getElementById('studyPageSubtitle');
    if (pageSubtitle) pageSubtitle.textContent = sectionData.sectionSubtitle || '';
    
    // Render tables for this section only
    const tablesContainer = document.getElementById('tablesContainer');
    if (tablesContainer) {
        tablesContainer.innerHTML = '';
        
        if (sectionData.tables && sectionData.tables.length > 0) {
            sectionData.tables.forEach(tableData => {
                const tableElement = createTable(tableData);
                tablesContainer.appendChild(tableElement);
            });
        }
    }
    
    // Show practice button if section has quizSet
    const practiceButton = document.getElementById('practiceButton');
    if (practiceButton && sectionData.quizSet) {
        practiceButton.style.display = 'block';
        practiceButton.onclick = () => {
            window.location.href = `?level=${level}&week=${week}&tag=${tag}&section=${section}&view=quiz`;
        };
    } else if (practiceButton) {
        practiceButton.style.display = 'none';
    }
}


function createTable(tableData) {
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    
    const table = document.createElement('table');
    table.className = tableData.type === 'simple' ? 'simple-table' : 'vocabulary-table';
    
    if (tableData.categoryStyle) {
        table.classList.add(tableData.categoryStyle);
    }
    
    // Title row (if title exists)
    if (tableData.title) {
        const titleRow = document.createElement('tr');
        titleRow.className = 'table-title-row';
        const titleCell = document.createElement('td');
        titleCell.className = 'table-title';
        titleCell.colSpan = tableData.columns.length;
        titleCell.textContent = tableData.title;
        titleRow.appendChild(titleCell);
        
        const titleTbody = document.createElement('tbody');
        titleTbody.appendChild(titleRow);
        table.appendChild(titleTbody);
    }
    
    // Header row (if columns exist)
    if (tableData.columns && tableData.columns.length > 0) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        tableData.columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }
    
    // Data rows
    const tbody = document.createElement('tbody');
    
    if (tableData.type === 'vocabulary') {
        // Vocabulary table with merged category column
        tableData.rows.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            
            row.forEach((cell, cellIndex) => {
                if (cellIndex === 0) {
                    // Category column - only create on first row with rowspan
                    if (rowIndex === 0) {
                        const td = document.createElement('td');
                        td.className = 'category-cell';
                        td.textContent = cell;
                        td.rowSpan = tableData.rows.length;
                        tr.appendChild(td);
                    }
                    // Skip for other rows (already merged from first row)
                } else if (cellIndex === 1) {
                    // Word column
                    const td = document.createElement('td');
                    td.className = 'word-cell';
                    td.textContent = cell;
                    tr.appendChild(td);
                } else if (cellIndex === 2) {
                    // Meaning column
                    const td = document.createElement('td');
                    td.className = 'meaning-cell';
                    td.textContent = cell;
                    tr.appendChild(td);
                }
            });
            
            tbody.appendChild(tr);
        });
    } else {
        // Simple table - render normally
        tableData.rows.forEach(row => {
            const tr = document.createElement('tr');
            
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
    }
    
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    
    return tableWrapper;
}

function showStudyError(message) {
    const tablesContainer = document.getElementById('tablesContainer');
    if (tablesContainer) {
        tablesContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

// ============================================
// RANDOMIZATION UTILITIES
// ============================================
/**
 * Fisher-Yates shuffle algorithm for array randomization
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array (original unchanged)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// LOAD QUESTIONS FROM JSON
// ============================================
async function loadQuestions(questionSet) {
    try {
        const response = await fetch('questions.json');
        allQuestionsData = await response.json();
        
        if (allQuestionsData[questionSet]) {
            // RANDOMIZATION 1: Shuffle question order on page load
            exercises = shuffleArray(allQuestionsData[questionSet]);
        } else {
            console.error(`Question set "${questionSet}" not found. Available sets:`, Object.keys(allQuestionsData));
            // Fallback to first available set
            const availableSets = Object.keys(allQuestionsData);
            if (availableSets.length > 0) {
                exercises = shuffleArray(allQuestionsData[availableSets[0]]);
                console.log(`Loading first available set: ${availableSets[0]}`);
            }
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        // Show error message to user
        questionsContainer.innerHTML = '<div class="error-message">Error loading questions. Please refresh the page.</div>';
    }
}

// ============================================
// QUESTION SIDEBAR
// ============================================
function createQuestionSidebar() {
    if (!questionSidebar) return;
    
    questionSidebar.innerHTML = '';
    
    // Create up arrow
    const upArrow = document.createElement('div');
    upArrow.className = 'sidebar-arrow up';
    upArrow.id = 'sidebarArrowUp';
    
    // Create scrollable container
    const scrollable = document.createElement('div');
    scrollable.className = 'question-sidebar-scrollable';
    scrollable.id = 'sidebarScrollable';
    
    // Create down arrow
    const downArrow = document.createElement('div');
    downArrow.className = 'sidebar-arrow down';
    downArrow.id = 'sidebarArrowDown';
    
    // Add dots to scrollable container
    exercises.forEach((exercise, index) => {
        const dot = document.createElement('div');
        dot.className = 'question-dot';
        dot.dataset.questionIndex = index;
        dot.setAttribute('data-question-num', index + 1);
        
        dot.addEventListener('click', () => {
            currentQuestionIndex = index;
            renderQuestions();
            updateNavigation();
            updateProgress();
            scrollToCurrentQuestion();
            
            // Save state after sidebar navigation
            if (currentQuestionSet) {
                saveQuizState(currentQuestionSet);
            }
        });
        
        scrollable.appendChild(dot);
    });
    
    // Append to sidebar
    questionSidebar.appendChild(upArrow);
    questionSidebar.appendChild(scrollable);
    questionSidebar.appendChild(downArrow);
    
    // Set sidebar height to match quiz section
    updateSidebarHeight();
    
    // Add hover-to-scroll functionality
    let scrollInterval = null;
    const scrollSpeed = 2; // pixels per frame
    
    const startScrolling = (direction) => {
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            const currentScroll = scrollable.scrollTop || 0;
            if (direction === 'up') {
                scrollable.scrollTop = Math.max(0, currentScroll - scrollSpeed);
            } else {
                scrollable.scrollTop = Math.min(
                    scrollable.scrollHeight - scrollable.clientHeight,
                    currentScroll + scrollSpeed
                );
            }
            updateArrowVisibility();
        }, 16);
    };
    
    const stopScrolling = () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    };
    
    upArrow.addEventListener('mouseenter', () => startScrolling('up'));
    upArrow.addEventListener('mouseleave', stopScrolling);
    downArrow.addEventListener('mouseenter', () => startScrolling('down'));
    downArrow.addEventListener('mouseleave', stopScrolling);
    
    // Update arrow visibility on scroll
    scrollable.addEventListener('scroll', updateArrowVisibility);
    
    // Initial arrow visibility
    updateArrowVisibility();
    
    // Update height on window resize and scroll
    window.addEventListener('resize', updateSidebarHeight);
    window.addEventListener('scroll', updateSidebarHeight);
}

function updateSidebarHeight() {
    if (!questionSidebar || !quizSection) return;
    
    // Position sidebar next to quiz-section using fixed positioning
    const quizSectionRect = quizSection.getBoundingClientRect();
    const quizSectionHeight = quizSectionRect.height;
    
    // Position sidebar 20px to the left of the quiz section (80px = 60px width + 20px gap)
    questionSidebar.style.left = `${quizSectionRect.left - 80}px`;
    
    // CENTER the sidebar vertically with the quiz section, then move up by 25px
    // Calculate the center of the quiz section
    const quizSectionCenter = quizSectionRect.top + (quizSectionHeight / 2);
    // Position sidebar so its center aligns with quiz section center, then offset upward by 25px
    const sidebarHeight = quizSectionHeight; // Sidebar matches quiz section height
    questionSidebar.style.top = `${quizSectionCenter - (sidebarHeight / 2) - 25}px`;
    questionSidebar.style.height = `${quizSectionHeight}px`;
    
    // Limit visible dots (12-15 visible at a time)
    const scrollable = document.getElementById('sidebarScrollable');
    if (!scrollable) return;
    
    const dots = scrollable.querySelectorAll('.question-dot');
    if (dots.length === 0) return;
    
    // Calculate how many dots fit in the visible area
    // 8px dot + 8px spacing = 16px per dot (for regular dots)
    // Current dot is 12px with 2px margins, but we'll use average spacing
    const dotSpacing = 8; // 8px spacing between dots
    const dotSize = 8; // regular dot size
    const dotHeightWithSpacing = dotSize + dotSpacing; // 16px total per dot
    const arrowHeight = 16 + 16; // arrow height + margins (8px top + 8px bottom)
    const availableHeight = quizSectionHeight - arrowHeight;
    const visibleDots = Math.floor(availableHeight / dotHeightWithSpacing);
    const maxVisibleDots = Math.min(15, Math.max(12, visibleDots));
    
    // Set max height to show only visible dots
    const maxHeight = maxVisibleDots * dotHeightWithSpacing;
    scrollable.style.maxHeight = `${maxHeight}px`;
    scrollable.style.overflowY = scrollable.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

function scrollToCurrentQuestion() {
    const scrollable = document.getElementById('sidebarScrollable');
    if (!scrollable) return;
    
    const dots = scrollable.querySelectorAll('.question-dot');
    const currentDot = dots[currentQuestionIndex];
    
    if (currentDot) {
        const scrollableHeight = scrollable.clientHeight;
        const dotTop = currentDot.offsetTop;
        const dotHeight = 8 + 8; // dot height + 8px spacing
        
        // Center the current dot in the visible area
        const targetScroll = dotTop - (scrollableHeight / 2) + (dotHeight / 2);
        scrollable.scrollTo({
            top: Math.max(0, Math.min(targetScroll, scrollable.scrollHeight - scrollable.clientHeight)),
            behavior: 'smooth'
        });
    }
}

function updateArrowVisibility() {
    const scrollable = document.getElementById('sidebarScrollable');
    const upArrow = document.getElementById('sidebarArrowUp');
    const downArrow = document.getElementById('sidebarArrowDown');
    
    if (!scrollable || !upArrow || !downArrow) return;
    
    const scrollTop = scrollable.scrollTop || 0;
    const scrollHeight = scrollable.scrollHeight;
    const clientHeight = scrollable.clientHeight;
    
    // Show up arrow if not at top
    if (scrollTop > 1) {
        upArrow.classList.remove('hidden');
    } else {
        upArrow.classList.add('hidden');
    }
    
    // Show down arrow if not at bottom
    if (scrollTop < scrollHeight - clientHeight - 1) {
        downArrow.classList.remove('hidden');
    } else {
        downArrow.classList.add('hidden');
    }
}

function updateQuestionSidebar() {
    if (!questionSidebar) return;
    
    const dots = questionSidebar.querySelectorAll('.question-dot');
    
    dots.forEach((dot, index) => {
        const exercise = exercises[index];
        const questionId = exercise.id;
        const isAnswered = selectedAnswers[questionId] !== undefined;
        const isCurrent = index === currentQuestionIndex;
        
        // Remove all state classes
        dot.classList.remove('current', 'answered', 'correct', 'incorrect');
        
        // Add current class
        if (isCurrent) {
            dot.classList.add('current');
        }
        
        // Add answered class
        if (isAnswered) {
            dot.classList.add('answered');
            
            // Add correct/incorrect if answered
            const userAnswer = selectedAnswers[questionId];
            const isCorrect = userAnswer === exercise.correct;
            dot.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
    });
}

// ============================================
// RENDERING FUNCTIONS
// ============================================
function renderQuestions() {
    questionsContainer.innerHTML = '';
    
    if (exercises.length === 0) {
        questionsContainer.innerHTML = '<div class="error-message">No questions available. Please check your question set.</div>';
        return;
    }
    
    // Only render the current question
    const exercise = exercises[currentQuestionIndex];
    const questionCard = createQuestionCard(exercise, currentQuestionIndex + 1);
    questionsContainer.appendChild(questionCard);
    
    // Set initial state: show button, hide options, hide Next button
    const showOptionsWrapper = document.querySelector('.show-options-wrapper');
    const showOptionsBtn = document.getElementById('showOptionsBtn');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextBtn = document.getElementById('nextBtn');
    
    // Show the wrapper and button
    if (showOptionsWrapper) {
        showOptionsWrapper.style.display = 'flex';
    }
    if (showOptionsBtn) {
        showOptionsBtn.style.display = 'block';
        showOptionsBtn.style.opacity = '1';
        showOptionsBtn.addEventListener('click', handleShowOptions);
    }
    
    // Hide options container
    if (optionsContainer) {
        optionsContainer.style.display = 'none';
        optionsContainer.style.opacity = '0';
    }
    
    // Hide Next button initially (but keep action-buttons container visible for Previous button)
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
    
    // Show Previous button if not on first question
    if (prevBtn) {
        prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    }
    
    // Ensure action-buttons container is visible
    const actionButtonsContainer = document.querySelector('.action-buttons');
    if (actionButtonsContainer && actionButtonsContainer.id !== 'submitButtonsContainer') {
        actionButtonsContainer.style.display = 'flex';
    }
    
    // Set the selected answer if already answered (skip show options flow)
    if (selectedAnswers[exercise.id]) {
        const radioInput = document.querySelector(`input[name="question_${exercise.id}"][value="${selectedAnswers[exercise.id]}"]`);
        if (radioInput) {
            // If already answered, show options and hide button wrapper
            const showOptionsWrapper = document.querySelector('.show-options-wrapper');
            if (showOptionsWrapper) {
                showOptionsWrapper.style.display = 'none';
            }
            if (optionsContainer) {
                optionsContainer.style.display = 'block';
                optionsContainer.style.opacity = '1';
            }
            radioInput.checked = true;
            showImmediateFeedback(radioInput, exercise.id);
            // Show Next button if answer is selected
            if (nextBtn) {
                nextBtn.style.display = 'block';
            }
        }
    }
    
    // Update sidebar height after rendering
    setTimeout(updateSidebarHeight, 0);
}

function createQuestionCard(exercise, questionNum) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.dataset.questionId = exercise.id;
    
    card.innerHTML = `
        <div class="question-header">
            <span class="question-badge badge-number">Question ${questionNum}</span>
            <span class="question-badge badge-category">${exercise.category}</span>
        </div>
        <div class="question-text">${exercise.question}</div>
        <div class="show-options-wrapper">
            <button type="button" class="show-options-btn" id="showOptionsBtn">Show Options</button>
        </div>
        <div class="options-container" id="optionsContainer" style="display: none; opacity: 0;">
            ${(() => {
                // RANDOMIZATION 2: Fully shuffle answer options randomly
                // Store shuffled order for this question ID so it stays consistent during the session
                if (!shuffledOptionsMap[exercise.id]) {
                    // Fully shuffle the options array using Fisher-Yates shuffle
                    const shuffledOptions = shuffleArray([...exercise.options]);
                    shuffledOptionsMap[exercise.id] = shuffledOptions;
                }
                const shuffledOptions = shuffledOptionsMap[exercise.id];
                return shuffledOptions.map((option, idx) => `
                    <div class="radio-option">
                        <input 
                            type="radio" 
                            id="q${exercise.id}_opt${idx}" 
                            name="question_${exercise.id}" 
                            value="${option}"
                        />
                        <label for="q${exercise.id}_opt${idx}">${option}</label>
                    </div>
                `).join('');
            })()}
        </div>
    `;
    
    return card;
}

// ============================================
// EVENT HANDLERS
// ============================================
function attachEventListeners() {
    questionsContainer.addEventListener('change', handleAnswerChange);
    quizForm.addEventListener('submit', handleSubmit);
    prevBtn.addEventListener('click', handlePrevious);
    nextBtn.addEventListener('click', handleNext);
    resetBtn.addEventListener('click', handleReset);
}

function handleShowOptions() {
    const showOptionsBtn = document.getElementById('showOptionsBtn');
    const showOptionsWrapper = showOptionsBtn ? showOptionsBtn.closest('.show-options-wrapper') : null;
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Fade out the button
    if (showOptionsBtn) {
        showOptionsBtn.style.opacity = '0';
        setTimeout(() => {
            if (showOptionsWrapper) {
                showOptionsWrapper.style.display = 'none';
            }
        }, 300); // Wait for fade transition
    }
    
    // Fade in the options
    if (optionsContainer) {
        optionsContainer.style.display = 'block';
        // Use setTimeout to trigger fade-in transition
        setTimeout(() => {
            optionsContainer.style.opacity = '1';
        }, 10);
    }
}

function handleAnswerChange(e) {
    if (e.target.type === 'radio' && !submitted) {
        const questionId = parseInt(e.target.name.split('_')[1]);
        const selectedValue = e.target.value;
        
        selectedAnswers[questionId] = selectedValue;
        answeredCount = Object.keys(selectedAnswers).length;
        
        updateProgress();
        updateCardState(e.target);
        
        // Show immediate feedback for the selected answer
        showImmediateFeedback(e.target, questionId);
        
        // Show Next button when an option is selected
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.style.display = 'block';
        }
        
        // Save state after answer change
        if (currentQuestionSet) {
            saveQuizState(currentQuestionSet);
        }
        
        // Remove auto-advance - wait for Next button click
    }
}

function updateCardState(radioInput) {
    const card = radioInput.closest('.question-card');
    if (card) {
        card.classList.add('answered');
    }
}

function showImmediateFeedback(radioInput, questionId) {
    const card = radioInput.closest('.question-card');
    if (!card) return;
    
    const exercise = exercises.find(ex => ex.id === questionId);
    if (!exercise) return;
    
    const userAnswer = radioInput.value;
    const options = card.querySelectorAll('.radio-option');
    
    // Disable all radio buttons in this question to prevent changing answer
    options.forEach(option => {
        const input = option.querySelector('input');
        const optionValue = input.value;
        
        // Disable the input
        input.disabled = true;
        
        // Remove previous feedback classes
        option.classList.remove('correct', 'incorrect');
        
        // Mark correct answer as green
        if (optionValue === exercise.correct) {
            option.classList.add('correct');
        }
        
        // Mark user's incorrect answer as red
        if (optionValue === userAnswer && userAnswer !== exercise.correct) {
            option.classList.add('incorrect');
        }
    });
}

function handleSubmit(e) {
    e.preventDefault();
    if (!submitted && answeredCount > 0) {
        checkAnswers();
    }
}

function handleClear() {
    if (!submitted) {
        clearAllAnswers();
    }
}

function handleReset() {
    resetQuiz();
}

// ============================================
// NAVIGATION
// ============================================
function updateNavigation() {
    const totalQuestions = exercises.length;
    
    // Show/hide Previous button
    if (prevBtn) {
        prevBtn.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    }
    
    // Next button visibility is now controlled by answer selection in renderQuestions
    // Only show if answer is already selected (handled in renderQuestions)
    // Don't auto-show Next button here - it's hidden initially and shown when answer is selected
    
    // Show Submit button only on last question
    if (submitButtonsContainer) {
        const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
        submitButtonsContainer.style.display = isLastQuestion ? 'flex' : 'none';
    }
    
    // Update sidebar
    updateQuestionSidebar();
    scrollToCurrentQuestion();
    updateSidebarHeight();
}

function handlePrevious() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestions();
        updateNavigation();
        updateProgress();
        
        // Save state after navigation
        if (currentQuestionSet) {
            saveQuizState(currentQuestionSet);
        }
    }
}

function handleNext() {
    if (currentQuestionIndex < exercises.length - 1) {
        currentQuestionIndex++;
        renderQuestions();
        updateNavigation();
        updateProgress();
        
        // Save state after navigation
        if (currentQuestionSet) {
            saveQuizState(currentQuestionSet);
        }
    }
}

// ============================================
// PROGRESS MANAGEMENT
// ============================================
function updateProgress() {
    const totalQs = exercises.length;
    
    // Update progress text
    if (progressText) {
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${totalQs}`;
    }
}

// ============================================
// ANSWER CHECKING
// ============================================
function checkAnswers() {
    submitted = true;
    let correctCount = 0;
    
    // Disable all inputs and buttons
    disableAllInputs();
    
    // Check each question
    exercises.forEach(exercise => {
        const userAnswer = selectedAnswers[exercise.id];
        const isCorrect = userAnswer === exercise.correct;
        
        if (isCorrect) {
            correctCount++;
        }
        
        showFeedback(exercise, userAnswer);
    });
    
    // Calculate and display results
    displayResults(correctCount);
    
    // Save final state and then clear it (quiz completed)
    if (currentQuestionSet) {
        saveQuizState(currentQuestionSet);
        // Clear saved state after a delay to allow viewing results
        setTimeout(() => {
            clearQuizState(currentQuestionSet);
        }, 1000);
    }
    
    // Scroll to results
    scrollToResults();
}

function showFeedback(exercise, userAnswer) {
    const card = document.querySelector(`[data-question-id="${exercise.id}"]`);
    if (!card) return;
    
    const options = card.querySelectorAll('.radio-option');
    
    options.forEach(option => {
        const input = option.querySelector('input');
        const optionValue = input.value;
        
        option.classList.remove('correct', 'incorrect');
        
        if (optionValue === exercise.correct) {
            option.classList.add('correct');
        } else if (optionValue === userAnswer && userAnswer !== exercise.correct) {
            option.classList.add('incorrect');
            card.classList.add('incorrect');
        }
    });
    
    // Stagger animation for better visual effect
    setTimeout(() => {
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = null;
    }, 100);
}

function disableAllInputs() {
    const inputs = questionsContainer.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.disabled = true);
    
    submitBtn.disabled = true;
    clearBtn.disabled = true;
}

// ============================================
// RESULTS DISPLAY
// ============================================
function displayResults(score) {
    const { title, message } = getResultsData(score);
    
    finalScore.textContent = score;
    resultsTitle.textContent = title;
    resultsMessage.textContent = message;
    
    quizSection.classList.add('hidden');
    resultsPanel.classList.remove('hidden');
}

function getResultsData(score) {
    const totalQuestions = exercises.length;
    const percentage = (score / totalQuestions) * 100;
    
    if (score === totalQuestions) {
        return {
            title: "Perfect!",
            message: "Congratulations! You got every question correct!"
        };
    } else if (percentage >= 90) {
        return {
            title: "Excellent!",
            message: "Excellent work! You have a strong grasp of German vocabulary."
        };
    } else if (percentage >= 80) {
        return {
            title: "Very Good!",
            message: "Very good! You're doing well with these vocabulary words."
        };
    } else {
        return {
            title: "Keep Practicing!",
            message: "Keep practicing! Review the words you got wrong and try again."
        };
    }
}

// ============================================
// RESET FUNCTIONS
// ============================================
function clearAllAnswers() {
    const inputs = questionsContainer.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.checked = false;
        input.disabled = false;
    });
    
    selectedAnswers = {};
    answeredCount = 0;
    
    updateProgress();
    
    // Remove feedback from all cards and options
    const cards = questionsContainer.querySelectorAll('.question-card');
    cards.forEach(card => {
        card.classList.remove('answered', 'incorrect', 'show-feedback');
        const options = card.querySelectorAll('.radio-option');
        options.forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
    });
}

function resetQuiz() {
    submitted = false;
    selectedAnswers = {};
    answeredCount = 0;
    currentQuestionIndex = 0;
    startTime = Date.now();
    shuffledOptionsMap = {}; // Reset shuffled options for new quiz session
    
    // Clear saved state when resetting
    if (currentQuestionSet) {
        clearQuizState(currentQuestionSet);
    }
    
    // Re-enable inputs
    const inputs = questionsContainer.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.disabled = false);
    
    clearAllAnswers();
    
    // Show quiz, hide results
    quizSection.classList.remove('hidden');
    resultsPanel.classList.add('hidden');
    
    // Re-render and update navigation
    renderQuestions();
    updateNavigation();
    
    scrollToTop();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToResults() {
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }, 300);
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const handleOptimizedScroll = debounce(() => {
    // Any scroll-based functionality can go here
}, 100);

window.addEventListener('scroll', handleOptimizedScroll);

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
