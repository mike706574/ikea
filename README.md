# ikea

[![npm version](https://badge.fury.io/js/ikea-alpha.svg)](https://badge.fury.io/js/ikea)

A library for preparing tabular data for display.

## Overview

### prepare

There are a few standalone functions for manipulating a set of items: `sort`, `exactFilter`, `filter`, and `paginate`.

`prepare` is a combination of `sort`, `filter`, and `paginate` into a single function. It takes 2 arguments: `params` and `items`.

The first argument, `params`, is a set of parameters that drive how the data set will be displayed. It would look something like this:

```javascript
{sortColumn: "name",
sortDescending: true,
filterValue: "do",
pageNumber: 1,
pageSize: 5}
```

These are optional - so, leave out `filterValue to skip filtering, `sortColumn` to skip sorting, or `pageNumber` to skip pagination, or use whatever combination you need.

The second argument, `items`, is the set of items - something like this:

```javascript
[{id: "1", name: "frog"},
 {id: "2", name: "dolphin"},
 {id: "3", name: "shark"},
 {id: "4", name: "dog"},
 {id: "5", name: "elephant"},
 {id: "6", name: "goat"},
 {id: "7", name: "sheep"},
 {id: "8", name: "monkey"},
 {id: "9", name: "giraffe"},
 {id: "10", name: "zebra"},
 {id: "11", name: "rhino"},
 {id: "12", name: "hippo"}];
```

The return value is an object with 2 properties: `items` and `filteredCount`.

With these examples of `params` and `items`, `prepare` would return this:

```javascript
{items: [{id: "4", name: "dog"},
         {id: "2", name: "dolphin"}],
 filteredCount: 2}
```

### change

There are a few standalone functions for manipulating a set of items: `changeFilter`, `changePageSize`, `changePage`, and `changeSort`.

`change` is a combination of all of these. `change` takes 2 arguments: `change` and `params`.

`change` is an object that specifies what type of change to make. Examples:

```javascript
{kind: "sort", value: "name"}
{kind: "page", value: 2}
{kind: "filter", value: "d"}
{kind: "pageSize", value: 10}
```

`params` is the same set of parameters from before.

The return value is a the set of parameters after applying the change.

## Build

[![CircleCI](https://circleci.com/gh/mike706574/ikea.svg?style=svg)](https://circleci.com/gh/mike706574/ikea)

## Copyright and License

The MIT License (MIT)

Copyright (c) 2018 Michael Easter

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
