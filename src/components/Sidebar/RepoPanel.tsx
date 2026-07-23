import { useState } from 'react'
import { FiGitBranch, FiShare2, FiSearch, FiRefreshCw } from 'react-icons/fi'
import FileTree from './FileTree'
import { mockFileTree } from '../../data/mockFileTree'

type Tab = 'files' | 'graph'

const statusConfig = {
  indexed: { label: 'Indexed', dot: 'bg-green-400', text: 'text-green-400' },
  indexing: { label: 'Indexing…', dot: 'bg-yellow-400 animate-pulse', text: 'text-yellow-400' },
  'not-connected': { label: 'Not connected', dot: 'bg-white/20', text: 'text-text-secondary' },
}

interface RepoPanelProps {
  repoName: string
  status: keyof typeof statusConfig
}

export default function RepoPanel({ repoName, status }: RepoPanelProps) {
  const [tab, setTab] = useState<Tab>('files')
  const [search, setSearch] = useState('')
  const cfg = statusConfig[status]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-white/6 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <FiGitBranch size={13} className="text-text-secondary/60" />
            <span className="text-sm font-semibold text-text-primary truncate">{repoName}</span>
          </div>
          <button className="text-text-secondary/40 hover:text-text-secondary transition-colors" aria-label="Refresh">
            <FiRefreshCw size={12} />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className={`text-[10px] font-medium ${cfg.text}`}>{cfg.label}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/6 shrink-0">
        {([['files', 'Repository'], ['graph', 'Dep. Graph']] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium border-b-2 transition-colors
              ${tab === id
                ? 'border-accent text-accent-light'
                : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          >
            {id === 'files' ? <FiSearch size={11} /> : <FiShare2 size={11} />}
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'files' ? (
          <>
            {/* Search */}
            <div className="px-3 py-2.5 border-b border-white/5 sticky top-0 bg-surface/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/6">
                <FiSearch size={11} className="text-text-secondary/50 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter files…"
                  className="flex-1 bg-transparent text-[11px] text-text-primary placeholder:text-text-secondary/40 outline-none"
                />
              </div>
            </div>
            <FileTree nodes={mockFileTree} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-12">
            <div className="w-12 h-12 rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center">
              <FiShare2 size={20} className="text-text-secondary/40" />
            </div>
            <p className="text-sm text-text-secondary">Dependency graph</p>
            <p className="text-[11px] text-text-secondary/50 max-w-[180px]">
              Visual dependency mapping coming in Phase 2.
            </p>
            <button className="mt-1 px-3 py-1.5 text-[11px] rounded-lg border border-white/8 text-text-secondary hover:text-text-primary hover:border-white/15 transition-colors">
              Join waitlist
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
