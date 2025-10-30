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
const progressCounter = document.getElementById('progressCounter');
const currentQuestion = document.getElementById('currentQuestion');
const progressBar = document.getElementById('progressBar');
const totalQuestions = document.getElementById('totalQuestions');
const totalQuestionsDisplay = document.getElementById('totalQuestionsDisplay');
const questionsContainer = document.getElementById('questionsContainer');
const submitBtn = document.getElementById('submitBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitButtonsContainer = document.getElementById('submitButtonsContainer');
const clearBtn = document.getElementById('clearBtn');
const resetBtn = document.getElementById('resetBtn');
const quizForm = document.getElementById('quizForm');
const resultsPanel = document.getElementById('resultsPanel');
const quizSection = document.getElementById('quizSection');
const finalScore = document.getElementById('finalScore');
const resultsTitle = document.getElementById('resultsTitle');
const resultsMessage = document.getElementById('resultsMessage');
const trophyIcon = document.getElementById('trophyIcon');

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Get the question set from URL parameter (default to vocab-week1)
    const urlParams = new URLSearchParams(window.location.search);
    const questionSet = urlParams.get('set') || 'vocab-week1';
    
    // Load questions from JSON
    await loadQuestions(questionSet);
    
    // Update total questions display
    if (totalQuestions && totalQuestionsDisplay) {
        totalQuestions.textContent = exercises.length;
        totalQuestionsDisplay.textContent = exercises.length;
    }
    
    startTime = Date.now();
    renderQuestions();
    updateNavigation();
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
        prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-flex' : 'none';
    }
    
    // Show/hide Next button
    if (nextBtn) {
        const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
        nextBtn.style.display = isLastQuestion ? 'none' : 'inline-flex';
    }
    
    // Show Submit button only on last question
    if (submitButtonsContainer) {
        const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
        submitButtonsContainer.style.display = isLastQuestion ? 'flex' : 'none';
    }
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
    const percentage = (answeredCount / totalQs) * 100;
    
    progressCounter.textContent = answeredCount;
    progressBar.style.width = `${percentage}%`;
    
    // Update current question display
    if (currentQuestion) {
        currentQuestion.textContent = currentQuestionIndex + 1;
    }
    
    // Add visual feedback when progress increases
    if (answeredCount > 0 && answeredCount % 10 === 0) {
        playProgressAnimation();
    }
}

function playProgressAnimation() {
    progressBar.style.animation = 'none';
    setTimeout(() => {
        progressBar.style.animation = 'shimmer 2s infinite';
    }, 10);
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
    finalScore.textContent = score;
    
    const { title, message, icon } = getResultsData(score);
    
    resultsTitle.textContent = title;
    resultsMessage.textContent = message;
    trophyIcon.textContent = icon;
    
    quizSection.classList.add('hidden');
    resultsPanel.classList.remove('hidden');
    
    // Animate score counting
    animateScore(score);
}

function getResultsData(score) {
    const totalQuestions = exercises.length;
    const percentage = (score / totalQuestions) * 100;
    
    if (score === totalQuestions) {
        return {
            title: "PERFEKT! 🎉",
            message: "Congratulations! You got every question correct! You're a German vocabulary master!",
            icon: "🏆"
        };
    } else if (percentage >= 90) {
        return {
            title: "AUSGEZEICHNET! 💪",
            message: "Excellent work! You have a strong grasp of A1 level German vocabulary. Keep up the great effort!",
            icon: "🌟"
        };
    } else if (percentage >= 80) {
        return {
            title: "SEHR GUT! ✅",
            message: "Very good! You're doing well with these vocabulary words. A bit more practice and you'll be excellent!",
            icon: "👍"
        };
    } else {
        return {
            title: "WEITER ÜBEN! 📚",
            message: "Keep practicing! Review the words you got wrong and try again. You'll improve with each attempt!",
            icon: "📖"
        };
    }
}

function animateScore(targetScore) {
    let currentScore = 0;
    const duration = 1000;
    const steps = Math.min(targetScore, 50); // Cap at 50 steps for smooth animation
    const increment = targetScore / steps;
    const stepDuration = duration / steps;
    
    const interval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }
        finalScore.textContent = Math.floor(currentScore);
    }, stepDuration);
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
