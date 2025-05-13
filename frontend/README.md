# Scrypo Frontend

This is the frontend application for the Scrypo project. It is built using React and TypeScript, and it is powered by Vite for fast development and build processes.

## Project Structure

The project has the following structure:

```
eslint.config.js
index.html
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
public/
    vite.svg
src/
    App.css
    App.tsx
    index.css
    main.tsx
    vite-env.d.ts
    WalletConnectorModal.tsx
    assets/
        logo-scrypo-square.png
        logo-scrypo.png
        react.svg
    pages/
        Map/
            Map.tsx
        Profile/
            Profile.tsx
```

### Key Directories and Files

- **`public/`**: Contains static assets like images and icons.
- **`src/`**: Contains the main application code.
  - **`App.tsx`**: The root component of the application.
  - **`pages/`**: Contains individual pages of the application, such as `Map` and `Profile`.
  - **`assets/`**: Contains images and other static resources used in the application.
- **`vite.config.ts`**: Configuration file for Vite.
- **`tsconfig.json`**: TypeScript configuration file.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone 
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Development Server

Start the development server with the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Linting and Formatting

To lint the code, run:

```bash
npm run lint
```

To format the code, run:

```bash
npm run format
```

## Contributing

Contributions are welcome! Please follow the [code of conduct](CODE_OF_CONDUCT.md) and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)