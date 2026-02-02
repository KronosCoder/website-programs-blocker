import { Shield } from 'lucide-react'

export function Footer() {
    return (
        <footer className="text-center mt-8 text-slate-500 text-sm">
            <p className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" /> Game Blocker Manager • Built with React + Express
            </p>
        </footer>
    )
}
