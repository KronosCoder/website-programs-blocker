import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-700">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'}`}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-slate-400 text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage >= totalPages
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'}`}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    )
}
