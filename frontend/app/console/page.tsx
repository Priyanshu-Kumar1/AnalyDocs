'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus } from 'lucide-react'

import Image from 'next/image'

import './console.css'
import { Sun, Moon } from 'react-feather'

interface Project {
  name: string;
  context: string;
  start: string;
  end: string;
}

// Extend the Window interface to include createProject, now expecting FormData
declare global {
  interface Window {
    createProject: (formData: FormData) => Promise<Project>;
    // getProjects should return a Promise that gives an json to print in console
    getProjects: () => Promise<Project[]>;
  }
}


export default function ProjectPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isDark, setIsDark] = useState(false)

  // State to hold the selected files for upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Specify File[] type
  // Ref for the hidden file input to programmatically trigger it
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const isDarkMode = savedTheme === 'dark'
    setIsDark(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)

    const projectmanager = document.createElement('script')
    projectmanager.src = '/utils/projectmanager.js'
    projectmanager.async = true
    document.body.appendChild(projectmanager)

    projectmanager.onload = () => {
      window.getProjects()
    .then(projects => {
      console.log('Fetched projects:', projects);
      setProjects(projects);
    })
    .catch(error => {
      console.error('Error fetching projects:', error);
    });
    };

    

  }, [])

  // Function to handle file selection from input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files)); // Convert FileList to Array
    }
  };

  // Function to trigger click on hidden file input when the div is clicked
  const handleDragDropAreaClick = () => {
    fileInputRef.current?.click(); // Use optional chaining in case ref is null
  };

  // NEW: Handle file drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default behavior (e.g., opening file in browser)
    e.stopPropagation();
    // Optional: Add visual feedback like changing border color
    // e.currentTarget.classList.add('border-blue-500');
  };

  // NEW: Handle file drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation();
    // Optional: Remove visual feedback
    // e.currentTarget.classList.remove('border-blue-500');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData(); // Clear the data transfer after successful drop
    }
  };


  const handleCreateProject = () => {
    const name = (document.getElementById('project-name') as HTMLInputElement).value.trim()
    const data_context = (document.getElementById('data-context') as HTMLTextAreaElement).value.trim()
    const data_file = (document.getElementById('data-file') as HTMLInputElement).value.trim()
    const date_from = (document.getElementById('start-date') as HTMLInputElement).value
    const date_to = (document.getElementById('end-date') as HTMLInputElement).value

    if (!name) {
      alert('Please fill name field.')
      return
    }
    if (!data_context) {
      alert('Please fill data context field.')
      return
    }
    if (!data_file) {
      alert('Please select at least one file.')
      return
    }
    if (!date_from || !date_to) {
      alert('Please select a valid date range.')
      return
    }

    // New: Create FormData object to include files
    const formData = new FormData();
    formData.append('name', name);
    formData.append('data_context', data_context);
    formData.append('date_from', date_from);
    formData.append('date_to', date_to);

    // Append each selected file
    selectedFiles.forEach(file => {
      formData.append('file', file); // 'file' should match your Django backend's field name for the file(s)
    });

    // Call the global createProject function defined in projectmanager.js
    // Now passing FormData instead of a plain object
    window.createProject(formData)
      .then((newProject: Project) => {
        setProjects(prev => [...prev, newProject])
        setShowDialog(false)
        setSelectedFiles([]);
      })
  }

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', newTheme);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-10 py-6 main-body">
      {/* Navbar */}
      <header>
        <a href="#" className="logo">
          <Image
            src={isDark ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'}
            id="logo"
            alt="AnalyDocs Logo"
            width={77}
            height={45}
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
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}>
              <div className="space-y-4">
                {/* Project Name */}
                <div>
                  <label htmlFor="project-name" className="block font-medium mb-1">Project Name</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="e.g. Market Analysis Q2"
                    id="project-name"
                    name='project-name'
                  />
                </div>

                {/* Data Context */}
                <div>
                  <label htmlFor="data-context" className="block font-medium mb-1">Data Context</label>
                  <textarea
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Describe what the data represents..."
                    id="data-context"
                    name='data_context'
                  />
                </div>

                {/* File Upload (Drag + Drop area) */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 cursor-pointer transition"
                  onClick={handleDragDropAreaClick} // Click handler for the div
                  onDragOver={handleDragOver} // NEW: Add drag over handler
                  onDrop={handleDrop} // NEW: Add drop handler
                >
                  <p className="text-sm text-gray-600">Drag & drop your files here, or click to upload.</p>
                  <input
                    type="file"
                    id="data-file"
                    multiple
                    className="hidden"
                    ref={fileInputRef} // Assign ref to the input
                    onChange={handleFileInputChange} // Changed function name
                    name='files' // Add name for FormData
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" // Optional: specify accepted file types
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>Selected Files:</p>
                      <ul className="list-disc list-inside">
                        {selectedFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Time Frame */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="start-date" className="block font-medium mb-1">From</label>
                    <input type="date" className="w-full border px-3 py-2 rounded" id="start-date" name='date_from' />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="end-date" className="block font-medium mb-1">To</label>
                    <input type="date" className="w-full border px-3 py-2 rounded" id="end-date" name='date_to' />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button" // Change to type="button" to prevent form submission
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>

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