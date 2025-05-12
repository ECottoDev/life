/**
* budgetDatabase.js
*
* @author Edwin Cotto <cottosoftwaredevelopment@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-May-14 initial version
*/
const mysql = require('mysql2');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.us-east-1.awsapps.com',
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: 'ecotto@cottodev.com',
        pass: 'Luxian1037@',
    },
});
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'cottosoftwaredevelopment@gmail.com',
//         pass: 'uecw rqgf lokk eifs', // Use App Password if 2FA is enabled
//     },
// });

dotenv.config();

class BudgetDatabase {
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
            console.log('Connected to Budget database!');
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

    async getAllCardData() {
        try {
            await this.checkConnection();

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM BudgetData;";
                this.connection.query(query, (err, results) => {
                    if (err) reject(new Error({ Errors: err.message }));
                    resolve(results);
                })
            })
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }

    async insertNewName(name, billing, amountDue, amountMinDue, loan) {
        try {
            await this.checkConnection();

            const response = await new Promise((resolve, reject) => {
                const query = "Insert Into BudgetData(cardName, billing, amountDue, amountMinDue, loan) values (?,?,?,?,?);";
                this.connection.query(query, [name, billing, amountDue, amountMinDue, loan], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            return {
                cardID: response.insertId,
                cardName: name,
                amountDue: amountDue,
                amountMinDue: amountMinDue

            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateCard(id, amountDue) {
        try {
            await this.checkConnection();

            if (isNaN(amountDue) || amountDue === null || amountDue === undefined || amountDue === '') {
                throw new Error('Invalid amount. Please provide a valid number.');
            }

            const mailOptions = {
                from: 'CTO-DEV <ecotto@cottodev.com>',
                to: 'development@cottodev.com',
                subject: 'Budget Notification - Bank information updated',
                text: `One of your cards has been updated at ${new Date().toLocaleString()}`,
            };

            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE BudgetData SET amountDue = ? WHERE cardID = ?";

                this.connection.query(query, [amountDue, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            //transporter.sendMail(mailOptions, (error, info) => {
            //    if (error) {
            //        return console.log('Error with email: ');
            //    }
            //    console.log('Email sent: ' + info.response);
            //});

            return response === 1 ? true : false;
        } catch (error) {
            console.log('Error updating card:');
            return false;
        }
    }

    async searchByName(name) {
        try {
            await this.checkConnection();

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM BudgetData WHERE cardName = ?;";

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
    async getBudget() {
        try {
            await this.checkConnection();

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM budgetformonth;";
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
    async updateBudget(amount) {
        try {

            await this.checkConnection();
            if (isNaN(amount)) {
                throw new Error('Invalid amount. Please provide a valid number.');
            }
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE budgetformonth SET budget = ?";

                this.connection.query(query, [amount], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async getBank() {
        try {
            await this.checkConnection();

            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM currentBankAmount;";
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

    async updateBank(amount) {
        try {
            await this.checkConnection();
            if (isNaN(amount)) {
                throw new Error('Invalid amount. Please provide a valid number.');
            }
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE currentBankAmount SET currentBankAmount = ?";

                this.connection.query(query, [amount], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
module.exports = new BudgetDatabase();
