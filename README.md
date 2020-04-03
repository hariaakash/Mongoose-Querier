# mongoose-querier

[![npm version](https://img.shields.io/npm/v/mongoose-querier.svg)](https://www.npmjs.com/package/mongoose-querier)
[![Dependency Status](https://img.shields.io/david/hariaakash/mongoose-querier.svg)](https://www.npmjs.com/package/mongoose-querier)
[![Dev Dependency Status](https://img.shields.io/david/dev/hariaakash/mongoose-querier.svg)](https://www.npmjs.com/package/mongoose-querier)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/hariaakash/mongoose-querier/issues)
[![Downloads](https://img.shields.io/npm/dm/mongoose-querier.svg)](https://www.npmjs.com/package/mongoose)
[![Github](https://img.shields.io/github/license/hariaakash/mongoose-querier.svg)](https://github.com/hariaakash/mongoose-querier/blob/HEAD/LICENSE)

> [Mongoose](http://mongoosejs.com) plugin which helps in querying Schema and supports pagination, filters, selection, searching, sorting.

[![NPM](https://nodei.co/npm/mongoose-querier.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/mongoose-querier)


## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Usage](#usage)
4. [API](#api)
5. [License](#license)

## Installation

```sh
npm install mongoose-querier -S
```

## Setup

> Add [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2) plugin and index the schema.

```js
const mongoose         = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const bookSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    title: String,
    genre: String,
    publishDate: Date
});

bookSchema.plugin(mongoosePaginate);

bookSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Book',  bookSchema);
```

## Usage

```js
// import plugin
const Querier = require('mongoose-querier');

// import Book Schema
const Book = require('./Book');

const method = async () => {
    const data = {
        id: 'list',
        options: {
            select: ['_id', 'title'],
        },
    };
    const populate = [{ path: 'author', model: 'Author' }];
    const res = await Querier(Book, data, populate);
};
```

## API 

```js
await Querier([schema], [data], [populate], [defaultQuery]);
```

**Parameters**

* `[schema]`           {Object} Mongoose Schema Model (required)
* `[data]`             {Object} (required)
    - `id`             {String} Can be valid Mongoose ObjectId or `list` (required)
    - `filters`        {Object[]} Data for performing filters (optional)
        - `type`       {String} Can be `match` or `multi` or `date`
        - `key`        {String} Schema field on which the filter operation will be performed
        - `data`       {Any} Data to perform the filter 
    - `options`        {Object} Options for plugin (optional)
        - `select`     {String[]} Keys which has to be present in the response (optional, by default sends all key)
        - `search`     {String} Schema wide search (optional, by default value is null)
* `populate`       {Object[]} Mongoose Populate wihch takes in array of objects (optional)
* `defaultQuery`   {Object} Default queries can also be passed here (optional, by default it's empty)

### Examples of data.filters field
```js
[
    { type: 'match', key: 'author', data: 'ObjectId' },
    { type: 'multi', key: 'genre', data: ['Fantasy', 'Horror'] },
    { type: 'date', key: 'publishDate', data: { from: 'date', to: 'date' } },
]
```
### License

[MIT](LICENSE)
