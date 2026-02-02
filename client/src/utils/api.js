// API Base URL
export const API_BASE = '/api'

// Fetch blocklist data
export const fetchBlocklist = async () => {
    const res = await fetch(`${API_BASE}/blocklist`)
    return res.json()
}

// Fetch versions data
export const fetchVersions = async () => {
    const res = await fetch(`${API_BASE}/versions`)
    return res.json()
}

// Add website
export const addWebsiteApi = async (url) => {
    const res = await fetch(`${API_BASE}/websites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    })
    return res.json()
}

// Delete website
export const deleteWebsiteApi = async (id) => {
    await fetch(`${API_BASE}/websites/${id}`, { method: 'DELETE' })
}

// Add program
export const addProgramApi = async (program) => {
    const res = await fetch(`${API_BASE}/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(program)
    })
    return res.json()
}

// Delete program
export const deleteProgramApi = async (id) => {
    await fetch(`${API_BASE}/programs/${id}`, { method: 'DELETE' })
}

// Export BAT files
export const exportBatApi = async () => {
    const res = await fetch(`${API_BASE}/export`, { method: 'POST' })
    return res.json()
}

// Delete history
export const deleteHistoryApi = async (version) => {
    await fetch(`${API_BASE}/history/${version}`, { method: 'DELETE' })
}
