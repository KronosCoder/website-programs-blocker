import { Trash2 } from 'lucide-react'

export function ProgramItem({ program, index, onDelete }) {
    return (
        <div
            className="flex items-center justify-between px-4 py-2.5 rounded-xl glass-item group"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-200">{program.name}</div>
                <div className="text-xs text-slate-500 truncate">{program.path}</div>
            </div>
            <button
                onClick={() => onDelete(program.id, program.name)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all ml-2"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    )
}
