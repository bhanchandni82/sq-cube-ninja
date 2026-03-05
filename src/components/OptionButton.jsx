import React from 'react';

export default function OptionButton({ option, onClick, state, disabled }) {
    // state can be 'idle', 'correct', 'incorrect', 'correct-revealed'
    let stateClass = '';
    if (state === 'correct') stateClass = 'btn-correct';
    if (state === 'incorrect') stateClass = 'btn-incorrect shake';
    if (state === 'correct-revealed') stateClass = 'btn-correct-revealed';

    return (
        <button
            className={`option-btn ${stateClass}`}
            onClick={() => onClick(option)}
            disabled={disabled}
        >
            <span className="option-text">{option}</span>
            {state === 'correct' && <div className="particles"></div>}
        </button>
    );
}
