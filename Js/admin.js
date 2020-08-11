var sidebar_Tabs = document.querySelectorAll("#sidebar-container ol li a");
sidebar_Tabs.forEach(tab => {
    tab.addEventListener("click", (clickedTab) => {
       sidebar_Tabs.forEach(elem => {
            elem.classList.remove("is-active");
        });
        clickedTab.target.classList.add("is-active");        
    });
});