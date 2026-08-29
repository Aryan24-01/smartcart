import { auth } from "./firebase.js";
import { 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful!");
        window.location = "index.html";
    } 
    catch (error) {
        console.log("Login Error Code:", error.code);

        if (error.code === "auth/user-not-found") {
            alert("No account found with this email.");
        } 
        else if (error.code === "auth/wrong-password") {
            alert("Incorrect password. Please try again.");
        } 
        else if (error.code === "auth/invalid-email") {
            alert("Invalid email format.");
        }
        else if (error.code === "auth/invalid-credential") {
            alert("Email or password is incorrect.");
        }
        else {
            alert("Something went wrong. Try again.");
        }
    }
});