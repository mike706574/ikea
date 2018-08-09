import {isPageNumberValid, countPages, change, prepare, sort} from "./index";

const columns = [{id: "id",
                  label: "ID",
                  width: "500",
                  sort: true,
                  filter: true},
                 {id: "name",
                  label: "Name",
                  width: "500",
                  sort: true,
                  filter: true}];

const animals = [{id: "1", name: "frog"},
                 {id: "2", name: "dog"},
                 {id: "3", name: "shark"},
                 {id: "4", name: "dolphin"},
                 {id: "5", name: "elephant"},
                 {id: "6", name: "goat"},
                 {id: "7", name: "sheep"},
                 {id: "8", name: "monkey"},
                 {id: "9", name: "giraffe"},
                 {id: "10", name: "zebra"},
                 {id: "11", name: "rhino"},
                 {id: "12", name: "hippo"}];

test("counting pages", () => {
  expect(countPages({pageSize: 3}, [])).toEqual(1);
  expect(countPages({pageSize: 3}, [1])).toEqual(1);
  expect(countPages({pageSize: 3}, [1, 2, 3])).toEqual(1);
  expect(countPages({pageSize: 3}, [1, 2, 3, 4])).toEqual(2);
  expect(countPages({pageSize: 3}, [1, 2, 3, 4, 5])).toEqual(2);
  expect(countPages({pageSize: 3}, [1, 2, 3, 4, 5, 6])).toEqual(2);
  expect(countPages({pageSize: 3}, [1, 2, 3, 4, 5, 6, 7])).toEqual(3);
});

test("page number validation", () => {
  expect(isPageNumberValid({pageNumber: 0, pageSize: 3}, [])).toEqual(false);
  expect(isPageNumberValid({pageNumber: 2, pageSize: 3}, [])).toEqual(false);
  expect(isPageNumberValid({pageNumber: 1, pageSize: 3}, [1, 2, 3])).toEqual(true);
  expect(isPageNumberValid({pageNumber: 2, pageSize: 3}, [1, 2, 3])).toEqual(false);
});

test("paging", () => {
  const params = {columns, pageNumber: 1, pageSize: 5};

  let result = prepare(params, animals);

  expect(result.items).toEqual([{id: "1", name: "frog"},
                                {id: "2", name: "dog"},
                                {id: "3", name: "shark"},
                                {id: "4", name: "dolphin"},
                                {id: "5", name: "elephant"}]);
  expect(result.filteredCount).toEqual(12);

  result = prepare({...params, pageNumber: 2}, animals);

  expect(result.items).toEqual([{id: "6", name: "goat"},
                                {id: "7", name: "sheep"},
                                {id: "8", name: "monkey"},
                                {id: "9", name: "giraffe"},
                                {id: "10", name: "zebra"}]);
  expect(result.filteredCount).toEqual(12);

  result = prepare({...params, pageNumber: 3}, animals);

  expect(result.items).toEqual([{id: "11", name: "rhino"},
                                {id: "12", name: "hippo"}]);
  expect(result.filteredCount).toEqual(12);
});

test("sorting", () => {
  const params = {columns, sortColumn: "name", sortDescending: true};

  let result = prepare(params, animals);

  expect(result.items).toEqual([{id: "2", name: "dog"},
                                {id: "4", name: "dolphin"},
                                {id: "5", name: "elephant"},
                                {id: "1", name: "frog"},
                                {id: "9", name: "giraffe"},
                                {id: "6", name: "goat"},
                                {id: "12", name: "hippo"},
                                {id: "8", name: "monkey"},
                                {id: "11", name: "rhino"},
                                {id: "3", name: "shark"},
                                {id: "7", name: "sheep"},
                                {id: "10", name: "zebra"}]);
  expect(result.filteredCount).toEqual(12);


  result = prepare({...params, sortDescending: false}, animals);

  expect(result.items).toEqual([{id: "10", name: "zebra"},
                                {id: "7", name: "sheep"},
                                {id: "3", name: "shark"},
                                {id: "11", name: "rhino"},
                                {id: "8", name: "monkey"},
                                {id: "12", name: "hippo"},
                                {id: "6", name: "goat"},
                                {id: "9", name: "giraffe"},
                                {id: "1", name: "frog"},
                                {id: "5", name: "elephant"},
                                {id: "4", name: "dolphin"},
                                {id: "2", name: "dog"}]);
  expect(result.filteredCount).toEqual(12);
});

test("sorting with nulls", () => {
  const params = {columns, sortColumn: "name", sortDescending: true};

  let items = sort(params, [{id: "1", name: "banana"},
                            {id: "2", name: "apple"},
                            {id: "3", name: null},
                            {id: "4", name: "cat"},
                            {id: "5", name: "aardvark"}]);

  expect(items).toEqual([{"id": "5", "name": "aardvark"},
                         {"id": "2", "name": "apple"},
                         {"id": "1", "name": "banana"},
                         {"id": "4", "name": "cat"},
                         {"id": "3", "name": null}]);
});

test("filtering", () => {
  const params = {columns, filterValue: ""};

  let result = prepare(params, animals);

  expect(result.items).toEqual(animals);
  expect(result.filteredCount).toEqual(12);

  result = prepare({...params, filterValue: "d"}, animals);

  expect(result.items).toEqual([{id: "2", name: "dog"},
                                {id: "4", name: "dolphin"}]);
  expect(result.filteredCount).toEqual(2);

  result = prepare({...params, filterValue: "eajfgeoiawjg0"}, animals);

  expect(result.items).toEqual([]);
  expect(result.filteredCount).toEqual(0);
});

test("filter change", () => {
  const params = {sortColumn: null,
                  sortDescending: true,
                  filterValue: "",
                  pageNumber: 1,
                  pageSize: 10};

  let result = change({kind: "filter",
                       value: "foo"},
                      params);

  expect(result).toEqual({sortColumn: null,
                          sortDescending: true,
                          filterValue: "foo",
                          pageNumber: 1,
                          pageSize: 10});
});

test("page size change", () => {
  const params = {sortColumn: null,
                  sortDescending: true,
                  filterValue: "",
                  pageNumber: 3,
                  pageSize: 10};

  let result = change({kind: "pageSize",
                       value: 25},
                      params);

  expect(result).toEqual({sortColumn: null,
                          sortDescending: true,
                          filterValue: "",
                          pageNumber: 1,
                          pageSize: 25});
});

test("page", () => {
  const params = {sortColumn: null,
                  sortDescending: true,
                  filterValue: "",
                  pageNumber: 1,
                  pageSize: 10};

  let result = change({kind: "page",
                       value: 2},
                      params);

  expect(result).toEqual({sortColumn: null,
                          sortDescending: true,
                          filterValue: "",
                          pageNumber: 2,
                          pageSize: 10});
});

test("sort", () => {
  const params = {sortColumn: null,
                  sortDescending: true,
                  filterValue: "",
                  pageNumber: 1,
                  pageSize: 10};

  let result = change({kind: "sort",
                       value: "name"},
                      params);

  expect(result).toEqual({sortColumn: "name",
                          sortDescending: true,
                          filterValue: "",
                          pageNumber: 1,
                          pageSize: 10});

  result = change({kind: "sort",
                   value: "name"},
                  result);

  expect(result).toEqual({sortColumn: "name",
                          sortDescending: false,
                          filterValue: "",
                          pageNumber: 1,
                          pageSize: 10});

  result = change({kind: "sort",
                   value: "id"},
                  result);

  expect(result).toEqual({sortColumn: "id",
                          sortDescending: true,
                          filterValue: "",
                          pageNumber: 1,
                          pageSize: 10});
});
