const Helpers = require('./helpers');

// Data structure
// data: { id, query: [{ key, data, type }], options: { select, pagination, page, limit, search } }

// Defaults
const paginationDefaultOptions = {
	lean: true,
	leanWithId: false,
	customLabels: { meta: 'meta' },
};


/**
 * Querier function which supports pagination, sorting, filtering and searching.
 * @param { Object } Schema - On which querier has to run
 * @param { Object } data - Data for querying
 * @param { 'list' | 'ObjectId' } data.id=list - List / ObjectId
 * @param { [{
	key: string,
	data: any,
	type: ('date'|'match'|'multi')
}] } data.query - Query data for performing filter and sort
 * @param { Object } data.options - Options for pagination, search and selection
 * @param { string } [data.options.select=all] - Keys separated with comma which has to be
 * selected for response
 * @param { boolean } [data.options.pagination=false] - Whether pagination should be enabled
 * @param { number } [data.options.page=1] - Page number for pagination
 * @param { number } [data.options.limit=10] - Entries per page for pagination
 * @param { string } [data.options.search] - Search the collection
 * @param { Object } query - Predefined queries for mongodb
 * @param { Array } populate - Array of objects for populating fields
 * @return { Object|Array } Object if the query has pagination enabled or if the id is ObjectId
 */
const handler = async (Schema, data = {}, query = {}, populate = []) => {
	// Check variables
	if (!data.id) data.id = 'list';
	if (!data.query) data.query = [];
	if (!data.options) data.options = {};
	if (!data.options.select) data.options.select = '';
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
	query = Helpers.filter(query, data.query);

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

	return Helpers.selector(Schema, result, data.options.select, pagination);
};

module.exports = handler;
