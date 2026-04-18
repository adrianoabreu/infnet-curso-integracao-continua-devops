import { StudyGuideApp } from "@/components/study-guide-app"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-slate-800 dark:text-slate-100">
          Guia de Estudos <span className="text-blue-600 dark:text-blue-400">Faculdade Infnet</span>
        </h1>
        <StudyGuideApp />
      </div>
    </main>
  )
}

