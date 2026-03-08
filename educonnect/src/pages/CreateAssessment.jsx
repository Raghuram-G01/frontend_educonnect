import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('quiz');
  const [quizMode, setQuizMode] = useState('ai');
  const [loading, setLoading] = useState(false);
  
  const [aiTopic, setAiTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [assessment, setAssessment] = useState({
    title: '',
    duration: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [codingProblem, setCodingProblem] = useState({
    title: '',
    description: '',
    testCases: [{ input: '', output: '' }]
  });

  const handleAddQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.every(opt => opt)) {
      setAssessment({ ...assessment, questions: [...assessment.questions, currentQuestion] });
      setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    }
  };

  const generateQuizWithAI = async () => {
    if (!aiTopic || !numQuestions) {
      alert('Please provide topic and number of questions');
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      alert('API key not configured');
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate exactly ${numQuestions} multiple choice questions about ${aiTopic}. Return ONLY a JSON array with no extra text or markdown. Each question must have this exact format:
[{"question":"text","options":["a","b","c","d"],"correctAnswer":0}]`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();
      
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const match = text.match(/\[.*\]/s);
      if (match) {
        const questions = JSON.parse(match[0]);
        setAssessment({
          title: `${aiTopic} Quiz`,
          duration: '30',
          questions: questions
        });
        alert(`Successfully generated ${questions.length} questions!`);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert('Failed to generate quiz: ' + error.message);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    const newAssessment = {
      id: Date.now(),
      type,
      ...(type === 'quiz' ? assessment : codingProblem),
      createdAt: new Date().toISOString() 
    };
    localStorage.setItem('assessments', JSON.stringify([...assessments, newAssessment]));
    navigate('/faculty/dashboard');
  };
//abc
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Assessment</h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Assessment Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="quiz">Quiz</option>
          <option value="coding">Coding Problem</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'quiz' ? (
          <>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <label className="block mb-2 font-semibold">Quiz Creation Mode</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setQuizMode('ai')}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    quizMode === 'ai'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-semibold">AI Generated</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Auto-generate with AI</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQuizMode('manual')}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    quizMode === 'manual'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">✍️</div>
                  <div className="font-semibold">Create Manually</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Add questions yourself</div>
                </button>
              </div>
            </div>

            {quizMode === 'ai' ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-2 border-blue-500">
                <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">🤖 AI Quiz Generator</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold">Topic</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., JavaScript Arrays, Python Loops"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Number of Questions</label>
                    <input
                      type="number"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                      max="20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={generateQuizWithAI}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Generating...' : '✨ Generate Quiz with AI'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block mb-2 font-semibold">Quiz Title</label>
                  <input
                    type="text"
                    value={assessment.title}
                    onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Duration (minutes)</label>
                  <input
                    type="number"
                    value={assessment.duration}
                    onChange={(e) => setAssessment({ ...assessment, duration: e.target.value })}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-2 border-green-500">
                  <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300">✍️ Add Question Manually</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Question"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {currentQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                        className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ))}
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {currentQuestion.options.map((_, index) => (
                        <option key={index} value={index}>Correct: Option {index + 1}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAddQuestion} className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Add Question
                    </button>
                  </div>
                </div>
              </>
            )}

            {assessment.questions.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-green-700 dark:text-green-300">
                  ✅ Questions Added: {assessment.questions.length}
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {assessment.questions.map((q, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded">
                      <p className="font-semibold mb-2">Q{idx + 1}: {q.question}</p>
                      <ul className="text-sm space-y-1">
                        {q.options.map((opt, i) => (
                          <li key={i} className={i === q.correctAnswer ? 'text-green-600 font-semibold' : ''}>
                            {i + 1}. {opt} {i === q.correctAnswer && '✓'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="block mb-2 font-semibold">Problem Title</label>
              <input
                type="text"
                value={codingProblem.title}
                onChange={(e) => setCodingProblem({ ...codingProblem, title: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Problem Description</label>
              <textarea
                value={codingProblem.description}
                onChange={(e) => setCodingProblem({ ...codingProblem, description: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows="5"
                required
              />
            </div>

            <div>
              <h3 className="font-semibold mb-3">Test Cases</h3>
              {codingProblem.testCases.map((tc, index) => (
                <div key={index} className="space-y-2 mb-4 p-4 border rounded">
                  <input
                    type="text"
                    placeholder="Input"
                    value={tc.input}
                    onChange={(e) => {
                      const newTestCases = [...codingProblem.testCases];
                      newTestCases[index].input = e.target.value;
                      setCodingProblem({ ...codingProblem, testCases: newTestCases });
                    }}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Expected Output"
                    value={tc.output}
                    onChange={(e) => {
                      const newTestCases = [...codingProblem.testCases];
                      newTestCases[index].output = e.target.value;
                      setCodingProblem({ ...codingProblem, testCases: newTestCases });
                    }}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCodingProblem({ ...codingProblem, testCases: [...codingProblem.testCases, { input: '', output: '' }] })}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Add Test Case
              </button>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
          disabled={type === 'quiz' && assessment.questions.length === 0}
        >
          Create Assessment
        </button>
      </form>
    </div>
  );
};

export default CreateAssessment;
