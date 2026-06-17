import db from './db.js';

/**
 * Adds a user as a volunteer for a specific project.
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteers (user_id, project_id) 
        VALUES ($1, $2)
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Removes a user as a volunteer for a specific project.
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteers 
        WHERE user_id = $1 AND project_id = $2
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Checks if a specific user is already volunteering for a specific project.
 */
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT COUNT(*) 
        FROM volunteers 
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return parseInt(result.rows[0].count) > 0;
};

/**
 * Gets all projects that a specific user has volunteered for.
 */
const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name as organization_name
        FROM volunteers v
        JOIN project p ON v.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.project_date ASC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isUserVolunteering, getVolunteerProjects };