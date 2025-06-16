import { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";

function Quiz() {
  const { classId, lessonId } = useParams();

  const allQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "London", "Paris", "Rome"],
      answer: "Paris",
      difficulty: "easy",
      classId: "1",
      lessonId: "geo"
    },
    {
      question: "Which language is used for web apps?",
      options: ["PHP", "Python", "Javascript", "All"],
      answer: "All",
      difficulty: "medium",
      classId: "1",
      lessonId: "cs"
    },
    {
      question: "What does JSX stand for?",
      options: ["Javascript XML", "Java Syntax eXtension", "Just a Simple eXample", "None of the above"],
      answer: "Javascript XML",
      difficulty: "hard",
      classId: "1",
      lessonId: "cs"
    },
    {
      question: "Which of the following is not a JavaScript data type?",
      options: ["Undefined", "Number", "Boolean", "Float"],
      answer: "Float",
      difficulty: "easy",
      classId: "1",
      lessonId: "cs"
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer: "O(log n)",
      difficulty: "medium",
      classId: "1",
      lessonId: "algos"
    },
    {
      question: "What is a closure in JavaScript?",
      options: [
        "A function having access to the parent scope",
        "A loop inside a function",
        "A class method",
        "None of the above"
      ],
      answer: "A function having access to the parent scope",
      difficulty: "hard",
      classId: "1",
      lessonId: "js"
    },
    {
      question: "What is the pH of a neutral solution?",
      options: ["0", "7", "14", "1"],
      answer: "7",
      difficulty: "easy",
      classId: "2",
      lessonId: "acids-and-bases"
    },
    {
      question: "Which of the following is a strong acid?",
      options: ["HCl", "CH3COOH", "NH3", "NaOH"],
      answer: "HCl",
      difficulty: "medium",
      classId: "2",
      lessonId: "acids-and-bases"
    },
    {
      question: "What is the conjugate base of H2SO4?",
      options: ["HSO4^-", "SO4^2-", "OH^-", "H+"],
      answer: "HSO4^-",
      difficulty: "hard",
      classId: "2",
      lessonId: "acids-and-bases"
    }
  ];

  const [difficulty, setDifficulty] = useState("easy");
  const filteredQuestions = allQuestions.filter(q => q.classId === classId && q.lessonId === lessonId && q.difficulty === difficulty);

  const initialAnswers = Array(filteredQuestions.length).fill(null);
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
    if (currentQuestion === filteredQuestions.length - 1) {
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
    const updatedQuestions = allQuestions.filter(q => q.classId === classId && q.lessonId === lessonId && q.difficulty === newDifficulty);
    setUserAnswers(Array(updatedQuestions.length).fill(null));
    setCurrentQuestion(0);
    setIsQuizFinished(false);
    setDifficulty(newDifficulty);
  }

  function getScore() {
    let finalScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === filteredQuestions[index].answer) {
        finalScore++;
      }
    });
    return finalScore;
  }

  const score = getScore();
  const nextDifficulty = score === filteredQuestions.length ? (difficulty === "easy" ? "medium" : "hard") : (score <= 1 ? "easy" : difficulty);

  if (isQuizFinished) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>Quiz App</Typography>
        <Typography variant="h5" gutterBottom>Quiz Completed!</Typography>
        <Typography variant="h6">Your Score: {score}/{filteredQuestions.length}</Typography>
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
      <Typography variant="h6" gutterBottom>{filteredQuestions[currentQuestion]?.question}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 3 }}>
        {filteredQuestions[currentQuestion]?.options.map((option) => (
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
          {currentQuestion === filteredQuestions.length - 1 ? "Finish Quiz" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}

export default Quiz;
