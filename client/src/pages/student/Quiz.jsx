import { useState } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";

function Quiz() {
  // REPLACE WITH QUESTIONS FROM DATABASE
  const allQuestions = [ 
    {
      question: "What is the capital of France?",
      options: ["Berlin", "London", "Paris", "Rome"],
      answer: "Paris",
      difficulty: "easy",
    },
    {
      question: "Which language is used for web apps?",
      options: ["PHP", "Python", "Javascript", "All"],
      answer: "All",
      difficulty: "medium",
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
      difficulty: "hard",
    },
  ];

  const [difficulty, setDifficulty] = useState("easy"); // NEED TO USE AI TO RECOMMEND DIFFICULTY INSTEAD
  const questionBank = allQuestions.filter(q => q.difficulty === difficulty);

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

  function restartQuiz(newDifficulty) {
    const updatedBank = allQuestions.filter(q => q.difficulty === newDifficulty);
    setUserAnswers(Array(updatedBank.length).fill(null));
    setCurrentQuestion(0);
    setIsQuizFinished(false);
    setDifficulty(newDifficulty);
  }

  function getScore() {
    let finalScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === questionBank[index].answer) {
        finalScore++;
      }
    });
    return finalScore;
  }

  const score = getScore();
  const nextDifficulty = score <= 1 ? "easy" : score === questionBank.length ? "hard" : "medium";

  if (isQuizFinished) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>Quiz App</Typography>
        <Typography variant="h5" gutterBottom>Quiz Completed!</Typography>
        <Typography variant="h6">Your Score: {score}/{questionBank.length}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>Recommended Difficulty for Next Quiz: <strong>{nextDifficulty}</strong></Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => restartQuiz(nextDifficulty)}>
          Take Another Quiz
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>Quiz App</Typography>
      <Typography variant="h5" gutterBottom>Question {currentQuestion + 1}</Typography>
      <Typography variant="h6" gutterBottom>{questionBank[currentQuestion].question}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
        {questionBank[currentQuestion].options.map((option) => (
          <Button
            key={option}
            variant={selectedAnswer === option ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSelectOption(option)}
            sx={{ width: '300px' }}
          >
            {option}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={goToPrev} disabled={currentQuestion === 0}>
          Previous
        </Button>
        <Button variant="contained" onClick={goToNext} disabled={!selectedAnswer}>
          {currentQuestion === questionBank.length - 1 ? "Finish Quiz" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}

export default Quiz;