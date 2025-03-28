// database.js
/**
* resumeDatabase.js
*
* @author Edwin Cotto <cottosoftwaredevelopment@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-May-14 initial version
*/

const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

class ResumeDatabase {
    constructor() {
        this.connectionConfig = {
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT
        };

        this.connection = mysql.createConnection(this.connectionConfig);

        this.connection.connect((err) => {
            if (err) throw err;
            console.log('Connected to resume database!');
        });
    }

    async query(sql, args) {
        await this.checkConnection();
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    checkConnection(retries = 3, delay = 1000) {
        const getStatus = () => {
            const conn = this.connection;
            if (!conn) return 'no_connection';
            if (conn._fatalError) return 'fatal_error';
            if (conn._protocolError) return 'protocol_error';
            if (!conn.stream) return 'no_stream';
            if (conn.stream.destroyed) return 'destroyed';
            if (conn.stream.connecting) return 'connecting';
            if (conn.authorized) return 'connected';
            return 'disconnected';
        };

        return new Promise((resolve, reject) => {
            const status = getStatus(this.connection);

            if (['fatal_error', 'no_stream', 'destroyed', 'protocol_error', 'disconnected', 'no_connection'].includes(status)) {
                const reconnect = (attemptsLeft) => {
                    console.warn(`++ DB Reconnecting... (${retries - attemptsLeft + 1})`);
                    this.connection = mysql.createConnection(this.connectionConfig);
                    this.connection.connect((err) => {
                        if (err) {
                            console.error('++ Reconnect failed:', err.message);
                            if (attemptsLeft > 1) {
                                setTimeout(() => reconnect(attemptsLeft - 1), delay);
                            } else {
                                reject(new Error('++ All DB reconnection attempts failed.'));
                            }
                        } else {
                            console.log('++ DB Reconnected successfully.');
                            resolve();
                        }
                    });
                };
                reconnect(retries);
            } else if (status === 'connected') {
                console.log('++ DB connection is active.');
                resolve();
            } else {
                console.warn('++ DB connection is in an unknown or idle state:', status);
                resolve();
            }
        });
    }

    async getEducationData() {
        try {
            await this.checkConnection();
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
    async addEducationData(schoolName, schoolYear, concentration, graduated) {
        try {
            await this.checkConnection();
            const name = schoolName;
            const year = schoolYear;
            const conc = concentration;
            const grad = graduated;
            const response = await new Promise((resolve, reject) => {
                const query = "insert into educationHistory(schoolName, schoolYear, concentration, graduated) values(?,?,?,?);";
                this.connection.query(query, [name, year, conc, grad], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return {
                id: response.insertId,
                name: schoolName,
                year: schoolYear,
                concentration: concentration,
                graduated: graduated
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateEducationData(id, schoolName, schoolYear, concentration, graduated) {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE educationHistory SET schoolName = ?, schoolYear = ?, concentration = ?, graduated = ? WHERE id = ?;";
                this.connection.query(query, [schoolName, schoolYear, concentration, graduated, id], (err, result) => {
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
    async deleteEducationData(id) {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM educationHistory WHERE id = ?;";
                this.connection.query(query, [id], (err, result) => {
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


    //experienceHistory
    async getExperienceData() {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM workExperience;";
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

    async addExperienceData(company, position, duties, timeWorked) {
        try {
            await this.checkConnection();

            const response = await new Promise((resolve, reject) => {
                const query = "insert into workExperience(company, position, duties, timeWorked) values(?,?,?,?);";
                this.connection.query(query, [company, position, duties, timeWorked], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return {
                id: response.insertId,
                name: company,
                position: position,
                duties: duties,
                timeWorked: timeWorked
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateExperienceData(id, company, position, duties, timeWorked) {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE workExperience SET Company = ?, Position = ?, Duties = ?, TimeWorked= ? WHERE id = ?;";
                this.connection.query(query, [company, position, duties, timeWorked, id], (err, result) => {
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
    async deleteExperienceData(id) {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM workExperience WHERE id = ?;";
                this.connection.query(query, [id], (err, result) => {
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
    //skills
    async getSkillsData() {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM skills;";
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
    async addSkillsData(name, skillLevel) {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "insert into skills(name, skillLevel) values(?,?);";
                this.connection.query(query, [name, skillLevel], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return {
                id: response.insertId,
                name: name,
                skillLevel: skillLevel
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateSkillsData(id, name, skillLevel) {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE skills SET name = ?, skillLevel = ? WHERE id = ?;";
                this.connection.query(query, [name, skillLevel, id], (err, result) => {
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
    async deleteSkillsData(id) {
        try {
            await this.checkConnection();
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM skills WHERE id = ?;";
                this.connection.query(query, [id], (err, result) => {
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

    // async searchByName(name) {
    //     try {
    //         if (this.connection.state === 'disconnected') this.connection.connect((err) => {
    //             if (err) throw err;
    //             console.log('Connected!');
    //         })
    //         const response = await new Promise((resolve, reject) => {
    //             const query = "SELECT * FROM BudgetData WHERE cardName = ?;";

    //             this.connection.query(query, [name], (err, results) => {
    //                 if (err) reject(new Error(err.message));
    //                 resolve(results);
    //             })
    //         });

    //         return response;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

}

module.exports = new ResumeDatabase();
