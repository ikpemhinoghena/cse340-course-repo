// Import any needed model functions
// Note: If you don't have getAllProjects yet, this might error until you build it. 
// For now, we can leave it as the instructions suggest or use a simple render.
// Assuming you might not have the model yet, here is a safe version:
const showProjectsPage = async (req, res) => {
    const title = 'Service Projects';
    // If you have a model, use: const projects = await getAllProjects();
    res.render('projects', { title }); 
};

// Export any controller functions
export { showProjectsPage };