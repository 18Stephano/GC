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

// ============================================
// DOM ELEMENTS
// ============================================
const progressText = document.getElementById('progressText');
const totalQuestionsDisplay = document.getElementById('totalQuestionsDisplay');
const questionsContainer = document.getElementById('questionsContainer');
const questionSidebar = document.getElementById('questionSidebar');
const submitBtn = document.getElementById('submitBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitButtonsContainer = document.getElementById('submitButtonsContainer');
const resetBtn = document.getElementById('resetBtn');
const quizForm = document.getElementById('quizForm');
const resultsPanel = document.getElementById('resultsPanel');
const quizSection = document.getElementById('quizSection');
const finalScore = document.getElementById('finalScore');
const resultsTitle = document.getElementById('resultsTitle');
const resultsMessage = document.getElementById('resultsMessage');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Get the question set from URL parameter (default to tag-1)
    const urlParams = new URLSearchParams(window.location.search);
    const questionSet = urlParams.get('set') || 'tag-1';
    
    // Load questions from JSON
    await loadQuestions(questionSet);
    
    // Update total questions display
    if (totalQuestionsDisplay) {
        totalQuestionsDisplay.textContent = exercises.length;
    }
    
    startTime = Date.now();
    createQuestionSidebar();
    renderQuestions();
    updateNavigation();
    updateProgress();
    attachEventListeners();
});

// ============================================
// LOAD QUESTIONS FROM JSON
// ============================================
async function loadQuestions(questionSet) {
    try {
        const response = await fetch('questions.json');
        allQuestionsData = await response.json();
        
        if (allQuestionsData[questionSet]) {
            exercises = allQuestionsData[questionSet];
        } else {
            console.error(`Question set "${questionSet}" not found. Available sets:`, Object.keys(allQuestionsData));
            // Fallback to first available set
            const availableSets = Object.keys(allQuestionsData);
            if (availableSets.length > 0) {
                exercises = allQuestionsData[availableSets[0]];
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
        });
        
        scrollable.appendChild(dot);
    });
    
    // Add hover-to-scroll functionality
    let scrollInterval = null;
    const scrollSpeed = 3; // pixels per frame
    
    upArrow.addEventListener('mouseenter', () => {
        scrollInterval = setInterval(() => {
            scrollable.scrollTop -= scrollSpeed;
        }, 16);
    });
    
    upArrow.addEventListener('mouseleave', () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    });
    
    downArrow.addEventListener('mouseenter', () => {
        scrollInterval = setInterval(() => {
            scrollable.scrollTop += scrollSpeed;
        }, 16);
    });
    
    downArrow.addEventListener('mouseleave', () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    });
    
    // Update arrow visibility on scroll
    scrollable.addEventListener('scroll', updateArrowVisibility);
    
    // Append to sidebar
    questionSidebar.appendChild(upArrow);
    questionSidebar.appendChild(scrollable);
    questionSidebar.appendChild(downArrow);
    
    // Initial arrow visibility
    updateArrowVisibility();
}

function scrollToCurrentQuestion() {
    const scrollable = document.getElementById('sidebarScrollable');
    if (!scrollable) return;
    
    const dots = scrollable.querySelectorAll('.question-dot');
    const currentDot = dots[currentQuestionIndex];
    
    if (currentDot) {
        const scrollableHeight = scrollable.clientHeight;
        const dotTop = currentDot.offsetTop;
        const dotHeight = currentDot.offsetHeight;
        
        // Center the current dot in the visible area
        scrollable.scrollTop = dotTop - (scrollableHeight / 2) + (dotHeight / 2);
    }
}

function updateArrowVisibility() {
    const scrollable = document.getElementById('sidebarScrollable');
    const upArrow = document.getElementById('sidebarArrowUp');
    const downArrow = document.getElementById('sidebarArrowDown');
    
    if (!scrollable || !upArrow || !downArrow) return;
    
    const scrollTop = scrollable.scrollTop;
    const scrollHeight = scrollable.scrollHeight;
    const clientHeight = scrollable.clientHeight;
    
    // Show up arrow if not at top
    if (scrollTop > 0) {
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
    
    // Set the selected answer if already answered
    if (selectedAnswers[exercise.id]) {
        const radioInput = document.querySelector(`input[name="question_${exercise.id}"][value="${selectedAnswers[exercise.id]}"]`);
        if (radioInput) {
            radioInput.checked = true;
            showImmediateFeedback(radioInput, exercise.id);
        }
    }
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
        <div class="options-container">
            ${exercise.options.map((option, idx) => `
                <div class="radio-option">
                    <input 
                        type="radio" 
                        id="q${exercise.id}_opt${idx}" 
                        name="question_${exercise.id}" 
                        value="${option}"
                    />
                    <label for="q${exercise.id}_opt${idx}">${option}</label>
                </div>
            `).join('')}
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
        
        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < exercises.length - 1) {
                handleNext();
            }
        }, 1000);
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
    
    // Show/hide Next button
    if (nextBtn) {
        const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
        nextBtn.style.display = isLastQuestion ? 'none' : 'block';
    }
    
    // Show Submit button only on last question
    if (submitButtonsContainer) {
        const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
        submitButtonsContainer.style.display = isLastQuestion ? 'flex' : 'none';
    }
    
    // Update sidebar
    updateQuestionSidebar();
    scrollToCurrentQuestion();
}

function handlePrevious() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestions();
        updateNavigation();
        updateProgress();
    }
}

function handleNext() {
    if (currentQuestionIndex < exercises.length - 1) {
        currentQuestionIndex++;
        renderQuestions();
        updateNavigation();
        updateProgress();
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
