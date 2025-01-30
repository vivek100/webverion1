# OneShot Code Generation Web

## Overview

OneShot Code Generation Web is a web application designed to streamline the process of generating and managing code for various projects. It provides a user-friendly interface for managing properties, renters, lease agreements, and more, while integrating with Supabase for authentication and data management.

## Features

- User authentication using Supabase
- Manage properties, renters, and lease agreements
- Join a waitlist for beta features
- Responsive design with Material-UI
- Real-time data visualization with charts
- Dynamic forms for data entry

## Technologies Used

- **Frontend:**
  - React
  - Vite
  - Material-UI
  - Recharts
  - React Admin

- **Backend:**
  - FastAPI
  - Supabase
  - Pydantic
  - JWT for authentication

## Project Structure

```
oneShotCodeGenWeb/
├── backend/                  # Backend code
│   ├── app/                  # FastAPI application
│   ├── dependencies.py       # Dependency injection
│   ├── models/               # Pydantic models
│   ├── utils/                # Utility functions
│   ├── config.py             # Configuration settings
│   └── .gitignore            # Git ignore file
├── frontend/                 # Frontend code
│   ├── src/                  # Source files
│   ├── pages/                # Page components
│   ├── components/           # Reusable components
│   ├── App.jsx               # Main application component
│   └── index.html            # HTML entry point
└── README.md                 # Project documentation
```

## Installation

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- PostgreSQL (for Supabase)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/oneShotCodeGenWeb.git
   cd oneShotCodeGenWeb
   ```

2. **Backend Setup:**

   - Navigate to the `backend` directory.
   - Create a virtual environment and activate it:

     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```

   - Install the required packages:

     ```bash
     pip install -r oldrequirements.txt
     ```

   - Create a `.env` file in the `backend` directory and add your Supabase credentials:

     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     PROJECT_BASE_DIR=./projects
     ```

3. **Frontend Setup:**

   - Navigate to the `frontend` directory.
   - Install the required packages:

     ```bash
     npm install
     ```

4. **Run the Application:**

   - Start the backend server:

     ```bash
     uvicorn app.main:app --reload
     ```

   - Start the frontend development server:

     ```bash
     npm run dev
     ```

5. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.io/) for providing a powerful backend as a service.
- [FastAPI](https://fastapi.tiangolo.com/) for building the backend API.
- [React](https://reactjs.org/) and [Material-UI](https://mui.com/) for creating a responsive frontend.
