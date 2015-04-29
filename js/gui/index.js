// Global variables
var timeout_to_show;


// Padding function
String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};


// Handle text input
$(document).ready(function(){
	$("#huffman_input").keyup(function(){
		// Get text
		var input = $("#huffman_input").val();
		
		
		// Call the interpret function
		var result = interpret_text(input);
		
		
		// Update GUI
		update_gui_elements(result);
	});
});


// Handle file uploads (dragging)
$(document).ready(function(){
	var target = document.getElementById("huffman_bits");
	target.addEventListener("dragover", function(e){e.preventDefault();}, true);
	target.addEventListener("drop", function(e){
		e.preventDefault();
		load_file(e.dataTransfer.files[0]);
	}, true);
});


// Handle file uploads (button to upload)
$(document).ready(function(){
	$("#huffman_upload_input").change(function(e){
		var input = document.getElementById("huffman_upload_input");
		var file = input.files[0];
		load_file(file);
	});
});


// Handle reading the file's contents
function load_file(file){
	var reader = new FileReader();
	
	reader.onload = function(e){
		// Get all the bytes from the file
		var byte_array = new Uint8Array(e.target.result.length);
		
		for(i = 0; i < e.target.result.length; i++){
			byte_array[i] = (e.target.result.charCodeAt(i));
		}
		
		
		// Call the interpret function
		var result = interpret_byte_array(byte_array);
		
		
		// Update GUI
		update_gui_elements(result);
	};
	
	reader.readAsBinaryString(file);
}


// Update the GUI elements with a result object
function update_gui_elements(result){
	// Prepare screen
	$("#huffman_graph-canvaswidget").remove();
	clearTimeout(timeout_to_show);
	
	
	// Update each element
	$("#huffman_input").val(result.text);
	update_huffman_graph(result.encoded_tree);
	update_huffman_bits(result.bit_string);
	update_huffman_download(result.file_output);
}


// Draw an encoded tree
function update_huffman_graph(encoded_tree){
	if(encoded_tree.length != 0){
		// Hide initial message
		$("#huffman_graph i").hide();
		
		
		// Visualize
		visualize(encoded_tree);
		
		
		// Animate tree building
		$("#huffman_graph-canvaswidget").fadeTo(0, 0);
		timeout_to_show = setTimeout(function(){
			$("#huffman_graph-canvaswidget").fadeTo(0, 1);
		}, 550);
	}
	else{
		// Show initial message
		$("#huffman_graph i").show();
	}
}


// Write the bits to the box
function update_huffman_bits(bit_string){
	if(bit_string != ""){
		$("#huffman_bits").html(bit_string);
	}
	else{
		$("#huffman_bits").html("<i>Type to see bits...</i>");
	}
}


// Update the download button
function update_huffman_download(file_output){
	var blob = new Blob([file_output], {type: "application/octet-stream"});
	var url = window.URL.createObjectURL(blob);
	$("#huffman_download").attr("href", url);
	$("#huffman_download").attr("download", "Encoded String");
}