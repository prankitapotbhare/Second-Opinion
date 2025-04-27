/**
 * Service for common database query operations
 */
const { createError, notFoundError } = require('../utils/error.util');

/**
 * Find document by ID with error handling
 * @param {Model} Model - Mongoose model
 * @param {string} id - Document ID
 * @param {string} select - Fields to select (optional)
 * @param {string} populate - Fields to populate (optional)
 * @param {string} entityName - Entity name for error message
 * @returns {Promise<Object>} Found document
 * @throws {Error} If document not found
 */
exports.findById = async (Model, id, select = '', populate = '', entityName = 'Document') => {
  let query = Model.findById(id);
  
  if (select) {
    query = query.select(select);
  }
  
  if (populate) {
    query = query.populate(populate);
  }
  
  const doc = await query;
  
  if (!doc) {
    throw notFoundError(`${entityName} not found`);
  }
  
  return doc;
};

/**
 * Find document by custom field with error handling
 * @param {Model} Model - Mongoose model
 * @param {Object} filter - Filter criteria
 * @param {string} select - Fields to select (optional)
 * @param {string} populate - Fields to populate (optional)
 * @param {string} entityName - Entity name for error message
 * @returns {Promise<Object>} Found document
 * @throws {Error} If document not found
 */
exports.findOne = async (Model, filter, select = '', populate = '', entityName = 'Document') => {
  let query = Model.findOne(filter);
  
  if (select) {
    query = query.select(select);
  }
  
  if (populate) {
    query = query.populate(populate);
  }
  
  const doc = await query;
  
  if (!doc) {
    throw notFoundError(`${entityName} not found`);
  }
  
  return doc;
};

/**
 * Get paginated results
 * @param {Model} Model - Mongoose model
 * @param {Object} filter - Filter criteria
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} sort - Sort criteria
 * @param {string} select - Fields to select
 * @param {string} populate - Fields to populate
 * @returns {Promise<Object>} Paginated results
 */
exports.getPaginated = async (Model, filter = {}, page = 1, limit = 10, sort = '-createdAt', select = '', populate = '') => {
  const skip = (page - 1) * limit;
  
  let query = Model.find(filter);
  
  if (select) {
    query = query.select(select);
  }
  
  if (sort) {
    query = query.sort(sort);
  }
  
  if (populate) {
    query = query.populate(populate);
  }
  
  const [results, total] = await Promise.all([
    query.skip(skip).limit(limit),
    Model.countDocuments(filter)
  ]);
  
  return {
    results,
    page: Number(page),
    limit: Number(limit),
    total
  };
};

/**
 * Create a new document
 * @param {Model} Model - Mongoose model
 * @param {Object} data - Document data
 * @returns {Promise<Object>} Created document
 */
exports.create = async (Model, data) => {
  return await Model.create(data);
};

/**
 * Update document by ID
 * @param {Model} Model - Mongoose model
 * @param {string} id - Document ID
 * @param {Object} data - Update data
 * @param {Object} options - Update options
 * @param {string} entityName - Entity name for error message
 * @returns {Promise<Object>} Updated document
 * @throws {Error} If document not found
 */
exports.updateById = async (Model, id, data, options = { new: true, runValidators: true }, entityName = 'Document') => {
  const doc = await Model.findByIdAndUpdate(id, data, options);
  
  if (!doc) {
    throw notFoundError(`${entityName} not found`);
  }
  
  return doc;
};

/**
 * Delete document by ID
 * @param {Model} Model - Mongoose model
 * @param {string} id - Document ID
 * @param {string} entityName - Entity name for error message
 * @returns {Promise<Object>} Deleted document
 * @throws {Error} If document not found
 */
exports.deleteById = async (Model, id, entityName = 'Document') => {
  const doc = await Model.findByIdAndDelete(id);
  
  if (!doc) {
    throw notFoundError(`${entityName} not found`);
  }
  
  return doc;
};