import React from 'react';

export default function QuestionCard({ question }) {
    if (!question) return null;

    return (
        <div className="question-card">
            <h2 className="question-text">
                What is the <span className="highlight fade-in">{question.type?.toLowerCase()}</span> of <span className="highlight fade-in">{question.number}</span>?
            </h2>
        </div>
    );
}
