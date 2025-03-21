// Purpose: This file contains all the data calls to the backend server.
//eduction data
const port = 5507
const host = 'https://luxprogramming.com'
//const host = 'https://44.193.226.223'
// const host = 'http://localhost'

// Function to get education data
export async function getEducationData() {
    try {
        const response = await fetch(`${host}:${port}/resume/getEducationData`);
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

export async function addEducationData(schoolName, schoolYear, concentration, graduated) {
    const response = await fetch(`${host}:${port}/resume/addEducationData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schoolName, schoolYear, concentration, graduated })
    });

    return response.json();
}
export async function updateEducationData(id, schoolName, schoolYear, concentration, graduated) {
    const response = await fetch(`${host}:${port}/resume/updateEducationData`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, schoolName, schoolYear, concentration, graduated })
    });

    return response.json();
}
export async function deleteEducationData(id) {
    const response = await fetch(`${host}:${port}/resume/deleteEducationData`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    return response.json();
}

//experience data

export async function getExperienceData() {
    try {
        const response = await fetch(`${host}:${port}/resume/getExperienceData`);
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



export async function addExperienceData(company, position, duties, timeWorked) {
    const response = await fetch(`${host}:${port}/resume/addExperienceData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ company, position, duties, timeWorked })
    });

    return response.json();
}

export async function updateExperienceData(id, company, position, duties, timeWorked) {
    const response = await fetch(`${host}:${port}/resume/updateExperienceData`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, company, position, duties, timeWorked })
    });

    return response.json();
}

export async function deleteExperienceData(id) {
    const response = await fetch(`${host}:${port}/resume/deleteExperienceData`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    return response.json();
}

//skills data
export async function getSkillsData() {
    var data = await fetch(`${host}:${port}/resume/getSkillsData`);
    data = await data.json();
    data = data.data;

    return data;
}
export async function addSkillsData(name, skillLevel) {
    const response = await fetch(`${host}:${port}/resume/addSkillsData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, skillLevel })
    });

    return response.json();
}
export async function deleteSkillsData(id) {
    const response = await fetch(`${host}:${port}/resume/deleteSkillsData`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    return response.json();
}
export async function updateSkillsData(id, name, skillLevel) {
    const response = await fetch(`${host}:${port}/resume/updateSkillsData`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name, skillLevel })
    });

    return response.json();
}

