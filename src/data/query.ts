
function getFilterString(params: object): string {
    if (Object.keys(params).length == 0) {
        return '';
    }
    const copyParams = { ...params };
    const objects = Object.entries(copyParams);
    let filterString = `${objects[0][0]} = '${objects[0][1]}' `;
    if (objects.length > 1) {
        // Remove the first element
        objects.splice(0, 1);

        for (const [key, value] of objects) {
            filterString += `AND ${key} = '${value}' `
        }
    }

    return `WHERE ${filterString}`;
}

function countRecords(params: object): string {
    const filterString = getFilterString(params);
    const query = `SELECT COUNT(id) FROM accounts 
        ${filterString}`;

    return query;
}

// function find(params: tableFields): string {
function findRecords(params: object): string {
    const filterString = getFilterString(params);
    const query = `SELECT * FROM accounts 
        ${filterString}
        ORDER BY id ASC`;
    // WHERE id = $1`;

    return query;
}

function deleteRecord(id: number): string {
    let query = `DELETE FROM accounts 
        WHERE id = $1`;
    return query;
}

export { countRecords, findRecords, deleteRecord };