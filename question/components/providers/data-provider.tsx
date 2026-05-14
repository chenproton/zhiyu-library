"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import type {
  QuestionBank,
  Question,
  Exam,
  ExamQuestion,
  Status,
  QuestionBankFormData,
  QuestionFormData,
  ExamFormData,
  StatusAction,
} from '@/lib/types'
import { getNextStatus, canPerformAction } from '@/lib/types'
import { mockQuestionBanks, mockQuestions, mockExams } from '@/lib/mock-data'

interface DataContextValue {
  // 题库相关
  questionBanks: QuestionBank[]
  getQuestionBank: (id: string) => QuestionBank | undefined
  createQuestionBank: (data: QuestionBankFormData) => QuestionBank
  updateQuestionBank: (id: string, data: QuestionBankFormData) => void
  deleteQuestionBank: (id: string) => void
  updateQuestionBankStatus: (id: string, action: StatusAction) => void

  // 题目相关
  questions: Question[]
  getQuestionsByBank: (bankId: string) => Question[]
  getQuestion: (id: string) => Question | undefined
  createQuestion: (bankId: string, data: QuestionFormData) => Question
  updateQuestion: (id: string, data: QuestionFormData) => void
  deleteQuestion: (id: string) => void

  // 试卷相关
  exams: Exam[]
  getExam: (id: string) => Exam | undefined
  createExam: (data: ExamFormData) => Exam
  updateExam: (id: string, data: Partial<Exam>) => void
  deleteExam: (id: string) => void
  updateExamStatus: (id: string, action: StatusAction) => void
  addQuestionToExam: (examId: string, question: Question, score?: number) => void
  removeQuestionFromExam: (examId: string, examQuestionId: string) => void
  updateExamQuestionScore: (examId: string, examQuestionId: string, score: number) => void
  reorderExamQuestions: (examId: string, questions: ExamQuestion[]) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>(mockQuestionBanks)
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [exams, setExams] = useState<Exam[]>(mockExams)

  // 题库操作
  const getQuestionBank = useCallback(
    (id: string) => questionBanks.find((bank) => bank.id === id),
    [questionBanks]
  )

  const createQuestionBank = useCallback((data: QuestionBankFormData): QuestionBank => {
    const newBank: QuestionBank = {
      id: `bank-${Date.now()}`,
      name: data.name,
      description: data.description,
      coverUrl: data.coverUrl,
      collaboratorIds: data.collaboratorIds,
      collaboratorDeptIds: data.collaboratorDeptIds,
      batchId: data.batchId,
      status: 'draft',
      questionCount: 0,
      version: 'v0.1.0',
      ownerType: 'mine',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setQuestionBanks((prev) => [...prev, newBank])
    return newBank
  }, [])

  const updateQuestionBank = useCallback((id: string, data: QuestionBankFormData) => {
    setQuestionBanks((prev) =>
      prev.map((bank) =>
        bank.id === id ? { ...bank, ...data, updatedAt: new Date() } : bank
      )
    )
  }, [])

  const deleteQuestionBank = useCallback((id: string) => {
    setQuestionBanks((prev) => prev.filter((bank) => bank.id !== id))
    setQuestions((prev) => prev.filter((q) => q.bankId !== id))
  }, [])

  const updateQuestionBankStatus = useCallback((id: string, action: StatusAction) => {
    setQuestionBanks((prev) =>
      prev.map((bank) => {
        if (bank.id !== id) return bank
        if (!canPerformAction(bank.status, action)) return bank
        return {
          ...bank,
          status: getNextStatus(action),
          updatedAt: new Date(),
        }
      })
    )
  }, [])

  // 题目操作
  const getQuestionsByBank = useCallback(
    (bankId: string) => questions.filter((q) => q.bankId === bankId),
    [questions]
  )

  const getQuestion = useCallback(
    (id: string) => questions.find((q) => q.id === id),
    [questions]
  )

  const createQuestion = useCallback((bankId: string, data: QuestionFormData): Question => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      bankId,
      ...data,
      createdAt: new Date(),
    }
    setQuestions((prev) => [...prev, newQuestion])
    // 更新题库题目数量
    setQuestionBanks((prev) =>
      prev.map((bank) =>
        bank.id === bankId
          ? { ...bank, questionCount: bank.questionCount + 1, updatedAt: new Date() }
          : bank
      )
    )
    return newQuestion
  }, [])

  const updateQuestion = useCallback((id: string, data: QuestionFormData) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...data } : q))
    )
  }, [])

  const deleteQuestion = useCallback((id: string) => {
    const question = questions.find((q) => q.id === id)
    if (question) {
      setQuestions((prev) => prev.filter((q) => q.id !== id))
      setQuestionBanks((prev) =>
        prev.map((bank) =>
          bank.id === question.bankId
            ? { ...bank, questionCount: Math.max(0, bank.questionCount - 1), updatedAt: new Date() }
            : bank
        )
      )
    }
  }, [questions])

  // 试卷操作
  const getExam = useCallback(
    (id: string) => exams.find((exam) => exam.id === id),
    [exams]
  )

  const createExam = useCallback((data: ExamFormData): Exam => {
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      name: data.name,
      description: data.description,
      duration: data.duration,
      collaboratorIds: data.collaboratorIds,
      collaboratorDeptIds: data.collaboratorDeptIds,
      batchId: data.batchId,
      status: 'draft',
      totalScore: 0,
      questions: [],
      version: 'v0.1.0',
      ownerType: 'mine',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setExams((prev) => [...prev, newExam])
    return newExam
  }, [])

  const updateExam = useCallback((id: string, data: Partial<Exam>) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === id ? { ...exam, ...data, updatedAt: new Date() } : exam
      )
    )
  }, [])

  const deleteExam = useCallback((id: string) => {
    setExams((prev) => prev.filter((exam) => exam.id !== id))
  }, [])

  const updateExamStatus = useCallback((id: string, action: StatusAction) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== id) return exam
        if (!canPerformAction(exam.status, action)) return exam
        return {
          ...exam,
          status: getNextStatus(action),
          updatedAt: new Date(),
        }
      })
    )
  }, [])

  const addQuestionToExam = useCallback((examId: string, question: Question, score?: number) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam
        // 检查是否已存在
        if (exam.questions.some((q) => q.questionId === question.id)) return exam

        const examQuestion: ExamQuestion = {
          id: `eq-${Date.now()}`,
          questionId: question.id,
          type: question.type,
          content: question.content,
          options: question.options,
          answer: question.answer,
          analysis: question.analysis,
          score: score ?? question.score,
          order: exam.questions.length + 1,
        }

        const newQuestions = [...exam.questions, examQuestion]
        const totalScore = newQuestions.reduce((sum, q) => sum + q.score, 0)

        return {
          ...exam,
          questions: newQuestions,
          totalScore,
          updatedAt: new Date(),
        }
      })
    )
  }, [])

  const removeQuestionFromExam = useCallback((examId: string, examQuestionId: string) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam

        const newQuestions = exam.questions
          .filter((q) => q.id !== examQuestionId)
          .map((q, index) => ({ ...q, order: index + 1 }))
        const totalScore = newQuestions.reduce((sum, q) => sum + q.score, 0)

        return {
          ...exam,
          questions: newQuestions,
          totalScore,
          updatedAt: new Date(),
        }
      })
    )
  }, [])

  const updateExamQuestionScore = useCallback(
    (examId: string, examQuestionId: string, score: number) => {
      setExams((prev) =>
        prev.map((exam) => {
          if (exam.id !== examId) return exam

          const newQuestions = exam.questions.map((q) =>
            q.id === examQuestionId ? { ...q, score } : q
          )
          const totalScore = newQuestions.reduce((sum, q) => sum + q.score, 0)

          return {
            ...exam,
            questions: newQuestions,
            totalScore,
            updatedAt: new Date(),
          }
        })
      )
    },
    []
  )

  const reorderExamQuestions = useCallback((examId: string, questions: ExamQuestion[]) => {
    setExams((prev) =>
      prev.map((exam) => {
        if (exam.id !== examId) return exam
        return {
          ...exam,
          questions: questions.map((q, index) => ({ ...q, order: index + 1 })),
          updatedAt: new Date(),
        }
      })
    )
  }, [])

  const value: DataContextValue = {
    questionBanks,
    getQuestionBank,
    createQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
    updateQuestionBankStatus,
    questions,
    getQuestionsByBank,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    exams,
    getExam,
    createExam,
    updateExam,
    deleteExam,
    updateExamStatus,
    addQuestionToExam,
    removeQuestionFromExam,
    updateExamQuestionScore,
    reorderExamQuestions,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
