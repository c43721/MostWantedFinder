"use strict";

const filterOptions = ["id", "gender", "dob", "height", "weight", "eyeColor", "occupation"];

//MAIN SEARCH FUNCTIONS
function searchByName() {
    const firstName = document.getElementById("firstName").value.trim().toLowerCase();
    const lastName = document.getElementById("lastName").value.trim().toLowerCase();

    const outputElement = document.getElementById("nameSearchOutput");

    const filteredPeople = data.filter(person => {
        if (!lastName) return person.firstName.toLowerCase() === firstName;
        if (!firstName) return person.lastName.toLowerCase() === lastName;
        return person.firstName.toLowerCase() === firstName && person.lastName.toLowerCase() === lastName;
    })

    if (!filteredPeople.length) return outputElement.innerText = "No search results";

    outputElement.innerHTML = filteredPeople.map(filteredPerson => {
        return `<div>${filteredPerson.firstName} ${filteredPerson.lastName} 
        <button onclick="alertToUser(${filteredPerson.id})">Show Information</button> 
        <button onclick="alertDescendants(${filteredPerson.id})">Get Descendants</button> 
        <button onclick="alertFamily(${filteredPerson.id})">Get Family</button></div>`;
    }).join("\n")
}


function searchByTraits() {
    const outputElement = document.getElementById("traitSearchOutput");

    const filterArray = document.querySelectorAll(".filter");

    let filteredPeople = data;
    filterArray.forEach(filterElement => {
        const [selector, value] = filterElement.children[0].value.split(": ");
        const filterResult = filteredPeople.filter(person => {
            return person[selector] == value;
        })

        filteredPeople = filterResult;
    })

    if (!filteredPeople.length) return outputElement.innerText = "No search results";

    outputElement.innerText = filteredPeople.map(filteredPerson => {
        return `${filteredPerson.firstName} ${filteredPerson.lastName}`;
    }).join("\n")
}

//ALERT FUNCTIONS
function alertToUser(id) {
    const userObject = getPersonFromId(id);

    let resultString = "";
    for (const [key, value] of Object.entries(userObject)) {
        if (key === "parents") resultString += `${key}: ${value.length ? getParents(value).map(parent => parent.firstName).join(', ') : "NO PARENTS"}\n`;
        else if (key === "currentSpouse") resultString += `${key}: ${value ? getPersonFromId(value).firstName : "NO SPOUSE"}\n`;
        else resultString += `${key}: ${value}\n`;
    }

    alert(resultString);
}

function alertDescendants(id) {
    const result = getDescendants(id)

    const relations = result.map(familyMember => {
        return `${familyMember.firstName} ${familyMember.lastName}`;
    }).join("\n");

    alert(relations || `NO CHILDREN`);
}

function alertFamily(id) {
    const result = getImmediateFamily(id);

    const relations = result.map(familyMember => {
        return `${familyMember.firstName} ${familyMember.lastName}`;
    }).join("\n");

    alert(relations || "NO FAMILY");
}

//FILTER TEXT FUNCTIONS
window.onload = updateClearButtons();

function addFilter() {
    const divContainer = document.getElementById("filter-container");
    if (divContainer.children.length > 5) return;

    const filterElement = document.createElement("span");

    filterElement.innerHTML = `
        <span class="span-removeable filter">
            <input type="text" name="filter" id="filter1">
            <i class="remove-icon">&times;</i>
        </span>`

    divContainer.appendChild(filterElement);

    updateClearButtons();
}

function updateClearButtons() {
    const allButtons = document.querySelectorAll(".remove-icon");

    allButtons.forEach((removeBtn, index) => {
        removeBtn.addEventListener("click", () => {
            removeInputElement(index);
        })
    })
}

function removeInputElement(index) {
    const container = document.getElementById("filter-container");
    return container.children[index].remove();
}

//SEARCHING FUNCTIONS
// function getDescendants(id, array = data) {
//     const children = [];
//     for (const person of array) {
//         console.log(
//             `TESTING: ${getPersonFromId(id).firstName}\nAGAINST: ${person.firstName}\n\nAGAINST PARENTS: ${getParents(person.parents).map(parent => parent.firstName).join(", ")}\nTEST PARENTS: ${getPersonFromId(id).parents.map(parent => getPersonFromId(parent).firstName).join(", ")}\n\nTEST RESULT: ${person.parents.includes(id)}`
//         )
//         // if (person.parents.includes(getPersonFromId(id).id)) children.push(person);
//         if (person.parents.includes(id)) children.push(person);
//         if (person.parents.includes(id)) children.push(person);
//         if (person.parents) {
//             const child = getDescendants(person.id, getParents(person.parents));
//             if (child && child.id) {
//                 children.push(child)
//             };
//         }
//     }
//     return children
// }

//O(n log n)
function getDescendants(id, array = data) {
    const children = [];
    for (const person of array) 
        if (person.parents.includes(id)) children.push(person);
    
    for (const child of children) {
        const grandChildren = getDescendants(child.id);
        if (grandChildren.length) return children.concat(grandChildren);
    }

    return children;
}

function getParents(parentArray) {
    const parentObjectArray = [];
    for (const parent of parentArray) {
        parentObjectArray.push(data.filter(person => {
            return person.id === parent;
        })[0]);
    }
    return parentObjectArray;
}

function getPersonFromId(id) {
    return data.filter(person => person.id)[0];
}

function getImmediateFamily(id) {
    const targetPerson = getPersonFromId(id);
    const family = [];
    for (const person of data) {
        if (person.currentSpouse === id) family.push(person);
        if (person.parents.includes(id)) family.push(person);
        if (targetPerson.parents.includes(person.id)) family.push(person);
    }
    return family;
}