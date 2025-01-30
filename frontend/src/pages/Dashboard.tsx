import React, { useEffect, useState } from 'react';
import { Plus, ExternalLink, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton'; // Import the Skeleton component

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  current_version_id: string;
  current_project_preview_url?: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(12); // Adjust as needed
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects/');
      setProjects(response);
      // Pagination logic\
      if (response.length > 0) {
        const indexOfLastProject = currentPage * projectsPerPage;
        const indexOfFirstProject = indexOfLastProject - projectsPerPage;
        setCurrentProjects(response.slice(indexOfFirstProject, indexOfLastProject));
        setTotalPages(Math.ceil(response.length / projectsPerPage));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      const response = await api.post('/projects/', {
        name: newProjectName,
        description: newProjectDescription
      });
      setIsModalOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
      await fetchProjects();
      navigate(`/chat/${response.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await api.delete(`/projects/${projectId}`);
      await fetchProjects();
      setIsDeleting(false);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleOpenChat = (projectId: string) => {
    navigate(`/chat/${projectId}`);
  };

  const handleOpenDeleteConfirmation = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleting(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setIsDeleting(false);
    setProjectToDelete(null);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard" />
      
      <main className="p-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Projects</h2>
            {loading ? ( // Show skeleton loading if loading
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} height="40px" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500">No projects found. Create your first project!</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 bg-blue-500 text-white p-2 rounded"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-100">
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                          onClick={() => handleOpenChat(project.id)}
                        >
                          {project.name}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer"
                          onClick={() => handleOpenChat(project.id)}
                        >
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${project.status === 'Ready' ? 'bg-green-100 text-green-800' : 
                              project.status === 'Deploying' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {project.status}
                          </span>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer"
                          onClick={() => handleOpenChat(project.id)}
                        >
                          {project.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleOpenChat(project.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <ExternalLink className="w-4 h-4 text-gray-500" />
                            </button>
                            <button 
                              onClick={() => handleOpenDeleteConfirmation(project.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <button 
        onClick={() => setIsModalOpen(true)} 
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        <span>New Project</span>
      </button>

      {/* Create Project Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <input 
            type="text" 
            value={newProjectName} 
            onChange={(e) => setNewProjectName(e.target.value)} 
            placeholder="Project Name" 
            className="mt-2 p-2 border rounded w-full"
          />
          <input 
            type="text" 
            value={newProjectDescription} 
            onChange={(e) => setNewProjectDescription(e.target.value)} 
            placeholder="Project Description" 
            className="mt-2 p-2 border rounded w-full"
          />
          <button 
            onClick={handleCreateProject} 
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Create
          </button>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <Modal onClose={handleCloseDeleteConfirmation}>
          <h2 className="text-lg font-semibold">Confirm Deletion</h2>
          <p>Are you sure you want to delete this project?</p>
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleCloseDeleteConfirmation} 
              className="mr-2 bg-gray-300 p-2 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleDeleteProject(projectToDelete as string)} 
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;