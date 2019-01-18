// 1. Listing all of a user’s notes on a sidebar --> For now, only create one user. There will be no log in.
// 2. When a user clicks on a note “preview” in the sidebar, the full note body and any other
//    details of the currently selected note should show on the page.
// 3. Allow users to create, edit and delete notes.
// 4. Feel free to add on your own features if you have built all of the above!
//    Some ideas: You could add filter or search functionality, multiple users,
//    or support for rich format (bold, italic, etc) when creating a note.


// REPEATE YOUR SELF TO GET THE JOB DONE!!! THEN REFACTOR!!!

document.addEventListener('DOMContentLoaded', () => {
  console.log('page loaded')

const sidebar = document.querySelector('#sidebar');
const notesContainer = document.querySelector('#notes-container');
const newNoteForm = document.querySelector('#note-form');
//send a fetch request to notes to allow them to render onto the page.
fetch('http://localhost:3000/api/v1/notes')
.then(res => res.json())
.then(jsonObjNotes => {
  jsonObjNotes.map(note => {
    sidebar.innerHTML += sidebarNoteTitles(note)
  }).join('')
})

/***************SIDEBAR LISTENER *******************************/
sidebar.addEventListener('click', e => {
// console.log('clicked sidebar')
// console.log('target:', e.target)
// console.log('id of the button clicked', e.target.dataset.id)
let clickCount = 0
if(e.target.dataset.action === 'preview' && clickCount < 1) {
  clickCount++
  console.log(clickCount);
  //if the target has a dataset action of Preview
  //send a fetch request to the server to get the jsonObjNotes of notes.
  //use that request to post the body to the display notes div id.
  fetch('http://localhost:3000/api/v1/notes')
  .then(res => res.json())
  .then(jsonObjNotes => {
      // to render a single note you need to have the
      const foundNote = jsonObjNotes.find(note => {
        //if the id of the button that was clicked matched the note id of an obj in the data base
        return e.target.dataset.id == note.id
        // notesContainer.innerHTML += renderSingleNoteText(note)
      })
      // remember to return your find statment or it will not get the thing you need to use.
      // Best practice is to use function expressions so you have the variable to work with in the future if you so choose.
      notesContainer.innerHTML += renderSingleNoteText(foundNote)
  })
} // end of if statment
})// end of sidebar addEventListener

// I will first make the delete button work beacuse this is easier.
// Need a click EventListener on the notesContainer.
// When you click that specific button it can edit, remove the preview, or delete the note.
/**************************NOTES CLICK LISTENER*********************************/
notesContainer.addEventListener('click', e => {
  // console.log('click notes container', e.target, e.target.dataset.id, e.target.dataset.remove)
  const removeButton = e.target.dataset.remove
  const editButton = e.target.dataset.edit
  const deleteButton = e.target.dataset.delete
  const targetID = e.target.dataset.id
  const currentNote = document.querySelector(`[data-note-id="${targetID}"]`)
  const currentTitle = document.querySelector(`[data-title-id="${targetID}"]`)
  // debugger;
  // if you click the remove button.
  /****YOU NEED TO DISABLE OR REMOVE THE BUTTON TO AVOID BAD USER EXPERIANCE******/
  if(removeButton === 'remove') {
    //select the specific li you just clicked.
    // change the whole container div to be blank.
    currentNote.innerHTML = '';
    // sidebar.removeEventLisener('click', e => {})
  }

  if(deleteButton === 'delete') {
    //remove the note and the title from the sidebar.
    fetch(`http://localhost:3000/api/v1/notes/${targetID}`, {
      method:'DELETE'
    })
    .then(console.log)
    .then( () => { //pestamestically render in a then statment!!
    currentNote.innerHTML = ''
    currentTitle.innerHTML = ''})

  } //end of if statment

  // When you click the edit button.
  // That specific HTML div is replaced with a form
  // When new text is entered the HTML on the page will update and replace the form with the new text.
  const sidebarTitle = document.querySelector('#note-title')
  const noteBodyText = document.querySelector('#note-text')
  if(editButton === 'edit') {
    // debugger
    currentNote.innerHTML = renderSingleEditForm(targetID)
    const editForm = document.querySelector('#edit-form');
    //need to get the inputs of the title and the textarea
    const noteTitle = document.querySelector('#edit-title')
    const noteText = document.querySelector('#text-input')
     // debugger;
     // editForm.value =
     noteTitle.value = sidebarTitle.innerHTML
     noteText.value = noteBodyText.innerHTML

    console.log(editForm)
    editForm.addEventListener('submit', e => {
      e.preventDefault()
      console.log('submited form', e.target, e.target.id )
      fetch(`http://localhost:3000/api/v1/notes/${targetID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
           title: noteTitle.value,
           body: noteText.value
        })

      })
      .then(res => res.json())
      .then(updatedJsonObj => {
        //the response is a json Object not an array! it is an OBJect!!
          currentNote.innerHTML = renderSingleNoteText(updatedJsonObj)
          })
      .then('Success your Note was edit', console.log)
      //end of Fetch
    })//end of edit form event listener
    //HERE YOU WOULD DISABLE THE SUBMIT EventListener for Edit!!
  }//end of edit if click statment

})// end of notes container event listener.

/************************CREATE NOTE EVENTLISTENER****************************/
// first step add an event listener to the note form.
  newNoteForm.addEventListener('submit', e => {
    e.preventDefault()
    console.log('You submitted a new Note', e.target)
    //get the inputs that the user place into the fields.
    const newNoteTitle = event.target.querySelector('#name');
    const newNoteBody = event.target.querySelector('#body');
    // const sidebarTitle = document.querySelector()
    // console.log(newNoteBody.value, newNoteTitle.value)
    fetch('http://localhost:3000/api/v1/notes', {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: newNoteTitle.value,
        body: newNoteBody.value,
        user_id: 3
      })

    })
    .then(res => res.json())
    .then(jsonObj => {
      sidebar.innerHTML += sidebarNoteTitles(jsonObj)
      notesContainer.innerHTML += renderSingleNoteText(jsonObj)
    })
    //end of Fetch
    newNoteForm.reset()



  })//end of newNote Form listener
})// end of page load EventListener
/**********************HELPER FUCNTIONS******************************/
function sidebarNoteTitles(notesObj) {
  return `<div data-title-id="${notesObj.id}">
            <h1 class="sidenav-overwrite"> Note Title</h1>
            <p id="note-title">${notesObj.title}</p>
            <button data-action="preview" data-id="${notesObj.id}">Preview Note</button>
          </div>
          `
}

function renderSingleNoteText(noteObj) {
  // takes a single string of HTML based on the preview button that was clicked.
  return `<div data-note-id="${noteObj.id}">
            <h4>${noteObj.title}</h4>
            <ul>
              <li id="note-text">${noteObj.body}</li>
            </ul>
            <button data-edit="edit" data-id="${noteObj.id}">Edit</button>
            <button data-remove="remove" data-id="${noteObj.id}">Remove Preview</button>
            <button data-delete="delete" data-id="${noteObj.id}">Delete Note</button>
          </div>
          `
}

function renderSingleEditForm(targetId) {
  return `<div data-edit-id="${targetId}">
            <form id="edit-form">
              <input id="edit-title" type="title" name="title" placeholder="Note Title" value="">
                <textarea id="text-input" rows="8" cols="50">
                  Place new note text here!
                </textarea>
              <input data-id="${targetId}" type="submit" value="Edit Note">
            </form>
          </div>
         `
}
/********************************************************************/
