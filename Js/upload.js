// Declare upload array and variables
let selectedFiles;
let selectedFiles__Object = [];	

// Clear upload object when all elements have been removed
function clearUploadArea() {
	// Clear selectedFiles variable
	selectedFiles = "";
	// Clear select file input field value
	document.getElementById('message-upload-field').value = "";
	// Reset HTML elements display styles and contents
	document.getElementById('message-upload-area--clear').style.display = "none";
	document.getElementById("message-help").style.display = "flex";
	document.getElementById("message-help").textContent = ("Drag and drop or click to add video files here");
}

// Prepares files for upload
function prepareUpload(files, filesCount) {		
	// Display clear button after files have been selected
	document.getElementById('message-upload-area--clear').style.display = "flex";
	// Append selected files and attributes to upload object
	if (objectLength(selectedFiles__Object) == 0) { // Checks if selectedFiles__Object object is empty
		// If yes, iterate through selectedFiles and push each to selectedFiles__Object
		for (let x = 0; x < filesCount; x++) {
			let entry = {"name": files[x].name, "size": files[x].size, "src": "Images/Favicon/PAW.jpg"};
			selectedFiles__Object.push(entry);
		}
	} else { // If selectedFiles__Object has elements in it, ensure 
		// an existing element is not added more than once
		// Iterate through selectedFiles			
		for (let x = 0; x < filesCount; x++) {
			// Create a data object for each item
			let entry = {"name": files[x].name, "size": files[x].size, "src": "Images/Favicon/PAW.jpg"};			
			// Initiate counter to increment if items in selectedFiles exist in selectedFiles__Object
			let check__count = 0;
			// Iterate through selectedFiles__Object to check each selected
			// file with every item in selectedFiles__Object
			for (let y = 0; y < selectedFiles__Object.length; y++) {
				// If an element exists
				if (selectedFiles__Object[y].name == entry.name) {
					// Increment counter
					check__count++;
				}					
			}
			// If counter is 0, means no match for checked item
			if (check__count == 0) {
				// Push checked item to seleted item to selectedFiles__Object
				selectedFiles__Object.push(entry);
			}
		}

	}
	// Display thumbnails of selected files
	addThumbnail();
	// Update selected files combined meta information(Total number, size etc)
	updateDataAttr();
}

//	Drag and drop functionality for uploads
(function() {
	
	// Preventing page from redirecting on dragover
	document.addEventListener("dragover", function(e) {
		e.preventDefault();
		e.stopPropagation();
		document.getElementById("message-help").textContent = "Drag here";						
	});

	document.addEventListener("drop", function(e) { e.preventDefault(); e.stopPropagation();});

	// Drag enter on mapped upload area
	document.getElementById('file-upload-area--message').addEventListener('dragenter', function (e) {
		e.stopPropagation();
		e.preventDefault();
		document.getElementById("message-help").textContent = "Drop here!";
	});

	// Drag over on mapped upload area
	document.getElementById('file-upload-area--message').addEventListener('dragover', function (e) {
		e.stopPropagation();
		e.preventDefault();
		document.getElementById("message-help").textContent = "Drop here!";
	});

	// Drop on mapped upload area
	document.getElementById('file-upload-area--message').addEventListener('drop', function (e) {
		e.stopPropagation();
		e.preventDefault();
		// Hold files dropped in upload area in the variable
		selectedFiles = e.dataTransfer.files;
		// Get length of dropped files
		selectedFiles__Length = selectedFiles.length;
		// Run prepareUpload function
		prepareUpload(selectedFiles, selectedFiles__Length);
		
	});
	
	// Simulate a click on file input selector on upload area div click
	document.getElementById("file-upload-area--message").addEventListener("click", (elem) => {
		elem.preventDefault();
		elem.stopPropagation();
		if (elem.target.id == "file-upload-area--message" || elem.target.id == "message-help" || elem.target.id == "file-data--grid") {
			document.getElementById("message-upload-field").click();
		}
	});

	// File selected
	document.getElementById("message-upload-field").addEventListener("change", function() {
		// Hold files selected
		selectedFiles = document.getElementById("message-upload-field").files;
		// Get length of dropped files
		selectedFiles__Length = selectedFiles.length;			
		// Run prepareUpload function
		prepareUpload(selectedFiles, selectedFiles__Length);
	});
		
})();

// Displays file thumbnail for selected file(s)
function addThumbnail() {
	// Hide hints
	document.getElementById("message-help").style.display = "none";
	// Clear file-data-grid before appending new data
	let __HTML__elem = "";
	// Append HTML elements for each thumbnail
	for (let x = 0; x < objectLength(selectedFiles__Object); x++) {
		const selectedFiles__Name = selectedFiles__Object[x].name;
		const selectedFiles__Size = convertSize(selectedFiles__Object[x].size);
		const selectedFiles__Src = selectedFiles__Object[x].src;
		// Creating an thumbnail and incrementally assign it to __HTML__elem variable
		__HTML__elem += (`<div class="upload--files" data-name="${selectedFiles__Name}" id="upload--file-${selectedFiles__Name}">
				<div class="close--btn"><i class="fa fa-times"></i></div>
				<img src="${selectedFiles__Src}" alt="" width="100%">
				<div class="file--size">${selectedFiles__Size}</div>
			</div>
		`);
	}
	// Append thumbnails to file-data--grid element
	document.getElementById("file-data--grid").innerHTML = __HTML__elem;

	// Hold all close button
	const remove__Btn = document.getElementsByClassName("close--btn");
	// Effect deleting feature for any thumbnail when clicked
	for (let x = 0; x < remove__Btn.length; x++) {			
		remove__Btn[x].addEventListener("click", function() {
			// Hides clicked/removed element
			this.parentNode.style.display = "none";
			// and get removed thumbnail file name
			const itemName = this.parentNode.dataset.name;
			// get the index of removed item in selectedFiles__Object
			const nameIndex = selectedFiles__Object.findIndex(x => x.name === itemName);
			// If item if found
			if (nameIndex > -1) {
				// ...remove this file/item/elem from selectedFiles__Object
				selectedFiles__Object.splice(nameIndex, 1);
			}				
			// Clear thumbnails and upload object if all files have been removed from selectedFiles__Object
			if (objectLength(selectedFiles__Object) == 0) {
				clearUploadArea();
			}
			// Run update function
			updateDataAttr();
		});
	}
	// Stashing function for removing all file on a single click
	clearAllFiles__Action(remove__Btn);
}

// Remove all file when clicked
function clearAllFiles__Action(remove__Btn) {
	document.getElementById("message-upload-file--clear").addEventListener("click", function (e) {
		e.preventDefault();
		for (let x = 0; x < remove__Btn.length; x++) {
			remove__Btn[x].click();
		}
	});
}

// Gets count of any object
function objectLength(Obj) {
	let Object__Length = 0;
	for (let obj__item in Obj) {
		Object__Length++;
	}
	return Object__Length;
}

// Updates uploaded files meta data (size, files count etc)
function updateDataAttr() {
	// Gets selectedFiles__Object instantaneously
	const __length = objectLength(selectedFiles__Object);
	// Initiate files size counter
	let __size = 0;
	// Iterate through object to get all file sizes
	for (let x = 0; x < __length; x++) {
		__size += parseFloat(selectedFiles__Object[x].size);			
	}
	// and process with convertSize function
	__size = convertSize(__size);
	// Append files information to HTML elements
	document.getElementById("message-upload-file--length").textContent = `${__length} files`;
	document.getElementById("message-upload-file--size").textContent = `Size: ${__size}`;
}

// File size bytes conversion
function convertSize(size) {		
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (size == 0) return '0 Byte';
	const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
	return (size / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];		
}