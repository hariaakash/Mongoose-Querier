const get = require('lodash.get');
const set = require('lodash.set');


/**
 * Function to perform selection.
 * @param { Object } data - On which selection is done
 * @param { Array } selections - Keys to be selected
 * @return { Object }
 */
const format = (data, selections) => {
	const res = {};
	for (let i = 0; i < selections.length; i += 1) {
		const key = selections[i];
		if (get(data, key)) {
			const value = get(data, key);
			set(res, key, value);
		}
	}
	return res;
};


/**
 * Function to perform selection.
 * @param { Object } Schema - On which querier has to run
 * @param { Object|Array } data - Data on which selection is done.
 * @param { Query } select - Keys which has to be selected in Data.
 * @param { boolean } pagination - Whether pagination was performed or not.
 * @return { Object|Array }
 */
const selector = (Schema, data, select, pagination) => {
	const keys = Object.keys(Schema.schema.paths).filter((x) => !x.includes('__v'));

	let selections = keys;
	if (select !== '') selections = select.split(',');

	if (Array.isArray(data)) {
		data = data.map((x) => format(x, selections));
	} else if (pagination && data.docs) {
		data.docs = data.docs.map((x) => format(x, selections));
		delete data.meta.hasPrevPage;
		delete data.meta.hasNextPage;
		delete data.meta.pagingCounter;
		delete data.meta.prevPage;
		delete data.meta.nextPage;
	} else if (data) data = format(data, selections);
	return data;
};


/**
 * Function to perform filter.
 * @param { Object } query - Main collection query on which filters are applied
 * @param { [{
		key: string,
		data: any,
		type: ('date'|'match'|'multi')
	}] } filters - Filters
 * @return { Object } Returns modified query param sent as parameter
 * @example When type is 'match'
 * ```{ key: 'email', data: 'em@i.l', type: 'match' }```
 * @example When type is 'multi'
 * { key: 'email', data: ['em@i.l', 'my.em@i.l', type: 'multi' }
 * @example When type is 'date'
 * { key: 'created_at', data: { from, to }, type: 'date' }
 */
const filter = (query = {}, filters = []) => {
	filters.forEach((x) => {
		if (typeof x.key === 'string' && typeof x.type === 'string') {
			if (x.type === 'match' && typeof x.data === 'string') {
				query[x.key] = x.data;
			} else if (x.type === 'multi' && Array.isArray(x.data)) {
				query[x.key] = { $in: x.data };
			} else if (x.type === 'date' && typeof x.data === 'object') {
				if (x.data.from && x.data.to) {
					query[x.key] = { $gte: x.data.from, $lte: x.data.to };
				}
			}
		}
	});
	return query;
};

module.exports = { selector, filter };
