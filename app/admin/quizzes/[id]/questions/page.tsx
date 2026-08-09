import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, HelpCircle, Plus, CheckCircle2, ListOrdered } from "lucide-react";

export default async function ManageQuizQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id: quizId } = await params;

  // 1. Safe Auth & Strict Admin Role Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "super_admin")) {
    redirect("/dashboard");
  }

  // 2. Fetch the specific Quiz and its associated questions
  const [
    { data: quiz, error: quizError },
    { data: questions, error: questionsError }
  ] = await Promise.all([
    supabase.from("quizzes").select("id, title, description, xp_reward").eq("id", quizId).single(),
    supabase.from("quiz_questions").select("*").eq("quiz_id", quizId).order("position", { ascending: true })
  ]);

  if (quizError || !quiz) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Quiz Not Found</h2>
        <p className="text-[#E2D1FE]/60">The requested assessment does not exist.</p>
        <Button asChild className="bg-brand-gradient border-none font-bold accent-glow hover:brightness-110">
          <Link href="/admin/quizzes">Return to Quizzes</Link>
        </Button>
      </div>
    );
  }

  // Calculate next position for the new question
  const nextPosition = questions && questions.length > 0 ? questions.length + 1 : 1;

  // 3. Inline Server Action for Adding a Question
  async function addQuestion(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();

    const prompt = formData.get("prompt") as string;
    const optA = formData.get("optionA") as string;
    const optB = formData.get("optionB") as string;
    const optC = formData.get("optionC") as string;
    const optD = formData.get("optionD") as string;
    const correctOptionLetter = formData.get("correctOption") as string;
    const explanation = formData.get("explanation") as string;
    const position = parseInt(formData.get("position") as string);

    // Build the JSON object required by the schema
    const optionsJson = {
      A: optA,
      B: optB,
      C: optC,
      D: optD
    };

    // Correct option must match the actual text value of the chosen letter for safety, or simply store the letter if frontend expects letter mapping
    const correctOptionText = optionsJson[correctOptionLetter as keyof typeof optionsJson];

    const { error: insertError } = await supabaseServer
      .from("quiz_questions")
      .insert([{
        quiz_id: quizId,
        position: position,
        prompt: prompt,
        options: optionsJson,
        correct_option: correctOptionText, // Storing the actual string value
        explanation: explanation || null
      }]);

    if (insertError) {
      console.error("Failed to add question:", insertError.message);
      return;
    }

    revalidatePath(`/admin/quizzes/${quizId}/questions`);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* Back Navigation & Header */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards">
        <Link href="/admin/quizzes" className="inline-flex items-center text-sm font-bold text-[#E2D1FE]/70 hover:text-accent transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Quizzes
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
            <ListOrdered className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground drop-shadow-lg">
              Edit <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Questions</span>
            </h1>
            <p className="text-[#E2D1FE]/80 mt-2 text-sm font-medium drop-shadow-md max-w-xl">
              Configuring assessment: <span className="text-white font-bold">{quiz.title}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Add Question Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Add New Question</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Position #{nextPosition} in the sequence.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={addQuestion} className="space-y-6">
              
              <input type="hidden" name="position" value={nextPosition} />

              <div className="space-y-2.5">
                <Label htmlFor="prompt" className="text-foreground font-bold ml-1">Question Prompt</Label>
                <Textarea 
                  id="prompt" 
                  name="prompt" 
                  placeholder="e.g., What is the primary purpose of a useEffect hook?" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[80px] backdrop-blur-sm resize-none"
                />
              </div>

              {/* Options Setup */}
              <div className="space-y-4 pt-2">
                <Label className="text-foreground font-bold ml-1">Answer Options</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-bold text-[#E2D1FE]/60 bg-black/40 h-11 rounded-lg border border-white/5 flex items-center justify-center shrink-0">A</span>
                    <Input name="optionA" required placeholder="Option A text" className="bg-black/20 border-white/10 text-foreground rounded-xl h-11" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-bold text-[#E2D1FE]/60 bg-black/40 h-11 rounded-lg border border-white/5 flex items-center justify-center shrink-0">B</span>
                    <Input name="optionB" required placeholder="Option B text" className="bg-black/20 border-white/10 text-foreground rounded-xl h-11" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-bold text-[#E2D1FE]/60 bg-black/40 h-11 rounded-lg border border-white/5 flex items-center justify-center shrink-0">C</span>
                    <Input name="optionC" required placeholder="Option C text" className="bg-black/20 border-white/10 text-foreground rounded-xl h-11" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-bold text-[#E2D1FE]/60 bg-black/40 h-11 rounded-lg border border-white/5 flex items-center justify-center shrink-0">D</span>
                    <Input name="optionD" required placeholder="Option D text" className="bg-black/20 border-white/10 text-foreground rounded-xl h-11" />
                  </div>
                </div>
              </div>

              {/* Correct Answer Selection */}
              <div className="space-y-2.5 pt-2">
                <Label htmlFor="correctOption" className="text-foreground font-bold ml-1">Correct Answer</Label>
                <div className="relative">
                  <select 
                    id="correctOption" 
                    name="correctOption" 
                    className="flex h-12 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="A" className="bg-gray-900 text-white">Option A</option>
                    <option value="B" className="bg-gray-900 text-white">Option B</option>
                    <option value="C" className="bg-gray-900 text-white">Option C</option>
                    <option value="D" className="bg-gray-900 text-white">Option D</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Label htmlFor="explanation" className="text-foreground font-bold ml-1">Explanation (Optional)</Label>
                <Textarea 
                  id="explanation" 
                  name="explanation" 
                  placeholder="Why is this answer correct? (Shown after submission)" 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[80px] backdrop-blur-sm resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Question
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Questions List */}
        <div className="lg:col-span-2 space-y-6">
          {questions && questions.length > 0 ? (
            questions.map((q, index) => {
              const animationDelay = `${(index + 3) * 100}ms`;
              return (
                <Card 
                  key={q.id} 
                  style={{ animationDelay }}
                  className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg rounded-3xl overflow-hidden"
                >
                  <CardHeader className="bg-black/10 border-b border-white/5 px-6 py-4 flex flex-row items-center justify-between">
                    <div className="font-bold text-[#E2D1FE]/70 tracking-wide text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white">{q.position}</span>
                      Question
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 px-6 pb-6">
                    <h3 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
                      {q.prompt}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {/* Decode JSON safely */}
                      {Object.entries(q.options as Record<string, string>).map(([letter, text]) => {
                        const isCorrect = text === q.correct_option;
                        return (
                          <div 
                            key={letter}
                            className={`flex items-center gap-3 p-3 rounded-xl border ${
                              isCorrect 
                                ? 'bg-emerald-500/10 border-emerald-500/30 shadow-inner' 
                                : 'bg-black/40 border-white/5'
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                              isCorrect ? 'bg-emerald-500 text-white' : 'bg-white/5 text-[#E2D1FE]/50 border border-white/5'
                            }`}>
                              {letter}
                            </span>
                            <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-400' : 'text-[#E2D1FE]/80'}`}>
                              {text}
                            </span>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    
                    {q.explanation && (
                      <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Explanation</span>
                        <p className="text-sm text-[#E2D1FE]/70">{q.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <HelpCircle className="w-8 h-8 text-[#E2D1FE]/30" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Questions Yet</h3>
                <p className="text-[#E2D1FE]/50 text-sm max-w-sm">
                  This quiz is currently empty. Use the form to construct your assessment options and define correct answers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}