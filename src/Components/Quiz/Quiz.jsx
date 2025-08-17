// src/Components/Quiz/Quiz.jsx
import React, { useState } from "react";
import { data } from "../../assets/data"; // adjust path if needed
import "./Quiz.css";

const Quiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null); // 1..4 or null
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [quizEnd, setQuizEnd] = useState(false);

  const q = data[currentQ];
  const options = q ? [q.option1, q.option2, q.option3, q.option4] : [];

  const handleSelect = (optionIndex) => {
    if (locked || quizEnd) return;
    setSelected(optionIndex);
    setLocked(true);

    if (optionIndex === q.ans) {
      setScore((s) => s + 1);
    }
  };

  const handleKey = (e, optionIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(optionIndex);
    }
  };

  const handleNext = () => {
    if (!locked) return; // require answer selection

    if (currentQ < data.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setLocked(false);
    } else {
      // end of quiz
      setQuizEnd(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setQuizEnd(false);
  };

  return (
    <div className="quiz-shell" aria-live="polite">
      <header className="quiz-header">
        <div className="brand">
          <div className="logo-dot" />
          <h1>Success Quiz</h1>
        </div>

        <div className="progress" aria-hidden={quizEnd}>
          <div
            className="progress-bar"
            style={{ ["--p"]: `${((currentQ + 1) / data.length) * 100}%` }}
          />
          <div className="progress-text">
            {currentQ + 1} / {data.length}
          </div>
        </div>
      </header>

      <main className="quiz-card">
        {!quizEnd ? (
          <>
            <h2 className="q-title">
              <span className="q-number">{currentQ + 1}.</span> {q.question}
            </h2>

            <ul className="options" role="list">
              {options.map((opt, i) => {
                const idx = i + 1; // 1..4
                let className = "option-item";

                if (locked) {
                  if (idx === q.ans) className += " correct";
                  else if (selected === idx) className += " wrong";
                  else className += " dim";
                }

                return (
                  <li
                    key={i}
                    role="button"
                    tabIndex={0}
                    className={className}
                    onClick={() => handleSelect(idx)}
                    onKeyDown={(e) => handleKey(e, idx)}
                    aria-pressed={locked ? (idx === q.ans ? "true" : "false") : "false"}
                  >
                    <span className="option-index">{String.fromCharCode(64 + idx)}</span>
                    <span className="option-text">{opt}</span>
                  </li>
                );
              })}
            </ul>

            <div className="actions">
              <button
                className="btn-next"
                onClick={handleNext}
                disabled={!locked}
                aria-disabled={!locked}
                title={!locked ? "Select an answer first" : "Next"}
              >
                {currentQ === data.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </>
        ) : (
          // Result Card (uses same CSS classes .result-overlay/.result-card)
          <div className={`result-overlay show`} aria-hidden={!quizEnd}>
            <div className="result-card">
              <div className="confetti" />
              <h3>Quiz Completed 🎉</h3>
              <p className="score">
                You scored <strong>{score}</strong> of {data.length}
              </p>
              <p className="feedback">
                {score === data.length
                  ? "Perfect! Keep up the momentum — consistency is your superpower."
                  : score >= Math.ceil(data.length * 0.7)
                  ? "Great result! Keep building these habits."
                  : "Nice attempt — reflect on the missed ones and try again."}
              </p>

              <div className="result-actions">
                <button className="btn-secondary" onClick={resetQuiz}>
                  Try Again
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    // optional: keep score saved or navigate elsewhere — for now restart
                    resetQuiz();
                  }}
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="quiz-footer">
        <small>Lear More Grow More</small>
      </footer>
    </div>
  );
};

export default Quiz;
