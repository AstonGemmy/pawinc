// Gets all selector channels
const selector = document.querySelectorAll("[data-selector-action]");
// Gets all individual delete buttons
const single_action = document.querySelectorAll("[data-single-action]");
// Gets all bulk delete buttons
const bulk_action = document.querySelectorAll("[data-bulk-action]");
// Gets all delete feedback response elements
const response_output = document.querySelectorAll("[data-response-action]");
// Gets all selector count update elements
const update_output = document.querySelectorAll("[data-update-action]");
// Disable all bulk delete elements on load
bulk_action.forEach(_bulk_action => {
    _bulk_action.disabled = true;
});

// Array to hold delete keys for selected item
let delete_object = [];
// Initialise focus area variable
let focus_area = "select-all-message";
// Initialise selector count update variable
let update_output_key;
// Initialise single output key variable to display feedback response when a single item is deleted
let single_action_key;
// Initialise feedback response variable 
let response_output_key;
// Initialise target element variable
let selected_target_element;
// initialise target element'state variable
let target_element_state;
// initialise selected channel's id variable
let selected_id;
// initialise selected channel's focus area variable
let selected_focus_area;
// initialise previously selected channel's focus area variable
let previous_focus_selector_element;
// Initialises focus area channel
let focus_selector_element;
// initialise index of selected channel's id in delete_object
let selector_object_index;
// Initialise variable that Stringifies delete_object for transport
let delete_key_object;
// Initialise Basic authentication credentials
let username;
let password;
// Initialise length of delete_object variable
let selector_count;


// Bulk selectors array
const bulk_selector = [
    "select-all-message",
    "select-all-announcement",
    "select-all-video"
];

// Iterates through all selector channels
selector.forEach(this_selector => {
    // When any channel is selected
    this_selector.addEventListener("click", function() {
        // Get channel id
        selected_id = this.id;
        // Get focus area of selected channel
        selected_focus_area = this.dataset.selectorAction;
        // Gets target element of selected channel (in this case using checkbox)
        selected_target_element = document.querySelector(`#${selected_id} input[type='checkbox']`);
        // Change state of channel's target element
        if (selected_target_element.checked == true) {
            selected_target_element.checked = false;
        } else {
            selected_target_element.checked = true;
        }
        // Stash current elements state
        target_element_state = selected_target_element.checked;
        // Get all channels belonging to prviously selected focus area
        previous_focus_selector_element = document.querySelectorAll(`[data-selector-action='${focus_area}']`);

        // Checks if channel is a bulk selector for current focus area
        if (!bulk_selector.includes(selected_id)) {
            // Check if focus area has changed
            if (focus_area != selected_focus_area) {
                // Uncheck all targets for previous focus areas
                previous_focus_selector_element.forEach(previous_focus_selector_element => {
                    document.querySelector(`#${previous_focus_selector_element.id} input[type='checkbox']`).checked = false;
                });
                // Set focus area variable to current channel's focus area
                focus_area = selected_focus_area;
                // Empty delete_object items
                delete_object = [];
            }
            // Uncheck all bulk selectors channel's targets for all focus areas once a single selector is selected
            bulk_selector.forEach(bulk_selector => {
                document.querySelector(`#${bulk_selector} input[type='checkbox']`).checked = false;
            });
            // Gets the index of selected channel's key in delete_object if it exist
            selector_object_index = delete_object.indexOf(selected_id);
            // and channel's target is checked
            if (target_element_state == true) {
                // Add this id(key) to delete_object if it does not exist
                if (selector_object_index == -1) {
                    delete_object.push(selected_id);
                }             
            } else {
                // If channel's target is unchecked and key is in delete_object
                if (selector_object_index > -1) {
                    // Remove this channel's id(key)
                    delete_object.splice(selector_object_index, 1);
                }
            }

        } else {
            // Set current focus area to selected channel's focus area
            focus_area = selected_focus_area;
            // Empty delete_object before adding new delete keys 
            delete_object = [];
            // Iterate through all selectors
            selector.forEach(this_selector => {
                // Uncheck all channel targets where channel's id is not equal to selected channel
               if (this_selector.id != selected_id) {
                    document.querySelector(`#${this_selector.id} input[type='checkbox']`).checked = false;
                }
            });
            // Get targets of all channels that belong to current focus area
            focus_selector_element = document.querySelectorAll(`[data-selector-action='${focus_area}']`);
            // If selected channel's target state is true
            if (target_element_state == true) {
                // Iterate through all focus area targets and check them
                focus_selector_element.forEach(focus_selector_element => {
                    document.querySelector(`#${focus_selector_element.id} input[type='checkbox']`).checked = true;
                    // push channel's ids (delete keys) to delete_object
                    delete_object.push(focus_selector_element.id);
                });               
                // Remove the first checkbox key
                // This key is just a reference
                delete_object.shift();
            } else {
                // Iterate through all focus area targets and uncheck them
                focus_selector_element.forEach(focus_selector_element => {
                    focus_selector_element.checked = false;       
                });
                // Empty delete keys
                delete_object = [];
            }

        }

        let counterArr = [];
        selector.forEach(check_any_selector_state => {            
            if (document.querySelector(`#${check_any_selector_state.id} input[type='checkbox']`).checked == true) {
               counterArr.push(check_any_selector_state.dataset.selectorAction);
            }            
        });

        if (counterArr.length > 0) {
            // Enable bulk action target for focus channel
            bulk_action.forEach(bulk_action => {
                if (bulk_action.dataset.bulkAction === counterArr[0]) {
                    bulk_action.disabled = false;
                } else {
                    bulk_action.disabled = true;
                }
            });
        } else {
            // Enable bulk action target for focus channel
            bulk_action.forEach(bulk_action => {
                bulk_action.disabled = true;
            });
        }

        // Gets focus area
        update_output_key = selected_focus_area;
        // Updates selection area using focused element id
        updateSelectorCount(update_output_key);
    });
    
});

single_action.forEach(single_action => {
    single_action.addEventListener("click", function() {
        single_action_key = this.dataset.actionKey;
        response_output_key = this.dataset.singleAction;
        deleteELEMENT([single_action_key], response_output_key);
    });
});

bulk_action.forEach(each_bulk_action => {
    each_bulk_action.addEventListener("click", function() {
        response_output_key = this.dataset.bulkAction;        
        deleteELEMENT(delete_object, response_output_key);
    });
});

function removeSelector(_selector_key) {
    _selector_key.forEach(this_key => {
        selector.forEach(remove_selector =>{
            if (remove_selector.id == this_key) {
                remove_selector.classList.add("hide");
                setTimeout(function() {
                   remove_selector.classList.add("remove");
                }, 800);
            }
        });
    });

    setTimeout(function() {
        _selector_key.forEach(this_key => {
            selector.forEach(remove_selector =>{
                if (remove_selector.id == this_key) {
                    remove_selector.classList.add("remove");
                }
            });
        });
    }, 2000);

    setTimeout(function() {
        update_output.forEach(update_output => {
            update_output.innerHTML = '';
        });
        response_output.forEach(response_output => {
           response_output.innerHTML = '';
        });
    }, 2000);
    
}

// Transports selected element's ids for deleting
function deleteELEMENT(_action_keys, _response_key) {
    // Stringifies delete_object for transport
    delete_key_object = JSON.stringify(_action_keys);
    // Set Basic authentication credentials
    username = 'aston';
    password = 'root';
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
        body: delete_key_object,
    })
    .then(response => response.text())
    .then(function(response) {
        // Clear all other response elements and parse response to focused area feedback element
        response_output.forEach(response_output => {
            if (response_output.dataset.responseAction != _response_key) {
                response_output.innerHTML = '';
            } else {
                response_output.innerHTML = `<button class="feedback">${response}</button>`;
            }
        });
        removeSelector(_action_keys);        
    })
    .catch(error => console.log(`Error deleting data -> ${error}`));	
}

// Updates selected items counts for focused area
function updateSelectorCount(count_update_id) {
    // Gets length of delete_object as number of selected items at any time
    selector_count = delete_object.length;
    
    if (selector_count > 0 ) {
        // Clear all other update elements and parse update to focused area update element
        update_output.forEach(update_output => {
            if (update_output.dataset.updateAction != count_update_id) {
                update_output.innerHTML = '';
            } else {
                update_output.innerHTML = `<button class="report">${selector_count} selected</button>`;
            }
        });
    } else {
        update_output.forEach(update_output => {
            update_output.innerHTML = '';
        });
    }
}
