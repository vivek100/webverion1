### **UI Details**

#### **Layout Overview**

1. **Menu Section (Sidebar)**

   - Collapsible on the left, default collapsed, expand no hover.

   - Contains navigation links:

     - Dashboard

     - Settings

     - Logout

   - UI Elements:

     - **Logo**: Top of the sidebar.

     - **Navigation Items**: Listed vertically.

2. **Main Section**

   - Right of the menu section, occupying the remaining space.

   - Contains:

     - Page-specific content (e.g., Login Form, Dashboard, Chat Interface).

     - Header Section:

       - Top of the main section.

       - Includes:

         - Page title.

         - Profile dropdown.

***


#### **Pages**

1. **Login Page**

   - **Layout**:

     - Single-column layout in the center of the screen.

   - **Elements**:

     - Email input field: Centered, Material UI `TextField`.

     - Password input field: Below the email field, Material UI `TextField` (type: password).

     - Login button: Below the password field, Material UI `Button` (variant: `contained`).

     - "Forgot Password" link: Below the Login button, aligned left.

     - Redirect after login: Navigate to the **Dashboard**.

***

2. **Dashboard Page**

   - **Layout**:

     - **Header Section**:

       - Page title: "Dashboard" displayed as a Material UI `Typography`.

       - Profile dropdown: Top right corner, Material UI `Avatar` with dropdown options (Profile, Logout).

     - **Main Section**:

       - **Project List Section**: user can see the projects created by them

         - Full-width Material UI `Table` displaying:

           - Project Name

           - Status (colored chips: `Created `“When a project is created”, `Ready `“When user has chatted and created an app once)

           - Creation Date

           - Actions (Open in Chat, Delete).

         - Pagination: Bottom of the table, Material UI `Pagination`.

         - If no projects exist, show a message and a cta to create a project, which should open the modal to create a project, details mentioned in the create project section

       - **Create Project Section**:

         - Floating Action Button (FAB) in the bottom-right corner: Material UI `FAB`.

         - Clicking FAB opens a modal with:

           - Input field for app Name.

           - Submit button. On successful submission user is navigated to the chat page for that project.

***

3. **Chat Page**

   - **Layout**:

     - Two-column layout:

       - **Left Column (Chat Section)**: 25% width.

         - **Top Section**:

           - App metadata (Material UI `Card`):

             - App name.

             - Status (colored chip).

             - Version dropdown for switching between versions.

           - Divider below metadata.

         - **Main Section**: Has 4 tabs

           - Tab1 : Development tab where chat history is shown

             - Chat history section

               1. User and AI messages displayed in `Chat Bubbles`.

               2. User messages: Right-aligned.

               3. AI messages: Left-aligned.

                  1. Normal message updates in no bg

                  2. Success updates with success bg

                  3. Error update message in error bg

               4. Messages should support hyperlinking and clicking

             - **Chat Input Section**:

               1. Text input field (Material UI `TextField`) with a placeholder: "Describe your app or changes…".

               2. Send button (Material UI `Button`) beside the input field.

           - Tab 2: Features tab , here user can see the use cases created for the current version of the app

             - Show use case list with title and description

           - Tab 3: Deploy tab, this tab will be empty for now with a get in touch button and hyper link to an external form

           - Tab 4: Settings tab, this tab will be empty with a message in center saying coming soon.

       - **Right Column (Live Preview)**: 75% width.

         - Embedded iframe to display the live app preview.

           - When If there is no app created: 

             - show a message saying how users to enter their requirements 

             - Below the message show 3 example prompts which user can click and it will be automatically copied to the input chat section

           - When app is being created or edited

             - Show message building your app

             - Below that show current statues where backend will send the status of the whole creation and it should be just shown

         - Placeholder message (spinner) if the app is still deploying.

         - Action link below the iframe: "Open in New Tab."

***

4. **Settings Page** 

   - **Layout**:

     - **Left Section**:

       - Sidebar navigation for settings categories (Account, subscription, usage).

     - **Main Section**:

       - When account is selected: Display form inputs for user to update name and email

       - When subscription is selected: Display coming soon

       - When Usage is selected: Display coming soon.

***


### **5. User Flows**

1. **Login Flow (Login Page)**

   - **Page**: **Login Page**

   - **Steps**:

     1. User visits the Login Page.

     2. Inputs email and password in the respective fields.

     3. Clicks the "Login" button.

     4. The system authenticates via Supabase.

     5. On success, the user is redirected to the **Dashboard Page**.

     6. On failure, an error toast displays.

***

2. **Dashboard Navigation (Dashboard Page)**

   - **Page**: **Dashboard Page**

   - **Steps**:

     1. User lands on the Dashboard Page after login.

     2. The **Project List Section** displays all user-created projects in a table.

     3. Actions available for each project:

        - **Open in Chat**:

          - Navigates to the **Chat Page** with the selected project pre-loaded.

        - **Delete**:

          - Opens a confirmation modal.

          - Deletes the project on confirmation and refreshes the table.

     4. The **Create Project Section**:

        - User clicks the FAB to open the project creation modal.

        - Provides the app description in the input field.

        - On submission, the project is created, and the user is navigated to the **Chat Page** for interaction.

***

3. **Create New App Flow (Chat Page)**

   - **Page**: **Chat Page**

   - **Steps**:

     1. User navigates from the **Dashboard Page** by clicking the "Create New Project" FAB.

     2. The Chat Page loads with an empty chat interface.

     3. User provides an app description in the input field and clicks "Send."

     4. The backend processes the input and generates the app.

     5. The iframe updates to show the live preview.

***

4. **Edit Existing App Flow (Chat Page)**

   - **info**: Essentially if user sends any message after creation and the app is created then it is considered as an edit flow

   - **Page**: **Chat Page**

   - **Steps**:

     1. User navigates from the **Dashboard Page** by clicking "Open in Chat" for an existing project.

     2. The Chat Page loads with the app metadata, chat history, and live preview.

     3. User provides an edit description in the input field and clicks "Send."

     4. The backend processes the input, updates the app, and refreshes the iframe preview.
     

***

5. **View and Revert to Previous Version (Chat Page)**

   - **Page**: **Chat Page**

   - **Steps**:

     1. On the **Chat Page**, the top section displays a dropdown of app versions.

     2. User selects a previous version from the dropdown.

     3. A pop up message comes up asking the user to "Revert."

     4. The app is restored to the selected version, and the iframe refreshes to show the reverted state.

     5. The status of reversion is shown on the live preview and the chat message.

***
