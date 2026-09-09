/* =========================================================
   PROVISION
   Main Website
   ========================================================= */


/* =========================
   MOBILE NAVIGATION
   ========================= */

const menuToggle =
  document.getElementById("menuToggle");

const primaryNavigation =
  document.getElementById("primaryNavigation");


if (
  menuToggle &&
  primaryNavigation
) {

  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        menuToggle.getAttribute(
          "aria-expanded"
        ) === "true";


      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );


      primaryNavigation.classList.toggle(
        "open",
        !isOpen
      );


      document.body.classList.toggle(
        "menu-open",
        !isOpen
      );

    }
  );


  /* =========================
     CLOSE MENU AFTER LINK
     ========================= */

  primaryNavigation
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );


          primaryNavigation
            .classList
            .remove("open");


          document.body
            .classList
            .remove("menu-open");

        }
      );

    });


  /* =========================
     RESET ON DESKTOP
     ========================= */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 760
      ) {

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );


        primaryNavigation
          .classList
          .remove("open");


        document.body
          .classList
          .remove("menu-open");

      }

    }
  );

}
