"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Resource, ResourceFormData, ResourceStatus, ResourceType, TagCategory, TagDefinition } from '@/lib/types'
import { randomTagColor } from '@/lib/types'
import { mockResources, mockCurrentUser, mockFavoriteIds, mockTagCategories, mockTagDefinitions } from '@/lib/mock-data'

interface DataContextValue {
  resources: Resource[]
  favorites: Set<string>
  currentUser: typeof mockCurrentUser
  tagCategories: TagCategory[]
  tagDefinitions: TagDefinition[]
  getResource: (id: string) => Resource | undefined
  getFavorites: () => Resource[]
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  createResource: (data: ResourceFormData) => Resource
  updateResource: (id: string, data: Partial<ResourceFormData>) => void
  deleteResource: (id: string) => void
  approveResource: (id: string) => void
  rejectResource: (id: string, reason: string) => void
  batchApprove: (ids: string[]) => void
  batchReject: (ids: string[], reason: string) => void
  batchDelete: (ids: string[]) => void
  batchUpdateShared: (ids: string[], isShared: boolean) => void
  incrementUsage: (id: string) => void
  getApprovedResources: () => Resource[]
  getMyUploads: () => Resource[]
  getMySharedResources: () => Resource[]
  getMyUnsharedResources: () => Resource[]
  getPendingResources: () => Resource[]
  addTagCategory: (name: string) => TagCategory
  updateTagCategory: (id: string, name: string) => void
  deleteTagCategory: (id: string) => void
  addTag: (name: string, categoryId: string) => TagDefinition
  updateTag: (id: string, name: string) => void
  deleteTag: (id: string) => void
  getTagColor: (tagName: string) => string
  getAllUsedTagNames: () => string[]
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(() => mockResources.map(r => ({ ...r })))
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(mockFavoriteIds))
  const [tagCategories, setTagCategories] = useState<TagCategory[]>(() => [...mockTagCategories])
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>(() => [...mockTagDefinitions])

  const getResource = useCallback((id: string) => resources.find(r => r.id === id), [resources])

  const getFavorites = useCallback(() => resources.filter(r => favorites.has(r.id)), [resources, favorites])

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        const delta = favorites.has(id) ? -1 : 1
        return { ...r, favoriteCount: Math.max(0, r.favoriteCount + delta) }
      }
      return r
    }))
  }, [favorites])

  const createResource = useCallback((data: ResourceFormData) => {
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      title: data.title,
      type: data.type,
      description: data.description || '',
      content: data.content || data.title,
      tags: data.tags || [],
      status: 'pending' as ResourceStatus,
      usageCount: 0,
      favoriteCount: 0,
      uploaderId: mockCurrentUser.id,
      uploaderName: mockCurrentUser.name,
      uploaderDepartment: mockCurrentUser.department,
      department: mockCurrentUser.department,
      venueCapacity: data.venueCapacity,
      venueLocation: data.venueLocation,
      venueOpenTime: data.venueOpenTime,
      venueContact: data.venueContact,
      equipmentLocation: data.equipmentLocation,
      equipmentQuantity: data.equipmentQuantity,
      softwareVersion: data.softwareVersion,
      softwareLicense: data.softwareLicense,
      softwareDownloadUrl: data.softwareDownloadUrl,
      softwareInstallerUrl: data.softwareInstallerUrl,
      linkUrl: data.linkUrl,
      fileUrl: data.fileUrl,
      knowledgeCode: data.knowledgeCode,
      knowledgeCourses: data.knowledgeCourses,
      abilityAttribute: data.abilityAttribute,
      isShared: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setResources(prev => [newResource, ...prev])
    return newResource
  }, [])

  const updateResource = useCallback((id: string, data: Partial<ResourceFormData>) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r
      return { ...r, ...data, updatedAt: new Date() }
    }))
  }, [])

  const deleteResource = useCallback((id: string) => {
    setResources(prev => prev.filter(r => r.id !== id))
    setFavorites(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const approveResource = useCallback((id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r
      return { ...r, status: 'approved' as ResourceStatus, rejectReason: undefined, updatedAt: new Date() }
    }))
  }, [])

  const rejectResource = useCallback((id: string, reason: string) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r
      return { ...r, status: 'rejected' as ResourceStatus, rejectReason: reason, updatedAt: new Date() }
    }))
  }, [])

  const batchApprove = useCallback((ids: string[]) => {
    setResources(prev => prev.map(r => {
      if (!ids.includes(r.id)) return r
      return { ...r, status: 'approved' as ResourceStatus, rejectReason: undefined, updatedAt: new Date() }
    }))
  }, [])

  const batchReject = useCallback((ids: string[], reason: string) => {
    setResources(prev => prev.map(r => {
      if (!ids.includes(r.id)) return r
      return { ...r, status: 'rejected' as ResourceStatus, rejectReason: reason, updatedAt: new Date() }
    }))
  }, [])

  const batchDelete = useCallback((ids: string[]) => {
    setResources(prev => prev.filter(r => !ids.includes(r.id)))
    setFavorites(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.delete(id))
      return next
    })
  }, [])

  const batchUpdateShared = useCallback((ids: string[], isShared: boolean) => {
    setResources(prev => prev.map(r => {
      if (!ids.includes(r.id)) return r
      return { ...r, isShared, updatedAt: new Date() }
    }))
  }, [])

  const incrementUsage = useCallback((id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r
      return { ...r, usageCount: r.usageCount + 1 }
    }))
  }, [])

  const getApprovedResources = useCallback(() =>
    resources.filter(r => r.status === 'approved'), [resources])

  const getMyUploads = useCallback(() =>
    resources.filter(r => r.uploaderId === mockCurrentUser.id), [resources])

  const getMySharedResources = useCallback(() =>
    resources.filter(r => r.uploaderId === mockCurrentUser.id && r.isShared), [resources])

  const getMyUnsharedResources = useCallback(() =>
    resources.filter(r => r.uploaderId === mockCurrentUser.id && !r.isShared), [resources])

  const getPendingResources = useCallback(() =>
    resources.filter(r => r.status === 'pending'), [resources])

  const addTagCategory = useCallback((name: string) => {
    const newCategory: TagCategory = { id: `cat-${Date.now()}`, name }
    setTagCategories(prev => [...prev, newCategory])
    return newCategory
  }, [])

  const updateTagCategory = useCallback((id: string, name: string) => {
    setTagCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c))
  }, [])

  const deleteTagCategory = useCallback((id: string) => {
    setTagCategories(prev => prev.filter(c => c.id !== id))
    setTagDefinitions(prev => {
      const removedTagNames = prev.filter(t => t.categoryId === id).map(t => t.name)
      setResources(res => res.map(r => ({
        ...r,
        tags: r.tags.filter(t => !removedTagNames.includes(t)),
      })))
      return prev.filter(t => t.categoryId !== id)
    })
  }, [])

  const addTag = useCallback((name: string, categoryId: string) => {
    const existingColors = tagDefinitions
      .filter(t => t.categoryId === categoryId)
      .map(t => t.color)
    const newTag: TagDefinition = {
      id: `tag-${Date.now()}`,
      name,
      categoryId,
      color: randomTagColor(existingColors),
    }
    setTagDefinitions(prev => [...prev, newTag])
    return newTag
  }, [tagDefinitions])

  const updateTag = useCallback((id: string, name: string) => {
    const oldTag = tagDefinitions.find(t => t.id === id)
    if (!oldTag) return
    const oldName = oldTag.name
    setTagDefinitions(prev => prev.map(t => t.id === id ? { ...t, name } : t))
    if (oldName !== name) {
      setResources(prev => prev.map(r => ({
        ...r,
        tags: r.tags.map(t => t === oldName ? name : t),
      })))
    }
  }, [tagDefinitions])

  const deleteTag = useCallback((id: string) => {
    const tagToDelete = tagDefinitions.find(t => t.id === id)
    setTagDefinitions(prev => prev.filter(t => t.id !== id))
    if (tagToDelete) {
      setResources(prev => prev.map(r => ({
        ...r,
        tags: r.tags.filter(t => t !== tagToDelete.name),
      })))
    }
  }, [tagDefinitions])

  const getTagColor = useCallback((tagName: string) => {
    const def = tagDefinitions.find(t => t.name === tagName)
    if (def) return def.color
    const usedColors = tagDefinitions.map(t => t.color)
    return randomTagColor(usedColors)
  }, [tagDefinitions])

  const getAllUsedTagNames = useCallback(() => {
    const names = new Set<string>()
    for (const r of resources) {
      for (const t of r.tags) {
        names.add(t)
      }
    }
    return Array.from(names)
  }, [resources])

  const value: DataContextValue = {
    resources,
    favorites,
    currentUser: mockCurrentUser,
    tagCategories,
    tagDefinitions,
    getResource,
    getFavorites,
    isFavorite,
    toggleFavorite,
    createResource,
    updateResource,
    deleteResource,
    approveResource,
    rejectResource,
    batchApprove,
    batchReject,
    batchDelete,
    batchUpdateShared,
    incrementUsage,
    getApprovedResources,
    getMyUploads,
    getMySharedResources,
    getMyUnsharedResources,
    getPendingResources,
    addTagCategory,
    updateTagCategory,
    deleteTagCategory,
    addTag,
    updateTag,
    deleteTag,
    getTagColor,
    getAllUsedTagNames,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
