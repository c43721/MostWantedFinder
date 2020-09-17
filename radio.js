"use strict";

const searchByNameCheck = document.getElementById("nameSearch");
const searchByFilterCheck = document.getElementById("filterSearch");

[searchByFilterCheck, searchByNameCheck].forEach(check => {
    check.addEventListener("change", () => {
        if (searchByNameCheck.checked) {
            document.getElementById("byNameSearch").style.display = "block";
            document.getElementById("byTraitSearch").style.display = "none";
        } else {
            document.getElementById("byNameSearch").style.display = "none";
        }

        if (searchByFilterCheck.checked) {
            document.getElementById("byNameSearch").style.display = "none";
            document.getElementById("byTraitSearch").style.display = "block";
        } else {
            document.getElementById("byTraitSearch").style.display = "none";
        }
    })
})

