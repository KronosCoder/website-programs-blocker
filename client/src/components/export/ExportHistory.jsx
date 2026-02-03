import { useState } from 'react'
import { ClipboardList, Download, Trash2 } from 'lucide-react'
import { Pagination } from '../common/Pagination'
import { API_BASE } from '../../utils/api'
import { useLanguage } from '../../context/LanguageContext'

const ITEMS_PER_PAGE = 5

export function ExportHistory({ history, onDelete }) {
    const [page, setPage] = useState(1)
    const { t, language } = useLanguage()

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
                <h2 className="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                    <ClipboardList className="w-6 h-6 text-blue-400" /> {t('exportHistory')}
                </h2>
                <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm">
                    {history.length} {t('exports')}
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
                            <span className="text-[var(--text-secondary)] text-sm">
                                {new Date(item.date).toLocaleString(language === 'th' ? 'th-TH' : 'en-US')}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    // Download both files as a zip
                                    const link = document.createElement('a')
                                    link.href = `${API_BASE}/download-zip/${item.version}`
                                    link.download = `game_blocker_${item.version}.zip`
                                    link.click()
                                }}
                                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/20 text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5" /> {t('download')}
                            </button>
                            <button
                                onClick={() => handleDelete(item.version)}
                                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                title={t('delete')}
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

