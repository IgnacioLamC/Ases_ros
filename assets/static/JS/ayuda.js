const items = document.querySelectorAll(".item");

        for (let i = 0; i < items.length; i++) {
            const button = items[i].querySelector(".title");

            button.addEventListener("click", function () {
                items[i].classList.toggle("active");
            });
        }