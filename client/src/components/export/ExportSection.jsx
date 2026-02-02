import { Upload, Package } from 'lucide-react'

export function ExportSection({ onExport }) {
    return (
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
                    onClick={onExport}
                    className="px-8 py-3 rounded-xl bg-green-400 font-bold text-lg cursor-pointer hover:scale-105 transition-all"
                >
                    <Package className="w-5 h-5 inline mr-2" /> Export BAT Files
                </button>
            </div>
        </section>
    )
}
