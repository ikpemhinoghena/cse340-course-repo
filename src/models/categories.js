import db from './db.js';

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM category;
    `;

    const result = await db.query(query);
    return result.rows;
}

const getCategoryDetails = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.project_date AS date, 
            p.location, 
            p.organization_id, 
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date ASC;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Assigns a single category to a project in the many-to-many table.
 * @param {string} categoryId - The ID of the category.
 * @param {string} projectId - The ID of the project.
 */
const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

/**
 * Updates all category assignments for a specific project.
 * Deletes existing assignments and re-inserts the new ones.
 * @param {string} projectId - The ID of the project.
 * @param {Array} categoryIds - Array of category IDs to assign.
 */
const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

/**
 * Creates a new category in the database.
 * @param {string} name - The name of the category.
 * @returns {string} The id of the newly created category record.
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const queryParams = [name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};

/**
 * Updates an existing category in the database.
 * @param {string} categoryId - The ID of the category to update.
 * @param {string} name - The new name for the category.
 * @returns {string} The id of the updated category record.
 */
const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const queryParams = [name, categoryId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated category with ID:', categoryId);
    }

    return result.rows[0].category_id;
};

export { 
    getAllCategories, 
    getCategoryDetails, 
    getProjectsByCategoryId, 
    updateCategoryAssignments,
    createCategory,
    updateCategory 
};