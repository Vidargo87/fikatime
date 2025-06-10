// Daily topics for Fika sessions
export const fikaTopics = [
  "What made you smile today?",
  "What's your dream travel destination?",
  "Coffee or tea — and why?",
  "A memory that always makes you laugh",
  "Your favorite season and why",
  "Something small you're grateful for today",
  "If today had a soundtrack, what would it be?",
  "What skill would you love to learn?",
  "A quote you live by",
  "How do you define happiness?",
  "If you had one extra hour today, how would you spend it?",
  "The best part of your morning routine",
  "What's something you've changed your mind about recently?",
  "Your favorite way to relax",
  "A food you could eat every day",
  "What would your ideal fika spot look like?",
  "If you could meet any historical figure, who and why?",
  "What's one thing that inspires you?",
  "A book or movie that changed your perspective",
  "A small goal for the next 24 hours",
  "What helps you reset after a stressful day?",
  "Favorite thing about your culture",
  "Something simple that brings you joy",
  "A hobby you've always wanted to try",
  "Describe your perfect weekend",
  "A lesson you learned the hard way",
  "Something you're currently learning",
  "The best compliment you've ever received",
  "What motivates you when you feel tired?",
  "Your favorite childhood snack",
  "One app you can't live without",
  "What do you do when you feel stuck?",
  "A song that lifts your mood instantly",
  "The best advice you've ever received",
  "What are you most proud of this week?",
  "A place that feels like home",
  "A goal you're currently working toward",
  "If you could instantly master one language, which would it be?",
  "What does 'balance' mean to you?",
  "A kind act someone did for you recently",
  "What are you most curious about right now?",
  "Your favorite smell and why",
  "What helps you focus?",
  "If you could relive one moment, what would it be?",
  "What does a perfect morning look like for you?",
  "A fear you've overcome",
  "Describe yourself in 3 words",
  "If today were a color, what would it be?",
  "What do you want to celebrate this week?",
  "A place you want to return to someday",
  "One word to describe your current mood",
  "What helps you stay grounded?",
  "How do you recharge your energy?",
  "A tradition you enjoy",
  "Who inspires you in daily life?",
  "What does success mean to you personally?",
  "What's your favorite way to show kindness?",
  "A dream you've never said out loud",
  "The best part of your week so far",
  "A dish that reminds you of family",
  "What does self-care mean to you?",
  "Describe your ideal workday",
  "Something you'd like to do more of",
  "How do you relax your mind?",
  "Something that surprised you recently",
  "One thing you're looking forward to",
  "If your life was a book, what would the title be?",
  "A favorite object in your home",
  "The best moment of today (so far)",
  "How do you usually start your day?",
  "What's your personal mantra?",
  "A piece of advice you often give",
  "What's one thing you'd like to change in the world?",
  "Your favorite way to spend 10 minutes",
  "What does 'being present' mean to you?",
  "A dream you're working toward",
  "Something that made you laugh recently",
  "What helps you sleep well?",
  "If you had a time machine, where would you go?",
  "Describe your ideal fika partner",
  "What does peace of mind look like to you?",
  "Your favorite quote from a book",
  "A challenge you've recently overcome",
  "How do you handle change?",
  "What makes a good conversation?",
  "A sound that calms you",
  "A little victory you've had this month",
  "How do you express creativity?",
  "A topic you could talk about for hours",
  "What does friendship mean to you?",
  "A lesson you'd teach your younger self",
  "How do you manage your time?",
  "A value you live by",
  "Something you love about your culture",
  "What's your idea of a great team?",
  "How do you celebrate small wins?",
  "A recent act of courage",
  "What's one question you ask yourself often?",
  "A moment that changed how you see things",
  "If you could share fika with anyone today, who would it be?"
];

// Get a random topic
export const getRandomTopic = () => {
  const randomIndex = Math.floor(Math.random() * fikaTopics.length);
  return fikaTopics[randomIndex];
};

// Store the current topic for the session
let todayTopic: string | null = null;

// Get today's topic (creates one if not already set)
export const getTodayTopic = () => {
  if (!todayTopic) {
    todayTopic = getRandomTopic();
  }
  return todayTopic;
};

// Reset the topic (useful for testing or forcing a new topic)
export const resetTodayTopic = () => {
  todayTopic = null;
  return getTodayTopic();
};