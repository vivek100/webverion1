import React, { useEffect, useState, useRef } from 'react';
import { Send, ChevronDown, ExternalLink, Code2, Sparkles, Wrench, Rocket, ArrowLeft, Lock, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';

interface Message {
  id: string;
  project_id: string;
  sender: string;
  message: string;
  type: string;
  created_at: string;
}

interface Version {
  id: string;
  version_number: number;
  backup_dir: string;
  created_at: string;
  status: string;
}

interface UseCase {
  id: string;
  title: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  current_version_id: string;
  current_project_preview_url?: string;
}

// Add these styles to your global CSS file or component
const scrollbarStyles = `
  /* Hide default scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 transparent;

  /* Custom scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #CBD5E0;
    border-radius: 3px;
  }

  /* Hide scrollbar arrows */
  &::-webkit-scrollbar-button {
    display: none;
  }

  /* Show scrollbar on hover */
  &:hover {
    overflow-x: auto; /* Show scrollbar on hover */
  }
`;

// Add this style block at the top of your file
const styles = `
  .tabs-container {
    overflow: hidden;
  }
  
  .tabs-container:hover {
    overflow-x: auto;
  }
  
  .tabs-container {
    scrollbar-width: thin;
    scrollbar-color: #CBD5E0 transparent;
  }
  
  .tabs-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .tabs-container::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .tabs-container::-webkit-scrollbar-thumb {
    background-color: #CBD5E0;
    border-radius: 3px;
  }
  
  .tabs-container::-webkit-scrollbar-button {
    display: none;
  }
`;

const Chat = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedTab, setSelectedTab] = useState('chat');
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [projectMetadata, setProjectMetadata] = useState({ name: '', status: '' });
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [iframeUrl, setIframeUrl] = useState<string>(projectMetadata.current_project_preview_url || 'http://localhost:5173');
  const [project, setProject] = useState<Project | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Example prompts for empty state
  const examplePrompts = [
    "Create a property manager app with option to manage properties and track renters.",
    "Build an onboarding tracker for new employees.",
    "Develop a vendor manager for contracts, agreements, and lease management."
  ];
  

  useEffect(() => {
    if (projectId) {
      const initializeData = async () => {
        try {
          const projectData = await fetchProjectDetails();
          await fetchVersions(projectData);  // Pass the project data
          await fetchMessages();
          await setupWebSocket();
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      };
      
      initializeData();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [projectId]);

  const setupWebSocket = async () => {
    try {
      if (ws.current) {
        ws.current.close();
      }

      ws.current = await api.connectWebSocket(projectId || '');
      
      // Add connection event handlers
      ws.current.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Handle different message types
          if (data.type === 'status') {
            setMessages(prev => [...prev, {
              id: new Date().toISOString(),
              project_id: projectId || '',
              sender: data.sender,
              message: data.message,
              type: 'status',
              created_at: new Date().toISOString()
            }]);
          } else if (data.type === 'loading') {
            setMessages(prev => [...prev, {
              id: new Date().toISOString(),
              project_id: projectId || '',
              sender: data.sender,
              message: data.message,
              type: 'loading',
              created_at: new Date().toISOString()
            }]);
          } else if (data.type === 'error') {
            setMessages(prev => [...prev, {
              id: new Date().toISOString(),
              project_id: projectId || '',
              sender: data.sender,
              message: data.message,
              type: 'error',
              created_at: new Date().toISOString()
            }]);
          } else if (data.type === 'normal' || data.type === null) {
            setMessages(prev => [...prev, {
              id: new Date().toISOString(),
              project_id: projectId || '',
              sender: data.sender,
              message: data.message,
              type: 'normal',
              created_at: new Date().toISOString()
            }]);
          }else if (data.type === 'success') {
            setMessages(prev => [...prev, {
              id: new Date().toISOString(),
              project_id: projectId || '',
              sender: data.sender,
              message: data.message,
              type: 'success',
              created_at: new Date().toISOString()
            }]);
          }

          // Auto-scroll to bottom
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Attempt to reconnect after error
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          setupWebSocket();
        }, 3000);
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        // Only attempt to reconnect if the close wasn't intentional
        if (!event.wasClean) {
          setTimeout(() => {
            console.log('Attempting to reconnect...');
            setupWebSocket();
          }, 3000);
        }
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      // Attempt to reconnect after setup error
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        setupWebSocket();
      }, 3000);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      await setProject(response);
      setLoading(false);
      setProjectMetadata({name: response.name, status: response.status});
      
      // Set the preview URL from project data
      if (response.current_project_preview_url) {
        setPreviewUrl(response.current_project_preview_url);
        setIframeUrl(response.current_project_preview_url);
      }
      
      // Only fetch versions after project data is set
      return response;  // Return the project data
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }
  };

  const fetchVersions = async (projectData: any) => {
    try {
      const response = await api.get(`/projects/${projectId}/versions`);
      await setVersions(response.data);
      
      console.log('Project data:', projectData);
      console.log('Versions data:', response.data);
      
      // Use the passed project data instead of the state
      const currentVersion = response.data.find(
        (version: { id: string }) => version.id === projectData.current_version_id
      );
      
      if (currentVersion) {
        setSelectedVersion(currentVersion.version_number);
        await fetchUseCases(currentVersion.id);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  const fetchUseCases = async (versionId: string) => {
    try {
      const response = await api.get(`/projects/${projectId}/versions/${versionId}/use-cases`);
      console.log(response.data);
      setUseCases(response.data);
    } catch (error) {
      console.error('Error fetching use cases:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!projectId || loading) return;
    setLoading(true);

    const newMessage = {
      id: new Date().toISOString(),
      project_id: projectId,
      sender: 'User',
      message: message,
      type: 'normal',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // If it's the first message, use create endpoint
      if (messages.length === 0) {
        const result = await api.post(`/projects/${projectId}/generate`, {
          project_id: projectId,
          sender: 'user',
          message: message,
          type: 'normal'
        });
        if (result.type === 'success') {
          setIframeUrl(result.data.preview_url);
          await fetchUseCases(project?.current_version_id || '');
        }
      } else {
        // Otherwise use edit endpoint
        const result = await api.post(`/projects/${projectId}/edit`, {
          project_id: projectId,
          sender: 'user',
          message: message,
          type: 'normal'
        });
        console.log(result);
        if (result.status === 'success') {
          setUseCases(result.data.use_cases);
          setIframeUrl(result.data.preview_url);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVersionChange = async (versionId: string) => {
    setSelectedVersion(versionId);
    await fetchUseCases(versionId);
    setIsRevertModalOpen(true);
  };

  const handleRevert = async () => {
    if (!projectId || !selectedVersion) return;

    try {
      const version = versions.find(v => v.id === selectedVersion);
      if (!version) return;

      await api.post(`/projects/${projectId}/revert`, {
        project_id: projectId,
        backup_dir: version.backup_dir
      });
      setIsRevertModalOpen(false);
      // Refresh data after revert
      window.location.reload();
    } catch (error) {
      console.error('Error reverting version:', error);
    }
  };

  const copyPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleRefresh = () => {
    setIframeUrl(prevUrl => `${prevUrl}?t=${new Date().getTime()}`); // Append a timestamp to refresh
  };

  // Render tab content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'chat':
        return (
          <div className="p-4 moverflow-y-auto max-h-screen hide-scrollbar">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                hasNextMessage={index < messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        );
      
      case 'features':
        return (
          <div className="p-4 overflow-y-auto max-h-screen hide-scrollbar">
            {useCases.length > 0 ? (
              <div className="space-y-4">
                {useCases.map((useCase, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">{useCase.title}</h4>
                    <p className="text-gray-600 text-sm">{useCase.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <p>No use cases available for this version.</p>
              </div>
            )}
          </div>
        );
      
      case 'deploy':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <h3 className="text-xl font-semibold mb-4">Deploy Your Application</h3>
            <p className="text-gray-600 mb-6 text-center">
              Ready to deploy your application? Get in touch with us to discuss deployment options.
            </p>
            <a
              href="https://forms.gle/your-form-link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        );
      
      case 'settings':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-gray-600">
                Project settings and configuration options will be available soon.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {/* Add the styles */}
      <style>{styles}</style>
      
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        {/* Chat Section - 25% width */}
        <div className="w-1/4 flex flex-col h-screen">
          <Header 
            title="Chat"
          />
          
          {/* App Metadata */}
          <div className="p-4 m-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{projectMetadata.name}</h2>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {projectMetadata.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Version:</span>
                <select 
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="px-2 py-1 border rounded-md text-sm"
                >
                  {versions.map(version => (
                    <option key={version.id} value={version.id}>{version.version_number}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 border-b tabs-container">
            <div className="flex gap-4 min-w-max">
              <button
                onClick={() => setSelectedTab('chat')}
                className={`px-4 py-2 border-b-2 whitespace-nowrap ${
                  selectedTab === 'chat'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                } flex items-center gap-2`}
              >
                <Code2 className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setSelectedTab('features')}
                className={`px-4 py-2 border-b-2 whitespace-nowrap ${
                  selectedTab === 'features'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                } flex items-center gap-2`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Use Cases</span>
              </button>
              <button
                onClick={() => setSelectedTab('deploy')}
                className={`px-4 py-2 border-b-2 whitespace-nowrap ${
                  selectedTab === 'deploy'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                } flex items-center gap-2`}
              >
                <Rocket className="w-4 h-4" />
                <span>Deploy</span>
              </button>
              {/* <button
                onClick={() => setSelectedTab('settings')}
                className={`px-4 py-2 border-b-2 whitespace-nowrap ${
                  selectedTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                } flex items-center gap-2`}
              >
                <Wrench className="w-4 h-4" />
                <span>Settings</span>
              </button> */}
            </div>
          </div>

          {/* Tab Content with flex-1 to take remaining space */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {selectedTab === 'chat' ? (
              <>
                {/* Chat Messages - scrollable */}
                <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={message.id} 
                      message={message}
                      hasNextMessage={index < messages.length - 1}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input - fixed at bottom */}
                <div className="flex-shrink-0">
                  <ChatInput
                    onSend={handleSendMessage}
                    loading={loading}
                    placeholder="Describe your app or changes..."
                    inputValue={input}
                    setInputValue={setInput}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto hide-scrollbar">
                {renderTabContent()}
              </div>
            )}
          </div>
        </div>

        {/* Preview Section - 75% width */}
        <div className="w-3/4 bg-white border-l flex flex-col h-screen overflow-hidden">
          <div className="p-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <a
                  href="/dashboard"
                  className="mr-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </a>
                <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
              </div>
              {project?.current_project_preview_url && (
                <a 
                  href={project?.current_project_preview_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in New Tab</span>
                </a>
              )}
            </div>
            
            {/* URL Bar */}
            <div className="mb-0 flex items-center bg-gray-100 rounded-lg overflow-hidden border">
              <div className="flex-shrink-0 px-3 py-3 bg-gray-200 text-gray-600 border-r">
                <Lock className="w-4 h-4" />
              </div>
              <div className="px-3 py-2 flex-grow bg-gray-50 text-gray-600 text-sm font-mono">
                {iframeUrl}
              </div>
              <div className="flex-shrink-0 px-3 py-3 bg-gray-200 text-gray-600 border-l hover:bg-gray-300">
                <button onClick={handleRefresh} className="flex items-center">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Preview Content - scrollable */}
          <div className="flex-1 px-4 pb-2 overflow-hidden">
            {versions.length > 0 && versions[0].status === 'generated' ? (
              <iframe
                src={iframeUrl}
                className="w-full h-full border rounded"
                title="Live Preview"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-4">
                <h3 className="text-xl font-semibold mb-4">Start Building Your App</h3>
                <p className="text-gray-600 mb-6">
                  Describe your requirements in the chat or try one of these examples:
                </p>
                <div className="space-y-4 w-full max-w-lg">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => copyPrompt(prompt)}
                      className="block w-full p-4 text-left border rounded-lg hover:bg-gray-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revert Version Modal */}
        {isRevertModalOpen && (
          <Modal onClose={() => setIsRevertModalOpen(false)}>
            <h2 className="text-lg font-semibold">Confirm Revert</h2>
            <p className="mt-2">Are you sure you want to revert to this version? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsRevertModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRevert}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Revert
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Chat;