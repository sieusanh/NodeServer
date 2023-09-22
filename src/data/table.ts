
const accounts = `CREATE TABLE accounts (
    id serial PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(50),
    created_at NUMERIC(15) NOT NULL
)`;
// created_at TIMESTAMP NOT NULL

const account_logs = `CREATE TABLE account_logs (
    id serial PRIMARY KEY,
    user_id INT NOT NULL,
    login_at TIMESTAMP NOT NULL,
    logout_at TIMESTAMP,
    activities VARCHAR[],
    FOREIGN KEY (user_id) REFERENCES accounts (id)
)`;

const products = `CREATE TABLE products (
    id serial PRIMARY KEY,
    title VARCHAR(50) UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    discount: NUMERIC(10, 2) NOT NULL,
    rating: NUMERIC(10, 2) NOT NULL,
    stock: INT NOT NULL,
    brand VARCHAR(50) NOT NULL,
    category: VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL
)`;

const orders = `CREATE TABLE orders (
    id serial PRIMARY KEY,
    total_price NUMERIC(10, 2),
    user_id INT NOT NULL,
    product_ids INT[],
    FOREIGN KEY (EACH ELEMENT OF product_ids) REFERENCES products (id),
    FOREIGN KEY (user_id) REFERENCE accounts (id)
)`;

const alter_accounts = `ALTER TABLE accounts
    ALTER COLUMN created_at TYPE INT NOT NULL
`;

const drop_accounts = `DROP TABLE accounts;`

export default {
    accounts, account_logs, products,
    orders, alter_accounts, drop_accounts
};