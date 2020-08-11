// Deleting section ID object
const delete__section = {
    "action": {
        "select-all-message":"delete-control--message",
        "select-all-announcement":"delete-control--announcement",
        "select-all-video":"delete-control--video"
    },
    "feedback": {
        "delete-selected--message": ["delete-message--feedback","delete-message--count"],
        "delete-selected--announcement": ["delete-announcement--feedback","delete-announcement--count"],
        "delete-selected--video": ["delete-video--feedback","delete-video--count"]
    }
};

// Delete function controller
(function() {
    // Array to hold delete keys for selected item
    let delete__Object = [];
    // Holds array key for checkbox selection update in delete__section object
    let updateData__KEY;
    // Holds id of update feedback element area currently in focus
    let updateArea__ID;
    // Hold key for reponse feedback in delete__section object
    let responseFeedback__KEY;
    // Gets id of focused area response feedback element
    let responseFeedback__ID;
    // Holds the data-control-value of currently focused area and helps in updating delete__Object content
    let focusArea__CHECK = "delete-selected--message";		
                
    // Hold all checkboxes that returns delete key for each selected item
    const all__CHECKBOX = document.querySelectorAll("#data-delete--area input[type='checkbox']");
    // Iterates through the delete_section object
    Object.keys(delete__section.action).forEach((optionKey, index) => {
        // Selects the first checkbox for every delete area (message, videos and announcement)
        const delete__ITEMS = document.querySelectorAll(`#${delete__section.action[optionKey]} input[type='checkbox']`);
        // On click of the first checkbox for every delete area (message, videos and announcement)
        document.querySelector(`#${optionKey}`).addEventListener("click", function() {
            // Empty delete__Object before adding new delete keys 
            delete__Object = [];
            // If first checkbox of an area is checked
            if (this.checked) {
                // Set all checkboxes to false
                all__CHECKBOX.forEach(checkBox => {checkBox.checked = false;});
                // Set checkboxes within delete area to true
                delete__ITEMS.forEach(this__ITEM => {
                    this__ITEM.checked = true;
                    // push delete keys to delete__Object
                    delete__Object.push(this__ITEM.id);
                });
                // Remove the first checkbox key
                // This key is just a reference
                delete__Object.shift();
            } else {
                // If first checkbox is false, set every checkbox within area to false
                delete__ITEMS.forEach(this__ITEM => {
                    this__ITEM.checked = false;
                });
                // Empty delete keys
                delete__Object = [];
            }
            // Gets focus area
            updateData__KEY = this.dataset.controlValue;
            // Gets focused element id
            updateArea__ID = delete__section.feedback[updateData__KEY][1];
            // Updates selection area using focused element id
            updateSelectorCount(updateArea__ID);				
        });

        // Holds all delete buttons
        const delete__BUTTON = document.querySelectorAll(`#${delete__section.action[optionKey]} button`);			
        // When any of the delete button is clicked
        delete__BUTTON.forEach(this__BUTTON => {
            this__BUTTON.addEventListener("click", function() {
                // Get the delete key of item via data-key HTML attribute
                const delete__KEY = this__BUTTON.dataset.key;
                // Delete response feedback ID key
                responseFeedback__KEY = this.dataset.controlValue;
                responseFeedback__ID = delete__section.feedback[responseFeedback__KEY][0];
                // Run the deleteElement function to delete just this item
                deleteELEMENT([delete__KEY], responseFeedback__ID);
            });
        });

    });

    // For all checkboxes, 
    all__CHECKBOX.forEach(delete__CHANNEL => {
        delete__CHANNEL.addEventListener("click", function() {
            // Checks if this checkbox is first checkbox
            if (!delete__section.action.hasOwnProperty(this.id)) {
                // Unselect "all-selector checkboxes for all focus areas
                Object.keys(delete__section.action).forEach((optionKey,index) => {
                    document.getElementById(`${optionKey}`).checked = false;
                });
                // Checks if focused area is same as previous area where last selection was done
                if (focusArea__CHECK === this.dataset.controlValue) {
                    // If same focus area, maintain focus checking variable
                    focusArea__CHECK = this.dataset.controlValue;
                } else {	// Else uncheck all checkboxes in previous focus area
                    document.querySelectorAll(`input[data-control-value='${focusArea__CHECK}']`).forEach(clearUnfocused__AREA => {
                        clearUnfocused__AREA.checked = false;
                    });
                    // Change focus area to current one
                    focusArea__CHECK = this.dataset.controlValue;
                    // Empty delete__Object items
                    delete__Object = [];
                }

                // Gets id(key) of clicked checkbox
                const this__ID = this.id;
                // Gets the index of this key in delete__Object if it exist
                const this__INDEX = delete__Object.indexOf(this__ID);
                // and checkbox is checked
                if (this.checked == true) {
                    // Add this id(key) to delete__Object
                    if (this__INDEX == -1) {
                        delete__Object.push(this__ID);
                    }
                } else {
                    // If checkbox is unchecked and key is in delete__Object
                    if (this__INDEX > -1) {
                        // Remove this id(key)
                        delete__Object.splice(this__INDEX, 1);
                    }
                }
                // Gets focus area
                updateData__KEY = this.dataset.controlValue;
                // Gets focused element id
                updateArea__ID = delete__section.feedback[updateData__KEY][1];
                // Updates selection area using focused element id
                updateSelectorCount(updateArea__ID);
            } else {					
                // If same focus area, maintain focus checking variable
                focusArea__CHECK = this.dataset.controlValue;					
            }
        });
    });

    // When any of master select and delete button is clicked
    Object.keys(delete__section.feedback).forEach((optionKey,index) => {
        document.getElementById(`${optionKey}`).addEventListener("click", function() {
            // Get focused area response element id
            responseFeedback__ID = delete__section.feedback[optionKey][0];
            // Run deleteELEMENT function to delete items 
            deleteELEMENT(delete__Object, responseFeedback__ID);
        });
    });
    
    // Transports selected element's ids for deleting
    function deleteELEMENT(deleteKeys,responseUpdate) {
        // Stringifies delete__Object for transport
        const deleteKeys__Object = JSON.stringify(deleteKeys);
        // Set Basic authentication credentials
        const username = 'aston';
        const password = 'root';
        // Initiate transport using fetch API
        fetch("deleteAPI.php", {
            method: 'POST',
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json', //	Content type sent
                'Accept': 'application/json',	//	Content type expected
                'Authorization': 'Basic ' + btoa(username + ':' + password),	//	Authentication credentials
            },
            // POST data body
            body: deleteKeys__Object,
        })
        .then(response => response.text())
        .then(function(response) {
            // Parse response to focused area feedback element
            document.getElementById(responseUpdate).innerHTML = `<button class="feedback">${response}</button>`;
        })
        .catch(error => console.log(`Error deleting data -> ${error}`));	
    }

    // Updates selected items counts for focused area
    function updateSelectorCount(countUpdate__ID) {
        // Gets length of delete__Object as number of selected items at any time
        const select__COUNT = delete__Object.length;
        // Empty other feedback elements
        Object.keys(delete__section.feedback).forEach(allUpdate__ELEM => {
            document.getElementById(delete__section.feedback[allUpdate__ELEM][1]).innerHTML = ``
        });
        // Append count update to focused area feedback element
        if (select__COUNT > 0 ) {
            document.getElementById(countUpdate__ID).innerHTML = `<button class="report">${select__COUNT} selected</button>`;
        }
    }

})();