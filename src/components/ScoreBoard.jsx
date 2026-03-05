import React from 'react';

export default function ScoreBoard({ score, streak }) {
    return (
        <div className="scoreboard">
            <div className="score-item">
                <span className="label">Score</span>
                <span className="value">{score}</span>
            </div>
            <div className="score-item streak">
                <span className="label">🔥 Streak</span>
                <span className="value">{streak}</span>
            </div>
        </div>
    );
}
