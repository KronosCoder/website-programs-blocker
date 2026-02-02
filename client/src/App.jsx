import { useBlocklist } from './hooks/useBlocklist'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { WebsitesSection } from './components/websites/WebsitesSection'
import { ProgramsSection } from './components/programs/ProgramsSection'
import { ExportSection } from './components/export/ExportSection'
import { ExportHistory } from './components/export/ExportHistory'
import './index.css'

function App() {
  const {
    blocklist,
    versions,
    loading,
    addWebsite,
    deleteWebsite,
    addProgram,
    deleteProgram,
    exportBat,
    deleteHistory
  } = useBlocklist()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center items-center">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-4">
        {/* Header */}
        <Header currentVersion={versions.currentVersion} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WebsitesSection
            websites={blocklist.websites}
            onAdd={addWebsite}
            onDelete={deleteWebsite}
          />
          <ProgramsSection
            programs={blocklist.programs}
            onAdd={addProgram}
            onDelete={deleteProgram}
          />
        </div>

        {/* Export Section */}
        <ExportSection onExport={exportBat} />

        {/* Export History */}
        <ExportHistory
          history={versions.history}
          onDelete={deleteHistory}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default App
