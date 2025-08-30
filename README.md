# 📊 Dynamic Portfolio Dashboard

A modern, responsive portfolio management dashboard built with **Next.js 15**, **React**, and **Tailwind CSS**. This project showcases real-time portfolio tracking, sector analysis, and interactive financial data visualization.

## 🚀 Live Demo

- **Local Development**: `https://dynamic-portfolio-dashboar.netlify.app/`
- **GitHub Repository**: [Dynamic-Portfolio-Dashboard](https://github.com/sarthak2443/Dynamic-Portfolio-Dashboard)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Portfolio Tracking** - Live updates of stock prices and portfolio values
- **Interactive Dashboard** - Modern, responsive UI with smooth animations
- **Sector Analysis** - Comprehensive breakdown of portfolio by sectors
- **Performance Metrics** - Key statistics including total value, P&L, and returns
- **Stock Management** - Detailed view of individual holdings and performance

### 🎨 UI/UX Highlights
- **Modern Design** - Clean, professional interface with gradient backgrounds
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Real-time Updates** - Dynamic data refresh with visual indicators
- **Interactive Components** - Hover effects, animations, and smooth transitions
- **Professional Styling** - Financial industry-standard color schemes and typography

### 📈 Data Features
- **Live Market Data** - Real-time stock price simulation
- **Portfolio Analytics** - Comprehensive performance tracking
- **Sector Diversification** - Visual representation of portfolio allocation
- **Currency Formatting** - Professional financial number formatting
- **Percentage Calculations** - Accurate P&L and return calculations

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.5.2** - React framework with App Router
- **React 19** - Latest React with modern hooks and features
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS** - CSS processing and optimization
- **Custom Animations** - Smooth transitions and micro-interactions

### Development Tools
- **ESLint** - Code linting and formatting
- **Hot Reload** - Fast development experience
- **Modern Build System** - Optimized production builds

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/sarthak2443/Dynamic-Portfolio-Dashboard.git

# Navigate to project directory
cd Dynamic-Portfolio-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
Dynamic-Portfolio-Dashboard/
│
├── 📁 app/                          # Next.js App Router directory
│   ├── 📁 api/                      # API routes for backend functionality
│   │   └── 📁 stock/                # Stock-related API endpoints
│   │       ├── 📁 cmp/              # Current Market Price endpoint
│   │       │   └── 📄 route.ts      # GET /api/stock/cmp - Real-time prices
│   │       └── 📁 details/          # Stock Details endpoint
│   │           └── 📄 route.ts      # GET /api/stock/details - Stock info
│   │
│   ├── 🎨 globals.css               # Global styles, Tailwind imports, animations
│   ├── 🏗️ layout.tsx                # Root layout with metadata and providers
│   └── 🏠 page.tsx                  # Main dashboard page component
│
├── 📁 components/                   # Reusable React components
│   ├── 📊 PortfolioTable.tsx       # Interactive portfolio table with real-time updates
│   ├── 🥧 SectorSummary.tsx        # Sector allocation and performance analysis
│   └── 📈 StatsCards.tsx           # Portfolio statistics cards with animations
│
├── 📁 lib/                         # Utility functions and data
│   └── 📄 sampleData.json          # Mock portfolio data for development
│
├── 📁 public/                      # Static assets (images, icons, etc.)
│   ├── 🖼️ favicon.ico              # Site favicon
│   └── 📸 screenshots/             # Project screenshots for README
│
├── ⚙️ tailwind.config.js           # Tailwind CSS configuration
├── ⚙️ postcss.config.js            # PostCSS configuration for CSS processing
├── ⚙️ tsconfig.json                # TypeScript compiler configuration
├── ⚙️ next.config.js               # Next.js configuration (if needed)
├── 📦 package.json                 # Project dependencies and scripts
├── 📦 package-lock.json            # Locked dependency versions
├── 🚫 .gitignore                   # Git ignore rules
├── 🚫 .eslintrc.json               # ESLint configuration
├── 🚫 .next/                       # Next.js build output (auto-generated)
├── 🚫 node_modules/                # npm dependencies (auto-generated)
└── 📖 README.md                    # Project documentation (this file)
```

### 📂 Directory Breakdown

#### `/app` - Next.js App Router
- **Purpose**: Modern Next.js routing and page structure
- **Key Files**:
  - `page.tsx` - Main dashboard with portfolio overview
  - `layout.tsx` - Global layout and metadata
  - `globals.css` - Tailwind CSS imports and custom styles

#### `/app/api` - Backend API Routes
- **Purpose**: Server-side API endpoints for data fetching
- **Features**:
  - RESTful API design
  - Real-time stock price simulation
  - JSON response formatting
  - Error handling and validation

#### `/components` - React Components
- **Purpose**: Modular, reusable UI components
- **Architecture**:
  - **PortfolioTable.tsx** - Main data table with sorting and filtering
  - **SectorSummary.tsx** - Visual sector breakdown and analytics
  - **StatsCards.tsx** - Key performance indicators display

#### `/lib` - Utilities and Data
- **Purpose**: Helper functions and mock data
- **Contents**:
  - Sample portfolio data for development
  - Utility functions for calculations
  - Type definitions and interfaces

### 🏗️ Component Architecture

```
Dashboard (page.tsx)
│
├── StatsCards
│   ├── Total Value Card
│   ├── P&L Card
│   ├── Returns Card
│   └── Holdings Count Card
│
├── PortfolioTable
│   ├── Header with Sorting
│   ├── Stock Rows with Live Updates
│   ├── Performance Indicators
│   └── Action Buttons
│
└── SectorSummary
    ├── Sector Allocation Chart
    ├── Top Performers List
    └── Sector Statistics
```

### 🔄 Data Flow

```
API Routes (/app/api) 
    ↓
Sample Data (/lib/sampleData.json)
    ↓
React Components (/components)
    ↓
Dashboard Page (/app/page.tsx)
    ↓
User Interface (Browser)
```

### 🎯 File Responsibilities

| File | Purpose | Key Features |
|------|---------|--------------|
| `app/page.tsx` | Main dashboard | Layout, state management, real-time updates |
| `components/PortfolioTable.tsx` | Portfolio display | Table rendering, sorting, performance calculations |
| `components/SectorSummary.tsx` | Sector analysis | Data aggregation, visual representation |
| `components/StatsCards.tsx` | Key metrics | Statistical calculations, animated counters |
| `app/api/stock/cmp/route.ts` | Price API | Real-time price simulation, market data |
| `app/api/stock/details/route.ts` | Stock details | Company information, metadata |
| `lib/sampleData.json` | Mock data | Portfolio holdings, stock information |

## 🎮 Usage

### Dashboard Overview
1. **Portfolio Summary** - View total portfolio value, P&L, and returns
2. **Holdings Table** - Detailed view of all stock positions
3. **Sector Analysis** - Pie chart and breakdown of sector allocation
4. **Real-time Updates** - Watch live price changes and portfolio updates

### Key Components

#### Portfolio Table
- **Stock Information** - Symbol, company name, and sector
- **Position Details** - Quantity, average price, and current value
- **Performance Metrics** - P&L, returns, and percentage changes
- **Real-time Updates** - Live price refresh with visual indicators

#### Sector Summary
- **Allocation Breakdown** - Percentage distribution across sectors
- **Value Analysis** - Sector-wise portfolio values
- **Performance Tracking** - Sector-level returns and P&L

#### Statistics Cards
- **Total Portfolio Value** - Real-time portfolio valuation
- **Total P&L** - Cumulative profit and loss
- **Overall Returns** - Portfolio performance percentage
- **Active Positions** - Number of holdings

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for custom colors and themes
- Update `app/globals.css` for global styling changes
- Customize component styles in individual component files

### Data
- Replace sample data in `lib/sampleData.json`
- Integrate with real market data APIs
- Modify API routes in `app/api/` for custom data sources

### Features
- Add new components in `components/` directory
- Extend API functionality in `app/api/` routes
- Implement additional portfolio analytics

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configurations:

```env
# API Configuration
NEXT_PUBLIC_API_URL=your_api_url_here

# Database Configuration (if needed)
DATABASE_URL=your_database_url_here
```

### Tailwind Configuration
The project uses a custom Tailwind configuration optimized for financial dashboards:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with automatic builds

### Other Platforms
- **Netlify**: Build command: `npm run build`, Publish directory: `out`
- **Heroku**: Add `package.json` scripts for build and start
- **Docker**: Create Dockerfile for containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Sarthak** - Full Stack Developer
- GitHub: [@sarthak2443](https://github.com/sarthak2443)
- LinkedIn: [Connect with me](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- **8byte** - For the technical assignment opportunity
- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **React Community** - For continuous inspiration and support

## 📸 Screenshots

### Desktop View
![Desktop Dashboard](screenshots/desktop-dashboard.png)

### Mobile View
![Mobile Dashboard](screenshots/mobile-dashboard.png)

### Features Showcase
![Features](screenshots/features-showcase.png)

---

## 🔥 Performance & Features

- ⚡ **Fast Loading** - Optimized with Next.js App Router
- 📱 **Mobile First** - Responsive design for all devices
- 🎨 **Modern UI** - Professional financial dashboard design
- 🔄 **Real-time** - Live data updates and animations
- 🎯 **Type Safe** - Full TypeScript implementation
- 🚀 **Production Ready** - Optimized build and deployment

---

**Built with ❤️ for modern portfolio management**

