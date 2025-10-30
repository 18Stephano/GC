// ============================================
// GERMAN VOCABULARY QUIZ - ENHANCED VERSION
// ============================================

/**
 * Quiz Data - 50 A1 Level German Vocabulary Questions
 */
const exercises = [
    { id: 1, question: "TIRED", options: ["MÜDE", "GLÜCKLICH"], correct: "MÜDE", category: "Feelings" },
    { id: 2, question: "ICH BIN _____. (I AM HAPPY)", options: ["GLÜCKLICH", "TRAURIG"], correct: "GLÜCKLICH", category: "Feelings" },
    { id: 3, question: "SICK", options: ["KRANK", "GESUND"], correct: "KRANK", category: "Feelings" },
    { id: 4, question: "SIE IST _____. (SHE IS HEALTHY)", options: ["GESUND", "KRANK"], correct: "GESUND", category: "Feelings" },
    { id: 5, question: "HUNGRY", options: ["HUNGRIG", "DURSTIG"], correct: "HUNGRIG", category: "Feelings" },
    { id: 6, question: "ER IST _____. (HE IS THIRSTY)", options: ["DURSTIG", "HUNGRIG"], correct: "DURSTIG", category: "Feelings" },
    { id: 7, question: "CONTENT/SATISFIED", options: ["ZUFRIEDEN", "NERVÖS"], correct: "ZUFRIEDEN", category: "Feelings" },
    { id: 8, question: "WIR SIND _____. (WE ARE NERVOUS)", options: ["NERVÖS", "RUHIG"], correct: "NERVÖS", category: "Feelings" },
    { id: 9, question: "CALM/QUIET", options: ["RUHIG", "AUFGEREGT"], correct: "RUHIG", category: "Feelings" },
    { id: 10, question: "DU BIST _____. (YOU ARE EXCITED)", options: ["AUFGEREGT", "FERTIG"], correct: "AUFGEREGT", category: "Feelings" },
    { id: 11, question: "READY/FINISHED", options: ["FERTIG", "BESCHÄFTIGT"], correct: "FERTIG", category: "States" },
    { id: 12, question: "IHR SEID _____. (YOU ALL ARE BUSY)", options: ["BESCHÄFTIGT", "FREI"], correct: "BESCHÄFTIGT", category: "States" },
    { id: 13, question: "FREE", options: ["FREI", "VERHEIRATET"], correct: "FREI", category: "States" },
    { id: 14, question: "ICH BIN _____. (I AM MARRIED)", options: ["VERHEIRATET", "FREI"], correct: "VERHEIRATET", category: "States" },
    { id: 15, question: "BIG/TALL", options: ["GROSS", "KLEIN"], correct: "GROSS", category: "Descriptions" },
    { id: 16, question: "DAS KIND IST _____. (THE CHILD IS SMALL)", options: ["KLEIN", "GROSS"], correct: "KLEIN", category: "Descriptions" },
    { id: 17, question: "YOUNG", options: ["JUNG", "ALT"], correct: "JUNG", category: "Descriptions" },
    { id: 18, question: "MEIN VATER IST _____. (MY FATHER IS OLD)", options: ["ALT", "JUNG"], correct: "ALT", category: "Descriptions" },
    { id: 19, question: "NEW", options: ["NEU", "ALT"], correct: "NEU", category: "Descriptions" },
    { id: 20, question: "DAS AUTO IST _____. (THE CAR IS GOOD)", options: ["GUT", "SCHLECHT"], correct: "GUT", category: "Descriptions" },
    { id: 21, question: "BAD", options: ["SCHLECHT", "GUT"], correct: "SCHLECHT", category: "Descriptions" },
    { id: 22, question: "DIE BLUME IST _____. (THE FLOWER IS BEAUTIFUL)", options: ["SCHÖN", "HÄSSLICH"], correct: "SCHÖN", category: "Descriptions" },
    { id: 23, question: "UGLY", options: ["HÄSSLICH", "SCHÖN"], correct: "HÄSSLICH", category: "Descriptions" },
    { id: 24, question: "DER WEG IST _____. (THE PATH IS LONG)", options: ["LANG", "KURZ"], correct: "LANG", category: "Descriptions" },
    { id: 25, question: "GERMAN", options: ["DEUTSCH", "ENGLISCH"], correct: "DEUTSCH", category: "Nationalities" },
    { id: 26, question: "ICH BIN _____. (I AM AMERICAN)", options: ["AMERIKANISCH", "KANADISCH"], correct: "AMERIKANISCH", category: "Nationalities" },
    { id: 27, question: "ENGLISH", options: ["ENGLISCH", "FRANZÖSISCH"], correct: "ENGLISCH", category: "Nationalities" },
    { id: 28, question: "ER IST _____. (HE IS SPANISH)", options: ["SPANISCH", "ITALIENISCH"], correct: "SPANISCH", category: "Nationalities" },
    { id: 29, question: "ITALIAN", options: ["ITALIENISCH", "FRANZÖSISCH"], correct: "ITALIENISCH", category: "Nationalities" },
    { id: 30, question: "SIE IST _____. (SHE IS FRENCH)", options: ["FRANZÖSISCH", "DEUTSCH"], correct: "FRANZÖSISCH", category: "Nationalities" },
    { id: 31, question: "CHINESE", options: ["CHINESISCH", "JAPANISCH"], correct: "CHINESISCH", category: "Nationalities" },
    { id: 32, question: "WIR SIND _____. (WE ARE JAPANESE)", options: ["JAPANISCH", "CHINESISCH"], correct: "JAPANISCH", category: "Nationalities" },
    { id: 33, question: "MEXICAN", options: ["MEXIKANISCH", "SPANISCH"], correct: "MEXIKANISCH", category: "Nationalities" },
    { id: 34, question: "IHR SEID _____. (YOU ALL ARE CANADIAN)", options: ["KANADISCH", "AMERIKANISCH"], correct: "KANADISCH", category: "Nationalities" },
    { id: 35, question: "STUDENT (MALE)", options: ["DER STUDENT", "DER LEHRER"], correct: "DER STUDENT", category: "Professions" },
    { id: 36, question: "ICH BIN _____. (I AM A TEACHER - FEMALE)", options: ["DIE LEHRERIN", "DIE STUDENTIN"], correct: "DIE LEHRERIN", category: "Professions" },
    { id: 37, question: "DOCTOR (MALE)", options: ["DER ARZT", "DER KOCH"], correct: "DER ARZT", category: "Professions" },
    { id: 38, question: "ER IST _____. (HE IS A COOK/CHEF)", options: ["DER KOCH", "DER ARZT"], correct: "DER KOCH", category: "Professions" },
    { id: 39, question: "ENGINEER (FEMALE)", options: ["DIE INGENIEURIN", "DIE VERKÄUFERIN"], correct: "DIE INGENIEURIN", category: "Professions" },
    { id: 40, question: "SIE IST _____. (SHE IS A SALESPERSON)", options: ["DIE VERKÄUFERIN", "DIE KELLNERIN"], correct: "DIE VERKÄUFERIN", category: "Professions" },
    { id: 41, question: "WAITER (MALE)", options: ["DER KELLNER", "DER VERKÄUFER"], correct: "DER KELLNER", category: "Professions" },
    { id: 42, question: "ICH BIN _____. (I AM A PROGRAMMER - FEMALE)", options: ["DIE PROGRAMMIERERIN", "DIE MANAGERIN"], correct: "DIE PROGRAMMIERERIN", category: "Professions" },
    { id: 43, question: "MANAGER (MALE)", options: ["DER MANAGER", "DER KÜNSTLER"], correct: "DER MANAGER", category: "Professions" },
    { id: 44, question: "ER IST _____. (HE IS AN ARTIST)", options: ["DER KÜNSTLER", "DER MANAGER"], correct: "DER KÜNSTLER", category: "Professions" },
    { id: 45, question: "FRIEND (FEMALE)", options: ["DIE FREUNDIN", "DIE LEHRERIN"], correct: "DIE FREUNDIN", category: "Nouns" },
    { id: 46, question: "DU BIST MEIN _____. (YOU ARE MY FRIEND - MALE)", options: ["FREUND", "LEHRER"], correct: "FREUND", category: "Nouns" },
    { id: 47, question: "PERSON/HUMAN", options: ["DER MENSCH", "DAS KIND"], correct: "DER MENSCH", category: "Nouns" },
    { id: 48, question: "DAS IST EIN _____. (THAT IS A CHILD)", options: ["KIND", "MENSCH"], correct: "KIND", category: "Nouns" },
    { id: 49, question: "FAMILY", options: ["DIE FAMILIE", "DER FREUND"], correct: "DIE FAMILIE", category: "Nouns" },
    { id: 50, question: "WIE IST DEIN _____? (WHAT IS YOUR NAME?)", options: ["NAME", "FAMILIE"], correct: "NAME", category: "Nouns" }
];

// ============================================
// STATE MANAGEMENT
// ============================================
let answeredCount = 0;
let submitted = false;
let selectedAnswers = {};
let startTime = null;

// ============================================
// DOM ELEMENTS
// ============================================
const progressCounter = document.getElementById('progressCounter');
const progressPercent = document.getElementById('progressPercent');
const progressBar = document.getElementById('progressBar');
const questionsContainer = document.getElementById('questionsContainer');
const submitBtn = document.getElementById('submitBtn');
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
document.addEventListener('DOMContentLoaded', () => {
    startTime = Date.now();
    renderQuestions();
    attachEventListeners();
});

// ============================================
// RENDERING FUNCTIONS
// ============================================
function renderQuestions() {
    questionsContainer.innerHTML = '';
    
    exercises.forEach((exercise, index) => {
        const questionCard = createQuestionCard(exercise, index + 1);
        questionsContainer.appendChild(questionCard);
    });
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
    clearBtn.addEventListener('click', handleClear);
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
    
    options.forEach(option => {
        const input = option.querySelector('input');
        const optionValue = input.value;
        
        // Remove previous feedback classes
        option.classList.remove('correct', 'incorrect');
        
        // Mark correct answer as green
        if (optionValue === exercise.correct) {
            option.classList.add('correct');
        }
        
        // Mark user's incorrect answer as red
        if (optionValue === userAnswer && userAnswer !== exercise.correct) {
            option.classList.add('incorrect');
            card.classList.add('incorrect');
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
// PROGRESS MANAGEMENT
// ============================================
function updateProgress() {
    const percentage = (answeredCount / 50) * 100;
    
    progressCounter.textContent = answeredCount;
    progressPercent.textContent = `${Math.round(percentage)}%`;
    progressBar.style.width = `${percentage}%`;
    
    submitBtn.disabled = answeredCount === 0;
    
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
    if (score === 50) {
        return {
            title: "PERFEKT! 🎉",
            message: "Congratulations! You got every question correct! You're a German vocabulary master!",
            icon: "🏆"
        };
    } else if (score >= 45) {
        return {
            title: "AUSGEZEICHNET! 💪",
            message: "Excellent work! You have a strong grasp of A1 level German vocabulary. Keep up the great effort!",
            icon: "🌟"
        };
    } else if (score >= 40) {
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
    const steps = 50;
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
    inputs.forEach(input => input.checked = false);
    
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
    startTime = Date.now();
    
    // Re-enable inputs
    const inputs = questionsContainer.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.disabled = false);
    
    clearAllAnswers();
    
    // Show quiz, hide results
    quizSection.classList.remove('hidden');
    resultsPanel.classList.add('hidden');
    
    // Re-enable buttons
    submitBtn.disabled = false;
    clearBtn.disabled = false;
    
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
