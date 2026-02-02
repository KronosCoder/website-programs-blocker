export function Header({ currentVersion }) {
    return (
        <header className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Game Blocker Manager
                </h1>
            </div>
            <p className="text-slate-400 text-lg">
                Manage blocked websites & programs • By KronosCoder
            </p>
            <div className="mt-3 inline-block px-4 py-1 rounded-full bg-blue-400 text-sm font-semibold">
                Current Version: {currentVersion}
            </div>
        </header>
    )
}
