function getCurrentPage() {
    let currentPath = window.location.hash;
    if (currentPath.includes("?custom-path=")) {
        currentPath = currentPath.split("?custom-path=")[1];
    }
    return currentPath;
}

function addPopupItem(label, callback) {
    const popupMenu = document.querySelector(".p-contextmenu-root-list");
    const newItem = document.createElement("li");
    newItem.id = `pv_id_1_${popupMenu.children.length}`;
    newItem.className = "p-menuitem";
    newItem.setAttribute("role", "menuitem");
    newItem.setAttribute("aria-label", label);
    newItem.setAttribute("aria-level", "1");
    newItem.setAttribute("aria-setsize", popupMenu.children.length + 1);
    newItem.setAttribute("aria-posinset", popupMenu.children.length);
    newItem.setAttribute("data-pc-section", "menuitem");
    newItem.setAttribute("data-p-highlight", "false");
    newItem.setAttribute("data-p-focused", "false");
    newItem.innerHTML = `
        <div class="p-menuitem-content" data-pc-section="content">
            <div data-v-25e37fb9 class="c-context-menu__item">
                <div class="c-context-menu__content">${label}</div>
                <div class="c-context-menu__trailing-visual"></div>
            </div>
        </div>
    `;
    newItem.addEventListener("click", function () {
        callback();
        closePopupMenu();
    });
    popupMenu.appendChild(newItem);
}

function closePopupMenu() {
    const popupMenu = document.querySelector(".p-contextmenu");
    if (popupMenu) {
        popupMenu.style.display = "none";
    }
}

export { getCurrentPage, addPopupItem };
