import { useState } from 'react'
import { Globe, Plus } from 'lucide-react'
import { WebsiteItem } from './WebsiteItem'

export function WebsitesSection({ websites, onAdd, onDelete }) {
    const [newUrl, setNewUrl] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await onAdd(newUrl)
        if (success) setNewUrl('')
    }

    return (
        <section className="glass rounded-2xl p-6 glow-blue animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-400" /> Websites to Block
                </h2>
                <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 text-sm">
                    {websites.length} sites
                </span>
            </div>

            {/* Add URL Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
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
                {websites.map((site, index) => (
                    <WebsiteItem
                        key={site.id}
                        site={site}
                        index={index}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </section>
    )
}
