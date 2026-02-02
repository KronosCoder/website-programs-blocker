import { Trash2 } from 'lucide-react'

export function WebsiteItem({ site, index, onDelete }) {
    return (
        <div
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/50 transition-all group"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <span className="text-slate-300 truncate">{site.url}</span>
            <button
                onClick={() => onDelete(site.id, site.url)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
