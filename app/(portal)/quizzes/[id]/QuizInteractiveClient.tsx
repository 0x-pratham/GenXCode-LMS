"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2, Award, Flame } from "lucide-react";
import { submitQuizAttempt } from "@/app/actions/quizActions";

interface Question {
  id: string;
  prompt: string;
  options: Record<string, string>; // {"A": "Option text", "B": "Option text"}
}

export default function QuizInteractiveClient({ quizId, questions }: { quizId: string, questions: Question[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number, xp: number } | null>(null);

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  // Handles clicking on an option
  const handleSelect = (optionText: string) => {
    setAnswers({ ...answers, [currentQ.id]: optionText });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Submits the quiz to the fast Backend Server Action
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitQuizAttempt(quizId, answers);
      if (res.success) {
        setResult({ score: res.score, xp: res.awardedXp });
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If result exists, show the Success Screen instantly
  if (result) {
    return (
      <div className="bg-black/40 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-xl shadow-2xl animate-zoom-fade-in focus:outline-none" tabIndex={0}>
        <div className="w-20 h-20 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(134,56,205,0.4)]">
          <Award className="w-10 h-10 text-accent" />
        </div>
        <h2 className="font-heading text-4xl font-bold text-white mb-2">Assessment Submitted!</h2>
        <p className="text-[#E2D1FE]/70 mb-8">Your logic has been evaluated.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full sm:w-48">
            <div className="text-xs text-[#E2D1FE]/50 uppercase tracking-widest font-bold mb-2">Final Score</div>
            <div className="text-4xl font-extrabold text-white">{result.score}%</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full sm:w-48">
            <div className="text-xs text-[#E2D1FE]/50 uppercase tracking-widest font-bold mb-2">XP Earned</div>
            <div className="text-4xl font-extrabold text-accent flex items-center justify-center gap-2">
              <Flame className="w-6 h-6 fill-accent/50" /> +{result.xp}
            </div>
          </div>
        </div>

        <Button onClick={() => router.push('/quizzes')} variant="premium" className="h-12 px-10 rounded-xl font-bold focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Return to Quizzes
        </Button>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Progress Bar */}
      <div className="bg-black/20 border border-white/10 rounded-full h-3 w-full overflow-hidden p-0.5 backdrop-blur-sm">
        <div 
          className="h-full bg-brand-gradient rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>
      <div className="text-right text-xs font-bold text-[#E2D1FE]/50 tracking-wider">
        QUESTION {currentIndex + 1} OF {questions.length}
      </div>

      {/* Question Card */}
      <Card className="bg-black/30 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-8 leading-relaxed">
            {currentQ.prompt}
          </h2>

          <div className="space-y-3">
            {Object.entries(currentQ.options as Record<string, string>).map(([letter, text]) => {
              const isSelected = currentAnswer === text;
              return (
                <div 
                  key={letter}
                  onClick={() => handleSelect(text)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(text);
                    }
                  }}
                  role="button"
                  className={`relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isSelected 
                      ? "bg-accent/10 border-accent/50 shadow-[0_0_15px_rgba(134,56,205,0.2)]" 
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-accent text-white" : "bg-black/40 border border-white/10 text-[#E2D1FE]/60 group-hover:border-white/30"
                  }`}>
                    {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{letter}</span>}
                  </div>
                  <span className={`text-sm sm:text-base font-medium transition-colors ${isSelected ? "text-white" : "text-[#E2D1FE]/80"}`}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentIndex === 0 || isSubmitting}
          className="rounded-xl border-white/10 text-white hover:bg-white/5 h-12 px-6 focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>

        {isLastQuestion ? (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || Object.keys(answers).length < questions.length}
            variant="premium"
            className="rounded-xl h-12 px-8 font-bold shadow-[0_5px_20px_rgba(134,56,205,0.3)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
            {isSubmitting ? "Evaluating..." : "Submit Assessment"}
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            disabled={!currentAnswer}
            className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-8 font-bold focus-visible:ring-2 focus-visible:ring-accent"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}