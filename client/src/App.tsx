import TextAnalyzer from "./components/TextAnalyzer";
import ThemeToggle from "./components/ThemeToggle";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Skill Bridge
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Entity Extraction Tool
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="py-6">
        <TextAnalyzer />
      </main>

      <footer className="bg-white dark:bg-slate-800 shadow-inner mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Skill Bridge. All rights reserved.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
