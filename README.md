# 🌍 German Vocabulary Quiz - A1 Level

An interactive, modern vocabulary quiz application for learning German at the A1 level. Built with HTML, CSS, and vanilla JavaScript - no frameworks required!

## 📋 Features

- **50 Questions**: Comprehensive A1 level German vocabulary questions
- **Real-time Progress Tracking**: Visual progress bar and counter showing answered questions
- **Interactive Feedback**: Instant visual feedback on answer correctness
- **Category Badges**: Questions organized by categories (Feelings, States, Descriptions, Nationalities, Professions, Nouns)
- **Smart Results**: Dynamic scoring system with motivational messages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Modern UI with smooth transitions and hover effects
- **Accessibility**: Keyboard navigation support and reduced motion preferences

## 🎨 Design Highlights

- **Modern Gradient Background**: Purple-to-blue gradient theme
- **White Content Container**: Clean, rounded card design with shadows
- **Color Coding**: 
  - Purple/Blue for primary actions
  - Green for correct answers
  - Red for incorrect answers
- **Progress Bar**: Visual indicator of completion percentage
- **Responsive Typography**: Minimum 16px for body text

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Open `index.html` in your web browser

### Running Locally

Simply open the `index.html` file in any modern web browser:

```bash
# On macOS/Linux
open index.html

# On Windows
start index.html

# Or use a local server (optional)
python -m http.server 8000
# Then visit http://localhost:8000
```

## 📖 How to Use

1. **Answer Questions**: Select one answer per question using the radio buttons
2. **Track Progress**: Watch your progress bar fill up as you answer questions
3. **Submit**: Click "Submit Answers" when you're ready (requires at least one answered question)
4. **Review Results**: See your score and get personalized feedback
5. **Retake**: Use the "Retake Quiz" button to start over

## 🎯 Scoring System

- **50/50** - "PERFEKT! 🎉🔥" - Perfect score!
- **45-49** - "AUSGEZEICHNET! 💪" - Excellent work
- **40-44** - "SEHR GUT! ✅" - Very good
- **Below 40** - "WEITER ÜBEN! 📚" - Keep practicing

## 📁 File Structure

```
german-vocab-quiz/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── script.js       # Quiz logic and interactivity
└── README.md       # This file
```

## 🛠️ Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Animations, Responsive Design
- **Vanilla JavaScript**: No dependencies or frameworks
- **Modern Browser APIs**: DOM manipulation, Event handling

### Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with ES6 support

### Key Features Implemented

- ✅ Semantic HTML5 elements
- ✅ Mobile-first responsive design
- ✅ CSS Grid and Flexbox layouts
- ✅ Smooth CSS transitions (0.3s)
- ✅ Event delegation for efficiency
- ✅ Form validation
- ✅ Keyboard accessibility
- ✅ Reduced motion support
- ✅ Real-time progress tracking
- ✅ Answer validation logic
- ✅ Visual feedback system

## 📚 Question Categories

The quiz covers 50 questions across 6 categories:

1. **Feelings** (Questions 1-10) - Emotions and physical states
2. **States** (Questions 11-14) - Conditions and personal states
3. **Descriptions** (Questions 15-24) - Adjectives and descriptions
4. **Nationalities** (Questions 25-34) - Countries and nationalities
5. **Professions** (Questions 35-44) - Jobs and occupations
6. **Nouns** (Questions 45-50) - Common nouns and people

## 🎨 Customization

Want to customize the quiz? Here are some easy modifications:

### Changing Colors

Edit `styles.css`:

```css
/* Change primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change success color */
background: #22c55e; /* Green */

/* Change error color */
background: #ef4444; /* Red */
```

### Adding More Questions

Edit `script.js` in the `exercises` array:

```javascript
{
    id: 51, 
    question: "YOUR QUESTION", 
    options: ["OPTION 1", "OPTION 2"], 
    correct: "CORRECT ANSWER", 
    category: "Category Name"
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: 375px and below

## 🧪 Testing

All functionality has been thoroughly tested:

- ✅ All 50 questions display correctly
- ✅ Radio buttons work properly (only one selection per question)
- ✅ Counter updates in real-time
- ✅ Submit button disabled when no questions answered
- ✅ Correct answers properly validated
- ✅ Visual feedback displays correctly
- ✅ Reset functionality clears everything
- ✅ Mobile responsive at all breakpoints
- ✅ Proper contrast ratios for accessibility
- ✅ No console errors

## 🔒 Privacy

This application runs entirely in your browser. No data is collected, sent to servers, or stored anywhere. Your progress and answers remain private on your device.

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and make it your own! Some ideas for improvements:

- Add more questions
- Implement a timer
- Add local storage to save progress
- Create multiple difficulty levels
- Add audio pronunciation
- Export results as PDF
- Dark mode toggle

## 💡 Tips for Learning

1. Take the quiz multiple times to reinforce learning
2. Pay attention to the categories to understand word types
3. Review incorrect answers to identify weak areas
4. Try to understand the context of each question
5. Practice regularly for best results

---

**Built with ❤️ for German language learners**

Happy Learning! Viel Erfolg! 🎓

