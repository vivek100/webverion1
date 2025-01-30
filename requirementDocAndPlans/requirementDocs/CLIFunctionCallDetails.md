Here’s how the backend should handle **only the function calls and output processing**, while leaving the overall API behavior to refer to the detailed responsibilities already defined.

---

### **Backend CLI Function Calls (with Context to API Details)**

Below are the adjusted FastAPI implementations that align with the API requirements, focusing specifically on calling the `createAPI`, `editAPI`, and `revertAPI` functions, passing correct inputs, and processing their outputs.

---

#### **1. `POST /projects/{project_id}/create`**

**Responsibilities (refer API details):**
- Calls the `createAPI` function with:
  - `description` (from the request body).
  - `output_dir` derived from the `project_id`.
  - `use_docker=True`.
- Processes the CLI output to:
  - Update the project’s `current_version_id` in the database.
  - Return the generated app’s preview URL.

**Implementation (Focus on Function Call and Output Processing):**
```python
@router.post("/projects/{project_id}/create")
async def create_project(project_id: str, description: str):
    """
    Creates a new app and generates project files.
    """
    try:
        # Define the output directory for the project
        output_dir = f"./projects/{project_id}"
        
        # WebSocket callback function
        async def broadcast_callback(message):
            await websocket_manager.broadcast(message)

        # Call the CLI function
        result = createAPI(
            description=description,
            output_dir=output_dir,
            broadcast_callback=broadcast_callback,
            use_docker=True,  # Always use Docker
            use_nginx=False  # Optional: Set to True if NGINX is needed
        )

        # Handle errors from CLI
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])

        # Extract important details for database updates
        output_dir = result["output_dir"]
        preview_url = result["preview_url"]

        # Here you would perform:
        # - Database updates for project status and version
        # - Database insert for new version details
        # These steps are detailed in the API design; refer to those.

        return {
            "status": "success",
            "data": {
                "project_id": project_id,
                "output_dir": output_dir,
                "preview_url": preview_url,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

#### **2. `POST /projects/{project_id}/edit`**

**Responsibilities (refer API details):**
- Calls the `editAPI` function with:
  - `project_dir` derived from the `project_id`.
  - `description` (from the request body).
  - `use_docker=True`.
- Processes the CLI output to:
  - Update the backup directory (`backup_dir`) for the current version.
  - Create a new version entry in the database.
  - Update the project’s `current_version_id` to the new version.

**Implementation (Focus on Function Call and Output Processing):**
```python
@router.post("/projects/{project_id}/edit")
async def edit_project(project_id: str, description: str):
    """
    Edits an existing app and applies changes.
    """
    try:
        # Define the project directory
        project_dir = f"./projects/{project_id}"
        
        # WebSocket callback function
        async def broadcast_callback(message):
            await websocket_manager.broadcast(message)

        # Call the CLI function
        result = editAPI(
            project_dir=project_dir,
            description=description,
            broadcast_callback=broadcast_callback,
            use_docker=True,  # Always use Docker
            use_nginx=False  # Optional: Set to True if NGINX is needed
        )

        # Handle errors from CLI
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])

        # Extract important details for database updates
        backup_dir = result["backup_dir"]
        preview_url = result["preview_url"]

        # Here you would perform:
        # - Database updates for the current version's `backup_dir`
        # - Database insert for the new version
        # - Update the project's `current_version_id` to the new version
        # These steps are detailed in the API design; refer to those.

        return {
            "status": "success",
            "data": {
                "project_id": project_id,
                "backup_dir": backup_dir,
                "preview_url": preview_url,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

#### **3. `POST /projects/{project_id}/revert`**

**Responsibilities (refer API details):**
- Calls the `revertAPI` function with:
  - `project_dir` derived from the `project_id`.
  - `backup_dir` (from the request body).
  - `use_docker=True`.
- Processes the CLI output to:
  - Return the reverted app's preview URL.

**Implementation (Focus on Function Call and Output Processing):**
```python
@router.post("/projects/{project_id}/revert")
async def revert_project(project_id: str, backup_dir: str):
    """
    Reverts an app to a specific version.
    """
    try:
        # Define the project directory
        project_dir = f"./projects/{project_id}"
        
        # WebSocket callback function
        async def broadcast_callback(message):
            await websocket_manager.broadcast(message)

        # Call the CLI function
        result = revertAPI(
            project_dir=project_dir,
            backup_dir=backup_dir,
            broadcast_callback=broadcast_callback,
            use_docker=True,  # Always use Docker
            use_nginx=False  # Optional: Set to True if NGINX is needed
        )

        # Handle errors from CLI
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])

        # Extract important details for the response
        preview_url = result["preview_url"]

        # Database updates for version status or related fields can be handled here
        # (Refer to the API design for complete flow)

        return {
            "status": "success",
            "data": {
                "project_id": project_id,
                "preview_url": preview_url,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### **Notes**
- The above code:
  - Focuses solely on **calling CLI functions and processing their outputs**.
  - Refers to the detailed API responsibilities for database operations, status updates, and other logic not shown here.
- For WebSocket broadcasting, the `broadcast_callback` is passed to every CLI function to enable real-time updates.

### **Next Steps**
- Ensure the database operations outlined in the API design are implemented in corresponding API endpoints.
- Also if any db calls are needed for the above function calls, please add them.

---

### **API Function Details**

#### **1. `createAPI` Function**

**Purpose:** Creates a new application from description.

**Inputs:**
- `description: str` - Description of the app to generate
- `output_dir: str` - Base output directory for generated apps
- `broadcast_callback: Optional[Callable]` - Function for real-time updates
- `use_docker: bool = False` - Flag to enable Docker deployment
- `use_nginx: bool = False` - Flag to enable Nginx configuration

**Returns:**
```python
{
    "status": str,          # "success" or "error"
    "message": str,         # Success/error message
    "output_dir": str,      # Path to generated project
    "preview_url": str,     # URL to access the app
    "use_cases": Dict       # Generated use cases model
}
```

---

#### **2. `editAPI` Function**

**Purpose:** Modifies an existing application based on description.

**Inputs:**
- `project_dir: str` - Path to the project directory
- `description: str` - Description of changes needed
- `broadcast_callback: Optional[Callable]` - Function for real-time updates
- `use_docker: bool = False` - Flag to enable Docker deployment
- `use_nginx: bool = False` - Flag to enable Nginx configuration

**Returns:**
```python
{
    "status": str,          # "success" or "error"
    "message": str,         # Success/error message
    "backup_dir": str,      # Path to backup directory
    "preview_url": str,     # URL to access the app
    "use_cases": Dict       # Updated use cases model
}
```

---

#### **3. `revertAPI` Function**

**Purpose:** Reverts an application to a specific version.

**Inputs:**
- `project_dir: str` - Path to the project directory
- `backup_dir: str` - Path to the backup directory to revert to
- `broadcast_callback: Optional[Callable]` - Function for real-time updates
- `use_docker: bool = False` - Flag to enable Docker deployment
- `use_nginx: bool = False` - Flag to enable Nginx configuration

**Returns:**
```python
{
    "status": str,          # "success" or "error"
    "message": str,         # Success/error message
    "preview_url": str      # URL to access the reverted app
}
```

---

### **Common Features Across Functions**

1. **Error Handling:**
   - All functions return error status and message on failure
   - Original state is preserved in case of errors

2. **Real-time Updates:**
   - Optional `broadcast_callback` for progress updates
   - Useful for WebSocket integration

3. **Deployment Options:**
   - Docker containerization support
   - Nginx reverse proxy configuration
   - Local development fallback

4. **Preview URLs:**
   - Docker: `http://localhost:<port>`
   - Docker + Nginx: `http://localhost/<app_name>`
   - Local: Development server URL

5. **Backup Management:**
   - Automatic backup creation for edits
   - Timestamped backup directories
   - Restore capability via revert function