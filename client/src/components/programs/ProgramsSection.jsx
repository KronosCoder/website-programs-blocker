import { useState } from 'react'
import { Monitor, Plus } from 'lucide-react'
import { ProgramItem } from './ProgramItem'
import { ProgramModal } from './ProgramModal'
import { useLanguage } from '../../context/LanguageContext'

export function ProgramsSection({ programs, onAdd, onDelete }) {
    const [showModal, setShowModal] = useState(false)
    const { t } = useLanguage()

    return (
        <>
            <section className="glass rounded-2xl p-6 glow-purple animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-[var(--text-primary)]">
                        <Monitor className="w-6 h-6 text-purple-400" /> {t('programsToBlock')}
                    </h2>
                    <span className="px-3 py-1 rounded-full glass-button text-purple-300 text-sm border border-purple-500/20">
                        {programs.length} {t('programs')}
                    </span>
                </div>

                {/* Add Program Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full mb-4 px-4 py-2.5 rounded-xl border border-dashed border-white/10 hover:border-purple-500/50 text-slate-400 hover:text-purple-300 transition-all flex items-center justify-center gap-2 cursor-pointer glass-button"
                >
                    <Plus className="w-4 h-4" /> {t('addProgram')}
                </button>

                {/* Program List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {[...programs].reverse().map((program, index) => (
                        <ProgramItem
                            key={program.id}
                            program={program}
                            index={index}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </section>

            {/* Program Modal */}
            <ProgramModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onAdd={onAdd}
            />
        </>
    )
}

