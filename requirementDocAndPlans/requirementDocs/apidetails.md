Here’s the **detailed API design** for the application we are using fastapi for the backend and supabase for the database and auth. And webscoket for the chat real time updates.

---

### **General Notes**
1. **Authentication**:
   - Authentication is handled on the frontend using Supabase JS.
   - The backend requires the Supabase Auth token (`Authorization: Bearer <token>`) in headers.
   - The token is verified on the backend to ensure the user is authorized.

2. **Status Codes**:
   - `200 OK`: Successful operation.
   - `400 Bad Request`: Invalid input.
   - `401 Unauthorized`: Missing or invalid auth token.
   - `403 Forbidden`: Access to a resource is denied.
   - `404 Not Found`: Resource not found.
   - `500 Internal Server Error`: Server issues.

---

### **Endpoints**

#### **1. Authentication**

No backend authentication endpoints are required because Supabase JS handles this on the frontend.

---

#### **2. Projects**

##### **2.1 `GET /projects`**
- **Description**: Fetch all projects created by the authenticated user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Request Parameters**: None.
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "project-id-1",
        "name": "Expense Tracker",
        "status": "Ready",
        "created_at": "2025-01-01T10:00:00Z",
        "current_version_id": "version-id-1"
      },
      {
        "id": "project-id-2",
        "name": "CRM App",
        "status": "Created",
        "created_at": "2025-01-05T10:00:00Z",
        "current_version_id": "version-id-2"
      }
    ]
  }
  ```

---

##### **2.2 `POST /projects`**
- **Description**: Create a new project.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "name": "CRM App",
    "description": "A CRM app for managing leads and customers"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "project-id-1",
      "name": "CRM App",
      "description": "A CRM app for managing leads and customers",
      "status": "Created",
      "created_at": "2025-01-01T10:00:00Z"
    }
  }
  ```
- **Note**: 
  - Make sure to create an entry in the versions table and update the current_version_id to the new version id after the app is created
  - only fetch the projects that are created by the user and the status is not "Deleted"

---

##### **2.3 `DELETE /projects/{project_id}`**
- **Description**: Delete a project created by the authenticated user.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Path Parameters**:
  - `project_id`: The ID of the project to delete.
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Project deleted successfully"
  }
  ```
- **Note**: 
  - Just update the status of the project to "Deleted"
  - User can only delete their own projects

---

#### **3. Chat Messages**

##### **3.1 `GET /projects/{project_id}/messages`**
- **Description**: Fetch chat messages for a project.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Path Parameters**:
  - `project_id`: The ID of the project.
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "message-id-1",
        "sender": "User",
        "message": "Add a dashboard for tracking sales",
        "type": "normal",
        "created_at": "2025-01-01T11:00:00Z"
      },
      {
        "id": "message-id-2",
        "sender": "AI",
        "message": "Dashboard added successfully",
        "type": "success",
        "created_at": "2025-01-01T11:01:00Z"
      }
    ]
  }
  ```

---

#### **4. App Versions**

##### **4.1 `GET /projects/{project_id}/versions`**
- **Description**: Fetch all versions of an app for a project.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Path Parameters**:
  - `project_id`: The ID of the project.
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "version-id-1",
        "version_number": 1,
        "backup_dir": "/backups/project-id-1/version-1",
        "created_at": "2025-01-01T12:00:00Z",
        "status": "generated"
      },
      {
        "id": "version-id-2",
        "version_number": 2,
        "backup_dir": "/backups/project-id-1/version-2",
        "created_at": "2025-01-02T12:00:00Z",
        "status": "generated"
      }
    ]
  }
  ```
- **Note**: 
  - only fetch the versions that are created by the user and the status is not "Deleted"
---

##### **4.2 `POST /projects/{project_id}/revert`**
- **Description**: Revert to a specific version of the app.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Request Body**:
  ```json
  {
    "backup_dir": "/backups/project-id-1/version-1"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Project reverted successfully"
  }
  ```
- **Note**: 
  - update the current_project_preview_url in projects table to the url of the docker container which the cli revert function should return
  - update the current_version_id in projects table to the version id of the version which is reverted to

---

#### **5. Use Cases**

##### **5.1 `GET /projects/{project_id}/versions/{version_id}/use-cases`**
- **Description**: Fetch use cases for a specific version of the app.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Path Parameters**:
  - `project_id`: The ID of the project.
  - `version_id`: The ID of the version.
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "use-case-id-1",
        "title": "Track Sales",
        "description": "The app allows users to track sales data in real-time."
      },
      {
        "id": "use-case-id-2",
        "title": "Manage Leads",
        "description": "The app includes a module for managing leads."
      }
    ]
  }
  ```

---

#### **6. Settings**

##### **6.1 `GET /settings`** is dummy endpoint for now
- **Description**: Fetch user settings.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "setting_key": "notification",
        "setting_value": "enabled"
      },
      {
        "setting_key": "subscription",
        "setting_value": "pro"
      }
    ]
  }
  ```

### **7. App Creation and Editing**

---

#### **7.1 `POST /projects/{project_id}/create`**
- **Description**: Trigger the app creation process for a given project.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Path Parameters**:
  - `project_id`: The ID of the project where the app is to be created.
- **Request Body**:
  ```json
  {
    "description": "An app to manage employee performance reviews."
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "App creation started successfully. Updates will be provided via WebSocket.",
    "project_id": "project-id-1",
    "description": "An app to manage employee performance reviews."
  }
  ```
- **Behavior**:
  - When user send the first message from the chat page, it calls the `create` function in the CLI with the project’s details and the provided app description.
  - Sends progress updates to the WebSocket connection.
  - Make sure to update the project table
    - status of the project to "Ready" after the app is created and current_project_dir is set to the project directory which is created in the backend
    - current_project_preview_url is set to the url of the docker container which the cli create function should return
  - Make sure to create an entry in the versions table and update the current_version_id to the new version id after the app is created
  - for a version which is not generated or is current version the backup_dir should be empty string
  - This api will call the create function in the cli to create the app and send the progress updates to the websocket connection and other details once the app is successfully created
  - update the use_cases in the projects table to the use_cases which the cli create function should return
  - If an error occurs, it returns:
    ```json
    {
      "status": "error",
      "message": "Failed to create app. Reason: [error_message]"
    }
    ```

---

#### **7.2 `POST /projects/{project_id}/edit`**
- **Description**: Trigger the app editing process for a given project.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <supabase-auth-token>"
  }
  ```
- **Path Parameters**:
  - `project_id`: The ID of the project to edit.
- **Request Body**:
  ```json
  {
    "description": "Add a feature to allow exporting data to CSV files."
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "App editing started successfully. Updates will be provided via WebSocket.",
    "project_id": "project-id-1",
    "description": "Add a feature to allow exporting data to CSV files.",
    "backup_dir": "/backups/project-id-1/version-2"
  }
  ```
- **Behavior**:
  - Wheneve users sends a message which is not the first message front end it calls the `edit` api which calls the `edit` function in the CLI with the project’s details and the provided edit description.
  - access the current_project_dir from the projects table to get the project directory and pass it to the cli
  - If the edit is succesful 
    - the edit cli function will provide the backup directory path and update the backup_dir value of the current version 
    - then create a new version in the versions table and update the current_version_id to the new version id and status to generated
    - update the current version id in the projects table to the new version id
    - update the current_project_preview_url in projects table to the url of the docker container which the cli edit function should return
    - update the use_cases in the projects table to the use_cases which the cli edit function should return
  - Sends progress updates to the WebSocket connection.
  - If an error occurs, it returns:
    ```json
    {
      "status": "error",
      "message": "Failed to edit app. Reason: [error_message]"
    }
    ```



### ** API Endpoints Summary**

| **Endpoint**                          | **Method** | **Description**                                |
|---------------------------------------|------------|-----------------------------------------------|
| `/projects`                           | `GET`      | Fetch all projects for the user.              |
| `/projects`                           | `POST`     | Create a new project.                         |
| `/projects/{project_id}`              | `DELETE`   | Delete a project.                             |
| `/projects/{project_id}/create`       | `POST`     | Trigger app creation for a project.           |
| `/projects/{project_id}/edit`         | `POST`     | Trigger app editing for a project.            |
| `/projects/{project_id}/messages`     | `GET`      | Fetch chat messages for a project.            |
| `/projects/{project_id}/versions`     | `GET`      | Fetch all versions of an app.                 |
| `/projects/{project_id}/revert`       | `POST`     | Revert to a specific version.                 |
| `/projects/{project_id}/versions/{version_id}/use-cases` | `GET` | Fetch use cases for a version.                |
| `/settings`                           | `GET`      | Fetch user settings.                          |

---