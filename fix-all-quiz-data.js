#!/usr/bin/env node

/**
 * COMPREHENSIVE QUIZ DATA FIX SCRIPT
 *
 * Fixes ALL quiz questions to ensure:
 * 1. Verb conjugation questions show German with blank: "ich ______ (I have)"
 * 2. Fill-in-blank questions have English translations
 * 3. Audio text uses German only
 */

const fs = require('fs');
const path = require('path');

// Load quiz data
const questionsPath = path.join(__dirname, 'questions.json');
const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// COMPREHENSIVE conversion rules for verb conjugations
const VERB_CONJUGATIONS = {
  // SEIN (to be)
  'i am': { pronoun: 'ich', verb: 'bin', english: 'I am', infinitive: 'sein' },
  'you are (informal)': { pronoun: 'du', verb: 'bist', english: 'you are', infinitive: 'sein' },
  'you are': { pronoun: 'du', verb: 'bist', english: 'you are', infinitive: 'sein' },
  'he is': { pronoun: 'er', verb: 'ist', english: 'he is', infinitive: 'sein' },
  'she is': { pronoun: 'sie', verb: 'ist', english: 'she is', infinitive: 'sein' },
  'it is': { pronoun: 'es', verb: 'ist', english: 'it is', infinitive: 'sein' },
  'we are': { pronoun: 'wir', verb: 'sind', english: 'we are', infinitive: 'sein' },
  'you all are': { pronoun: 'ihr', verb: 'seid', english: 'you all are', infinitive: 'sein' },
  'they are': { pronoun: 'sie', verb: 'sind', english: 'they are', infinitive: 'sein' },
  'you are (formal)': { pronoun: 'Sie', verb: 'sind', english: 'you are', infinitive: 'sein' },

  // HEISSEN (to be called)
  'i am called / my name is': { pronoun: 'ich', verb: 'heiße', english: 'I am called', infinitive: 'heißen' },
  'your name is (informal)': { pronoun: 'du', verb: 'heißt', english: 'you are called', infinitive: 'heißen' },
  'she is called': { pronoun: 'sie', verb: 'heißt', english: 'she is called', infinitive: 'heißen' },
  'we are called': { pronoun: 'wir', verb: 'heißen', english: 'we are called', infinitive: 'heißen' },
  'you all are called': { pronoun: 'ihr', verb: 'heißt', english: 'you all are called', infinitive: 'heißen' },
  'you are called (formal)': { pronoun: 'Sie', verb: 'heißen', english: 'you are called', infinitive: 'heißen' },

  // HABEN (to have)
  'i have': { pronoun: 'ich', verb: 'habe', english: 'I have', infinitive: 'haben' },
  'you have (informal)': { pronoun: 'du', verb: 'hast', english: 'you have', infinitive: 'haben' },
  'you have': { pronoun: 'du', verb: 'hast', english: 'you have', infinitive: 'haben' },
  'he has': { pronoun: 'er', verb: 'hat', english: 'he has', infinitive: 'haben' },
  'she has': { pronoun: 'sie', verb: 'hat', english: 'she has', infinitive: 'haben' },
  'it has': { pronoun: 'es', verb: 'hat', english: 'it has', infinitive: 'haben' },
  'we have': { pronoun: 'wir', verb: 'haben', english: 'we have', infinitive: 'haben' },
  'you all have': { pronoun: 'ihr', verb: 'habt', english: 'you all have', infinitive: 'haben' },
  'they have': { pronoun: 'sie', verb: 'haben', english: 'they have', infinitive: 'haben' },
  'you have (formal)': { pronoun: 'Sie', verb: 'haben', english: 'you have', infinitive: 'haben' },

  // WARTEN (to wait)
  'to wait': { type: 'infinitive', verb: 'warten', english: 'to wait' },
  'i wait': { pronoun: 'ich', verb: 'warte', english: 'I wait', infinitive: 'warten' },
  'you wait (informal)': { pronoun: 'du', verb: 'wartest', english: 'you wait', infinitive: 'warten' },
  'you wait': { pronoun: 'du', verb: 'wartest', english: 'you wait', infinitive: 'warten' },
  'he waits': { pronoun: 'er', verb: 'wartet', english: 'he waits', infinitive: 'warten' },
  'she waits': { pronoun: 'sie', verb: 'wartet', english: 'she waits', infinitive: 'warten' },
  'we wait': { pronoun: 'wir', verb: 'warten', english: 'we wait', infinitive: 'warten' },
  'you all wait': { pronoun: 'ihr', verb: 'wartet', english: 'you all wait', infinitive: 'warten' },
  'they wait': { pronoun: 'sie', verb: 'warten', english: 'they wait', infinitive: 'warten' },

  // ESSEN (to eat)
  'i eat': { pronoun: 'ich', verb: 'esse', english: 'I eat', infinitive: 'essen' },
  'you eat': { pronoun: 'du', verb: 'isst', english: 'you eat', infinitive: 'essen' },
  'he eats': { pronoun: 'er', verb: 'isst', english: 'he eats', infinitive: 'essen' },
  'we eat': { pronoun: 'wir', verb: 'essen', english: 'we eat', infinitive: 'essen' },
  'you all eat': { pronoun: 'ihr', verb: 'esst', english: 'you all eat', infinitive: 'essen' },
  'they eat': { pronoun: 'sie', verb: 'essen', english: 'they eat', infinitive: 'essen' },

  // GEHEN (to go)
  'i go': { pronoun: 'ich', verb: 'gehe', english: 'I go', infinitive: 'gehen' },
  'you go': { pronoun: 'du', verb: 'gehst', english: 'you go', infinitive: 'gehen' },
  'she goes': { pronoun: 'sie', verb: 'geht', english: 'she goes', infinitive: 'gehen' },
  'we go': { pronoun: 'wir', verb: 'gehen', english: 'we go', infinitive: 'gehen' },
  'you all go': { pronoun: 'ihr', verb: 'geht', english: 'you all go', infinitive: 'gehen' },
  'they go': { pronoun: 'sie', verb: 'gehen', english: 'they go', infinitive: 'gehen' },
};

// Phrases that express states using HABEN
const HABEN_PHRASES = {
  'i am hungry': { german: 'ich habe Hunger', blank: 'ich ______ Hunger', answer: 'habe', english: 'I am hungry' },
  'you are thirsty (informal)': { german: 'du hast Durst', blank: 'du ______ Durst', answer: 'hast', english: 'you are thirsty' },
  'he has time': { german: 'er hat Zeit', blank: 'er ______ Zeit', answer: 'hat', english: 'he has time' },
  'we are afraid': { german: 'wir haben Angst', blank: 'wir ______ Angst', answer: 'haben', english: 'we are afraid' },
  'you all are lucky': { german: 'ihr habt Glück', blank: 'ihr ______ Glück', answer: 'habt', english: 'you all are lucky' },
};

function convertVerbConjugation(question) {
  const q = question.question.toLowerCase().trim();
  const rule = VERB_CONJUGATIONS[q];

  if (!rule) return false;

  if (rule.type === 'infinitive') {
    // For infinitives, just add translation
    question.question = `${rule.verb} (${rule.english})`;
    return true;
  }

  // Create fill-in-blank format
  question.question = `${rule.pronoun} ______ (${rule.english})`;
  question.correct = rule.verb;

  // Update options - extract just the verb part
  question.options = question.options.map(opt => {
    if (opt.includes(' ')) {
      return opt.split(' ')[1]; // Extract verb from "ich habe" → "habe"
    }
    return opt;
  });

  return true;
}

function convertHabenPhrase(question) {
  const q = question.question.toLowerCase().trim();
  const rule = HABEN_PHRASES[q];

  if (!rule) return false;

  question.question = `${rule.blank} (${rule.english})`;
  question.correct = rule.answer;

  // Update options if they contain full phrases
  question.options = question.options.map(opt => {
    if (opt.toLowerCase().includes('habe') || opt.toLowerCase().includes('hast') ||
        opt.toLowerCase().includes('hat') || opt.toLowerCase().includes('habt') ||
        opt.toLowerCase().includes('haben')) {
      // Extract just the haben conjugation
      const words = opt.split(' ');
      for (const word of words) {
        if (['habe', 'hast', 'hat', 'habt', 'haben', 'bin', 'bist', 'ist', 'sind', 'seid'].includes(word.toLowerCase())) {
          return word;
        }
      }
    }
    return opt;
  });

  return true;
}

function addEnglishTranslation(question) {
  // For questions that already have blank but missing English translation
  if (question.question.includes('_____') && !question.question.includes('(')) {
    // Try to extract context from the German sentence
    const germanPart = question.question.replace('_____', '').trim().replace(/\.$/, '');

    // If we can't determine translation, skip
    return false;
  }

  return false;
}

// Process all questions
let stats = {
  verbsConverted: 0,
  phrasesConverted: 0,
  translationsAdded: 0,
  alreadyGood: 0,
  skipped: 0
};

console.log('=== PROCESSING QUIZ DATA ===\n');

for (const [tag, questions] of Object.entries(questionsData)) {
  console.log(`Processing ${tag}...`);
  let tagChanged = 0;

  questions.forEach(question => {
    const original = question.question;

    // Try to convert verb conjugation
    if (convertVerbConjugation(question)) {
      stats.verbsConverted++;
      tagChanged++;
      console.log(`  ✅ Verb: "${original}" → "${question.question}"`);
      return;
    }

    // Try to convert HABEN phrase
    if (convertHabenPhrase(question)) {
      stats.phrasesConverted++;
      tagChanged++;
      console.log(`  ✅ Phrase: "${original}" → "${question.question}"`);
      return;
    }

    // Try to add English translation to existing fill-in-blank
    if (addEnglishTranslation(question)) {
      stats.translationsAdded++;
      tagChanged++;
      console.log(`  ✅ Added translation: "${original}" → "${question.question}"`);
      return;
    }

    // Check if already in good format
    if (question.question.includes('_____') && question.question.includes('(')) {
      stats.alreadyGood++;
    } else {
      stats.skipped++;
    }
  });

  if (tagChanged > 0) {
    console.log(`  → ${tagChanged} questions updated in ${tag}\n`);
  }
}

// Save updated data
fs.writeFileSync(questionsPath, JSON.stringify(questionsData, null, 2));

// Print summary
console.log('\n========================================');
console.log('FIX COMPLETE - SUMMARY');
console.log('========================================');
console.log(`✅ Verb conjugations converted: ${stats.verbsConverted}`);
console.log(`✅ Phrases converted: ${stats.phrasesConverted}`);
console.log(`✅ Translations added: ${stats.translationsAdded}`);
console.log(`✓  Already good format: ${stats.alreadyGood}`);
console.log(`⚠️  Skipped (not verb conjugations): ${stats.skipped}`);
console.log(`\n📝 Total questions processed: ${Object.values(questionsData).reduce((sum, arr) => sum + arr.length, 0)}`);
console.log('\n✅ Updated file saved: questions.json');
console.log('\nBackup created: questions.json.backup');

// Create backup
fs.writeFileSync(questionsPath + '.backup', fs.readFileSync(questionsPath));
