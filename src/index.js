import get from "lodash.get";

function comparator(path) {
  return (a, b) => {
    const aValue = get(a, path);
    const bValue = get(b, path);

    if(aValue == null) {
      return 1;
    }
    else if(bValue == null) {
      return -1;
    }
    if (aValue < bValue) {
      return -1;
    }
    if (aValue > bValue) {
      return 1;
    }
    return 0;
  };
}

function flip(f) {
  return (a, b) => f(b, a);
}

function flipWhen(condition, f) {
  return condition ? flip(f) : f;
}

export function sort({columns, sortDescending, sortColumn}, items) {
  let sortedItems = items;

  if(sortColumn !== null) {
    const column = columns.find(column => column.id === sortColumn);

    if(!column) {
      throw new Error(`Column ${sortColumn} not found.`);
    }

    let path = column.path || sortColumn;

    let comp = flipWhen(!sortDescending, comparator(path));

    sortedItems.sort(comp);
  }

  return sortedItems;
}

export function exactFilter({columns, filterColumn, filterValue}, items) {
  if(filterValue == null || filterValue === "") {
    return items;
  }

  const column = columns.find(column => column.id === filterColumn);
  const path = column.path || column.id;

  return items.filter(item => {
    const value = get(item, path);
    return value === filterValue;
  });
}

export function filter({columns, filterValue}, items) {
  if(filterValue == null || filterValue === "") {
    return items;
  }

  const filterableColumns = columns.filter(column => column.filter);

  if(filterableColumns.length === 0) {
    return items;
  }

  return items.filter(item => {
    return filterableColumns.some(column => {
      const path = column.path || column.id;
      const value = get(item, path);
      if(value == null) {
        return false;
      }
      let adjustedFilterValue = filterValue;
      if(typeof value === "number") {
        adjustedFilterValue = adjustedFilterValue.replace(/,/g, "");
      }

      return value.toString().toLowerCase().indexOf(adjustedFilterValue.toLowerCase()) !== -1;
    });
  });
}

export function countPages({pageSize}, items) {
  return Math.max(Math.ceil(items.length / pageSize), 1);
}

export function isPageNumberValid(params, items) {
  return params.pageNumber > 0 && params.pageNumber <= countPages(params, items);
}

export function isPageNumberInvalid(params, items) {
  return !isPageNumberValid(params, items);
}

export function paginate({pageNumber, pageSize}, items) {
  const firstIndex = pageSize * (pageNumber - 1);
  return items.slice(firstIndex, firstIndex + pageSize);
}

export function prepare(params, items) {
  let preparedItems = items.slice(0),
      filteredCount = preparedItems.length;

  if("filterValue" in params) {
    preparedItems = filter(params, preparedItems);
    filteredCount = preparedItems.length;
  }

  if("sortColumn" in params) {
    preparedItems = sort(params, preparedItems);
  }

  if("pageNumber" in params) {
    preparedItems = paginate(params, preparedItems);
  }

  return {items: preparedItems, filteredCount};
}

export function changeFilter(filterValue, params) {
  return {...params,
          filterValue,
          pageNumber: 1};
}

export function changePageSize(pageSize, params) {
  return {...params,
          pageSize,
          pageNumber: 1};
}

export function changePage(pageNumber, params) {
  return {...params, pageNumber};
}

export function changeSort(sortColumn, params) {
  const currentSortColumn = params.sortColumn;
  const currentSortDescending = params.sortDescending;
  const sortedBy = sortColumn === currentSortColumn;
  const sortDescending = sortedBy ? !currentSortDescending : true;
  return {...params, sortColumn, sortDescending};
}

export function select(change, params) {
  const selected = new Set(params.selected);
  const {id} = change;

  if(selected.has(id)) {
    selected.delete(id);
  }
  else {
    selected.add(id);
  }

  return {...params, selected};;
}

export function selectAll(change, params) {
  const {items, selectionId} = params;
  const selected = new Set(params.selected);
  items.forEach(item => selected.add(item[selectionId]));
  return {...params, selected};
}

export function deselectAll(change, params) {
  const selected = new Set(params.selected);
  selected.clear();
  return {...params, selected};
}

export function selectAllDisplayed(change, params) {
  const {items, selectionId} = params;
  const selected = new Set(params.selected);
  prepare(params, items)
    .items
    .forEach(item => selected.add(item[selectionId]));
  return {...params, selected};
}

export function deselectAllDisplayed(change, params) {
  const {items, selectionId} = params;
  const selected = new Set(params.selected);
  prepare(params, items)
    .items
    .forEach(item => selected.delete(item[selectionId]));
  return {...params, selected};
}

export function change(change, params) {
  const {kind, value} = change;
  switch(kind) {
    case "filter": return changeFilter(value, params);
    case "pageSize": return changePageSize(value, params);
    case "sort": return changeSort(value, params);
    case "page": return changePage(change.value, params);
    case "select": return select(change, params);
    case "selectAll": return selectAll(change, params);
    case "deselectAll": return deselectAll(change, params);
    case "selectAllDisplayed": return selectAllDisplayed(change, params);
    case "deselectAllDisplayed": return deselectAllDisplayed(change, params);
    default: throw new Error("Invalid change type: " + kind);
  }
}
