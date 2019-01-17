const NOTESURL = "http://localhost:3000/api/v1/notes"
let allNotes = []
let noteData
let userObj
let noteToEdit

document.addEventListener('DOMContentLoaded', () => {
  // console.log('ADD UR CODE HERE!')

  const notesContainer = document.querySelector("#list")
  const userContainer = document.querySelector("#user-notes")
  const notesShowPanel = document.querySelector("#show-panel")
  const newNoteForm = document.querySelector("#new-note-form")
  const newNoteTitle = document.querySelector("#new-note-title")
  const newNoteBody = document.querySelector("#new-note-body")


  // renders all notes in notes container and sets header to user's name
  // creates an array of all notes for specific user
  function renderUserNotes() {
    fetch(NOTESURL)
      .then( resp => resp.json())
      .then(notes => {
        allNotes = notes
        notesContainer.innerHTML = ""
        userObj = allNotes[0].user
        userContainer.innerHTML = `
        <h2>${userObj.name}'s Notes:</h2>
        <button id="create-and-edit-button" data-action="create">Create New Note</button>
        `
        renderNotesPanel(notes)
      })
  }
  renderUserNotes()

  // Help to render HTML for each element in array passes as argument
  function renderNotesPanel(notesArray) {
    notesArray.map( note => {
      renderNoteCard(note)
    })
  }

  //Add HTML to container for a note passed in as argument
  function renderNoteCard(note) {
    notesContainer.innerHTML += `
    <li id=note-${note.id}>${note.title}
    <button data-note-id=${note.id} data-action="preview">preview</button>
    </li><br>
    `
  }

  // function to display note information in note panel
  function renderPreview(el) {
    notesShowPanel.innerHTML = `
    <h3 id="note-title">${el.title}</h3>
    <p id="note-body">${el.body}</p>
    <button data-note-id=${el.id} data-action="edit">Edit</button><button data-note-id=${el.id} data-action="delete">Delete</button>
    <div id="edit-note-form">
      <form id="editnoteform" class="edit-form" action="index.html" method="post">
        Title:<br>
        <input id="edit-note-title" type="text" name="title" value=""><br>
        New Note:
      </form>
      <textarea id="edit-note-body" row="6" cols="50" name="body" form="editnoteform"></textarea><br>
      <button data-action="cancel">Cancel</button>  <button data-action="submit">Submit</button>
    </div>`
  }

  // finds the information on the note clicked via preview button idea
  // calls renderPreview on click of preview button
  notesContainer.addEventListener("click", e => {
    e.preventDefault()
    noteData = allNotes.find( note => note.id == e.target.dataset.noteId)
    if (e.target.dataset.action == "preview") {
      renderPreview(noteData)
    }
  })//end of addEventListener


  // on click of 'create' clears window and makes create form visible
  userContainer.addEventListener("click", e => {
    // e.preventDefault()
    if (e.target.dataset.action == "create") {
      notesContainer.innerHTML = ""
      notesShowPanel.innerHTML = ""
      newNoteTitle.value = ""
      newNoteBody.value = ""
      if (newNoteForm.style.visibility = "hidden") {
        newNoteForm.style.visibility = "visible"
      }
    }
  })

  // on click:
    // cancel will hide new note form and re-render existing notes
  newNoteForm.addEventListener("click", e => {
    e.preventDefault()
    if (e.target.dataset.action == "cancel") {
      renderUserNotes();
      newNoteForm.style.visibility = "hidden"
    }
    // submit will create a new note, re-render all notes with new note
    // attached, and hide new note form
    if (e.target.dataset.action == "submit") {
      const newTitle = newNoteTitle.value
      const newBody = newNoteBody.value
      fetch(NOTESURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          "title": newTitle,
          "body": newBody,
          "user": {
            "id": userObj.id,
            "name": userObj.name
          }
        })
      })
      .then( resp => resp.json())
      .then( note => {
        renderUserNotes()
        renderPreview(note)
        newNoteForm.style.visibility = "hidden"
      })
    }
  })

  // on click:
    // edit will make edit form visible and assign contents to existing note info
  notesShowPanel.addEventListener("click", e => {
    e.preventDefault()
    const editNoteForm = document.querySelector("#edit-note-form")
    const editNoteTitle = document.querySelector("#edit-note-title")
    const editNoteBody = document.querySelector("#edit-note-body")
    if (e.target.dataset.action == "edit") {
      editNoteForm.style.visibility = "visible"
      noteToEdit = allNotes.find( note => note.id == e.target.dataset.noteId)
      editNoteTitle.value = noteToEdit.title
      editNoteBody.value = noteToEdit.body
    }
    // cancel will hide edit form
    if (e.target.dataset.action == "cancel") {
      editNoteForm.style.visibility = "hidden"
    }
    // submit will send patch request to database
    if (e.target.dataset.action == "submit") {
      // console.log(`${NOTESURL}/${noteToEdit.id}`);
      fetch(`${NOTESURL}/${noteToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          "title": editNoteTitle.value,
          "body": editNoteBody.value,
          "user": {
            "id": userObj.id,
            "name": userObj.name
          }
        })
      })
      .then( res => res.json())
      .then( edittedNote => {
        editNoteForm.style.visibility = "hidden"
        // notesShowPanel.innerHTML = `
        // <h3 id="note-title">${edittedNote.title}</h3>
        // <p id="note-body">${edittedNote.body}</p>
        // <button data-note-id=${noteData.id} data-action="edit">Edit</button><button data-note-id=${noteData.id} data-action="delete">Delete</button>
        // <div id="edit-note-form">
        //   <form id="editnoteform" class="edit-form" action="index.html" method="post">
        //     Title:<br>
        //     <input id="edit-note-title" type="text" name="title" value=""><br>
        //     New Note:
        //   </form>
        //   <textarea id="edit-note-body" row="6" cols="50" name="body" form="editnoteform"></textarea><br>
        //   <button data-action="cancel">Cancel</button>  <button data-action="submit">Submit</button>
        // </div>`
        renderPreview(edittedNote)
        renderUserNotes()
        // debugger
      })
    }
    // delete will remove note from note show panel and list of notes
    if (e.target.dataset.action == "delete") {
      const noteToDeleteId = event.target.dataset.noteId
      window.alert("Are you sure you want to chuck it?")
      fetch(`${NOTESURL}/${noteToDeleteId}`, {method: "DELETE"})
      document.querySelector(`#note-${noteToDeleteId}`).remove()
      notesShowPanel.innerHTML = ""
    }
  })


})//end of DOMContentLoaded
