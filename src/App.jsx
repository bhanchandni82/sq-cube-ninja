import React, { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import OptionButton from './components/OptionButton';
import ScoreBoard from './components/ScoreBoard';
import { generateQuestion, generateOptions } from './utils/gameLogic';

function App() {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // 'idle', 'correct', 'incorrect'
  const [gameState, setGameState] = useState('idle');
  const [selectedOption, setSelectedOption] = useState(null);

  const initTurn = () => {
    const newQuestion = generateQuestion();
    setQuestion(newQuestion);
    setOptions(generateOptions(newQuestion.correctAnswer, newQuestion.type, newQuestion.number));
    setGameState('idle');
    setSelectedOption(null);
  };

  useEffect(() => {
    initTurn();
  }, []);

  const handleOptionClick = (option) => {
    if (gameState !== 'idle') return;

    setSelectedOption(option);

    if (option === question.correctAnswer) {
      setGameState('correct');
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => s + 1);

      setTimeout(() => {
        initTurn();
      }, 1500);
    } else {
      setGameState('incorrect');
      setStreak(0);

      setTimeout(() => {
        initTurn();
      }, 2000);
    }
  };

  const getOptionState = (option) => {
    if (gameState === 'idle') return 'idle';

    if (option === question.correctAnswer) {
      if (gameState === 'correct') return 'correct';
      if (gameState === 'incorrect') return 'correct-revealed';
    }

    if (option === selectedOption && gameState === 'incorrect') {
      return 'incorrect';
    }

    return 'idle';
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header>
          <h1 className="title">Math Power Up!</h1>
        </header>

        <ScoreBoard score={score} streak={streak} />

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
        </main>
      </div>
    </div>
  );
}

export default App;
