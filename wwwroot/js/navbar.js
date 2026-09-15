document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // NAVBAR
    // =====================================================

    const navbar =
        document.getElementById("navbar");


    // =====================================================
    // SCROLL
    // =====================================================

    function updateNavbar() {

        if (!navbar) {
            return;
        }


        if (window.scrollY > 20) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        updateNavbar
    );


    updateNavbar();


    // =====================================================
    // MENÚ MÓVIL
    // =====================================================

    const mobileMenuButton =
        document.getElementById(
            "mobileMenuButton"
        );


    const navLinks =
        document.getElementById(
            "navLinks"
        );


    if (
        mobileMenuButton &&
        navLinks
    ) {

        mobileMenuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    navLinks.classList.toggle(
                        "mobile-active"
                    );


                const icon =
                    mobileMenuButton.querySelector(
                        "i"
                    );


                if (isOpen) {

                    icon.classList.remove(
                        "fa-bars"
                    );

                    icon.classList.add(
                        "fa-xmark"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-label",
                        "Cerrar menú"
                    );

                    document.body.style.overflow =
                        "hidden";

                } else {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-label",
                        "Abrir menú"
                    );

                    document.body.style.overflow =
                        "";

                }

            }
        );


        // Cerrar menú al seleccionar
        // una opción

        navLinks
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "mobile-active"
                        );


                        const icon =
                            mobileMenuButton.querySelector(
                                "i"
                            );


                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );


                        mobileMenuButton.setAttribute(
                            "aria-label",
                            "Abrir menú"
                        );


                        document.body.style.overflow =
                            "";

                    }
                );

            });

    }


    // =====================================================
    // BUSCADOR
    // =====================================================

    const searchButton =
        document.getElementById(
            "searchButton"
        );


    const searchPanel =
        document.getElementById(
            "searchPanel"
        );


    const closeSearch =
        document.getElementById(
            "closeSearch"
        );


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (
        searchButton &&
        searchPanel
    ) {

        searchButton.addEventListener(
            "click",
            () => {

                searchPanel.classList.toggle(
                    "active"
                );


                if (
                    searchPanel.classList.contains(
                        "active"
                    )
                ) {

                    setTimeout(() => {

                        searchInput?.focus();

                    }, 150);

                }

            }
        );

    }


    // =====================================================
    // CERRAR BUSCADOR
    // =====================================================

    if (closeSearch) {

        closeSearch.addEventListener(
            "click",
            () => {

                searchPanel?.classList.remove(
                    "active"
                );

            }
        );

    }


    // =====================================================
    // ESC
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                searchPanel?.classList.remove(
                    "active"
                );


                navLinks?.classList.remove(
                    "mobile-active"
                );


                if (mobileMenuButton) {

                    const icon =
                        mobileMenuButton.querySelector(
                            "i"
                        );


                    icon?.classList.remove(
                        "fa-xmark"
                    );

                    icon?.classList.add(
                        "fa-bars"
                    );

                }


                document.body.style.overflow =
                    "";

            }

        }
    );


});