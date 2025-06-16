import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Alert,
  Chip,
  LinearProgress,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  VideoFile,
  Quiz,
  TextSnippet,
  Delete,
  Visibility,
  Save,
} from "@mui/icons-material";

const TeacherUploadInterface = () => {
  // Predefined topic options
  const topicOptions = "Lesson 1";
  const [materialType, setMaterialType] = useState("");
  const [topicTag, setTopicTag] = useState(topicOptions);
  const [modality, setModality] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [quizData, setQuizData] = useState({
    questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
  });
  const [textContent, setTextContent] = useState("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [materials, setMaterials] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleQuizQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field.startsWith("option")) {
      const optionIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].options[optionIndex] = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = parseInt(value);
    }
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    if (!materialType || !topicTag || !modality) {
      alert("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create material object
      const materialData = {
        id: Date.now().toString(),
        type: materialType,
        topic: topicTag,
        modality: modality,
        uploadDate: new Date().toISOString(),
        title: materialTitle,
        content: null,
      };

      // Handle different material types
      if (materialType === "video" && uploadedFile) {
        materialData.content = {
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          fileType: uploadedFile.type,
        };
      } else if (materialType === "quiz") {
        materialData.content = quizData;
      } else if (materialType === "text") {
        materialData.content = { text: textContent };
      }

      // Add to local state (replace with actual API call later)
      setMaterials([...materials, materialData]);
      console.log(materialData);

      // Setup to upload to backend

      setUploadSuccess(true);

      // Reset form
      resetForm();

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setMaterialType("");
    setModality("");
    setUploadedFile(null);
    setQuizData({
      questions: [
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    });
    setMaterialTitle("");
    setTextContent("");
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "video":
        return <VideoFile />;
      case "quiz":
        return <Quiz />;
      case "text":
        return <TextSnippet />;
      default:
        return <CloudUpload />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Upload Learning Materials
      </Typography>

      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Material uploaded successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Upload Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Add New Material
            </Typography>

            {/* Material Type Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Material Type *</InputLabel>
              <Select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                label="Material Type *"
              >
                <MenuItem value="video">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <VideoFile /> Video
                  </Box>
                </MenuItem>
                <MenuItem value="quiz">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Quiz /> Quiz
                  </Box>
                </MenuItem>
                <MenuItem value="text">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextSnippet /> Text Material
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Learning Modality */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Learning Modality *</FormLabel>
              <RadioGroup
                row
                value={modality}
                onChange={(e) => setModality(e.target.value)}
              >
                <FormControlLabel
                  value="visual"
                  control={<Radio />}
                  label="Visual"
                />
                <FormControlLabel
                  value="auditory"
                  control={<Radio />}
                  label="Auditory"
                />
                <FormControlLabel
                  value="kinesthetic"
                  control={<Radio />}
                  label="Kinesthetic"
                />
              </RadioGroup>
            </FormControl>
            {/* Title of Material */}
            <TextField
              fullWidth
              label="Material Title *"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Content Upload/Creation Area */}
            {materialType && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  {materialType === "video" && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Upload Video File
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{ mb: 2 }}
                      >
                        Choose Video File
                        <input
                          type="file"
                          hidden
                          accept="video/*"
                          onChange={handleFileUpload}
                        />
                      </Button>
                      {uploadedFile && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <VideoFile color="primary" />
                          <Typography>{uploadedFile.name}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => setUploadedFile(null)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  )}

                  {materialType === "quiz" && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Create Quiz
                      </Typography>
                      {quizData.questions.map((q, index) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{ mb: 2, p: 2 }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle1">
                              Question {index + 1}
                            </Typography>
                          </Box>

                          <TextField
                            fullWidth
                            label="Question"
                            multiline
                            rows={2}
                            value={q.question}
                            onChange={(e) =>
                              handleQuizQuestionChange(
                                index,
                                "question",
                                e.target.value
                              )
                            }
                            sx={{ mb: 2 }}
                          />

                          {q.options.map((option, optIndex) => (
                            <TextField
                              key={optIndex}
                              fullWidth
                              label={`Option ${optIndex + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleQuizQuestionChange(
                                  index,
                                  `option-${optIndex}`,
                                  e.target.value
                                )
                              }
                              sx={{ mb: 1 }}
                            />
                          ))}

                          <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Correct Answer</InputLabel>
                            <Select
                              value={q.correctAnswer}
                              onChange={(e) =>
                                handleQuizQuestionChange(
                                  index,
                                  "correctAnswer",
                                  e.target.value
                                )
                              }
                              label="Correct Answer"
                            >
                              {q.options.map((_, optIndex) => (
                                <MenuItem key={optIndex} value={optIndex}>
                                  Option {optIndex + 1}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Card>
                      ))}
                    </Box>
                  )}

                  {materialType === "text" && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Text Content
                      </Typography>
                      <TextField
                        fullWidth
                        label="Enter your text content here"
                        multiline
                        rows={8}
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        variant="outlined"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={resetForm}>
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  isUploading || !materialType || !topicTag || !modality || !materialTitle
                }
                startIcon={isUploading ? null : <Save />}
              >
                {isUploading ? "Uploading..." : "Upload Material"}
              </Button>
            </Box>

            {isUploading && <LinearProgress sx={{ mt: 2 }} />}
          </Paper>
        </Grid>

        {/* Preview/Summary Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Uploaded Materials ({materials.length})
            </Typography>

            {materials.length === 0 ? (
              <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                No materials uploaded yet
              </Typography>
            ) : (
              materials.map((material) => (
                <Card key={material.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {getFileIcon(material.type)}
                      <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {material.type}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {material.title || "Untitled Material"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Topic:</strong> {material.topic}
                    </Typography>

                    <Chip
                      size="small"
                      label={material.modality}
                      color="primary"
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />

                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      {new Date(material.uploadDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherUploadInterface;
