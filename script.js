"use strict";

const filterOptions = ["id", "gender", "dob", "height", "weight", "eyeColor", "occupation"];

function searchByName() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    const outputElement = document.getElementById("nameSearchOutput");

    const filteredPeople = data.filter(person => {
        if (!lastName) return person.firstName.toLowerCase() === firstName.toLowerCase();
        if (!firstName) return person.lastName.toLowerCase() === lastName.toLowerCase();
        return person.firstName.toLowerCase() === firstName.toLowerCase() && person.lastName.toLowerCase() === lastName.toLowerCase();
    })

    if (!filteredPeople.length) return outputElement.innerText = "No search results";
    else return outputElement.innerText = JSON.stringify(filteredPeople);
}

function searchByTraits() {
    const outputElement = document.getElementById("traitSearchOutput");

    const filterArray = document.querySelectorAll(".filter");

    let filteredPeople = data;
    filterArray.forEach(filterElement => {
        const [selector, value] = filterElement.children[0].value.split(": ");
        if (!value || !selector) return outputElement.innerText = "No valid filter(s).";
        if (!filterOptions.includes(selector)) return outputElement.innerText = "One of your options contains an invalid filter."

        const filterResult = filteredPeople.filter(person => {
            return person[selector] == value;
        })

        filteredPeople = filterResult;
    })

    if (!filteredPeople.length) return outputElement.innerText = "No search results";
    return outputElement.innerText = JSON.stringify(filteredPeople);
}

function addFilter() {
    const divContainer = document.getElementById("filter-container");

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
    const buttonToRemove = document.querySelectorAll(".span-removeable")[index];

    return buttonToRemove.parentNode.removeChild(buttonToRemove);
}

window.onload = updateClearButtons();


//SEARCHING FUNCTIONS

function getDescendants(id, array = data) {
    const children = [];
    for (const person of array) {
        if (person.id === id) continue;
        if (person.parents.includes(id)) children.push(person);
        if (person.parents.length) {
            const child = getDescendants(person.id, getParents(person.parents));
            if (child && child.id) children.push(child);
        }
    }
    return children
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
