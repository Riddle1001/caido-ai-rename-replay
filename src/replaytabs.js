function getSelectedTabIds() {
    const selectedTabs = document.querySelectorAll('.c-tab[data-is-selected="true"]');
    const selectedIds = Array.from(selectedTabs).map((tab) => tab.getAttribute("data-session-id"));
    return selectedIds;
}

export default getSelectedTabIds;
