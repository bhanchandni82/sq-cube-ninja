import React, { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import OptionButton from './components/OptionButton';
import ScoreBoard from './components/ScoreBoard';
import SettingsScreen from './components/SettingsScreen';
import { generateQuestion, generateOptions } from './utils/gameLogic';
import { playSound } from './utils/soundUtils';

function App() {
  const [inGame, setInGame] = useState(false);
  const [settings, setSettings] = useState(null);

  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sequenceIndex, setSequenceIndex] = useState(0);

  // 'idle', 'correct', 'incorrect'
  const [gameState, setGameState] = useState('idle');
  const [selectedOption, setSelectedOption] = useState(null);

  // Timer logic for Pro Mode
  const [timeLeft, setTimeLeft] = useState(10);

  const handleStartGame = (newSettings) => {
    setSettings(newSettings);
    setScore(0);
    setStreak(0);
    setSequenceIndex(0);
    setInGame(true);
    initTurn(newSettings, 0);
  };

  const handleQuit = () => {
    playSound('click');
    setInGame(false);
  };

  const initTurn = (activeSettings = settings, currentIndex = sequenceIndex) => {
    const newQuestion = generateQuestion(activeSettings, currentIndex);
    setQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.correctAnswer, newQuestion.type, newQuestion.number, activeSettings.mode));
    setGameState('idle');
    setSelectedOption(null);

    // Reset timer for Pro Mode (5 seconds per question!)
    if (activeSettings.mode === 'pro') {
      setTimeLeft(5);
    }
  };

  useEffect(() => {
    let timer;
    if (inGame && settings?.mode === 'pro' && gameState === 'idle' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (inGame && settings?.mode === 'pro' && gameState === 'idle' && timeLeft === 0) {
      // Time's up! Treat as incorrect.
      handleOptionClick(-1); // -1 is impossible, guarantees incorrect
    }
    return () => clearTimeout(timer);
  }, [timeLeft, inGame, gameState]);

  const handleOptionClick = (option) => {
    if (gameState !== 'idle') return;

    setSelectedOption(option);

    if (option === question.correctAnswer) {
      playSound('correct');
      setGameState('correct');

      const newStreak = streak + 1;
      setStreak(newStreak);

      const basePoints = settings.mode === 'basic' ? 10 : (settings.mode === 'advanced' ? 20 : 50);
      const timeBonus = settings.mode === 'pro' ? timeLeft * 2 : 0;
      setScore(s => s + basePoints + (newStreak * 5) + timeBonus);

      if (newStreak % 5 === 0) {
        playSound('level-up');
      }

      setTimeout(() => {
        setSequenceIndex(prev => prev + 1);
        initTurn(settings, sequenceIndex + 1);
      }, 1200);
    } else {
      playSound('wrong');
      setGameState('incorrect');
      setStreak(0);

      setTimeout(() => {
        setSequenceIndex(prev => prev + 1);
        initTurn(settings, sequenceIndex + 1);
      }, 2000);
    }
  };

  const getOptionState = (option) => {
    if (gameState === 'idle') return 'idle';
    if (option === question?.correctAnswer) {
      if (gameState === 'correct') return 'correct';
      if (gameState === 'incorrect') return 'correct-revealed';
    }
    if (option === selectedOption && gameState === 'incorrect') {
      return 'incorrect';
    }
    return 'idle';
  };

  if (!inGame) {
    return <SettingsScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="app-container">
      <div className="glass-panel game-panel fade-in-up">
        <header className="game-header">
          <button className="quit-btn" onClick={handleQuit}>⬅️ Quit</button>
          <div className="mode-badge">{settings.mode.toUpperCase()}</div>
        </header>

        <ScoreBoard score={score} streak={streak} />

        {settings.mode === 'pro' && (
          <div className="timer-bar-container">
            <div
              className="timer-bar"
              style={{
                width: `${(timeLeft / 5) * 100}%`,
                backgroundColor: timeLeft <= 2 ? '#ef4444' : '#10b981'
              }}
            />
          </div>
        )}

        <main className="game-area">
          <QuestionCard question={question} />

          <div className="options-grid">
            {options.map((opt, idx) => (
              <OptionButton
                key={idx}
                option={opt}
                onClick={handleOptionClick}
                state={getOptionState(opt)}
                disabled={gameState !== 'idle'}
              />
            ))}
          </div>

          {gameState === 'correct' && streak > 1 && (
            <div className="combo-flyer combo-anim">
              Combo x{streak}! 🔥
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
