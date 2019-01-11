//Google Auth
var uiConfig = {
signInSuccessUrl: 'http://localhost:8080/',
signInOptions: [{
    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    scopes: config.scopes
},

// FirebaseUI config.
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
],
// tosUrl and privacyPolicyUrl accept either url string or a callback
// function.
// Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
        window.location.assign('<your-privacy-policy-url>');
    }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

// This function will trigger when there is a login event
firebase.auth().onAuthStateChanged(function(user) {
    var firebaseContainer = document.getElementById("firebaseui-auth-container");
    var listContainer = document.getElementById("list-container");
    var logOut = document.getElementById("logout");
    if (user == null){
        firebaseContainer.style.display = "block";
        listContainer.style.display = "none";
        logOut.style.display = "none";
    }
    var uid = user.uid;
    //Make sure there is a valid user object
    if(user){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://apis.google.com/js/api.js';
    }
      // Once the Google API Client is loaded, you can run your code
      else {
        firebase.auth().signOut(); // Something went wrong, sign out
        firebaseContainer.style.display = "block";
        listContainer .style.display = "none";
      }
      // Add to the document
      document.getElementsByTagName('head')[0].appendChild(script);  
      if(user!=null){
         firebaseContainer.style.display = "none";
         listContainer .style.display = "block";

      }
      /* 
THE APP STARTS BELOW
*/
//create firebase database reference
var usersRef = firebase.database().ref('users');
var dbRef = firebase.database();

//Get Elements
var preObject = document.getElementById('notes')
var dbRefObject = dbRef.ref().child('notes'); 
var dbRefList = dbRefObject.child(uid); 


//Retrieve data on database to populate <ul>
dbRefObject.on('value', gotData, errData);
function gotData(data) {
    var noteListings = document.getElementsByClassName("noteItem")
    for (let i = 0; i < noteListings.length; i++){
        $(noteListings).remove(i); //Need to fix this
    }
    var noteList = document.getElementById("notes");
    var notes = data.val();
    var keys = Object.keys(notes) //Creates array with all the keys from "notes"

    for ( let i = 0; i < keys.length; i++) { //Iterates through keys
        var k = keys[i];
        var note = notes[k].noteContent;
        var currentUser_id = notes[k].uid;
        if (currentUser_id === firebase.database().ref("notes").child(uid).key){ //
            var newNote = document.createElement('li');
            newNote = newNote.innerHTML = "<li class='noteItem'><span data-key="+k+"><i class='fas fa-trash-alt'></i></span>" + note +"</li>";
            noteList.innerHTML+=newNote; //appends new list of notes from database to page.
        }
    }   

}


function errData(err){
    console.log ("There is an error: " + err);
}

$("#logout").on("click", function(){
    firebase.auth().signOut();
    gotData();
})


$("ul").on("click", "li", function(){
    $(this).toggleClass("done");
});

// Click on "X" to delete item
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(1000, function(){
        $(this).remove();
    })
    event.stopPropagation();
});

//Remove from firebase
var remove = function(e){
    var key = $(this).data('key');
    if(confirm('Are you sure?')){
      firebase.database().ref("notes").child(key).remove();
    }
  }
  $("ul").on('click', 'span', remove);

// Create new item
$("input[type='text']").keypress(function(event){
    var user = firebase.auth().currentUser;
    var uid = user.uid;
    if (user == null){
        alert("You have to sign in first!")
    }
    if(event.which === 13){
        //grab new todo item from input
        var todoText = $(this).val();
        $(this).val("");

        //How data will be displayed in database
        var data = {
            uid,
            "noteContent": todoText
        }
        dbRefObject.push(data); 
        dbRefObject.on('child_added', function(data){
           return  key = data.key;
        });
        
       // $("#notes").append("<li class='noteItem'><span data-key="+key+"><i class='fas fa-trash-alt'></i></span> "+todoText+"</li>");
    }
});
    });

$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle()
})

$("ul").on("click", "li", function(){
    $(this).toggleClass("done");
});


$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle()
})
var noteListings = document.getElementsByClassName("noteItem")
if (noteListings.length > 0){
    $("input").css("border-radius", "none");
} else {
    $("input").css("border-radius", "0px 0px 15px 15px");
}
if(document.readyState === "complete") {
    //Already loaded!
    console.log("ITS READY!")
  }