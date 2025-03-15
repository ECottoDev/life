// database.js
/**
* resumeDatabase.js
*
* @author Edwin Cotto <cottosoftwaredevelopment@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-May-14 initial version
*/

/*
 This file holds the connection to the database and the definition of the sql queries.
*/
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

class ResumeDatabase {
    constructor() {
        const connectionConfig = {
            //takes in the environment variables from service file.
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT
        };
        this.connection = mysql.createConnection(connectionConfig);
        this.connection.connect((err) => {
            if (err) throw err;
            console.log('Connected to resume database!');
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    async getEducationData() {
        try {
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM educationHistory;";
                this.connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }
    async searchByName(primary) {
        try {
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM <table> WHERE primary = ?;";

                this.connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async addEducationData(variablesToSend) {
        try {
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })
            //constants for variables to send
            // const name = schoolName;
            // const year = schoolYear;

            const response = await new Promise((resolve, reject) => {
                const query = "insert into <table>(<tableVariables...>) values(<? x quantity of variables>);";
                this.connection.query(query, [constantsOfVariables], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return response === 1 ? true : false;
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateEducationData(variables) {
        try {
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE educationHistory SET variable1 = ?, variable2 = ? WHERE primary = ?;";
                this.connection.query(query, [variables], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            })
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteEducationData(primary) {
        try {
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM <table> WHERE primary = ?;";
                this.connection.query(query, [primary], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                }
                )
            })
            return response === 1 ? true : false;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}

module.exports = new ResumeDatabase();
