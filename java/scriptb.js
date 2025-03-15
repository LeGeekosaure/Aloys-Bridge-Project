document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.imageb img');
    let timeout; // Stocke le délai avant d'afficher le tooltip
  
    // Création d'un tooltip global pour éviter d'en créer un par image
    const tooltip = document.createElement('div');
    tooltip.classList.add('alt-text');
    document.body.appendChild(tooltip);
  
    images.forEach(img => {
      img.addEventListener('mouseenter', function(event) {
        const altText = img.getAttribute('alt');
        if (!altText) return;
  
        // Stocke l'affichage du tooltip après 5s
        timeout = setTimeout(() => {
          tooltip.innerText = altText;
          tooltip.style.display = 'block';
        }, 2000);
      });
  
      img.addEventListener('mousemove', function(event) {
        // Déplace le tooltip avec la souris
        tooltip.style.left = event.pageX + 10 + 'px'; // 10px de décalage
        tooltip.style.top = event.pageY + 10 + 'px';
      });
  
      img.addEventListener('mouseleave', function() {
        // Annule l'affichage si on quitte avant 5s
        clearTimeout(timeout);
        tooltip.style.display = 'none';
      });
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("show");
      }, index * 200);
    });
  });
  
  
  
  // Fonction pour ouvrir/fermer le menu latéral
  function toggleNav() {
      var sidenav = document.getElementById("mySidenav");
      if (sidenav.style.left === "-250px") {
        sidenav.style.left = "0";
      } else {
        sidenav.style.left = "-250px";
      }
    }
    document.addEventListener("DOMContentLoaded", function () {
      const toggleButton = document.getElementById("toggle-dark-mode");
      const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
      // Vérifier si un mode est déjà enregistré dans localStorage
      const currentMode = localStorage.getItem("theme");
  
      if (currentMode === "dark") {
          document.body.classList.add("dark-mode");
          toggleButton.textContent = "☀️ Mode clair";
      } else if (currentMode === "light") {
          document.body.classList.remove("dark-mode");
          toggleButton.textContent = "🌙 Mode sombre";
      } else if (prefersDarkScheme.matches) {
          // Si aucune préférence n'est définie, utiliser celle du système
          document.body.classList.add("dark-mode");
          toggleButton.textContent = "☀️ Mode clair";
      }
  
      // Ajouter un écouteur sur le bouton pour changer de mode
      toggleButton.addEventListener("click", function () {
          if (document.body.classList.contains("dark-mode")) {
              document.body.classList.remove("dark-mode");
              localStorage.setItem("theme", "light");
              toggleButton.textContent = "🌙 Mode sombre";
          } else {
              document.body.classList.add("dark-mode");
              localStorage.setItem("theme", "dark");
              toggleButton.textContent = "☀️ Mode clair";
          }
      });
  }); 

  document.addEventListener("DOMContentLoaded", function () {
    const pageTitle = document.title; // Récupère le titre de la page
    const titleElement = document.getElementById("page-title");
  
    if (titleElement) {
      titleElement.textContent = pageTitle; // Mets à jour le titre dans le side nav
    }
  });

  