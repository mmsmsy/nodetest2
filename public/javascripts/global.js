// Userlist data array for filling in info box
var userListData = [];

// DOM Ready
$(document).ready(function() {

	// Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

     // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

	// Populate the user table on initial page load
	populateTable();

});

// Functions

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

		 // Stick our user data array into a userlist variable in the global object
        userListData = data;

		// For each item in our JSON, add a table row and cells to the çontent string
        $.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.surname + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserUsername = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserUsername);

	// Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoUsername').text(thisUserObject.username);
    $('#userInfoPasswordd').text(thisUserObject.passwordd);
    $('#userInfoNamee').text(thisUserObject.namee);
    $('#userInfoSurname').text(thisUserObject.surname);
    $('#userInfoDateofbirth').text(thisUserObject.dateofbirth);
    $('#userInfoListt').text(thisUserObject.listt);

};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check for duplication in username fields. The users will still be able to have the rest of details identical
    var duplication = 0;

    // Check and make sure errorCount's still at zero
    if(errorCount === 0 && duplication < 1) {

        // If it is, compile all user info into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserUsername').val(),
            'passwordd': $('#addUser fieldset input#inputUserPasswordd').val(),
            'namee': $('#addUser fieldset input#inputUserNamee').val(),
            'surname': $('#addUser fieldset input#inputUserSurname').val(),
            'dateofbirth': $('#addUser fieldset input#inputUserDateofbirth').val(),
            'listt': $('#addUser fieldset input#inputUserListt').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user is confirmed for deletion
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            } else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    } else {

        // If they said no to the confirm, do nothing
        return false;

    }

};