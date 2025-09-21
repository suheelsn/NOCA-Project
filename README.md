# Article Management Dashboard

A full-stack web application for managing bicycle component articles with filtering, sorting, and CRUD operations.

## 🏗️ Architecture Overview

This solution consists of two main components:
- **Backend**: .NET 8 Web API with in-memory data storage
- **Frontend**: Angular 17 application with Material Design

```
NOCA Project/
├── ArticleManagementApi/          # .NET 8 Web API
│   ├── Controllers/               # API Controllers
│   ├── Services/                  # Business Logic Layer
│   ├── Models/                    # Domain Models
│   ├── DTOs/                      # Data Transfer Objects
│   ├── Validators/                # Input Validation
│   └── Repositories/              # Data Access Layer
├── ArticleManagementApi.Tests/    # Backend Unit & Integration Tests
└── article-management-frontend/   # Angular 17 Frontend
    ├── src/app/
    │   ├── features/articles/     # Article Management Components
    │   ├── services/              # HTTP Services
    │   ├── models/                # TypeScript Interfaces
    │   └── shared/                # Shared Components & Utilities
    └── src/styles/                # Global Styling & Themes
```

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [Angular CLI 17+](https://angular.io/cli): `npm install -g @angular/cli`

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "NOCA Project"
   ```

2. **Start the Backend API**
   ```bash
   cd ArticleManagementApi
   dotnet restore
   dotnet run
   ```
   The API will be available at `https://localhost:7297` and `http://localhost:5297`

3. **Start the Frontend (in a new terminal)**
   ```bash
   cd article-management-frontend
   npm install
   npm start
   ```
   The application will be available at `http://localhost:4200`

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:4200`
   - The application will automatically connect to the backend API

## 🛠️ Development Setup

### Backend (.NET API)

1. **Restore dependencies**
   ```bash
   cd ArticleManagementApi
   dotnet restore
   ```

2. **Run in development mode**
   ```bash
   dotnet run --environment Development
   ```

4. **Build for production**
   ```bash
   dotnet build --configuration Release
   ```

### Frontend (Angular)

1. **Install dependencies**
   ```bash
   cd article-management-frontend
   npm install
   ```

2. **Run development server**
   ```bash
   npm start
   # or
   ng serve
   ```

3. **Run tests**
   ```bash
   npm test
   # or
   ng test
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   ng build --configuration production
   ```

5. **Run linting**
   ```bash
   ng lint
   ```

## 🎯 Features

### Core Functionality
- ✅ **Article Management**: Create, read, update bicycle component articles
- ✅ **Advanced Filtering**: Filter by article category, bicycle category, and material
- ✅ **Sorting**: Sort by net weight and article category (ascending/descending)
- ✅ **Responsive Design**: Mobile-first design that works on all screen sizes
- ✅ **Accessibility**: WCAG compliant with ARIA labels and keyboard navigation
- ✅ **Form Validation**: Comprehensive client and server-side validation
- ✅ **Error Handling**: User-friendly error messages and loading states

### Technical Features
- ✅ **RESTful API**: Clean API design following REST principles
- ✅ **Type Safety**: Full TypeScript implementation in frontend
- ✅ **Material Design**: Consistent UI using Angular Material
- ✅ **Reactive Forms**: Angular reactive forms with validation
- ✅ **HTTP Interceptors**: Centralized error handling
- ✅ **Unit Testing**: Comprehensive test coverage
- ✅ **Integration Testing**: API endpoint testing

## 🔧 Technology Stack

### Backend
- **Framework**: .NET 8 Web API
- **Language**: C# 12
- **Data Storage**: In-memory collections (for demo purposes)
- **Validation**: FluentValidation
- **Testing**: xUnit, Moq
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture with Repository Pattern

### Frontend
- **Framework**: Angular 17
- **Language**: TypeScript 5.4
- **UI Library**: Angular Material 17
- **HTTP Client**: Axios (instead of Angular HttpClient)
- **Forms**: Angular Reactive Forms
- **Testing**: Jasmine, Karma
- **Build Tool**: Angular CLI with Webpack
- **Styling**: SCSS with CSS Custom Properties

### Development Tools
- **IDE**: Visual Studio Code / Visual Studio
- **Version Control**: Git
- **Package Managers**: NuGet (.NET), npm (Angular)
- **Linting**: ESLint (Angular), EditorConfig

## 📋 API Endpoints

### Articles API
- `GET /api/articles` - Get all articles with optional filtering and sorting
- `GET /api/articles/{id}` - Get article by ID
- `POST /api/articles` - Create new article
- `PUT /api/articles/{id}` - Update existing article

### Query Parameters
- **Filtering**: `articleCategory`, `bicycleCategories`, `material`
- **Sorting**: `sortField` (articleCategory, netWeightInGramm), `sortDirection` (asc, desc)

### Example Requests
```bash
# Get all articles
GET /api/articles

# Filter by category
GET /api/articles?articleCategory=Frame&material=Carbon

# Sort by weight descending
GET /api/articles?sortField=netWeightInGramm&sortDirection=desc

# Create new article
POST /api/articles
Content-Type: application/json
{
  "articleNumber": 12345,
  "name": "Carbon Frame",
  "articleCategory": "Frame",
  "bicycleCategory": "Road",
  "material": "Carbon",
  "lengthInMm": 500.0,
  "widthInMm": 100.0,
  "heightInMm": 200.0,
  "netWeightInGramm": 1200.0
}
```

## 🏛️ Architecture Decisions & Assumptions

### Backend Architecture
- **In-Memory Storage**: Used for simplicity and demo purposes. In production, this would be replaced with a proper database (SQL Server, PostgreSQL, etc.)
- **Repository Pattern**: Implemented for data access abstraction and testability
- **Service Layer**: Business logic separated from controllers for better maintainability
- **FluentValidation**: Chosen for more flexible and readable validation rules
- **AutoMapper**: Used for object-to-object mapping between models and DTOs

### Frontend Architecture
- **Standalone Components**: Using Angular 17's standalone components for better tree-shaking
- **Axios over HttpClient**: Chosen for more familiar API and better error handling patterns
- **Material Design**: Provides consistent, accessible UI components out of the box
- **Reactive Forms**: Better for complex forms with validation
- **Feature-based Structure**: Components organized by feature for better scalability

### Data Model Assumptions
- **Article Numbers**: Assumed to be unique integers
- **Categories**: Predefined sets of categories (could be made dynamic in production)
- **Measurements**: All dimensions in millimeters, weight in grams
- **Validation**: Required fields based on typical bicycle component specifications



## 🧪 Testing

### Frontend Tests
```bash
cd article-management-frontend
npm test
```

### Test Coverage
- **Frontend**: Component tests, service tests, and integration tests

## 🚀 Deployment

### Backend Deployment
```bash
cd ArticleManagementApi
dotnet publish -c Release -o ./publish
```

### Frontend Deployment
```bash
cd article-management-frontend
npm run build
# Deploy contents of dist/ folder to web server
```

### Environment Configuration
- **Development**: Uses localhost URLs and development settings
- **Production**: Configure `appsettings.Production.json` and Angular environment files

## 🔒 Security Considerations

- **CORS**: Configured for development (localhost:4200)
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: No sensitive information exposed in error messages
- **HTTPS**: Recommended for production deployment





## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



---

**Built with ❤️ using .NET 8 and Angular 17**