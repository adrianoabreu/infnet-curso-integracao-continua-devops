"use client"

import { useState } from "react"
import { StudyForm } from "@/components/study-form"
import { StudyList } from "@/components/study-list"
import type { StudyItem } from "@/types/study-item"

export function StudyGuide() {
  const [studyItems, setStudyItems] = useState<StudyItem[]>([])

  const addStudyItem = (item: StudyItem) => {
    setStudyItems([...studyItems, { ...item, id: Date.now().toString() }])
  }

  const deleteStudyItem = (id: string) => {
    setStudyItems(studyItems.filter((item) => item.id !== id))
  }

  const toggleCompleted = (id: string) => {
    setStudyItems(studyItems.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  return (
    <div className="space-y-8">
      <StudyForm onAddItem={addStudyItem} />
      <StudyList items={studyItems} onDelete={deleteStudyItem} onToggleComplete={toggleCompleted} />
    </div>
  )
}

