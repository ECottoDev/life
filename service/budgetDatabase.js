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
    host: 'mail.prw.net',
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
        user: 'ecotto@prw.net',
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
        const connectionConfig = {
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT
        };

        this.connection = mysql.createConnection(connectionConfig);

        this.connection.connect((err) => {
            if (err) throw err;
            console.log('Connected to Budget database!');
        });
    }

    async getAllCardData() {
        try {
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

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
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

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
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

            const mailOptions = {
                from: 'Lux Programming <ecotto@prw.net>',
                // from: 'Lux Programming <cottosoftwaredevelopment@gmail.com>',
                to: 'ecotto@cloudium.net',
                subject: 'Lux Programming - Bank information updated',
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

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log('Error with email: ');
                }
                console.log('Email sent: ' + info.response);
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log('Error updating card:');
            return false;
        }
    }

    async searchByName(name) {
        try {
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

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
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

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
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

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
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

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
            if (this.connection.state === 'disconnected') this.connection.connect((err) => {
                if (err) throw err;
                console.log('Connected!');
            })

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
