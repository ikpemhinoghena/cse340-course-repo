import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';

// Middleware Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.static(path.join(__dirname, 'public')));

// Route Handler Helper (Async/Await pattern)
const renderPage = async (req, res, pageName, pageTitle) => {
  try {
    res.render(pageName, { title: pageTitle });
  } catch (error) {
    console.error(`Error rendering ${pageName}:`, error);
    res.status(500).send('Internal Server Error');
  }
};

// Routes
app.get('/', (req, res) => renderPage(req, res, 'home', 'Home'));
app.get('/organizations', (req, res) => renderPage(req, res, 'organizations', 'Organizations'));
app.get('/projects', (req, res) => renderPage(req, res, 'projects', 'Service Projects'));
app.get('/categories', (req, res) => renderPage(req, res, 'categories', 'Categories'));

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  console.log(`Environment: ${nodeEnv}`);
});