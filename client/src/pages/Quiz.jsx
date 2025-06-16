import { useState } from "react";

function Quiz() {
  const questionBank = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "London", "Paris", "Rome"],
      answer: "Paris",
    },
    {
      question: "Which language is used for web apps?",
      options: ["PHP", "Python", "Javascript", "All"],
      answer: "All",
    },
    {
      question: "What does JSX stand for?",
      options: [
        "Javascript XML",
        "Java Syntax eXtension",
        "Just a Simple eXample",
        "None of the above",
      ],
      answer: "Javascript XML",
    },
  ];

  const initialAnswers = Array(questionBank.length).fill(null);
  const [userAnswers, setUserAnswers] = useState(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const selectedAnswer = userAnswers[currentQuestion];
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  function handleSelectOption(option) {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = option;
    setUserAnswers(newUserAnswers);
  }

  function goToNext() {
    if (currentQuestion === questionBank.length - 1) {
      setIsQuizFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  function goToPrev() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  function restartQuiz() {
    setUserAnswers(initialAnswers);
    setCurrentQuestion(0);
    setIsQuizFinished(false);
  }

  if (isQuizFinished) {
    const score = userAnswers.reduce(
      (acc, answer, i) => (answer === questionBank[i].answer ? acc + 1 : acc),
      0
    );

    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p className="score">Your Score: {score}/{questionBank.length}</p>
        <button className="restart-button" onClick={restartQuiz}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Question {currentQuestion + 1}</h2>
      <p className="question">{questionBank[currentQuestion].question}</p>
      {questionBank[currentQuestion].options.map((option) => (
        <button
          key={option}
          className={"option" + (selectedAnswer === option ? " selected" : "")}
          onClick={() => handleSelectOption(option)}
        >
          {option}
        </button>
      ))}
      <div className="nav-buttons">
        <button onClick={goToPrev} disabled={currentQuestion === 0}>
          Previous
        </button>
        <button onClick={goToNext} disabled={!selectedAnswer}>
          {currentQuestion === questionBank.length - 1 ? "Finish Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
