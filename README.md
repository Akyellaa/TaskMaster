# TaskMaster - Advanced Task Management Application

A modern, full-featured task management application built with React, featuring both regular and recurring tasks, category management, and a beautiful user interface.

## Features

### 🎯 Task Management
- **Regular Tasks**: Create tasks with deadlines and priorities
- **Recurring Tasks**: Set up tasks that repeat on specific days of the week
- **Priority Levels**: Low, Medium, and High priority with visual indicators
- **Task Completion**: Mark tasks as complete with undo functionality
- **Task Archive**: Archive and unarchive tasks to keep your workspace clean

### 🏷️ Category Management
- **Create Categories**: Organize tasks with custom categories
- **Color-Coded**: Visual organization with custom color indicators
- **Category CRUD**: Full create, read, update, delete functionality
- **Archive Categories**: Keep unused categories archived but accessible

### 📊 Dashboard & Views
- **List View**: Comprehensive task list with filtering and sorting
- **Calendar View**: Visual calendar representation of tasks
- **Statistics**: Real-time statistics showing completion rates and progress
- **Filtering**: Filter by priority, category, completion status, and more

### 🔐 Authentication
- **User Registration**: Secure account creation
- **User Login**: JWT-based authentication
- **Protected Routes**: Secure access to user data
- **Token Management**: Automatic token refresh and validation

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Modern icon library
- **date-fns** - Date manipulation library
- **Axios** - HTTP client for API calls

### State Management
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Persistent authentication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running (see backend setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskmaster-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Update the backend URL in `src/config/index.js`:
   ```javascript
   export const BACKEND_URL = "http://localhost:8000"; // Your backend URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   ├── Calendar/        # Calendar view components
│   ├── Categories/      # Category management
│   ├── Dashboard/       # Dashboard widgets
│   ├── Layout/          # Layout components
│   ├── Tasks/           # Task-related components
│   └── ui/              # shadcn/ui components
├── context/             # React Context providers
│   ├── AuthContext.jsx  # Authentication state
│   ├── CategoryContext.jsx # Category management
│   └── TaskContext.jsx  # Task management
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
├── services/            # API service functions
└── config/              # Configuration files
```

## API Integration

The application communicates with a backend API for:

- **Authentication**: User registration, login, token validation
- **Tasks**: CRUD operations for regular and recurring tasks
- **Categories**: Full category management
- **Data Persistence**: All data is stored server-side

### Required Backend Endpoints

```
Authentication:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Tasks:
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:uuid
DELETE /api/tasks/:uuid
PUT    /api/tasks/:uuid/complete
PUT    /api/tasks/:uuid/undo-complete
PUT    /api/tasks/:uuid/archive
PUT    /api/tasks/:uuid/unarchive

Categories:
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
PUT    /api/categories/:id/archive
PUT    /api/categories/:id/unarchive
```

## Usage

### Creating Tasks

1. Click the "New Task" button in the header
2. Fill in task details:
   - Title and description
   - Priority level (Low, Medium, High)
   - Category (optional)
   - Choose between Regular (with deadline) or Recurring (with specific days)
3. Submit to create the task

### Managing Categories

1. Click "Categories" in the header
2. Use "New Category" to create categories
3. For existing categories:
   - Edit: Click the pencil icon
   - Delete: Click the trash icon (with confirmation)
   - Archive: Click the archive icon

### Task Operations

- **Complete**: Check the checkbox or use the complete button
- **Edit**: Click the edit icon on any task
- **Delete**: Use the delete option in task actions
- **Archive**: Move completed tasks to archive

## Customization

### Theming
The application uses CSS custom properties for theming. Modify `src/index.css` to customize colors and styling.

### Components
All UI components are built with shadcn/ui and can be customized by modifying the component files in `src/components/ui/`.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ by Tim TASKMASTER
