const DB_NAME = process.env.DB_NAME;
    DB_PASSWORD = process.env.DB_PASSWORD,
    DB_URI = `mongodb+srv://franklin:${DB_PASSWORD}@muzerk20.2beoo.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    JWT_KEY = process.env.JWT_KEY

module.exports = { DB_URI, JWT_KEY };

