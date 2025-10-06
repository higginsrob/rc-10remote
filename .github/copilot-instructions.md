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