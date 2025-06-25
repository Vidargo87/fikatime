// Daily topics for Fika sessions - Enhanced collection
export const fikaTopics = [
  // Gratitude & Reflection
  "What made you smile today?",
  "Something small you're grateful for today",
  "A memory that always makes you laugh",
  "What's one thing you'd like to celebrate this week?",
  "The best moment of today (so far)",
  "A little victory you've had this month",
  
  // Dreams & Aspirations
  "What's your dream travel destination?",
  "What skill would you love to learn?",
  "A dream you're working toward",
  "If you had one extra hour today, how would you spend it?",
  "A goal you're currently working toward",
  "Something you've always wanted to try",
  
  // Personal Preferences
  "Coffee or tea — and why?",
  "Your favorite season and why",
  "A food you could eat every day",
  "Your favorite way to relax",
  "What would your ideal fika spot look like?",
  "Your favorite childhood snack",
  
  // Inspiration & Motivation
  "If today had a soundtrack, what would it be?",
  "A quote you live by",
  "How do you define happiness?",
  "What's one thing that inspires you?",
  "Who inspires you in daily life?",
  "What does success mean to you personally?",
  
  // Self-Care & Wellness
  "What helps you reset after a stressful day?",
  "How do you recharge your energy?",
  "What does self-care mean to you?",
  "How do you relax your mind?",
  "What helps you sleep well?",
  "What does peace of mind look like to you?",
  
  // Learning & Growth
  "Something you're currently learning",
  "A lesson you learned the hard way",
  "What's something you've changed your mind about recently?",
  "A fear you've overcome",
  "How do you handle change?",
  "A lesson you'd teach your younger self",
  
  // Relationships & Connection
  "What makes a good conversation?",
  "What does friendship mean to you?",
  "A kind act someone did for you recently",
  "Your favorite way to show kindness?",
  "If you could share fika with anyone today, who would it be?",
  "What's your idea of a great team?",
  
  // Creativity & Expression
  "How do you express creativity?",
  "A topic you could talk about for hours",
  "If your life was a book, what would the title be?",
  "If today were a color, what would it be?",
  "Describe yourself in 3 words",
  "One word to describe your current mood",
  
  // Daily Life & Habits
  "The best part of your morning routine",
  "How do you usually start your day?",
  "What's your personal mantra?",
  "How do you manage your time?",
  "Your favorite way to spend 10 minutes",
  "What helps you focus?",
  
  // Culture & Values
  "Favorite thing about your culture",
  "Something you love about your culture",
  "A tradition you enjoy",
  "A value you live by",
  "What's one thing you'd like to change in the world?",
  "A piece of advice you often give",
  
  // Mindfulness & Presence
  "What does 'being present' mean to you?",
  "What helps you stay grounded?",
  "A sound that calms you",
  "Your favorite smell and why",
  "What does 'balance' mean to you?",
  "How do you celebrate small wins?",
  
  // Future & Past
  "If you had a time machine, where would you go?",
  "A place you want to return to someday",
  "What are you looking forward to?",
  "If you could instantly master one language, which would it be?",
  "What are you most curious about right now?",
  "A moment that changed how you see things",
  
  // Work & Purpose
  "What motivates you when you feel tired?",
  "Describe your ideal workday",
  "What do you do when you feel stuck?",
  "A recent act of courage",
  "What's one question you ask yourself often?",
  "How do you celebrate achievements?",
  
  // Simple Pleasures
  "A favorite object in your home",
  "One app you can't live without",
  "A song that lifts your mood instantly",
  "The best advice you've ever received",
  "A dish that reminds you of family",
  "What's your favorite way to spend a weekend?",
  
  // Reflection Questions
  "What are you most proud of this week?",
  "A place that feels like home",
  "If you could relive one moment, what would it be?",
  "What does a perfect morning look like for you?",
  "Something that surprised you recently",
  "A recent challenge you've overcome"
];

// Get a random topic
export const getRandomTopic = () => {
  const randomIndex = Math.floor(Math.random() * fikaTopics.length);
  return fikaTopics[randomIndex];
};

// Store the current topic for the session
let todayTopic: string | null = null;
let topicDate: string | null = null;

// Get today's topic (creates one if not already set for today)
export const getTodayTopic = () => {
  const today = new Date().toDateString();
  
  // If we don't have a topic or it's from a different day, get a new one
  if (!todayTopic || topicDate !== today) {
    todayTopic = getRandomTopic();
    topicDate = today;
  }
  
  return todayTopic;
};

// Reset the topic (useful for testing or forcing a new topic)
export const resetTodayTopic = () => {
  todayTopic = null;
  topicDate = null;
  return getTodayTopic();
};

// Get topic for a specific date (for historical purposes)
export const getTopicForDate = (date: Date) => {
  // Use date as seed for consistent topic per day
  const dateString = date.toDateString();
  const seed = dateString.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(seed) % fikaTopics.length;
  return fikaTopics[index];
};