import { updateUsernameCookieExpiration } from "../../helpers/basicElements.js";

const port = 5507
const host = 'https://www.cottodev.com';
// const host = 'http://localhost'
const domain = `${host}:${port}`

export async function systemLogin(username, password, success = () => { }, fail = () => { }) {
    if (!username || !password) {
        const errorMessage = 'Username and password are required';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    try {
        const response = await fetch(`${domain}/session/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            fail();
            throw new Error(`Failed to login. HTTP status: ${response.status}`);
        }
        console.log('login start');
        const data = await response.json();
        success();
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        fail();
        throw error;
    }
}

export async function verifySession(username) {
    try {
        const response = await fetch(`${domain}/session/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        if (!response.ok) {
            // throw new Error(`Failed to verify session. HTTP status: ${response.status}`);
            return { success: false };
        }
        await updateUsernameCookieExpiration(username);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying session:', error);
        throw error;
    }
}

export async function systemLogout(username, success = () => { }, fail = () => { }) {
    try {
        const response = await fetch(`${domain}/session/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        if (!response.ok) {
            fail();
            throw new Error(`Failed to logout. HTTP status: ${response.status}`);
        }
        const data = await response.json();
        success();
        return data;
    } catch (error) {
        console.error('Error logging out:', error);
        fail();
        throw error;
    }
}

export async function systemRegister(username, password, success = () => { }, fail = () => { }) {
    if (!username || !password) {
        const errorMessage = 'Username and password are required';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    try {
        const response = await fetch(`${domain}/session/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            fail();
            throw new Error(`Failed to register. HTTP status: ${response.status}`);
        }
        const data = await response.json();
        success();
        return data;
    } catch (error) {
        console.error('Error registering:', error);
        fail();
        throw error;
    }
}
