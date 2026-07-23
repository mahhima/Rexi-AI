import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronRight, FiFolder, FiFile } from 'react-icons/fi'
import type { FileNode } from '../../data/mockFileTree'

const langColors: Record<string, string> = {
  ts: 'text-blue-400',
  tsx: 'text-sky-400',
  js: 'text-yellow-400',
  json: 'text-green-400',
  sql: 'text-orange-400',
  docker: 'text-cyan-400',
}

interface FileTreeNodeProps {
  node: FileNode
  depth: number
  selectedId: string | null
  onSelect: (id: string) => void
}

function FileTreeNode({ node, depth, selectedId, onSelect }: FileTreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 1)
  const isFolder = node.type === 'folder'
  const isSelected = selectedId === node.id
  const color = node.lang ? langColors[node.lang] ?? 'text-text-secondary' : 'text-text-secondary'

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setExpanded((v) => !v)
          else onSelect(node.id)
        }}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={`w-full flex items-center gap-1.5 py-1 pr-3 rounded-md text-left transition-colors duration-100 group
          ${isSelected ? 'bg-accent/15 text-accent-light' : 'hover:bg-white/4 text-text-secondary hover:text-text-primary'}`}
      >
        {isFolder ? (
          <>
            <motion.span
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="shrink-0 text-text-secondary/40"
            >
              <FiChevronRight size={11} />
            </motion.span>
            <FiFolder size={12} className="shrink-0 text-yellow-500/70" />
          </>
        ) : (
          <>
            <span className="w-[11px] shrink-0" />
            <FiFile size={12} className={`shrink-0 ${color}`} />
          </>
        )}
        <span className="text-[11px] truncate">{node.name}</span>
      </button>

      <AnimatePresence initial={false}>
        {isFolder && expanded && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileTreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface FileTreeProps {
  nodes: FileNode[]
}

export default function FileTree({ nodes }: FileTreeProps) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="py-1">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedId={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  )
}
