document.addEventListener('DOMContentLoaded', () => {
  const notesList = document.querySelector('#notes-list')
  const showNote = document.querySelector('#show-note')
  const newNoteButton = document.querySelector('#new-note')
  const editNoteButton = document.querySelector('#edit-note-button')
  const deleteNoteButton = document.querySelector('#delete-note-button')
  const newNoteFormContainer = document.querySelector('#new-note-container')
  const newNoteForm = document.querySelector('#new-note-form')
  const editNoteForm = document.querySelector('#edit-note-form')

  let currentNoteId

  // const newNoteFormHTML = `
  //   <h2>New Note</h2>
  //   <form id = "new-note-form">
  //     Title: <input id="title" type="text" name="note_name"></br>
  //     <textarea rows="10" cols="50" id="note-body" name="note_body" form="new-note-form" placeholder="Write note here..."></textarea></br>
  //     <input type="submit">
  //   </form></br>
  //   `



  fetch('http://localhost:3000/api/v1/users/1')
    .then(res => res.json())
    .then(user => {
      user.notes.forEach(function(note){
        notesList.innerHTML += `
          <a data-class="note-title" id ="note-${note.id}" data-id="${note.id}">${note.title}</a>
        `
      })
    })

  notesList.addEventListener("click", function(e){
    if (e.target.dataset.class === "note-title") {
      const noteId = e.target.dataset.id
      fetch(`http://localhost:3000/api/v1/notes/${noteId}`)
        .then(res => res.json())
        .then(note => {
          showNote.innerHTML = `
            <h1>${note.title}</h1>
            <p>${note.body}</p>
            <button id="edit-note-button" data-class="edit-note-button" data-id="${note.id}">Edit</button>
            <button id="delete-note-button" data-class="delete-note-button" data-id="${note.id}">Delete</button>
          `
        })
    }
    // else if (e.target.dataset.class === "new") {
    //   newNote = !newNote
    //   console.log(newNote)
    //   if (newNote) {
    //     newNoteFormContainer.style.display = 'block'
    //   } else {
    //     newNoteFormContainer.style.display = 'none'
    //   }
    // }
  })

  newNoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    const newNoteTitle = e.target.note_name.value
    const newNoteBody = e.target.note_body.value

    fetch('http://localhost:3000/api/v1/notes', {
      method: "POST",

      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      body: JSON.stringify({
        title: newNoteTitle,
        body: newNoteBody,
        user_id: 1
      })
    })
      .then(res => res.json())
      .then(newNote => {
        notesList.innerHTML += `
          <a data-class="note-title" data-id="${newNote.id}" id="note-${newNote.id}">${newNote.title}</a>
        `
      })
  })

  showNote.addEventListener("click", function(e){
    if (e.target.dataset.class === "edit-note-button") {
      currentNoteId = e.target.dataset.id
      noteToEditTitle = e.target.parentElement.querySelector("h1").innerHTML
      noteToEditBody = e.target.parentElement.querySelector("p").innerHTML

      editNoteForm.edit_note_name.value = noteToEditTitle
      editNoteForm.edit_note_body.value = noteToEditBody




    } else if (e.target.dataset.class === "delete-note-button") {
      const noteToDelete = e.target.dataset.id

      fetch(`http://localhost:3000/api/v1/notes/${noteToDelete}`, {
        method: "DELETE" })

       document.querySelector(`#note-${noteToDelete}`).remove()
       showNote.innerHTML = ""

    }
  })

  editNoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    const updatedTitle = e.target.edit_note_name.value
    const updatedBody = e.target.edit_note_body.value

    fetch(`http://localhost:3000/api/v1/notes/${currentNoteId}`, {
      method: "PATCH",

      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },

      body: JSON.stringify({
        title: updatedTitle,
        body: updatedBody,
      })

    })
      .then(res => res.json())
      .then(updatedNote => {
        console.log(updatedNote.id)
        document.querySelector(`#note-${updatedNote.id}`).innerText = updatedNote.title

        showNote.innerHTML = `
          <h1>${updatedNote.title}</h1>
          <p>${updatedNote.body}</p>
          <button id="edit-note-button" data-class="edit-note-button" data-id="${updatedNote.id}">Edit</button>
          <button id="delete-note-button" data-class="delete-note-button" data-id="${updatedNote.id}">Delete</button>
        `

      })

  })




})
