const mockProjects = [
  {
    id: "project-id-1",
    name: "E-commerce Site",
    status: "Ready",
    created_at: "2024-03-10T10:00:00Z",
    current_version_id: "version-id-1",
    current_project_dir: "/projects/project-id-1",
    current_project_preview_url: "http://localhost:5173",
  },
  {
    id: "project-id-2",
    name: "Blog Platform",
    status: "Deploying",
    created_at: "2024-03-09T10:00:00Z",
    current_version_id: "version-id-2",
  },
  {
    id: "project-id-3",
    name: "Portfolio",
    status: "Created",
    created_at: "2024-03-08T10:00:00Z",
    current_version_id: "version-id-3",
  },
];

const mockMessages: { [key: string]: { id: string; sender: string; message: string; type: string; created_at: string; }[] } = {
  "project-id-1": [
    {
      id: "message-id-1",
      sender: "User",
      message: "Add a dashboard for tracking sales",
      type: "normal",
      created_at: "2024-03-10T11:00:00Z",
    },
    {
      id: "message-id-2",
      sender: "AI",
      message: "Dashboard added successfully",
      type: "success",
      created_at: "2024-03-10T11:01:00Z",
    },
  ],
  "project-id-2": [
    {
      id: "message-id-3",
      sender: "User",
      message: "Need to fix the checkout process",
      type: "normal",
      created_at: "2024-03-09T11:00:00Z",
    },
  ],
};

const mockVersions : { [key: string]: { id: string; version_number: number; backup_dir: string; created_at: string; status: string; }[] } = {
  "project-id-1": [
    {
      id: "version-id-1",
      version_number: 1,
      backup_dir: "/backups/project-id-1/version-1",
      created_at: "2024-03-10T12:00:00Z",
      status: "generated",
    },
    {
      id: "version-id-2",
      version_number: 2,
      backup_dir: "/backups/project-id-1/version-2",
      created_at: "2024-03-11T12:00:00Z",
      status: "generated",
    },
  ],
  "project-id-2": [
    {
      id: "version-id-3",
      version_number: 1,
      backup_dir: "/backups/project-id-2/version-1",
      created_at: "2024-03-09T12:00:00Z",
      status: "generated",
    },
  ],
};

const mockSettings = [
  {
    setting_key: "notification",
    setting_value: "enabled",
  },
  {
    setting_key: "subscription",
    setting_value: "pro",
  },
];

// Update mockUseCases to be version-specific
const mockUseCases: { [key: string]: { [key: string]: { id: string; title: string; description: string; }[] } } = {
  "project-id-1": {
    "version-id-1": [
      {
        id: "use-case-id-1",
        title: "Track Sales",
        description: "The app allows users to track sales data in real-time."
      },
      {
        id: "use-case-id-2",
        title: "Manage Leads",
        description: "The app includes a module for managing leads."
      }
    ],
    "version-id-2": [
      {
        id: "use-case-id-3",
        title: "Export Reports",
        description: "Users can export sales reports in various formats."
      }
    ]
  }
};

// Mock API functions
const mockAPI = {
  getProjects: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success", data: mockProjects });
      }, 500);
    });
  },

  createProject: (name: string, description: string) => {
    const newProject = {
      id: `project-id-${mockProjects.length + 1}`,
      name,
      description,
      status: "Created",
      created_at: new Date().toISOString(),
      current_version_id: `version-id-${mockProjects.length + 1}`,
    };
    mockProjects.push(newProject);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success", data: newProject });
      }, 500);
    });
  },

  deleteProject: (projectId: string) => {
    const projectIndex = mockProjects.findIndex((p) => p.id === projectId);
    if (projectIndex > -1) {
      mockProjects[projectIndex].status = "Deleted";
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: "success", message: "Project deleted successfully" });
        }, 500);
      });
    }
    return Promise.reject({ status: "error", message: "Project not found" });
  },

  getMessages: (projectId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success", data: mockMessages[projectId] || [] });
      }, 500);
    });
  },

  getVersions: (projectId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success", data: mockVersions[projectId] || [] });
      }, 500);
    });
  },

  getSettings: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: "success", data: mockSettings });
      }, 500);
    });
  },

  getProject: (projectId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = mockProjects.find(p => p.id === projectId);
        resolve({ status: "success", data: project });
      }, 500);
    });
  },

  getUseCases: (projectId: string, versionId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const projectUseCases = mockUseCases[projectId] || {};
        const versionUseCases = projectUseCases[versionId] || [];
        resolve({ status: "success", data: versionUseCases });
      }, 500);
    });
  },
};

export default mockAPI; 