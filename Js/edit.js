// Editing section ID object
const editor__section = {"section":"#data-edit--area"};

// Extracts each li element data to input fields
// getting them ready for editing
Object.keys(editor__section).forEach((optionKey, index) => {
    document.querySelectorAll(editor__section[optionKey] + " li").forEach(lister => {
        lister.addEventListener("click", function() {
            // Gets ID of the selected item area
            const sectionID = "#" + this.parentNode.id;
            // Gets ID of edit form element where selected item belongs
            const formID = "#" + this.parentNode.id + "-form";
            // Serialise all data attributes of selected element
            const editor__object = this.dataset;
            // Loop through serialised object
            Object.keys(editor__object).forEach((optionKey, index) => {
                // Append each data attribute to corresponding input fields
                document.querySelector(formID + " input[id=" + optionKey + "]").value = editor__object[optionKey];
            });
        });
    });
});
