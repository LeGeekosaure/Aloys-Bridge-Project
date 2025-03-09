// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0uD3eaiK6qPjIrd6q1G7zj6MnRsbHu2w",
  authDomain: "site-web-aloy-s-bridge.firebaseapp.com",
  projectId: "site-web-aloy-s-bridge",
  storageBucket: "site-web-aloy-s-bridge.firebasestorage.app",
  messagingSenderId: "596847091885",
  appId: "1:596847091885:web:3e2d85c72d1b26b710e624",
  measurementId: "G-62LV9K53LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const questionForm = document.getElementById("question-form");
  const questionInput = document.getElementById("question");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const questionsList = document.getElementById("questions-list");
  const adminQuestionsList = document.getElementById("admin-questions-list");

  // User login
  loginBtn.addEventListener("click", async () => {
    const email = prompt("Entrez votre e-mail admin :");
    const password = prompt("Entrez votre mot de passe :");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Connecté avec succès :", userCredential.user);

      // Check if the user is admin
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().admin) {
        console.log("Utilisateur admin détecté !");
        window.location.href = "admin.html"; // Redirect to admin page
      } else {
        alert("Vous n'avez pas les droits d'accès.");
      }
    } catch (error) {
      alert("Erreur de connexion : " + error.message);
    }
  });

  // User logout
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("Déconnecté");
      window.location.href = "FAQ.html"; // Redirect after logout
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  });

  // Monitor auth state
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline";

      // Check if the user is admin
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().admin) {
        console.log("Utilisateur admin détecté !");
        if (window.location.pathname.endsWith("admin.html")) {
          displayAdminQuestions();
        }
      }
    } else {
      loginBtn.style.display = "inline";
      logoutBtn.style.display = "none";
    }
  });

  // Add a question
  async function addQuestion(questionText) {
    try {
      const docRef = await addDoc(collection(db, "FAQ"), {
        question: questionText,
        reponse: "",
        timestamp: new Date(),
      });
      console.log("Question ajoutée :", docRef.id);
      displayQuestions();
    } catch (e) {
      alert("Erreur : " + e.message);
    }
  }

  // Display user questions
  async function displayQuestions() {
    const querySnapshot = await getDocs(collection(db, "FAQ"));
    questionsList.innerHTML = "<h2>Questions de la communauté</h2>";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const questionElement = document.createElement("div");

      questionElement.innerHTML = `
        <div class="card2">
          <p><strong>Question:</strong> ${data.question}</p>
          <p><strong>Réponse:</strong> ${data.reponse || "Aucune réponse pour l'instant."}</p>
        </div>
      `;
      questionsList.appendChild(questionElement);
    });
  }

  // Display admin questions
  async function displayAdminQuestions() {
    const querySnapshot = await getDocs(collection(db, "FAQ"));
    adminQuestionsList.innerHTML = "<h2>Questions en attente de réponse</h2>";
  
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const questionElement = document.createElement("div");
      questionElement.classList.add("question");
  
      questionElement.innerHTML = `
        <div class="card">
          <p><strong>Question:</strong> ${data.question}</p>
          <p><strong>Réponse actuelle:</strong> ${data.reponse || "Aucune réponse pour l'instant."}</p>
          <div class="admin-actions">
            <input type="text" placeholder="Écrire une réponse..." id="reponse-${doc.id}" />
            <button id="btn-repondre-${doc.id}">Répondre</button>
            <hr />
            <input type="text" placeholder="Corriger la question..." id="corriger-question-${doc.id}" value="${data.question}" />
            <button id="btn-corriger-${doc.id}">Corriger la question</button>
            <hr />
            <button id="btn-supprimer-${doc.id}" class="delete-btn">🗑 Supprimer</button>
          </div>
        </div>
      `;
      adminQuestionsList.appendChild(questionElement);
  
      // Bouton pour répondre
      document.getElementById(`btn-repondre-${doc.id}`).addEventListener("click", () => {
        submitAnswer(doc.id);
      });
  
      // Bouton pour corriger la question
      document.getElementById(`btn-corriger-${doc.id}`).addEventListener("click", () => {
        correctQuestion(doc.id);
      });
  
      // Bouton pour supprimer la question
      document.getElementById(`btn-supprimer-${doc.id}`).addEventListener("click", () => {
        deleteQuestion(doc.id);
      });
    });
  }

  
  

  // Submit an answer
  async function submitAnswer(questionId) {
    const reponseInput = document.getElementById(`reponse-${questionId}`);
    const reponseText = reponseInput.value.trim();

    if (!reponseText) {
      alert("La réponse ne peut pas être vide.");
      return;
    }

    try {
      const questionRef = doc(db, "FAQ", questionId);
      await updateDoc(questionRef, { reponse: reponseText });
      alert("Réponse soumise !");
      displayAdminQuestions(); // Refresh the admin question list
    } catch (e) {
      console.error("Erreur lors de l'envoi de la réponse :", e);
    }
  }
// Display admin questions with the possibility of correcting them
async function displayAdminQuestions() {
  const querySnapshot = await getDocs(collection(db, "FAQ"));
  adminQuestionsList.innerHTML = "<h2>Questions en attente de réponse</h2>";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");

    questionElement.innerHTML = `
      <div class="card">
        <p><strong>Question:</strong> ${data.question}</p>
        <p><strong>Réponse actuelle:</strong> ${data.reponse || "Aucune réponse pour l'instant."}</p>
        <div class="admin-actions">
          <input type="text" placeholder="Écrire une réponse..." id="reponse-${doc.id}" />
          <button id="btn-repondre-${doc.id}">Répondre</button>
          <hr />
          <input type="text" placeholder="Corriger la question..." id="corriger-question-${doc.id}" value="${data.question}" />
          <button id="btn-corriger-${doc.id}">Corriger la question</button>
        </div>
      </div>
    `;
    adminQuestionsList.appendChild(questionElement);

    // Bouton pour répondre
    document.getElementById(`btn-repondre-${doc.id}`).addEventListener("click", () => {
      submitAnswer(doc.id);
    });

    // Bouton pour corriger la question
    document.getElementById(`btn-corriger-${doc.id}`).addEventListener("click", () => {
      correctQuestion(doc.id);
    });
  });
}

// Fonction pour corriger la question
async function correctQuestion(questionId) {
  const correctedQuestionInput = document.getElementById(`corriger-question-${questionId}`);
  const correctedQuestionText = correctedQuestionInput.value.trim();

  if (!correctedQuestionText) {
    alert("La question corrigée ne peut pas être vide.");
    return;
  }

  try {
    const questionRef = doc(db, "FAQ", questionId);
    await updateDoc(questionRef, { question: correctedQuestionText });
    alert("Question corrigée !");
    displayAdminQuestions(); // Rafraîchir la liste des questions administrateur
  } catch (e) {
    console.error("Erreur lors de la correction de la question :", e);
  }
}

  // Submit user question form
  questionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const questionText = questionInput.value.trim();
    if (questionText) {
      addQuestion(questionText);
      questionInput.value = "";
    } else {
      alert("Veuillez entrer une question.");
    }
  });

  // Load questions based on the page
  if (window.location.pathname.endsWith("admin.html")) {
    displayAdminQuestions();
  } else {
    displayQuestions();
  }
});
