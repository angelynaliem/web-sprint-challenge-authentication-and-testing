module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./data/auth.db3" },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations",
    },
  },

  testing: {
    client: "sqlite3",
    connection: {
      filename: "./data/auth.db3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations",
    },
  },
};
