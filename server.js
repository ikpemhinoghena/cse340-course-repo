import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
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
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

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
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
});
app.get('/projects', (req, res) => renderPage(req, res, 'projects', 'Service Projects'));
app.get('/categories', (req, res) => renderPage(req, res, 'categories', 'Categories'));

// Start Server
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});