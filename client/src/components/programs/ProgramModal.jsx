import { useState, useRef } from 'react'
import { Monitor, Plus, FolderOpen, X } from 'lucide-react'

export function ProgramModal({ isOpen, onClose, onAdd }) {
    const [program, setProgram] = useState({ name: '', path: '', processName: '' })
    const fileInputRef = useRef(null)

    if (!isOpen) return null

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            const fileName = file.name
            const programName = fileName.replace(/\.exe$/i, '').replace(/[-_]/g, ' ')
            setProgram(prev => ({
                ...prev,
                name: prev.name || programName.charAt(0).toUpperCase() + programName.slice(1),
                processName: fileName
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await onAdd(program)
        if (success) {
            setProgram({ name: '', path: '', processName: '' })
            onClose()
        }
    }

    const handleClose = () => {
        setProgram({ name: '', path: '', processName: '' })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="relative glass rounded-2xl p-6 w-full max-w-lg mx-4 animate-fade-in glow-purple">
                {/* Close Button */}
                <button
                    onClick={handleClose}
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                            value={program.name}
                            onChange={(e) => setProgram(p => ({ ...p, name: e.target.value }))}
                            placeholder="e.g., Steam, Epic Games, Roblox"
                            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-white placeholder-slate-500"
                        />
                    </div>

                    {/* Full Path */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Full Path *</label>
                        <input
                            type="text"
                            value={program.path}
                            onChange={(e) => setProgram(p => ({ ...p, path: e.target.value }))}
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
                            value={program.processName}
                            onChange={(e) => setProgram(p => ({ ...p, processName: e.target.value }))}
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
                            onClick={handleClose}
                            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 font-semibold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
