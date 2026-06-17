import { addVolunteer, removeVolunteer } from '../models/volunteers.js';
import { requireLogin } from './users.js';

const processAddVolunteer = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);
        req.flash('success', 'You have successfully volunteered for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'An error occurred while volunteering.');
        res.redirect(`/project/${req.params.projectId}`);
    }
};

const processRemoveVolunteer = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.session.user.user_id;

        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed from this project.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'An error occurred while removing your volunteer status.');
        res.redirect(`/project/${req.params.projectId}`);
    }
};

export { processAddVolunteer, processRemoveVolunteer };