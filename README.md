# ikea

[![npm version](https://badge.fury.io/js/ikea-alpha.svg)](https://badge.fury.io/js/ikea)

A library for preparing tabular data for display.

## Overview

In Javascript applications, oftentimes items that are displayed on a page in a list or a table need to be sorted, filtered, and paginated. With that, the parameters controlling those operations need to change, too. I've found myself writing the same code for these situations more than a few times, so this library attempts to provide some sort of common solution. 

Here's an example of the set of parameters that drive which items will be displayed, which we'll call `params`:

```javascript
{sortColumn: "name",
 sortDescending: true,
 filterValue: "do",
 pageNumber: 1,
 pageSize: 5}
```

There are three groups of `params`:

1) `sortColumn` and `sortDescending` for sorting
2) `filterValue` for filtering
3) `pageNumber` and `pageSize` for pagination

Each group is optional, so use any combination to fit your needs. For example, leave out `filterValue` if you don't need your items to be filtered:

```javascript
{sortColumn: "name",
 sortDescending: true,
 pageNumber: 1,
 pageSize: 5}
```

Or `pageNumber` and `pageSize` if pagination isn't needed:

```javascript
{sortColumn: "name",
 sortDescending: true,
 filterValue: "do"}
```

### prepare

There are a few standalone functions for manipulating a set of items: `sort`, `exactFilter`, `filter`, and `paginate`.

`prepare` is a combination of `sort`, `filter`, and `paginate` into a single function. It takes 2 arguments: `params` and `items`.

`params` is the same parameters as described above, while `items` is an array of items, which are objects:

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

There are a few standalone functions for manipulating `params`: `changeFilter`, `changePageSize`, `changePage`, and `changeSort`.

`change` is a combination of all of these. `change` takes 2 arguments: `change` and `params`.

`change` is an object that specifies what type of change to make. Examples:

```javascript
{kind: "sort", value: "name"}
{kind: "page", value: 2}
{kind: "filter", value: "d"}
{kind: "pageSize", value: 10}
```

`params` is the same set of parameters describe above.

The return value is a the set of parameters after applying the change.

## Build

[![CircleCI](https://circleci.com/gh/mike706574/ikea.svg?style=svg)](https://circleci.com/gh/mike706574/ikea)

## Copyright and License

The MIT License (MIT)

Copyright (c) 2018 Michael Easter

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
