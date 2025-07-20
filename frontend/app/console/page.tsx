'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

import './console.css'
import { Sun, Moon } from 'react-feather'

interface Project {
  name: string;
  context: string;
  start: string;
  end: string;
}


export default function ProjectPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const isDarkMode = savedTheme === 'dark'
    setIsDark(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.body.classList.toggle('dark', newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  const handleCreateProject = () => {
    const name = (document.getElementById('project-name') as HTMLInputElement).value.trim()
    const context = (document.getElementById('data-context') as HTMLTextAreaElement).value.trim()
    const start = (document.getElementById('start-date') as HTMLInputElement).value
    const end = (document.getElementById('end-date') as HTMLInputElement).value

    if (!name || !context || !start || !end) {
      alert('Please fill all fields.')
      return
    }

    setProjects([...projects, { name, context, start, end }])
    setShowDialog(false)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-10 py-6 main-body">
      {/* Navbar */}
      <header>
        <a href="#" className="logo">
          <img
            src={isDark ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'}
            id="logo"
            alt="AnalyDocs Logo"
          />
        </a>
        <nav>
            <button
                className="create-project-btn"
                onClick={() => setShowDialog(true)}
                title="Create New Project"
              >
                <Plus size={16} />
                Create Project
              </button>

          <button className="dark-toggle" onClick={toggleTheme} title="Toggle Theme">
            {isDark ? <Sun /> : <Moon />}
          </button>
        </nav>
      </header>

      <div className="flex flex-wrap gap-6 mx-10 my-10">
        {projects.length === 0 ? (
          <div className="w-full text-center text-gray-500 relative no-project-div">
            <p className="text-lg">You have no projects yet. Create one!</p>
            <div className="arrow">
              <svg
                className="text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 13l-5 5-5-5" />
              </svg>
            </div>
          </div>
        ) : (
          projects.map((proj, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 shadow hover:shadow-md transition w-[250px] bg-gray-50"
            >
              <h2 className="font-semibold text-lg">{proj.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{proj.context}</p>
              <p className="text-xs text-gray-400">
                {proj.start} → {proj.end}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[90%] max-w-xl rounded-lg shadow-lg p-6 relative">
            <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>

            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="e.g. Market Analysis Q2"
                  id="project-name"
                />
              </div>

              {/* Data Context */}
              <div>
                <label className="block font-medium mb-1">Data Context</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Describe what the data represents..."
                  id="data-context"
                />
              </div>

              {/* File Upload (Drag + Drop area) */}
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 cursor-pointer transition">
                <p className="text-sm text-gray-600">Drag & drop your files here, or click to upload.</p>
                <input type="file" id="file-upload" multiple className="hidden" />
              </div>

              {/* Time Frame */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">From</label>
                  <input type="date" className="w-full border px-3 py-2 rounded" id="start-date" />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">To</label>
                  <input type="date" className="w-full border px-3 py-2 rounded" id="end-date" />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>

            {/* Close X */}
            <button
              className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-gray-700"
              onClick={() => setShowDialog(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
