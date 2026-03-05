import React from 'react';
import { playSound } from '../utils/soundUtils';

export default function SettingsScreen({ onStartGame }) {
    const [operation, setOperation] = React.useState('both'); // 'squares', 'cubes', 'both'
    const [minNum, setMinNum] = React.useState(1);
    const [maxNum, setMaxNum] = React.useState(10);
    const [mode, setMode] = React.useState('basic'); // 'basic', 'advanced', 'pro'

    const handleStart = () => {
        playSound('click');
        onStartGame({ operation, minNum, maxNum, mode });
    };

    const handleModeClick = (m) => {
        playSound('click');
        setMode(m);
    };

    const handleOpClick = (op) => {
        playSound('click');
        setOperation(op);
    }

    return (
        <div className="settings-screen fade-in-up">
            <h1 className="title">Math Ninja Training</h1>

            <div className="settings-card">
                <h2 className="settings-heading">Target Operation</h2>
                <div className="toggle-group">
                    <button className={`toggle-btn ${operation === 'squares' ? 'active' : ''}`} onClick={() => handleOpClick('squares')}>Squares 🟥</button>
                    <button className={`toggle-btn ${operation === 'both' ? 'active' : ''}`} onClick={() => handleOpClick('both')}>Mix 🔀</button>
                    <button className={`toggle-btn ${operation === 'cubes' ? 'active' : ''}`} onClick={() => handleOpClick('cubes')}>Cubes 🧊</button>
                </div>
            </div>

            <div className="settings-card">
                <h2 className="settings-heading">Number Range</h2>
                <div className="range-inputs">
                    <div className="input-group">
                        <label>From</label>
                        <input type="number" value={minNum} onChange={e => setMinNum(parseInt(e.target.value) || 1)} min="1" max="100" />
                    </div>
                    <div className="input-group">
                        <label>To</label>
                        <input type="number" value={maxNum} onChange={e => setMaxNum(parseInt(e.target.value) || 1)} min="1" max="100" />
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <h2 className="settings-heading">Difficulty Mode</h2>
                <div className="mode-cards">
                    <div className={`mode-card ${mode === 'basic' ? 'active' : ''}`} onClick={() => handleModeClick('basic')}>
                        <div className="mode-icon">🌱</div>
                        <h3>Basic</h3>
                        <p>Go in order, no timer. Great for learning!</p>
                    </div>
                    <div className={`mode-card ${mode === 'advanced' ? 'active' : ''}`} onClick={() => handleModeClick('advanced')}>
                        <div className="mode-icon">⚔️</div>
                        <h3>Advanced</h3>
                        <p>Random order, trickier options!</p>
                    </div>
                    <div className={`mode-card ${mode === 'pro' ? 'active' : ''}`} onClick={() => handleModeClick('pro')}>
                        <div className="mode-icon">🥷</div>
                        <h3>Ninja Pro</h3>
                        <p>Crazy timer, hardest choices. Max points!</p>
                    </div>
                </div>
            </div>

            <button className="start-btn pulse-anim" onClick={handleStart}>
                Start Training
            </button>
        </div>
    );
}
