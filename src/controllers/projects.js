// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Define constants
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    
    if (!project) {
        // If project not found, trigger a 404 error
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Service Project Details';
    res.render('project', { title, project });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };