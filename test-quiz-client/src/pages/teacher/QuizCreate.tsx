import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { api } from '@/lib/api';
import { useQuizStore } from '@/store/useQuizStore';
import { Question } from '@/types';

interface QuestionForm {
  text: string;
  options: { label: string; text: string }[];
  correctOptionIndex: number;
}

const QuizCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentQuiz, addQuestion } = useQuizStore();
  
  const quizType = (location.state as any)?.quizType || 'INDIVIDUAL';
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionForm>({
    text: '',
    options: [
      { label: 'A', text: '' },
      { label: 'B', text: '' },
    ],
    correctOptionIndex: 0,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'title' | 'questions'>('title');

  const addOption = () => {
    if (currentQuestion.options.length < 6) {
      const nextLabel = String.fromCharCode(65 + currentQuestion.options.length); // A, B, C, D, E, F
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, { label: nextLabel, text: '' }],
      });
    }
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index].text = text;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
        correctOptionIndex: currentQuestion.correctOptionIndex >= newOptions.length 
          ? 0 
          : currentQuestion.correctOptionIndex,
      });
    }
  };

  const handleAddQuestion = () => {
    if (currentQuestion.text && currentQuestion.options.every(opt => opt.text)) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        text: '',
        options: [
          { label: 'A', text: '' },
          { label: 'B', text: '' },
        ],
        correctOptionIndex: 0,
      });
    }
  };

  const handleFinishQuiz = async () => {
    try {
      setLoading(true);
      
      // Create quiz
      const quiz = await api.createQuiz(quizTitle, quizType, 15);
      setCurrentQuiz(quiz);

      // Add all questions
      for (const q of questions) {
        const questionData = {
          text: q.text,
          order: questions.indexOf(q) + 1,
          timeLimit: 15,
          options: q.options.map((opt, idx) => ({
            label: opt.label,
            text: opt.text,
            isCorrect: idx === q.correctOptionIndex,
          })),
        };
        
        const createdQuestion = await api.addQuestion(quiz.id, questionData);
        addQuestion(createdQuestion);
      }

      // Navigate to lobby
      navigate(`/teacher/quiz/${quiz.id}/lobby`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'title') {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          {quizType === 'INDIVIDUAL' ? 'Yakka' : 'Jamoaviy'} tartibli test yaratish
        </h1>
        <Card>
          <Input
            label="Test nomini kiriting"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Masalan: Matematika testi"
            fullWidth
          />
          <Button
            onClick={() => setStep('questions')}
            disabled={!quizTitle}
            fullWidth
            className="mt-6"
          >
            KEYINGI BOSQICH
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">
        Savol qo'shish
      </h1>
      <p className="text-gray-400 text-center mb-8">
        {questions.length} ta savol qo'shildi
      </p>

      <Card>
        <div className="space-y-6">
          {/* Question Text */}
          <Input
            label="Savol matnini kiriting"
            value={currentQuestion.text}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
            placeholder="Savolingizni yozing..."
            fullWidth
          />

          {/* Options */}
          <div>
            <label className="block text-white text-lg mb-3 font-medium">
              Javob variantlarni kiriting
            </label>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Variant ${option.label}`}
                    fullWidth
                  />
                  <span className="text-white font-bold text-xl min-w-[30px] text-center">
                    {option.label}
                  </span>
                  {currentQuestion.options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-400 text-xl"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {currentQuestion.options.length < 6 && (
              <button
                onClick={addOption}
                className="mt-3 text-white hover:text-gray-300 transition-colors"
              >
                + Varyant qo'shish
              </button>
            )}
          </div>

          {/* Correct Answer */}
          <div>
            <label className="block text-white text-lg mb-3 font-medium">
              To'g'ri javobni tanlang
            </label>
            <select
              value={currentQuestion.correctOptionIndex}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctOptionIndex: parseInt(e.target.value) })}
              className="bg-transparent border-2 border-white rounded-xl px-6 py-4 text-white text-lg w-full focus:outline-none focus:border-gray-300"
            >
              {currentQuestion.options.map((option, index) => (
                <option key={index} value={index} className="bg-card text-white">
                  {option.label} - {option.text || '(bo\'sh)'}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleAddQuestion}
              disabled={!currentQuestion.text || !currentQuestion.options.every(opt => opt.text)}
              fullWidth
            >
              SAVOL QO'SHISH
            </Button>
            {questions.length > 0 && (
              <Button
                onClick={handleFinishQuiz}
                variant="secondary"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Yuklanmoqda...' : 'YAKUNLASH'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizCreate;
