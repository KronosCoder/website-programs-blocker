import { useState, useEffect, useRef } from 'react'
import { Globe, Monitor, Upload, ClipboardList, Trash2, Plus, Package, Download, Shield, Loader2, FolderOpen, X, ChevronLeft, ChevronRight } from 'lucide-react'
import Swal from 'sweetalert2'
import './index.css'

const API_BASE = '/api'

// SweetAlert2 Dark Theme Config
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1e293b',
  color: '#f1f5f9',
})

function App() {
  const [blocklist, setBlocklist] = useState({ websites: [], programs: [] })
  const [versions, setVersions] = useState({ currentVersion: 'v1.0.0', history: [] })
  const [newUrl, setNewUrl] = useState('')
  const [newProgram, setNewProgram] = useState({ name: '', path: '', processName: '' })
  const [loading, setLoading] = useState(true)
  const [showProgramModal, setShowProgramModal] = useState(false)
  const [historyPage, setHistoryPage] = useState(1)
  const ITEMS_PER_PAGE = 5
  const fileInputRef = useRef(null)

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [blockRes, versionRes] = await Promise.all([
        fetch(`${API_BASE}/blocklist`),
        fetch(`${API_BASE}/versions`)
      ])
      const blockData = await blockRes.json()
      const versionData = await versionRes.json()
      setBlocklist(blockData)
      setVersions(versionData)
    } catch (error) {
      Toast.fire({ icon: 'error', title: 'Failed to fetch data' })
    } finally {
      setLoading(false)
    }
  }

  // Add website with validation and loading
  const addWebsite = async (e) => {
    e.preventDefault()
    if (!newUrl.trim()) {
      Toast.fire({ icon: 'warning', title: 'Please enter a URL' })
      return
    }

    // Basic URL validation
    const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/
    const cleanUrl = newUrl.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')
    if (!urlPattern.test(cleanUrl)) {
      Toast.fire({ icon: 'warning', title: 'Please enter a valid URL' })
      return
    }

    try {
      Swal.fire({
        title: 'Adding website...',
        allowOutsideClick: false,
        showConfirmButton: false,
        background: '#1e293b',
        color: '#f1f5f9',
        didOpen: () => Swal.showLoading()
      })

      const res = await fetch(`${API_BASE}/websites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newUrl })
      })
      const website = await res.json()
      setBlocklist(prev => ({ ...prev, websites: [...prev.websites, website] }))
      setNewUrl('')

      Swal.close()
      Toast.fire({ icon: 'success', title: 'Website added successfully!' })
    } catch (error) {
      Swal.close()
      Toast.fire({ icon: 'error', title: 'Failed to add website' })
    }
  }

  // Handle file selection for program
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const fileName = file.name
      const programName = fileName.replace(/\.exe$/i, '').replace(/[-_]/g, ' ')
      setNewProgram(prev => ({
        ...prev,
        name: prev.name || programName.charAt(0).toUpperCase() + programName.slice(1),
        processName: fileName
      }))
    }
  }

  // Open program modal
  const openProgramModal = () => {
    setNewProgram({ name: '', path: '', processName: '' })
    setShowProgramModal(true)
  }

  // Close program modal
  const closeProgramModal = () => {
    setShowProgramModal(false)
    setNewProgram({ name: '', path: '', processName: '' })
  }

  // Delete website with confirmation
  const deleteWebsite = async (id, url) => {
    const result = await Swal.fire({
      title: 'Delete Website?',
      text: `Are you sure you want to remove "${url}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1e293b',
      color: '#f1f5f9',
    })

    if (result.isConfirmed) {
      try {
        await fetch(`${API_BASE}/websites/${id}`, { method: 'DELETE' })
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

  // Add program with validation and loading
  const addProgram = async (e) => {
    e.preventDefault()

    // Validation
    if (!newProgram.name.trim()) {
      Toast.fire({ icon: 'warning', title: 'Please enter a program name' })
      return
    }
    if (!newProgram.path.trim()) {
      Toast.fire({ icon: 'warning', title: 'Please enter the program path' })
      return
    }

    try {
      Swal.fire({
        title: 'Adding program...',
        allowOutsideClick: false,
        showConfirmButton: false,
        background: '#1e293b',
        color: '#f1f5f9',
        didOpen: () => Swal.showLoading()
      })

      const res = await fetch(`${API_BASE}/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram)
      })
      const program = await res.json()
      setBlocklist(prev => ({ ...prev, programs: [...prev.programs, program] }))
      closeProgramModal()

      Swal.close()
      Toast.fire({ icon: 'success', title: 'Program added successfully!' })
    } catch (error) {
      Swal.close()
      Toast.fire({ icon: 'error', title: 'Failed to add program' })
    }
  }

  // Delete program with confirmation
  const deleteProgram = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Program?',
      text: `Are you sure you want to remove "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1e293b',
      color: '#f1f5f9',
    })

    if (result.isConfirmed) {
      try {
        await fetch(`${API_BASE}/programs/${id}`, { method: 'DELETE' })
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

  // Export BAT files with confirmation and loading
  const exportBat = async () => {
    const result = await Swal.fire({
      title: 'Export BAT Files?',
      html: `
        <p style="color: #94a3b8;">This will generate new BAT files with version <strong style="color: #3b82f6;">${versions.currentVersion}</strong></p>
        <p style="color: #64748b; font-size: 0.875rem; margin-top: 0.5rem;">Files will be saved in server/exports folder</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, export!',
      cancelButtonText: 'Cancel',
      background: '#1e293b',
      color: '#f1f5f9',
    })

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Exporting...',
          html: '<p style="color: #94a3b8;">Generating BAT files...</p>',
          allowOutsideClick: false,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#f1f5f9',
          didOpen: () => Swal.showLoading()
        })

        const res = await fetch(`${API_BASE}/export`, { method: 'POST' })
        const data = await res.json()

        await fetchData() // Refresh to get new version

        Swal.fire({
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
          `,
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          background: '#1e293b',
          color: '#f1f5f9',
        })
      } catch (error) {
        Swal.fire({
          title: 'Export Failed!',
          text: 'Failed to export BAT files. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#1e293b',
          color: '#f1f5f9',
        })
      }
    }
  }

  // Delete export history with confirmation
  const deleteHistory = async (version) => {
    const result = await Swal.fire({
      title: 'Delete Export?',
      text: `Are you sure you want to delete "${version}" and its BAT files?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      background: '#1e293b',
      color: '#f1f5f9',
    })

    if (result.isConfirmed) {
      try {
        await fetch(`${API_BASE}/history/${version}`, { method: 'DELETE' })
        setVersions(prev => ({
          ...prev,
          history: prev.history.filter(h => h.version !== version)
        }))
        // Reset page if needed
        const newTotal = versions.history.length - 1
        const maxPage = Math.ceil(newTotal / ITEMS_PER_PAGE)
        if (historyPage > maxPage && maxPage > 0) {
          setHistoryPage(maxPage)
        }
        Toast.fire({ icon: 'success', title: `Deleted ${version}!` })
      } catch (error) {
        Toast.fire({ icon: 'error', title: 'Failed to delete history' })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-400 animate-pulse-soft">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center items-center">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-4">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Game Blocker Manager
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Manage blocked websites & programs • By KronosCoder
          </p>
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-blue-400 text-sm font-semibold">
            Current Version: {versions.currentVersion}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Websites Section */}
          <section className="glass rounded-2xl p-6 glow-blue animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="w-6 h-6 text-blue-400" /> Websites to Block
              </h2>
              <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-sm">
                {blocklist.websites.length} sites
              </span>
            </div>

            {/* Add URL Form */}
            <form onSubmit={addWebsite} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter URL (e.g., games.com)"
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-400 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 font-semibold btn-hover flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>

            {/* Website List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {blocklist.websites.map((site, index) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/50 transition-all group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span className="text-slate-300 truncate">{site.url}</span>
                  <button
                    onClick={() => deleteWebsite(site.id, site.url)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Programs Section */}
          <section className="glass rounded-2xl p-6 glow-purple animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Monitor className="w-6 h-6 text-purple-400" /> Programs to Block
              </h2>
              <span className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 text-sm">
                {blocklist.programs.length} programs
              </span>
            </div>

            {/* Add Program Button */}
            <button
              onClick={openProgramModal}
              className="w-full mb-4 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-600 hover:border-purple-500 text-slate-400 hover:text-purple-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Program
            </button>

            {/* Program List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {blocklist.programs.map((program, index) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/50 transition-all group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-200">{program.name}</div>
                    <div className="text-xs text-slate-500 truncate">{program.path}</div>
                  </div>
                  <button
                    onClick={() => deleteProgram(program.id, program.name)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Export Section */}
        <section className="glass rounded-2xl p-6 mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="w-6 h-6 text-green-400" /> Export BAT Files
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Generate block_games.bat and unblock_games.bat with current settings
              </p>
            </div>
            <button
              onClick={exportBat}
              className="px-8 py-3 rounded-xl bg-green-400 font-bold text-lg cursor-pointer hover:scale-105 transition-all"
            >
              <Package className="w-5 h-5 inline mr-2" /> Export BAT Files
            </button>
          </div>
        </section>

        {/* Export History */}
        {versions.history && versions.history.length > 0 && (
          <section className="glass rounded-2xl p-6 mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-blue-400" /> Export History
              </h2>
              <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm">
                {versions.history.length} exports
              </span>
            </div>

            {/* History List with Pagination */}
            <div className="space-y-2">
              {versions.history
                .slice((historyPage - 1) * ITEMS_PER_PAGE, historyPage * ITEMS_PER_PAGE)
                .map((item, index) => (
                  <div
                    key={item.version}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/40 group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 font-mono text-sm">
                        {item.version}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {new Date(item.date).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`${API_BASE}/download/${item.blockFile}`}
                        className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-blue-600 text-sm transition-all flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Block
                      </a>
                      <a
                        href={`${API_BASE}/download/${item.unblockFile}`}
                        className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-green-600 text-sm transition-all flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> Unblock
                      </a>
                      <button
                        onClick={() => deleteHistory(item.version)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete this export"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {versions.history.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                  disabled={historyPage === 1}
                  className={`p-2 rounded-lg transition-all ${historyPage === 1
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-400 text-sm">
                  Page {historyPage} of {Math.ceil(versions.history.length / ITEMS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setHistoryPage(prev => Math.min(prev + 1, Math.ceil(versions.history.length / ITEMS_PER_PAGE)))}
                  disabled={historyPage >= Math.ceil(versions.history.length / ITEMS_PER_PAGE)}
                  className={`p-2 rounded-lg transition-all ${historyPage >= Math.ceil(versions.history.length / ITEMS_PER_PAGE)
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p className="flex items-center justify-center gap-2"><Shield className="w-4 h-4" /> Game Blocker Manager • Built with React + Express</p>
        </footer>
      </div>

      {/* Program Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeProgramModal}
          />

          {/* Modal Content */}
          <div className="relative glass rounded-2xl p-6 w-full max-w-lg mx-4 animate-fade-in glow-purple">
            {/* Close Button */}
            <button
              onClick={closeProgramModal}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Add Program to Block</h2>
            </div>

            {/* Form */}
            <form onSubmit={addProgram} className="space-y-4">
              {/* File Picker */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Select Program (optional)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".exe"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-600 hover:border-purple-500 text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FolderOpen className="w-5 h-5 text-purple-400" />
                  Browse for .exe file
                </button>
                <p className="text-xs text-slate-500 mt-1">
                  Note: Due to browser security, you'll need to enter the full path manually below
                </p>
              </div>

              {/* Program Name */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Program Name *</label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Steam, Epic Games, Roblox"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white placeholder-slate-500"
                />
              </div>

              {/* Full Path */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Full Path *</label>
                <input
                  type="text"
                  value={newProgram.path}
                  onChange={(e) => setNewProgram(p => ({ ...p, path: e.target.value }))}
                  placeholder="e.g., C:\Program Files\Steam\steam.exe"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white placeholder-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Tip: Use %LOCALAPPDATA% or %ProgramFiles% for system paths
                </p>
              </div>

              {/* Process Name */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Process Name (auto-detected)</label>
                <input
                  type="text"
                  value={newProgram.processName}
                  onChange={(e) => setNewProgram(p => ({ ...p, processName: e.target.value }))}
                  placeholder="e.g., steam.exe (auto-detected from file)"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white placeholder-slate-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 font-semibold btn-hover cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Program
                </button>
                <button
                  type="button"
                  onClick={closeProgramModal}
                  className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
