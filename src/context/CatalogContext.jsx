import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { productsApi } from '../services/api'
import { SEED_MACHINES } from '../data/machines'

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await productsApi.list()
      setMachines(data)
    } catch (err) {
      console.warn('Catalog API unavailable, using local seed:', err.message)
      setMachines(SEED_MACHINES)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => {
    const getMachineById = (id) => machines.find((m) => m.id === id) || null
    const getMachinesByCategory = (categoryId) =>
      machines.filter((m) => m.categoryId === categoryId && m.published !== false)
    const getProductCount = (categoryId) => getMachinesByCategory(categoryId).length

    return {
      machines,
      loading,
      error,
      refresh,
      getMachineById,
      getMachinesByCategory,
      getProductCount,
    }
  }, [machines, loading, error, refresh])

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
