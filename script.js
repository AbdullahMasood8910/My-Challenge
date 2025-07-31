const routines = [
  "🏋️‍♂️ Pushups, Pullups, Cardio",
  "📚 Read book for 15 minutes",
  "🎨 Create a Canva design",
  "🧘‍♀️ Stand up straight all day",
  "💧 Drink 8 glasses of water",
  "🌅 Wake up at 6 AM",
  "🚶‍♂️ Take 10,000 steps",
  "🧠 Learn 5 new words",
  "🍎 Eat only healthy snacks",
  "📱 No social media for 2 hours",
  "🎵 Listen to a podcast",
  "✍️ Write in a journal for 10 minutes",
  "🌱 Do 10 minutes of gardening",
  "🧹 Organize one room/area",
  "📞 Call a friend or family member",
  "🎯 Practice a new skill for 20 minutes",
  "🍳 Cook a healthy meal from scratch",
  "🚫 No caffeine after 2 PM",
  "🧘 Meditate for 10 minutes",
  "💪 Do 50 squats throughout the day",
  "📖 Read news for 15 minutes",
  "🎭 Watch an educational video",
  "🌟 Compliment 3 people",
  "🏃‍♂️ Do a 15-minute HIIT workout",
  "🎨 Draw or sketch for 20 minutes",
  "🧠 Solve a puzzle or brain teaser",
  "🌿 Take a nature walk",
  "📝 Plan tomorrow's tasks",
  "🎪 Try a new hobby for 30 minutes",
  "💻 Learn something new online"
];

const streakIcons = ['🐣','🐥','🐤','🦆','🐸','🐢','🦡','🦎','🦝','🐍','🦉','🐨','🦇','🦅','🐘','🐼','🦊','🐺','🐱','🐶','🐋','🐳','🐴','🐮','🦈','🐯','🦁','🐙','🦕','🦖'];
const calorieGoals = [1800, 2000, 2200, 1900, 2100, 2300, 1750, 2050, 2150, 1950, 2000, 2250, 1850, 2100, 2200, 1900, 2000, 2300, 1800, 2150];

const motivationalQuotes = [
  "Every day is a new opportunity! 💪",
  "Consistency is the key to success! 🔑",
  "You're building great habits! 🌟",
  "Small steps lead to big changes! 🚀",
  "Keep pushing forward! 🎯",
  "Progress, not perfection! ✨",
  "You've got this! 💯",
  "Building discipline one day at a time! 🏆",
  "Success is the sum of small efforts! ⭐",
  "Transform your life, one day at a time! 🌱"
];

const achievements = [
  { id: 'first_day', title: 'First Step', desc: 'Complete your first day', icon: '🎯', requirement: 1 },
  { id: 'week_warrior', title: 'Week Warrior', desc: 'Complete 7 days in a row', icon: '🔥', requirement: 7 },
  { id: 'month_master', title: 'Month Master', desc: 'Complete 30 days total', icon: '👑', requirement: 30 },
  { id: 'halfway_hero', title: 'Halfway Hero', desc: 'Reach 50% completion', icon: '⭐', requirement: 30 },
  { id: 'final_stretch', title: 'Final Stretch', desc: 'Complete 50 days', icon: '🚀', requirement: 50 },
  { id: 'champion', title: 'Champion', desc: 'Complete all 60 days', icon: '🏆', requirement: 60 }
];

// App State
let currentDay = 0;
let completedDays = new Set();
let currentSection = 'challenge';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  loadData();
  setupEventListeners();
  updateDisplay();
  generateCalendar();
  updateAchievements();
});

// Load data from localStorage
function loadData() {
  const saved = localStorage.getItem('completedDays');
  if (saved) {
    completedDays = new Set(JSON.parse(saved));
  }

  const savedDay = localStorage.getItem('currentDay');
  if (savedDay) {
    currentDay = parseInt(savedDay);
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('completedDays', JSON.stringify([...completedDays]));
  localStorage.setItem('currentDay', currentDay.toString());
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });

  // Day navigation
  document.getElementById('prev').addEventListener('click', goToPrevDay);
  document.getElementById('next').addEventListener('click', goToNextDay);

  // Complete button
  document.getElementById('completeBtn').addEventListener('click', markDayComplete);

  // Notes
  document.getElementById('notesBtn').addEventListener('click', openNotesModal);
  document.getElementById('closeNotesBtn').addEventListener('click', closeNotesModal);
  document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);

  // Calendar clicks
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('calendar-day')) {
      const dayIndex = parseInt(e.target.dataset.day);
      if (dayIndex <= currentDay) {
        currentDay = dayIndex;
        switchSection('challenge');
        updateDisplay();
      }
    }
  });

  // Close modal on backdrop click
  document.getElementById('notesModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeNotesModal();
  });
}

// Switch between sections
function switchSection(section) {
  currentSection = section;

  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  // Update sections
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.toggle('active', sec.id === section);
  });

  // Update displays based on section
  if (section === 'progress') updateProgressDisplay();
  if (section === 'stats') updateStatsDisplay();
}

// Navigation functions
function goToNextDay() {
  if (currentDay < 59) {
    currentDay++;
    saveData();
    updateDisplay();
    generateCalendar();
  }
}

function goToPrevDay() {
  if (currentDay > 0) {
    currentDay--;
    saveData();
    updateDisplay();
    generateCalendar();
  }
}

// Mark day as complete
function markDayComplete() {
  completedDays.add(currentDay);
  saveData();
  updateDisplay();
  generateCalendar();
  updateAchievements();
  showCelebration();
}

// Update main display
function updateDisplay() {
  updateChallengeSection();
  updateProgressDisplay();
  updateStatsDisplay();
}

// Update challenge section
function updateChallengeSection() {
  const dayTitle = document.getElementById('dayTitle');
  const dayCounter = document.getElementById('dayCounter');
  const streakCharacter = document.getElementById('streakCharacter');
  const challengeText = document.getElementById('challengeText');
  const motivationQuote = document.getElementById('motivationQuote');
  const caloriesDisplay = document.getElementById('caloriesDisplay');
  const completionStatus = document.getElementById('completionStatus');
  const completeBtn = document.getElementById('completeBtn');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  // Update content
  dayTitle.textContent = `Day ${currentDay + 1}`;
  dayCounter.textContent = `${currentDay + 1} / 60`;
  streakCharacter.textContent = streakIcons[currentDay % streakIcons.length];
  challengeText.textContent = routines[currentDay % routines.length];
  motivationQuote.textContent = motivationalQuotes[currentDay % motivationalQuotes.length];
  caloriesDisplay.textContent = calorieGoals[currentDay % calorieGoals.length];

  // Update button states
  prevBtn.disabled = (currentDay === 0);
  nextBtn.disabled = (currentDay === 59);

  // Update completion status
  if (completedDays.has(currentDay)) {
    completionStatus.textContent = '🎉 Day completed! Great job!';
    completionStatus.className = 'completion-status completed';
    completeBtn.textContent = '✅ Completed';
    completeBtn.disabled = true;
  } else {
    completionStatus.textContent = '⏳ Mark this day as complete when finished';
    completionStatus.className = 'completion-status pending';
    completeBtn.textContent = '✅ Mark Complete';
    completeBtn.disabled = false;
  }
}

// Update progress display
function updateProgressDisplay() {
  const completedCount = completedDays.size;
  const totalDays = 60;
  const progressPercentage = Math.round((completedCount / totalDays) * 100);

  // Update progress circle
  const progressCircle = document.getElementById('progressCircle');
  const progressPercentageEl = document.getElementById('progressPercentage');
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progressPercentage / 100) * circumference;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  if (progressPercentageEl) {
    progressPercentageEl.textContent = `${progressPercentage}%`;
  }

  // Update other progress elements
  const completedDaysEl = document.getElementById('completedDays');
  const currentStreakEl = document.getElementById('currentStreak');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  if (completedDaysEl) completedDaysEl.textContent = completedCount;
  if (currentStreakEl) currentStreakEl.textContent = calculateCurrentStreak();

  if (progressFill) {
    progressFill.style.width = `${progressPercentage}%`;
  }

  if (progressText) {
    progressText.textContent = `Day ${currentDay + 1} of ${totalDays} (${progressPercentage}% complete)`;
  }
}

// Update stats display
function updateStatsDisplay() {
  const completedCount = completedDays.size;
  const totalDays = 60;
  const completionRate = Math.round((completedCount / totalDays) * 100);
  const longestStreak = calculateLongestStreak();
  const totalPoints = completedCount * 10;
  const weekStreak = calculateWeekStreak();

  const completionRateEl = document.getElementById('completionRate');
  const longestStreakEl = document.getElementById('longestStreak');
  const totalPointsEl = document.getElementById('totalPoints');
  const weekStreakEl = document.getElementById('weekStreak');

  if (completionRateEl) completionRateEl.textContent = `${completionRate}%`;
  if (longestStreakEl) longestStreakEl.textContent = longestStreak;
  if (totalPointsEl) totalPointsEl.textContent = totalPoints;
  if (weekStreakEl) weekStreakEl.textContent = weekStreak;
}

// Calculate current streak
function calculateCurrentStreak() {
  let streak = 0;
  for (let i = currentDay; i >= 0; i--) {
    if (completedDays.has(i)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Calculate longest streak
function calculateLongestStreak() {
  let longestStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < 60; i++) {
    if (completedDays.has(i)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return longestStreak;
}

// Calculate week streak
function calculateWeekStreak() {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  let weekStreak = 0;
  for (let i = Math.max(0, currentDay - 6); i <= currentDay; i++) {
    if (completedDays.has(i)) {
      weekStreak++;
    }
  }

  return weekStreak;
}

// Generate calendar
function generateCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  if (!calendarGrid) return;

  calendarGrid.innerHTML = '';

  for (let i = 0; i < 60; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = i + 1;
    dayElement.dataset.day = i;

    if (completedDays.has(i)) {
      dayElement.classList.add('completed');
    } else if (i === currentDay) {
      dayElement.classList.add('current');
    } else if (i > currentDay) {
      dayElement.classList.add('future');
    }

    calendarGrid.appendChild(dayElement);
  }
}

// Update achievements
function updateAchievements() {
  const achievementList = document.getElementById('achievementList');
  if (!achievementList) return;

  achievementList.innerHTML = '';

  const completedCount = completedDays.size;
  const currentStreak = calculateCurrentStreak();

  achievements.forEach(achievement => {
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement-item';

    let isUnlocked = false;

    switch (achievement.id) {
      case 'first_day':
        isUnlocked = completedCount >= 1;
        break;
      case 'week_warrior':
        isUnlocked = currentStreak >= 7;
        break;
      case 'month_master':
        isUnlocked = completedCount >= 30;
        break;
      case 'halfway_hero':
        isUnlocked = completedCount >= 30;
        break;
      case 'final_stretch':
        isUnlocked = completedCount >= 50;
        break;
      case 'champion':
        isUnlocked = completedCount >= 60;
        break;
    }

    if (isUnlocked) {
      achievementElement.classList.add('unlocked');
    }

    achievementElement.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-text">
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-desc">${achievement.desc}</div>
      </div>
    `;

    achievementList.appendChild(achievementElement);
  });
}

// Notes functionality
function openNotesModal() {
  const modal = document.getElementById('notesModal');
  const notesInput = document.getElementById('notesInput');

  // Load existing notes
  const savedNotes = localStorage.getItem(`notes-day-${currentDay + 1}`);
  notesInput.value = savedNotes || '';

  modal.classList.remove('hidden');
}

function closeNotesModal() {
  const modal = document.getElementById('notesModal');
  modal.classList.add('hidden');
}

function saveNotes() {
  const notesInput = document.getElementById('notesInput');
  localStorage.setItem(`notes-day-${currentDay + 1}`, notesInput.value);

  // Show success feedback
  const saveBtn = document.getElementById('saveNotesBtn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = '✅ Saved!';
  saveBtn.style.background = '#4caf50';

  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background = '#4ecdc4';
    closeNotesModal();
  }, 1000);
}

// Show celebration animation
function showCelebration() {
  const streak = document.getElementById('streakCharacter');
  if (streak) {
    streak.style.animation = 'none';
    streak.style.transform = 'scale(1.8) rotate(360deg)';
    streak.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    streak.style.filter = 'drop-shadow(0 0 30px rgba(78, 205, 196, 1))';

    setTimeout(() => {
      streak.style.transform = 'scale(1)';
      streak.style.animation = 'streakPulse 3s ease-in-out infinite';
      streak.style.filter = 'drop-shadow(0 0 10px rgba(78, 205, 196, 0.3))';
    }, 800);
  }

  // Create confetti effect
  createConfetti();
}

// Create confetti effect
function createConfetti() {
  const colors = ['#4ecdc4', '#ff6b6b', '#ffc107', '#4caf50', '#9c27b0'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      top: -10px;
      left: ${Math.random() * 100}vw;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      animation: fall ${Math.random() * 3 + 2}s linear forwards;
    `;

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
window.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".avatar, .talking-avatar, .ai-avatar, .animated");

  animatedElements.forEach((el) => {
    el.classList.remove("assistant-animation", "slide-in", "fade", "whatever-they-added");
    el.classList.add("fade-in-up-override");
  });
});