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

export function useBlocklist(t) {
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
            Toast.fire({ icon: 'error', title: t('failedToFetchData') })
        } finally {
            setLoading(false)
        }
    }

    // Add website with validation
    const addWebsite = async (url) => {
        if (!url.trim()) {
            Toast.fire({ icon: 'warning', title: t('pleaseEnterUrl') })
            return false
        }

        // Basic URL validation - supports subdomains like th.y8.com
        const urlPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
        const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '').replace(/\/.*$/, '')
        if (!urlPattern.test(cleanUrl)) {
            Toast.fire({ icon: 'warning', title: t('pleaseEnterValidUrl') })
            return false
        }

        // Check if website already exists
        const exists = blocklist.websites.some(w => w.url.toLowerCase() === cleanUrl.toLowerCase())
        if (exists) {
            Toast.fire({ icon: 'warning', title: t('websiteAlreadyExists') })
            return false
        }

        try {
            showLoading(t('addingWebsite'))
            const website = await addWebsiteApi(url)
            setBlocklist(prev => ({ ...prev, websites: [...prev.websites, website] }))
            closeLoading()
            Toast.fire({ icon: 'success', title: t('websiteAddedSuccess') })
            return true
        } catch (error) {
            closeLoading()
            Toast.fire({ icon: 'error', title: t('failedToAddWebsite') })
            return false
        }
    }

    // Delete website with confirmation
    const deleteWebsite = async (id, url) => {
        const confirmed = await confirmDialog({
            title: t('deleteWebsiteTitle'),
            text: `${t('deleteWebsiteText')} "${url}"?`,
            confirmText: t('yesDeleteIt'),
            cancelText: t('cancel')
        })

        if (confirmed) {
            try {
                await deleteWebsiteApi(id)
                setBlocklist(prev => ({
                    ...prev,
                    websites: prev.websites.filter(w => w.id !== id)
                }))
                Toast.fire({ icon: 'success', title: t('websiteRemoved') })
            } catch (error) {
                Toast.fire({ icon: 'error', title: t('failedToRemoveWebsite') })
            }
        }
    }

    // Add program with validation
    const addProgram = async (program) => {
        if (!program.name.trim()) {
            Toast.fire({ icon: 'warning', title: t('pleaseEnterProgramName') })
            return false
        }
        if (!program.path.trim()) {
            Toast.fire({ icon: 'warning', title: t('pleaseEnterProgramPath') })
            return false
        }

        // Check if program already exists (by name or path)
        const existsByName = blocklist.programs.some(p => p.name.toLowerCase() === program.name.trim().toLowerCase())
        const existsByPath = blocklist.programs.some(p => p.path.toLowerCase() === program.path.trim().toLowerCase())
        if (existsByName) {
            Toast.fire({ icon: 'warning', title: t('programNameExists') })
            return false
        }
        if (existsByPath) {
            Toast.fire({ icon: 'warning', title: t('programPathExists') })
            return false
        }

        try {
            showLoading(t('addingProgram'))
            const newProgram = await addProgramApi(program)
            setBlocklist(prev => ({ ...prev, programs: [...prev.programs, newProgram] }))
            closeLoading()
            Toast.fire({ icon: 'success', title: t('programAddedSuccess') })
            return true
        } catch (error) {
            closeLoading()
            Toast.fire({ icon: 'error', title: t('failedToAddProgram') })
            return false
        }
    }

    // Delete program with confirmation
    const deleteProgram = async (id, name) => {
        const confirmed = await confirmDialog({
            title: t('deleteProgramTitle'),
            text: `${t('deleteWebsiteText')} "${name}"?`,
            confirmText: t('yesDeleteIt'),
            cancelText: t('cancel')
        })

        if (confirmed) {
            try {
                await deleteProgramApi(id)
                setBlocklist(prev => ({
                    ...prev,
                    programs: prev.programs.filter(p => p.id !== id)
                }))
                Toast.fire({ icon: 'success', title: t('programRemoved') })
            } catch (error) {
                Toast.fire({ icon: 'error', title: t('failedToRemoveProgram') })
            }
        }
    }

    // Export BAT files
    const exportBat = async () => {
        const confirmed = await showQuestion({
            title: t('exportBatTitle'),
            html: `
        <p style="color: #94a3b8;">${t('exportBatText')} <strong style="color: #3b82f6;">${versions.currentVersion}</strong></p>
        <p style="color: #64748b; font-size: 0.875rem; margin-top: 0.5rem;">${t('exportBatNote')}</p>
      `,
            confirmText: t('yesExport'),
            cancelText: t('cancel')
        })

        if (confirmed) {
            try {
                showLoading(t('exporting'), `<p style="color: #94a3b8;">${t('generatingBat')}</p>`)
                const data = await exportBatApi()
                await fetchData() // Refresh to get new version

                showSuccess({
                    title: t('exportSuccess'),
                    html: `
            <div style="text-align: left; color: #94a3b8;">
              <p><strong style="color: #22c55e;">${t('version')}:</strong> ${data.version}</p>
              <p style="margin-top: 0.5rem;"><strong style="color: #3b82f6;">${t('filesCreated')}:</strong></p>
              <ul style="margin-left: 1rem; margin-top: 0.25rem;">
                <li>📄 ${data.files.block}</li>
                <li>📄 ${data.files.unblock}</li>
              </ul>
            </div>
          `
                })
            } catch (error) {
                showError({
                    title: t('exportFailed'),
                    text: t('exportFailedText')
                })
            }
        }
    }

    // Delete history with confirmation
    const deleteHistory = async (version, onPageReset) => {
        const confirmed = await confirmDialog({
            title: t('deleteExportTitle'),
            text: `${t('deleteExportText')} "${version}" ${t('andItsBat Files')}`,
            confirmText: t('yesDelete'),
            cancelText: t('cancel')
        })

        if (confirmed) {
            try {
                await deleteHistoryApi(version)
                setVersions(prev => ({
                    ...prev,
                    history: prev.history.filter(h => h.version !== version)
                }))
                if (onPageReset) onPageReset()
                Toast.fire({ icon: 'success', title: `${t('deleted')} ${version}!` })
            } catch (error) {
                Toast.fire({ icon: 'error', title: t('failedToDeleteHistory') })
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

