import { Upload, Package } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export function ExportSection({ onExport }) {
    const { t } = useLanguage()

    return (
        <section className="glass rounded-2xl p-6 mt-6 animate-fade-in glow-green" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                        <Upload className="w-6 h-6 text-green-400" /> {t('exportTitle')}
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">
                        {t('exportDescription')}
                    </p>
                </div>
                <button
                    onClick={onExport}
                    className="px-8 py-3 rounded-xl btn-gradient font-bold text-lg text-white cursor-pointer"
                >
                    <Package className="w-5 h-5 inline mr-2" /> {t('exportButton')}
                </button>
            </div>
        </section>
    )
}

