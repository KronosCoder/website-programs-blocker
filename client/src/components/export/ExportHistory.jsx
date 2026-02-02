import { useState } from 'react'
import { ClipboardList, Download, Trash2 } from 'lucide-react'
import { Pagination } from '../common/Pagination'
import { API_BASE } from '../../utils/api'

const ITEMS_PER_PAGE = 5

export function ExportHistory({ history, onDelete }) {
    const [page, setPage] = useState(1)

    if (!history || history.length === 0) return null

    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE)
    const paginatedHistory = history.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const handleDelete = (version) => {
        const newTotal = history.length - 1
        const maxPage = Math.ceil(newTotal / ITEMS_PER_PAGE)
        onDelete(version, () => {
            if (page > maxPage && maxPage > 0) {
                setPage(maxPage)
            }
        })
    }

    return (
        <section className="glass rounded-2xl p-6 mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-blue-400" /> Export History
                </h2>
                <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm">
                    {history.length} exports
                </span>
            </div>

            {/* History List */}
            <div className="space-y-2">
                {paginatedHistory.map((item) => (
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
                                onClick={() => handleDelete(item.version)}
                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Delete this export"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </section>
    )
}
