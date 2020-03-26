/**
 * @module Querier
 *
 * @requires Querier.selector
 * @requires Querier.filter
 */
const { selector, filter } = require('./helpers');

/**
 * @constant module:Querier~paginationDefaultOptions
 */
const paginationDefaultOptions = {
	lean: true,
	leanWithId: false,
	customLabels: { meta: 'meta' },
};

/**
 * @typedef Options
 *
 * @property {String[]} [select=[]] - Keys which has to be selected for response
 * @property {Boolean} [pagination=false] - Whether pagination should be enabled
 * @property {Number} [page=1] - Page number for pagination
 * @property {Number} [limit=10] - Entries per page for pagination
 * @property {String} [search] - Search the collection
 */

/**
 * @typedef Data
 *
 * @property {String} id=list - list / ObjectId
 * @property {module:Querier~Filters[]} filters - Data for performing filter and sort
 * @property {module:Querier~Options} options - Options for pagination, search and selection
 */

/**
 * Querier function which supports pagination, sorting, filtering and searching.
 * @param {Object} Schema - On which querier has to run
 * @param {module:Querier~Data} data - Data for querying
 * @param {Object[]} [populate=[]] - Array of objects for populating fields
 * @param {Object} [query={}] - Predefined queries for mongodb
 * @return {Promise<Object|Array>} Object if the query has pagination enabled or if the id is ObjectId
 */
const handler = async (Schema, data, populate = [], query = {}) => {
	// Check variables
	if (!data.id) data.id = 'list';
	if (!data.filters) data.filters = [];
	if (!data.options) data.options = {};
	if (!data.options.select) data.options.select = [];
	if (!data.options.pagination) data.options.pagination = false;
	if (!data.options.search) data.options.search = null;

	// find / findOne / paginate
	let queryType;

	// Pagination Variables
	const { pagination = false } = data.options;
	const paginationOptions = paginationDefaultOptions;

	// Document wide search
	if (data.options.search) query.$text = { $search: data.options.search };

	// Filters
	query = filter(query, data.filters);

	if (data.id === 'list') {
		if (pagination) {
			queryType = 'paginate';
			paginationOptions.page = data.options.page || 1;
			paginationOptions.limit = data.options.limit || 10;
			paginationOptions.populate = populate;
		} else {
			queryType = 'find';
		}
	} else {
		queryType = 'findOne';
		query._id = data.id;
	}

	const result = queryType === 'paginate'
		? await Schema.paginate(query, paginationOptions)
		: await Schema[queryType](query).populate(populate);

	return selector(Schema, result, data.options.select, pagination);
};

module.exports = handler;
