// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error in showOrganizationsPage:', error);
        req.flash('error', 'Could not load organizations.');
        res.redirect('/');
    }
};

const showOrganizationDetailsPage = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);
        const projects = await getProjectsByOrganizationId(organizationId);
        const title = 'Organization Details';
        res.render('organization', { title, organizationDetails, projects });
    } catch (error) {
        console.error('Error in showOrganizationDetailsPage:', error);
        req.flash('error', 'Could not load organization details.');
        res.redirect('/organizations');
    }
};

const showNewOrganizationForm = async (req, res) => {
    try {
        const title = 'Add New Organization';
        res.render('new-organization', { title });
    } catch (error) {
        console.error('Error in showNewOrganizationForm:', error);
        req.flash('error', 'Could not load the form.');
        res.redirect('/organizations');
    }
};

const processNewOrganizationForm = async (req, res) => {
    try {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect('/new-organization');
        }

        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png'; 

        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        
        req.flash('success', 'Organization added successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('Error in processNewOrganizationForm:', error);
        req.flash('error', 'An error occurred while adding the organization.');
        res.redirect('/new-organization');
    }
};

const showEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);
        const title = 'Edit Organization';
        res.render('edit-organization', { title, organizationDetails });
    } catch (error) {
        console.error('Error in showEditOrganizationForm:', error);
        req.flash('error', 'Could not load organization details for editing.');
        res.redirect('/organizations');
    }
};

const processEditOrganizationForm = async (req, res) => {
    try {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect('/edit-organization/' + req.params.id);
        }

        const organizationId = req.params.id;
        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
        
        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('Error in processEditOrganizationForm:', error);
        req.flash('error', 'An error occurred while updating the organization.');
        res.redirect('/edit-organization/' + req.params.id);
    }
};

// Export any controller functions
export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};