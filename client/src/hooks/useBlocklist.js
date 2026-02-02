import { useState, useEffect } from 'react'
import {
    fetchBlocklist,
    fetchVersions,
    addWebsiteApi,
    deleteWebsiteApi,
    addProgramApi,
    deleteProgramApi,
    exportBatApi,
    deleteHistoryApi
} from '../utils/api'
import { Toast, showLoading, closeLoading, confirmDialog, showSuccess, showError, showQuestion } from '../utils/toast'

export function useBlocklist() {
    const [blocklist, setBlocklist] = useState({ websites: [], programs: [] })
    const [versions, setVersions] = useState({ currentVersion: 'v1.0.0', history: [] })
    const [loading, setLoading] = useState(true)

    // Fetch data on mount
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [blockData, versionData] = await Promise.all([
                fetchBlocklist(),
                fetchVersions()
            ])
            setBlocklist(blockData)
            setVersions(versionData)
        } catch (error) {
            Toast.fire({ icon: 'error', title: 'Failed to fetch data' })
        } finally {
            setLoading(false)
        }
    }

    // Add website with validation
    const addWebsite = async (url) => {
        if (!url.trim()) {
            Toast.fire({ icon: 'warning', title: 'Please enter a URL' })
            return false
        }

        // Basic URL validation
        const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/
        const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
        if (!urlPattern.test(cleanUrl)) {
            Toast.fire({ icon: 'warning', title: 'Please enter a valid URL' })
            return false
        }

        try {
            showLoading('Adding website...')
            const website = await addWebsiteApi(url)
            setBlocklist(prev => ({ ...prev, websites: [...prev.websites, website] }))
            closeLoading()
            Toast.fire({ icon: 'success', title: 'Website added successfully!' })
            return true
        } catch (error) {
            closeLoading()
            Toast.fire({ icon: 'error', title: 'Failed to add website' })
            return false
        }
    }

    // Delete website with confirmation
    const deleteWebsite = async (id, url) => {
        const confirmed = await confirmDialog({
            title: 'Delete Website?',
            text: `Are you sure you want to remove "${url}"?`,
            confirmText: 'Yes, delete it!'
        })

        if (confirmed) {
            try {
                await deleteWebsiteApi(id)
                setBlocklist(prev => ({
                    ...prev,
                    websites: prev.websites.filter(w => w.id !== id)
                }))
                Toast.fire({ icon: 'success', title: 'Website removed!' })
            } catch (error) {
                Toast.fire({ icon: 'error', title: 'Failed to remove website' })
            }
        }
    }

    // Add program with validation
    const addProgram = async (program) => {
        if (!program.name.trim()) {
            Toast.fire({ icon: 'warning', title: 'Please enter a program name' })
            return false
        }
        if (!program.path.trim()) {
            Toast.fire({ icon: 'warning', title: 'Please enter the program path' })
            return false
        }

        try {
            showLoading('Adding program...')
            const newProgram = await addProgramApi(program)
            setBlocklist(prev => ({ ...prev, programs: [...prev.programs, newProgram] }))
            closeLoading()
            Toast.fire({ icon: 'success', title: 'Program added successfully!' })
            return true
        } catch (error) {
            closeLoading()
            Toast.fire({ icon: 'error', title: 'Failed to add program' })
            return false
        }
    }

    // Delete program with confirmation
    const deleteProgram = async (id, name) => {
        const confirmed = await confirmDialog({
            title: 'Delete Program?',
            text: `Are you sure you want to remove "${name}"?`,
            confirmText: 'Yes, delete it!'
        })

        if (confirmed) {
            try {
                await deleteProgramApi(id)
                setBlocklist(prev => ({
                    ...prev,
                    programs: prev.programs.filter(p => p.id !== id)
                }))
                Toast.fire({ icon: 'success', title: 'Program removed!' })
            } catch (error) {
                Toast.fire({ icon: 'error', title: 'Failed to remove program' })
            }
        }
    }

    // Export BAT files
    const exportBat = async () => {
        const confirmed = await showQuestion({
            title: 'Export BAT Files?',
            html: `
        <p style="color: #94a3b8;">This will generate new BAT files with version <strong style="color: #3b82f6;">${versions.currentVersion}</strong></p>
        <p style="color: #64748b; font-size: 0.875rem; margin-top: 0.5rem;">Files will be saved in server/exports folder</p>
      `
        })

        if (confirmed) {
            try {
                showLoading('Exporting...', '<p style="color: #94a3b8;">Generating BAT files...</p>')
                const data = await exportBatApi()
                await fetchData() // Refresh to get new version

                showSuccess({
                    title: 'Export Successful!',
                    html: `
            <div style="text-align: left; color: #94a3b8;">
              <p><strong style="color: #22c55e;">Version:</strong> ${data.version}</p>
              <p style="margin-top: 0.5rem;"><strong style="color: #3b82f6;">Files created:</strong></p>
              <ul style="margin-left: 1rem; margin-top: 0.25rem;">
                <li>📄 ${data.files.block}</li>
                <li>📄 ${data.files.unblock}</li>
              </ul>
            </div>
          `
                })
            } catch (error) {
                showError({
                    title: 'Export Failed!',
                    text: 'Failed to export BAT files. Please try again.'
                })
            }
        }
    }

    // Delete history with confirmation
    const deleteHistory = async (version, onPageReset) => {
        const confirmed = await confirmDialog({
            title: 'Delete Export?',
            text: `Are you sure you want to delete "${version}" and its BAT files?`,
            confirmText: 'Yes, delete!'
        })

        if (confirmed) {
            try {
                await deleteHistoryApi(version)
                setVersions(prev => ({
                    ...prev,
                    history: prev.history.filter(h => h.version !== version)
                }))
                if (onPageReset) onPageReset()
                Toast.fire({ icon: 'success', title: `Deleted ${version}!` })
            } catch (error) {
                Toast.fire({ icon: 'error', title: 'Failed to delete history' })
            }
        }
    }

    return {
        blocklist,
        versions,
        loading,
        addWebsite,
        deleteWebsite,
        addProgram,
        deleteProgram,
        exportBat,
        deleteHistory
    }
}
