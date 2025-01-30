Here’s the **updated database schema** to accommodate the changes based on the requirements:
We are using supabase for the database and supabase auth for authentication.

---

### **Database Schema (SQL)**

#### **1. `profiles` Table**
- Links to Supabase auth.users and stores additional user information
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **2. `projects` Table**
- Stores details about the projects created by users
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Created', -- Possible values: 'Created', 'Ready'
    current_version_id UUID REFERENCES versions(id) ON DELETE CASCADE,
    current_project_dir TEXT, -- Path to the project directory, empty string if current version is not generated
    current_project_preview_url TEXT, -- Path to the project directory, empty string if current version is not generated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **3. `chat_messages` Table**
- Stores chat history for each project
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL, -- 'User' or 'AI'
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'normal', -- 'normal', 'success', 'error'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **4. `versions` Table**
- Stores versions of the app generated or edited for each project
```sql
CREATE TABLE versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    backup_dir TEXT, -- Path to the backup directory, empty string if not generated
    status VARCHAR(50) DEFAULT 'notGenerated', -- Possible values: 'notGenerated', 'generated'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **5. `use_cases` Table**
- Stores use cases created for each project version
```sql
CREATE TABLE use_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES versions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### **6. `settings` Table**
- Stores user-specific or project-specific settings
```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
