const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'mail.prw.net',
//     port: 465,
//     secure: true, // true for 465, false for 587
//     auth: {
//         user: 'ecotto@prw.net',
//         pass: 'Luxian1037@',
//     },
// });
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cottosoftwaredevelopment@gmail.com',
        pass: 'uecw rqgf lokk eifs', // Use App Password if 2FA is enabled
    },
});

dotenv.config();

class LoginDatabase {
    constructor() {
        this.connectionConfig = {
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: 'loginProject',
            port: process.env.DB_PORT
        };
        this.connection = mysql.createConnection(this.connectionConfig);
        this.connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                throw err;
            }
            console.log('Connected to login database!');
        });
    }
    query(sql, args, { message = 'Error with execution: ' }) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, results) => {
                if (err) {
                    console.error(message, err);
                    return reject(new Error(message));
                }
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


    async getUserByUsername(username) {
        await this.checkConnection();

        const query = 'SELECT * FROM users WHERE username = ?';
        return new Promise((resolve, reject) => {
            this.connection.query(query, [username], (err, results) => {
                if (err) {
                    console.error('Error fetching user by username:', err);
                    return reject(new Error('Error fetching user'));
                }
                else if (results.length === 0) {
                    return reject(new Error('User not found'));
                }
                else return resolve(results[0]);
            });
        });
    }

    async logIntoSystem(username, password) {

        //mailoptions text has username and date as Jan/01/2001 00:00:00
        // const mailOptions = {
        //     // from: 'cottosoftwaredevelopment@gmail.com',
        //     from: 'Lux Programming <cottosoftwaredevelopment@gmail.com>',
        //     to: 'ecotto@cloudium.net, ecotto@prw.net',
        //     subject: 'Lux Programming - New login attempt',
        //     text: `Your account ${username} has been accessed at ${new Date().toLocaleString()}`,
        // };

        try {
            await this.checkConnection();


            const user = await this.getUserByUsername(username);
            // Compare passwords (assuming passwords are hashed)
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                //create session
                await this.sessionInitiator(username);
                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         return console.log('Error: ', error);
                //     }
                //     console.log('Email sent: ' + info.response);
                // });
                return { message: 'Login successful' }; // Return user data along with the success message
            } else {
                throw new Error('Invalid password');
            }
        } catch (err) {
            console.error('Login error:', err);
            throw err; // Re-throw the error to handle it in the caller
        }
    }

    async hashPassword(password) {
        console.log('password', await bcrypt.hash(password, 10));
        return await bcrypt.hash(password, 10);
    }

    async isValidUser(username, password) {
        try {
            const user = await this.getUserByUsername(username);
            return await bcrypt.compare(password, user.password);
        } catch (err) {
            console.error('Error validating user:', err);
            return false;
        }
    }
    /** register management */



    async registerUser(username, password) {
        try {
            await this.checkConnection();
            // Check if the user already exists
            await this.getUserByUsername(username);
            throw new Error('User already exists');
        } catch (err) {
            if (err.message === 'User not found') {
                const hashedPassword = await bcrypt.hash(password, 10);
                const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
                return this.query(query, [username, hashedPassword], { message: 'Error registering user:' });
            } else {
                // If there's any other error, rethrow it
                console.error('Error checking user existence:', err);
                throw err;
            }
        }
    }


    /** session management */

    async getDateTime() {
        const sessionLife = new Date();
        sessionLife.setHours(sessionLife.getHours() + 1);
        return sessionLife;
    }
    async compareSessionLife(sessionLife) {
        //return true if session life is 1 hour or greater in difference
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const sessionTime = new Date(sessionLife);
        const timeDifference = currentTime - sessionTime;
        return timeDifference >= 3600000;
    }
    async tokenGenerator(length = 64) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};:,.<>?/~';
        let token = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters[randomIndex];
        }
        return token;
    }
    async sessionInitiator(username) {
        const tokenExists = await this.getAuthToken(username);
        if (!tokenExists || tokenExists.length === 0) {
            const authToken = await this.tokenGenerator();
            const sessionToken = await this.tokenGenerator();
            await this.createAuthenticator(username, authToken);
            this.sessionCreator(authToken, sessionToken);
        } else {
            const authToken = await this.tokenGenerator();
            const sessionToken = await this.tokenGenerator();
            this.updateAuthenticator(username, authToken);
            this.destroySession(tokenExists);
            this.sessionCreator(authToken, sessionToken);
        }
    }

    async createAuthenticator(username, authToken) {
        await this.checkConnection();
        const query = 'INSERT INTO authTokens (username, token) VALUES (?, ?)';
        return this.query(query, [username, authToken], { message: 'Error creating authentication token:' });
    }
    async updateAuthenticator(username, authToken) {
        await this.checkConnection();
        const query = 'UPDATE authTokens SET token = ? WHERE username =  ?';
        return this.query(query, [authToken, username], { message: 'Error creating authentication token:' });
    }
    async getAuthToken(username) {
        if (this.connection.state === 'disconnected') this.connection.connect((err) => {
            if (err) throw err;
            console.log('Connected!');
        })
        const query = 'SELECT token FROM authTokens WHERE username = ?';
        return this.query(query, [username], { message: 'Error fetching authentication token:' });
    }

    async sessionCreator(authToken, sessionToken) {
        await this.checkConnection();
        const query = 'INSERT INTO session (authToken, sessionToken, sessionLife) VALUES (?, ?, ?)';
        const sessionLife = new Date();
        sessionLife.setHours(sessionLife.getHours() + 1);
        return this.query(query, [authToken, sessionToken, sessionLife], { message: 'Error creating session:' });
    }
    async getSessionDetails(authToken) {
        await this.checkConnection();
        const query = 'SELECT * FROM session WHERE authToken = ?';
        return this.query(query, [authToken[0].token], { message: 'Error fetching session details:' });
    }

    // async verifyUsername(username){
    //     //check if user exists
    //     const query = 'SELECT * FROM users WHERE username = ?';
    // }
    /** session verification */
    async sessionVerify(username) {
        await this.checkConnection();
        const user = await this.getUserByUsername(username);
        const authToken = await this.getAuthToken(username);
        const sessionDetails = await this.getSessionDetails(authToken);
        if (sessionDetails.length === 0) {
            this.sessionInitiator(username);
        }
        else {
            const valid = this.compareSessionLife(sessionDetails[0].sessionLife);
            valid ? this.sessionUpdate(authToken) : this.sessionDestroyer(username);
        }
    };

    async sessionUpdate(authToken) {
        await this.checkConnection();
        const query = 'UPDATE session SET sessionLife = ? WHERE authToken = ?';
        const sessionLife = new Date();
        sessionLife.setHours(sessionLife.getHours() + 1);
        return this.query(query, [sessionLife, authToken[0].token], { message: 'Error updating session:' });
    }
    async sessionDestroyer(username) {
        await this.checkConnection();
        const authToken = await this.getAuthToken(username);
        this.destroySession(authToken);
        this.destroyAuthenticator(authToken);
        return { message: 'Logout Successful' }
    }
    async destroyAuthenticator(authToken) {
        await this.checkConnection();
        const query = 'DELETE FROM authTokens WHERE token = ?';
        return this.query(query, [authToken], { message: 'Error deleting authentication token:' });
    }
    async destroySession(authToken) {
        await this.checkConnection();
        if (!authToken) {
            throw new Error('Invalid authToken: Auth token is required to delete a session.');
        }
        const query = 'DELETE FROM session WHERE authToken = ?';
        return this.query(query, [authToken], { message: 'Error deleting session:' });
    }

}

module.exports = new LoginDatabase();
