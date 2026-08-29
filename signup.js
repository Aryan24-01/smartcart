import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () => {

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account Created Successfully!");
        window.location = "index.html";
    } catch (error) {
        alert(error.message);
    }
});