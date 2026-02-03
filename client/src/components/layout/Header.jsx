import { LanguageToggle } from '../common/LanguageToggle'
import { useLanguage } from '../../context/LanguageContext'

// Manual app version (separate from BAT export version)
const APP_VERSION = 'v1.0.0'

export function Header() {
    const { t } = useLanguage()

    return (
        <header className="text-center mb-8 animate-fade-in relative">
            {/* Language Toggle Button */}
            <div className="absolute top-0 right-0">
                <LanguageToggle />
            </div>

            <div className="inline-flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    {t('appTitle')}
                </h1>
            </div>
            <p className="text-slate-400 text-lg">
                {t('appSubtitle')}
            </p>
            <div className="mt-3 inline-block px-4 py-1 rounded-full bg-blue-400 text-sm font-semibold">
                {t('currentVersion')}: {APP_VERSION}
            </div>
        </header>
    )
}

