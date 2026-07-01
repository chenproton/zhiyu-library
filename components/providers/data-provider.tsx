"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Resource, ResourceFormData, ResourceStatus, ResourceType } from '@/lib/types'
import { mockResources, mockCurrentUser, mockFavoriteIds } from '@/lib/mock-data'

interface DataContextValue {
  resources: Resource[]
  favorites: Set<string>
  currentUser: typeof mockCurrentUser
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
  incrementUsage: (id: string) => void
  getApprovedResources: () => Resource[]
  getMyUploads: () => Resource[]
  getPendingResources: () => Resource[]
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(() => mockResources.map(r => ({ ...r })))
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(mockFavoriteIds))

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
      content: data.content,
      tags: data.tags,
      status: 'pending' as ResourceStatus,
      usageCount: 0,
      favoriteCount: 0,
      uploaderId: mockCurrentUser.id,
      uploaderName: mockCurrentUser.name,
      uploaderDepartment: mockCurrentUser.department,
      department: mockCurrentUser.department,
      venueCapacity: data.venueCapacity,
      venueLocation: data.venueLocation,
      venueFacilities: data.venueFacilities,
      venueOpenTime: data.venueOpenTime,
      venueContact: data.venueContact,
      equipmentModel: data.equipmentModel,
      equipmentSpec: data.equipmentSpec,
      equipmentLocation: data.equipmentLocation,
      equipmentManager: data.equipmentManager,
      equipmentQuantity: data.equipmentQuantity,
      softwareVersion: data.softwareVersion,
      softwareEnv: data.softwareEnv,
      softwareLicense: data.softwareLicense,
      softwareDownloadUrl: data.softwareDownloadUrl,
      simulationPlatform: data.simulationPlatform,
      simulationDomain: data.simulationDomain,
      simulationInstructions: data.simulationInstructions,
      linkUrl: data.linkUrl,
      linkSource: data.linkSource,
      fileUrl: data.fileUrl,
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

  const getPendingResources = useCallback(() =>
    resources.filter(r => r.status === 'pending'), [resources])

  const value: DataContextValue = {
    resources,
    favorites,
    currentUser: mockCurrentUser,
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
    incrementUsage,
    getApprovedResources,
    getMyUploads,
    getPendingResources,
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
