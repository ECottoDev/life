/**
* resumeDataCalls.js
*
* @author Edwin Cotto <edtowers1037@gmail.com>
* @copyright Edwin Cotto, All rights reserved.
*
* @version 2024-February-04 initial version
*/


// Purpose: This file contains all the data calls to the backend server.

//education data
const port = 5507
// const host = 'https://luxprogramming.com'
//const host = 'https://44.193.226.223'
const host = 'http://localhost' 
const domain = `${host}:${port}`

// Function to get education data
export async function getEducationData() {
    try {
        const response = await fetch(`${domain}/resume/getEducationData`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

//function to post data into the database
export async function addEducationData(schoolName, schoolYear, concentration, graduated) {
    const response = await fetch(`${domain}/resume/addEducationData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schoolName, schoolYear, concentration, graduated })
    });

    return response.json();
}

//function to patch/update a current entry in the database
export async function updateEducationData(id, schoolName, schoolYear, concentration, graduated) {
    const response = await fetch(`${domain}/resume/updateEducationData`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, schoolName, schoolYear, concentration, graduated })
    });

    return response.json();
}

//function to delete an existing entry in the database
export async function deleteEducationData(id) {
    const response = await fetch(`${domain}/resume/deleteEducationData`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    return response.json();
}