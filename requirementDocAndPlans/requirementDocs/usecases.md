Here are the **use cases** for the web application which is built on top of the oneShotCodeGen project to create and edit apps:

---

### **Use Cases**

---

#### **1. User Management**
##### **1.1 Login**
- **Actors**: User
- **Description**: Users can log in to their account using email and password.
- **Steps**:
  1. The user visits the login page.
  2. The user provides their email and password.
  3. The system authenticates the user using Supabase.
  4. On success, the user is redirected to the dashboard.
  5. On failure, the system displays an error toast.
- **Preconditions**:
  - The user account exists in the system.
  - The correct email and password are provided.
- **Postconditions**:
  - The user is logged in and can access their projects.
- **Edge Cases**:
  - Incorrect email or password.
  - Supabase service is unavailable.

##### **1.2 Logout**
- **Actors**: User
- **Description**: Users can log out of their account.
- **Steps**:
  1. The user clicks the "Logout" option from the profile dropdown.
  2. The system ends the user session.
  3. The user is redirected to the login page.
- **Preconditions**:
  - The user is logged in.
- **Postconditions**:
  - The user session is terminated.
  - The user is redirected to the login page.

---

#### **2. Project Management**
##### **2.1 View Projects**
- **Actors**: User
- **Description**: Users can view a list of all projects they have created.
- **Steps**:
  1. The user logs in and lands on the dashboard.
  2. The dashboard displays a table of projects, including:
     - Project name
     - Status
     - Creation date
     - Actions: Open in Chat, Delete.
- **Preconditions**:
  - The user has created one or more projects.
- **Postconditions**:
  - The user can see their projects and their statuses.
- **Edge Cases**:
  - No projects exist (empty state message is shown with a cta to create a project).

##### **2.2 Create Project**
- **Actors**: User
- **Description**: Users can create a new project by providing a name and description.
- **Steps**:
  1. The user clicks the "Create New Project" FAB on the dashboard.
  2. A modal appears with an input field for the project name.
  3. The user submits the form.
  4. The project is created and stored in the database.
  5. The user is redirected to the chat page for the new project.
- **Preconditions**:
  - The user is logged in.
  - Valid project data is provided.
- **Postconditions**:
  - A new project is created and displayed in the dashboard.
- **Edge Cases**:
  - Backend errors during project creation.

##### **2.3 Delete Project**
- **Actors**: User
- **Description**: Users can delete a project they own.
- **Steps**:
  1. The user clicks the "Delete" action for a project on the dashboard.
  2. A confirmation modal appears.
  3. The user confirms the deletion.
  4. The project is deleted from the database.
  5. The table is updated to remove the deleted project.
- **Preconditions**:
  - The project exists.
  - The user owns the project.
- **Postconditions**:
  - The project is permanently deleted.
- **Edge Cases**:
  - The project does not exist (e.g., already deleted by another process).

---

#### **3. Chat and App Creation**
##### **3.1 Create App**
- **Actors**: User
- **Description**: Users can describe an app in the chat interface, and the backend generates the app based on the description.
- **Steps**:
  1. The user navigates to the chat page for a project.
  2. The user provides an app description in the input field.
  3. The system processes the input and generates the app.
  4. The iframe updates to display the live preview.
  5. Chat messages and the preview iframe display progress updates.
- **Preconditions**:
  - The user is logged in.
  - The project exists.
- **Postconditions**:
  - The app is created, and a live preview is displayed.
- **Edge Cases**:
  - Backend errors during app generation.

##### **3.2 Edit App**
- **Actors**: User
- **Description**: Users can request changes to an existing app in the chat interface.
- **Steps**:
  1. The user navigates to the chat page for a project.
  2. The user describes the desired changes in the input field.
  3. The system processes the input and modifies the app.
  4. The iframe updates to display the updated preview.
  5. Chat messages display progress updates.
- **Preconditions**:
  - The user is logged in.
  - The project exists.
- **Postconditions**:
  - The app is modified and updated in real time.
- **Edge Cases**:
  - Backend errors during app modification.

---

#### **4. Version Management**
##### **4.1 View Versions**
- **Actors**: User
- **Description**: Users can view a list of all versions of their app.
- **Steps**:
  1. The user navigates to the chat page for a project.
  2. The top section displays a dropdown with all available versions.
- **Preconditions**:
  - The user is logged in.
  - The project exists.
  - The app has at least one version.
- **Postconditions**:
  - The user can see all versions of their app.
- **Edge Cases**:
  - No versions exist for the app.

##### **4.2 Revert to Version**
- **Actors**: User
- **Description**: Users can revert their app to a previous version.
- **Steps**:
  1. The user selects a version from the dropdown on the chat page.
  2. A confirmation modal appears.
  3. The user confirms the reversion.
  4. The app is restored to the selected version.
  5. The iframe updates to display the reverted version.
  6. A chat message displays the status of the reversion.
- **Preconditions**:
  - The user is logged in.
  - The project exists.
  - The selected version exists.
- **Postconditions**:
  - The app is restored to the selected version.
- **Edge Cases**:
  - The version directory is missing.
  - Errors occur during deployment.

---

#### **5. Features and Use Cases**
##### **5.1 View Features**
- **Actors**: User
- **Description**: Users can view the use cases created for the current version of their app.
- **Steps**:
  1. The user navigates to the "Features" tab on the chat page.
  2. The tab displays a list of use cases with their titles and descriptions.
- **Preconditions**:
  - The user is logged in.
  - The project exists.
  - The current version has use cases.
- **Postconditions**:
  - The user can see all use cases for the current version.
- **Edge Cases**:
  - No use cases exist for the version.

---

#### **6. Settings Management**
##### **6.1 Update Account Details**
- **Actors**: User
- **Description**: Users can update their name and email in the settings page.
- **Steps**:
  1. The user navigates to the "Account" section in the settings page.
  2. The user updates their name and/or email in the form fields.
  3. The user submits the form.
  4. The system updates the user's details in the database.
- **Preconditions**:
  - The user is logged in.
- **Postconditions**:
  - The user's name and/or email is updated.
- **Edge Cases**:
  - Invalid email format.
  - Duplicate email in the database.

##### **6.2 View Subscription and Usage** dummy pages to be created for now
- **Actors**: User
- **Description**: Users can view their subscription status and usage details.
- **Steps**:
  1. The user navigates to the "Subscription" or "Usage" section in the settings page.
  2. The tab displays relevant information.
- **Preconditions**:
  - The user is logged in.
- **Postconditions**:
  - The user can view their subscription and usage details.
- **Edge Cases**:
  - Subscription or usage data is unavailable.

---