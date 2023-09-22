import tableFields from './table-type';

function insertRow(row: tableFields): string {
    let i: number = 1;
    let values: string = '';
    const fields = `${Object.keys(row).map(e => {
        values += `$${i},`;
        i++;
        return e;
    })}`;
    let query = `INSERT INTO accounts (${fields}) 
        VALUES(${values.slice(0, values.length - 1)})`;
    // for (const value of Object.values(account)) {
    //     query += value + ',';
    // }
    // query = query.slice(0, query.length - 1) + ')'

    return query;
}

export { insertRow }