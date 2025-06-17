require("dotenv").config();

const express = require("express");
const axios = require("axios");
const router = express.Router();

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_BASE_URL = "https://api.cohere.ai/v1";

async function classifyQuestionWithCohere(questionData) {
  try {
    const generatePrompt = `
Analyze this multiple choice question and provide:
1. Topic tags (4 relevant subject/topic keywords)
2. Difficulty level (Easy, Medium, Hard)

Question: "${questionData.question}"
Options: ${questionData.options.join(", ")}
Answer: ${questionData.answer}

Respond in this exact format:
Topics: [topic1, topic2, topic3, topic4]
Difficulty: [Easy/Medium/Hard]
    `;

    //console.log("=== Sending prompt to Cohere ===");
    //console.log(generatePrompt);

    const generateResponse = await axios.post(
      `${COHERE_BASE_URL}/generate`,
      {
        model: "command",
        prompt: generatePrompt,
        max_tokens: 100,
        temperature: 0.3,
        stop_sequences: ["\n\n"],
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = generateResponse.data.generations[0].text.trim();

    //console.log("=== Raw response from Cohere ===");
    //console.log(generatedText);

    // Parse the response
    const topicsMatch = generatedText.match(/Topics:\s*\[?(.*?)\]?(?:\n|$)/);
    const difficultyMatch = generatedText.match(/Difficulty:\s*(Easy|Medium|Hard)/);

    //console.log("=== Regex match results ===");
    //console.log("Topics match:", topicsMatch);
    //console.log("Difficulty match:", difficultyMatch);

    let topics = [];
    let difficulty = "Medium"; // default

    if (topicsMatch) {
      topics = topicsMatch[1]
        .split(",")
        .map((topic) => topic.trim().replace(/['"]/g, ""))
        .filter((topic) => topic.length > 0);
    }

    if (difficultyMatch) {
      difficulty = difficultyMatch[1];
    }

    //console.log("=== Final classification result ===");
    //console.log({ tags: topics, difficulty });

    return {
      tags: topics,
      difficulty: difficulty,
    };
  } catch (error) {
    console.error("Error with Cohere API:", error.response?.data || error.message);

    // Fallback classification if API fails
    return {
      tags: ["general"],
      difficulty: "Medium",
    };
  }
}

router.post("/classify", async (req, res) => {
    try {
        const { question, options, answer, classId, lessonId } = req.body;
        
        // Validate input
        if (!question || !options || !answer || !classId || !lessonId) {
            return res.status(400).json({ 
                message: "Missing required fields: question, options, answer, classId, lessonId" 
            });
        }

        // Classify the question using Cohere
        const classification = await classifyQuestionWithCohere({
            question,
            options,
            answer
        });

        // Create the classified question object
        const classifiedQuestion = {
            question,
            options,
            answer,
            classId,
            lessonId,
            tags: classification.tags,
            difficulty: classification.difficulty,
        };

        res.json(classifiedQuestion);

    } catch (error) {
        console.error("Error in /classify-question:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
