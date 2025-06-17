import { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getQuestions } from "../../api";

function Quiz() {
  const { classId, lessonId } = useParams();
  useEffect(() => {
      const fetchClasses = async () => {
        try {
          const token = localStorage.getItem('token');
            const lessonData = await getQuestions(token, lessonId);
            console.log(lessonData)
            // if (classData) setClasses(classData);
          } catch (err) {
            console.error('Failed to fetch classes:', err.message);
          }
        };
    
        fetchClasses();
      }, [lessonId]);

  // Previous dummy data
  /*
  const allQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "London", "Paris", "Rome"],
      answer: "Paris",
      difficulty: "easy",
      classId: "1",
      lessonId: "geo",
    },
    {
      question: "Which language is used for web apps?",
      options: ["PHP", "Python", "Javascript", "All"],
      answer: "All",
      difficulty: "medium",
      classId: "1",
      lessonId: "cs",
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
      classId: "1",
      lessonId: "cs",
    },
    {
      question: "Which of the following is not a JavaScript data type?",
      options: ["Undefined", "Number", "Boolean", "Float"],
      answer: "Float",
      difficulty: "easy",
      classId: "1",
      lessonId: "cs",
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer: "O(log n)",
      difficulty: "medium",
      classId: "1",
      lessonId: "algos",
    },
    {
      question: "What is a closure in JavaScript?",
      options: [
        "A function having access to the parent scope",
        "A loop inside a function",
        "A class method",
        "None of the above",
      ],
      answer: "A function having access to the parent scope",
      difficulty: "hard",
      classId: "1",
      lessonId: "js",
    },
    {
      question: "What is the pH of a neutral solution?",
      options: ["0", "7", "14", "1"],
      answer: "7",
      difficulty: "easy",
      classId: "2",
      lessonId: "acids-and-bases",
    },
    {
      question: "Which of the following is a strong acid?",
      options: ["HCl", "CH3COOH", "NH3", "NaOH"],
      answer: "HCl",
      difficulty: "medium",
      classId: "2",
      lessonId: "acids-and-bases",
    },
    {
      question: "What is the conjugate base of H2SO4?",
      options: ["HSO4^-", "SO4^2-", "OH^-", "H+"],
      answer: "HSO4^-",
      difficulty: "hard",
      classId: "2",
      lessonId: "acids-and-bases",
    },
  ];
*/

// New Dummy data to test AI confidence level
 const allQuestions = [
  {
    question: "What does it mean for a sorting algorithm to be stable?",
    options: [
      "It preserves the relative order of equal elements",
      "It always sorts in O(n log n) time",
      "It does not use recursion",
      "It works without extra space"
    ],
    answer: "It preserves the relative order of equal elements",
    classId: "cs101",
    lessonId: "sorting-and-trees",
    tags: ["stability", "definitions", "sorting"],
    difficulty: "Easy"
  },
  {
    question: "Which of the following sorting algorithms is stable?",
    options: ["Heap Sort", "Quick Sort", "Selection Sort", "Bubble Sort"],
    answer: "Bubble Sort",
    classId: "cs101",
    lessonId: "sorting-and-trees",
    tags: ["sorting", "stability", "algorithm-properties"],
    difficulty: "Medium"
  },
  {
    question: "What is the height of a complete binary tree with 15 nodes?",
    options: ["3", "4", "5", "6"],
    answer: "3",
    classId: "cs101",
    lessonId: "sorting-and-trees",
    tags: ["trees", "binary-trees", "tree-height"],
    difficulty: "Medium"
  },
  {
    question: "Which traversal method of a binary search tree results in sorted order?",
    options: ["Pre-order", "Post-order", "In-order", "Level-order"],
    answer: "In-order",
    classId: "cs101",
    lessonId: "sorting-and-trees",
    tags: ["bst", "in-order", "tree-traversal"],
    difficulty: "Easy"
  },
  {
    question: "What is the worst-case time complexity of Heap Sort?",
    options: ["O(n²)", "O(n log n)", "O(log n)", "O(n)"],
    answer: "O(n log n)",
    classId: "cs101",
    lessonId: "sorting-and-trees",
    tags: ["heap-sort", "time-complexity", "sorting"],
    difficulty: "Medium"
  },
  {
    question: "What kind of binary tree has all leaf nodes at the same depth and every internal node with two children?",
    options: ["Complete Binary Tree", "Full Binary Tree", "Balanced Tree", "Degenerate Tree"],
    answer: "Full Binary Tree",
    classId: "cs101",
    lessonId: "sorting-and-trees",
    tags: ["tree-structures", "definitions", "binary-trees"],
    difficulty: "Medium"
  }
];
  const [difficulty, setDifficulty] = useState("easy");
  //const filteredQuestions = allQuestions.filter(q => q.classId === classId && q.lessonId === lessonId && q.difficulty === difficulty);
  const filteredQuestions = allQuestions;
  const initialAnswers = Array(filteredQuestions.length).fill(null);
  const [userAnswers, setUserAnswers] = useState(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const selectedAnswer = userAnswers[currentQuestion];
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  // Created new usestate so that it can be feed into AI
  const [userAnswersToAI, setUserAnswersToAI] = useState([]);
  const [confidenceResult, setConfidenceResult] = useState(null); 
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
  const callConfidenceAPI = async () => {
    if (!isQuizFinished || userAnswersToAI.length === 0) return;

    // Prepare the payload
    const formattedQuestionsData = userAnswersToAI.map(item => ({
      question: item.question,
      studentAnswer: item.studentAnswer,
      isCorrect: item.isCorrect,
    }));

    setIsEvaluating(true);
    try {
      const response = await axios.post("http://localhost:5001/api/confidence", {
        questionsData: formattedQuestionsData
      });

      // console.log("Confidence API response:", response.data);
      setConfidenceResult(response.data);
    } catch (error) {
      console.error("Error calling confidence API:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  callConfidenceAPI();
}, [isQuizFinished, userAnswersToAI]);

  function handleSelectOption(option) {
    // Original logic
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = option;
    setUserAnswers(newUserAnswers);

    // Additional logic for more AI friendly
    const currentQ = filteredQuestions[currentQuestion];
    const answerObj = {
      question: currentQ,
      studentAnswer: option,
      isCorrect: option === currentQ.answer,
    };

    setUserAnswersToAI((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.question.question === currentQ.question
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = answerObj;
        return updated;
      } else {
        return [...prev, answerObj];
      }
    });
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
    const updatedQuestions = allQuestions.filter(
      (q) =>
        q.classId === classId &&
        q.lessonId === lessonId &&
        q.difficulty === newDifficulty
    );
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
  const nextDifficulty =
    score === filteredQuestions.length
      ? difficulty === "easy"
        ? "medium"
        : "hard"
      : score <= 1
      ? "easy"
      : difficulty;

  // Previous display after completion of quiz
  /*
  if (isQuizFinished) {
    console.log("User Answers to AI:", userAnswersToAI);
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          Quiz App
        </Typography>
        <Typography variant="h5" gutterBottom>
          Quiz Completed!
        </Typography>
        <Typography variant="h6">
          Your Score: {score}/{filteredQuestions.length}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Recommended Difficulty for Next Quiz:{" "}
          <strong>{nextDifficulty}</strong>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => restartQuiz(nextDifficulty)}
        >
          Take Another Quiz
        </Button>
      </Box>
    );
  }
*/ 


if (isQuizFinished && confidenceResult) {
  const tagData = confidenceResult.tagConfidence?.tagConfidence || [];
  const aiComment = confidenceResult.tagConfidence?.comments || "";

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Quiz App
      </Typography>

      <Typography variant="h5" gutterBottom>
        Quiz Completed!
      </Typography>

      <Typography variant="h6" gutterBottom>
        Your Score: {score}/{filteredQuestions.length}
      </Typography>

      <Typography variant="body2" sx={{ mt: 1, mb: 3 }} color="text.secondary">
        (Confidence is rated out of 100. 100 = full marks)
      </Typography>

      <Box sx={{ mt: 3, textAlign: "left", maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Confidence Levels by Topic:
        </Typography>
        {tagData.map((item, index) => (
          <Typography key={index} sx={{ mb: 1 }}>
            <strong>{item.tag}:</strong> {item.confidence}/100
          </Typography>
        ))}
      </Box>

      <Box sx={{ mt: 4, textAlign: "left", maxWidth: 600, mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          AI Feedback:
        </Typography>
        <Typography>{aiComment}</Typography>
      </Box>
    </Box>
  );
}

if (isQuizFinished && isEvaluating) {
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Evaluating your answers...
      </Typography>
      <Typography variant="body1">
        Please wait while the AI analyzes your responses.
      </Typography>
    </Box>
  );
}

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        Quiz App
      </Typography>
      <Typography variant="h5" gutterBottom>
        Question {currentQuestion + 1}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {filteredQuestions[currentQuestion]?.question}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 3,
        }}
      >
        {filteredQuestions[currentQuestion]?.options.map((option) => (
          <Button
            key={option}
            variant={selectedAnswer === option ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleSelectOption(option)}
            sx={{ width: "300px" }}
          >
            {option}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={goToPrev}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={goToNext}
          disabled={!selectedAnswer}
        >
          {currentQuestion === filteredQuestions.length - 1
            ? "Finish Quiz"
            : "Next"}
        </Button>
      </Box>
    </Box>
  );
}

export default Quiz;
