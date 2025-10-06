# Generate RC-10 Remote Control Web App Repository

## Task Overview

Generate a complete TypeScript-based web application repository that allows users to control their Boss RC-10r Rhythm Loop Station from their web browser. This should be a production-ready static website with full development tooling, testing, and CI/CD pipeline.

## Project Requirements

### Core Functionality
- **Primary Purpose**: Web-based control interface for Boss RC-10r Rhythm Loop Station
- **Target Users**: Musicians and audio engineers
- **Technology Stack**: TypeScript + React + Redux + Vite + Tailwind CSS
- **Communication**: Web MIDI API for device interaction
- **Deployment**: Static website deployable to GitHub Pages
- **License**: MIT License

### Browser Support
- Modern browsers with Web MIDI API support (Chrome 43+, Edge 79+, Opera 30+)
- Graceful degradation for unsupported browsers
- HTTPS requirement for Web MIDI API in production

## Technical Implementation

### Architecture Requirements
- Single Page Application (SPA) architecture
- TypeScript for type safety and developer experience
- React for UI components with modern hooks pattern
- Redux Toolkit for predictable state management
- Vite for fast development and optimized production builds
- Tailwind CSS for responsive, utility-first styling
- Web MIDI API integration for real-time device communication

### Project Structure
Create the following directory structure:
```
/
├── src/
│   ├── components/          # React components
│   │   ├── App.tsx         # Main application component
│   │   ├── MidiControls/   # MIDI control components
│   │   ├── DeviceStatus/   # Device connection status
│   │   └── UI/             # Reusable UI components
│   ├── store/              # Redux store and slices
│   │   ├── index.ts        # Store configuration
│   │   ├── midiSlice.ts    # MIDI device state
│   │   └── rc10rSlice.ts   # RC-10r specific state
│   ├── services/           # Business logic services
│   │   ├── midi.ts         # Web MIDI API wrapper
│   │   └── rc10r.ts        # RC-10r specific MIDI commands
│   ├── types/              # TypeScript definitions
│   │   ├── midi.ts         # MIDI-related types
│   │   └── rc10r.ts        # RC-10r device types
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── styles/             # Custom CSS (if needed)
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
│   ├── index.html          # HTML template
│   └── favicon.ico         # Site icon
├── dist/                   # Build output (generated)
├── .github/
│   ├── workflows/
│   │   └── deploy.yml      # CI/CD pipeline
│   ├── copilot-instructions.md
│   └── prompts/
├── tests/                  # Test files
├── docs/                   # Documentation
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## Development Tooling Requirements

### Package.json Scripts
Include these essential npm scripts:
- `dev` - Start development server (Vite)
- `build` - Production build
- `preview` - Preview production build locally
- `lint` - ESLint linting
- `lint:fix` - Auto-fix ESLint issues
- `type-check` - TypeScript type checking
- `test` - Run test suite
- `test:watch` - Run tests in watch mode
- `test:coverage` - Generate test coverage report

### Dependencies

#### Production Dependencies
- `react` and `react-dom` (UI framework)
- `@reduxjs/toolkit` (state management)
- `react-redux` (React-Redux bindings)
- `@types/web-midi-api` (Web MIDI API types)

#### Development Dependencies
- `vite` (build tool)
- `@vitejs/plugin-react` (React support for Vite)
- `typescript` (TypeScript support)
- `tailwindcss` (CSS framework)
- `postcss` and `autoprefixer` (CSS processing)
- `eslint` and related plugins (code linting)
- `prettier` (code formatting)
- `vitest` (testing framework)
- `@testing-library/react` (React testing utilities)
- `@testing-library/jest-dom` (DOM testing matchers)

### Configuration Files

#### TypeScript Configuration (`tsconfig.json`)
- Strict type checking enabled
- Modern ES modules support
- React JSX support
- Path mapping for clean imports

#### ESLint Configuration (`.eslintrc.json`)
- TypeScript support
- React hooks rules
- Accessibility rules
- Prettier integration

#### Vite Configuration (`vite.config.ts`)
- React plugin
- Build optimization
- Development server configuration
- GitHub Pages deployment base path

#### Tailwind Configuration (`tailwind.config.js`)
- Custom color palette
- Responsive design breakpoints
- Component purging for production

## Boss RC-10r Integration Specifications

### MIDI Implementation Details
The RC-10r uses standard MIDI protocol with these key features:

#### Control Change (CC) Messages
- Track controls (record/play/stop per track)
- Rhythm pattern selection
- Volume and parameter adjustments
- Synchronization settings

#### System Exclusive (SysEx) Messages
- Device identification
- Advanced parameter access
- Firmware information retrieval

#### Program Change Messages
- Rhythm pattern switching
- Memory bank selection

### Required UI Components

#### Device Connection Panel
- MIDI device enumeration and selection
- Connection status indicator
- Automatic reconnection handling
- Error state display

#### Track Controls
- Individual track record/play/stop buttons
- Track volume sliders
- Track mute/solo controls
- Visual feedback for active tracks

#### Rhythm Section
- Rhythm pattern browser/selector
- Tempo control
- Start/stop rhythm playback
- Rhythm volume control

#### Global Controls
- Master volume
- All tracks stop/clear
- Synchronization mode toggle
- Device settings panel

## Testing Requirements

### Unit Tests
- MIDI service function testing
- Redux store action/reducer testing
- Utility function testing
- Component prop validation

### Integration Tests
- MIDI message flow testing
- Redux state management testing
- Component interaction testing
- Error handling scenarios

### End-to-End Testing (Manual)
- Device connection workflow
- All MIDI control functions
- Responsive design validation
- Browser compatibility testing

## CI/CD Pipeline Specifications

### GitHub Actions Workflow (`.github/workflows/deploy.yml`)
Create a workflow that:

1. **Triggers**: On push to `main` branch and pull requests
2. **Environment**: Ubuntu latest with Node.js 18+
3. **Steps**:
   - Checkout code
   - Setup Node.js and cache dependencies
   - Install dependencies (`npm ci`)
   - Run type checking (`npm run type-check`)
   - Run linting (`npm run lint`)
   - Run test suite (`npm test`)
   - Build production bundle (`npm run build`)
   - Deploy to GitHub Pages (main branch only)

### GitHub Pages Configuration
- Deploy from `gh-pages` branch or GitHub Actions
- Serve static files from `dist/` directory
- Configure custom domain if needed
- Enable HTTPS (required for Web MIDI API)

## Code Quality Standards

### TypeScript Guidelines
- Strict mode enabled
- Explicit typing for public APIs
- Proper interface definitions for all data structures
- No `any` types (use `unknown` if needed)

### React Best Practices
- Functional components with hooks
- Proper dependency arrays in useEffect
- Memoization for expensive computations
- Accessible component design

### MIDI Implementation Best Practices
- Proper error handling for MIDI access
- Device state synchronization
- Message queuing for rapid commands
- Resource cleanup on component unmount

## Documentation Requirements

### README.md Structure
1. Project description and purpose
2. Features and capabilities
3. Browser compatibility requirements
4. Installation and setup instructions
5. Development workflow
6. Deployment instructions
7. Contributing guidelines
8. License information

### Code Documentation
- JSDoc comments for public functions
- Inline comments for complex logic
- Type definitions with descriptions
- API documentation for MIDI integration

## Security and Performance Considerations

### Security
- HTTPS requirement for Web MIDI API
- No sensitive data storage
- Client-side only architecture
- Secure dependency management

### Performance
- Code splitting for optimal loading
- Lazy loading of non-critical components
- Efficient Redux state updates
- Optimized production builds

## Validation Steps

After generation, ensure the following work correctly:
1. `npm install` completes without errors
2. `npm run dev` starts development server
3. `npm run build` creates production bundle
4. `npm run lint` passes without errors
5. `npm run type-check` passes without errors
6. `npm test` runs all tests successfully
7. Application loads in browser and detects MIDI capability
8. Basic UI components render correctly
9. Responsive design works on mobile/desktop
10. Production build deploys successfully to GitHub Pages

## Include Copilot Instructions

The generated repository must include the following `.github/copilot-instructions.md` content:

```markdown
# RC-10 Remote Control Web App - Copilot Instructions

## Project Overview

This repository builds a static website using TypeScript that allows users to control their Boss RC-10r Rhythm Loop Station from their web browser. The app provides a modern web interface for musicians and audio engineers to interact with their Boss RC-10r device.

### Key Technologies
- **Language**: TypeScript
- **UI Framework**: React with Redux for state management
- **Build Tool**: Vite (bundler and development server)
- **Styling**: Tailwind CSS
- **MIDI Communication**: Web MIDI API
- **License**: MIT License

### Browser Compatibility
- Only supports modern web browsers with Web MIDI API support
- Target browsers: Chrome 43+, Edge 79+, Opera 30+
- Safari and Firefox require experimental flags or polyfills

## Project Architecture

### Directory Structure
```
/
├── src/                     # Source code
│   ├── components/          # React components
│   ├── store/              # Redux store and slices
│   ├── services/           # MIDI API services
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Tailwind CSS and custom styles
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── .github/                # GitHub configuration
│   ├── workflows/          # CI/CD pipelines
│   └── copilot-instructions.md
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # Project documentation
```

### Key Source Files
- `src/main.tsx` - Application entry point, React root rendering
- `src/components/App.tsx` - Main application component
- `src/store/index.ts` - Redux store configuration
- `src/services/midi.ts` - Web MIDI API integration
- `src/types/rc10r.ts` - Boss RC-10r device type definitions

## Development Workflow

### Building the Project
```bash
npm install          # Install dependencies
npm run dev         # Start development server (http://localhost:5173)
npm run build       # Build for production
npm run preview     # Preview production build locally
```

### Testing and Validation
```bash
npm run lint        # ESLint code linting
npm run type-check  # TypeScript type checking
npm test           # Run test suite (Jest/Vitest)
npm run test:watch # Run tests in watch mode
```

### Pre-commit Checks
The following checks should pass before committing:
1. TypeScript compilation (`npm run type-check`)
2. ESLint linting (`npm run lint`)
3. Unit tests (`npm test`)
4. Build success (`npm run build`)

## CI/CD Pipeline

### GitHub Actions Workflow
Located in `.github/workflows/deploy.yml`:
1. **On push to main branch**:
   - Install dependencies
   - Run linting and type checking
   - Run test suite
   - Build production bundle
   - Deploy to GitHub Pages

### GitHub Pages Deployment
- Production builds are automatically deployed to GitHub Pages
- Static site is served from the `dist/` directory
- Accessible at `https://higginsrob.github.io/RC-10remote/`

## Configuration Files

### Build & Development
- `vite.config.ts` - Vite configuration (build tool)
- `tsconfig.json` - TypeScript compiler options
- `package.json` - Dependencies, scripts, project metadata

### Styling & Linting
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS plugins configuration
- `.eslintrc.json` - ESLint rules and configuration
- `.prettierrc` - Code formatting rules

## Dependencies

### Production Dependencies
- `react` & `react-dom` - UI framework
- `@reduxjs/toolkit` - State management
- `react-redux` - React-Redux bindings
- Web MIDI API (browser native) - MIDI device communication

### Development Dependencies
- `vite` - Build tool and dev server
- `typescript` - Type checking and compilation
- `@vitejs/plugin-react` - React support for Vite
- `tailwindcss` - CSS framework
- `eslint` & `prettier` - Code linting and formatting
- `vitest` or `jest` - Testing framework

## Boss RC-10r Integration

### MIDI Implementation
The app communicates with the Boss RC-10r using:
- **MIDI Input**: Receives device status and feedback
- **MIDI Output**: Sends control commands to device
- **System Exclusive (SysEx)**: Device-specific commands
- **Control Change (CC)**: Parameter adjustments

### Key Features to Implement
- Track record/play/stop controls
- Rhythm pattern selection and control
- Loop synchronization settings
- Device status monitoring
- Parameter adjustment controls

## Validation Steps

### Manual Testing Checklist
1. **Web MIDI API Detection**: Verify browser compatibility message
2. **Device Connection**: Test MIDI device enumeration and connection
3. **Control Commands**: Verify each control sends correct MIDI messages
4. **Status Updates**: Confirm device status reflects in UI
5. **Responsive Design**: Test on different screen sizes
6. **Error Handling**: Test with device disconnected

### Automated Testing
- Unit tests for MIDI service functions
- Integration tests for Redux store actions
- Component rendering tests
- MIDI message validation tests

## Common Development Tasks

### Adding New Controls
1. Define MIDI messages in `src/types/rc10r.ts`
2. Create service functions in `src/services/midi.ts`
3. Add Redux actions/reducers in `src/store/`
4. Implement UI components in `src/components/`
5. Add corresponding tests

### Debugging MIDI Issues
- Use browser DevTools console for MIDI API logs
- Check `navigator.requestMIDIAccess()` availability
- Monitor MIDI message flow with Web MIDI API debugging
- Test with MIDI monitoring software for verification

## Security Considerations
- Web MIDI API requires HTTPS in production
- GitHub Pages automatically provides HTTPS
- No server-side components or user data storage
- Client-side only application

## Performance Notes
- Vite provides fast HMR (Hot Module Replacement) in development
- Production builds are optimized and minified
- Tailwind CSS is purged of unused styles
- Code splitting for optimal loading performance
```

## Success Criteria

The generated repository should:
1. Build and run without errors in development mode
2. Pass all linting and type checking
3. Include comprehensive test coverage
4. Deploy successfully to GitHub Pages
5. Provide a functional MIDI device detection interface
6. Include all necessary development tooling
7. Follow modern TypeScript and React best practices
8. Be ready for immediate development by a coding agent

Generate the complete repository structure with all files, configurations, and initial implementation.