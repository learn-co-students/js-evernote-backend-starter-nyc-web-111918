document.addEventListener('DOMContentLoaded', () => {

  const notesList = document.querySelector('#list')
  const showNote = document.querySelector('#note')
  const editForm = document.querySelector('#edit-form')
  const noteTitleInput = document.querySelector('#note-title')
  const noteBodyInput = document.querySelector('#note-body')
  const newTitleInput = document.querySelector('#new-note-title')
  const newBodyInput = document.querySelector('#new-note-body')
  const newNoteForm = document.querySelector('#new-form')
  const searchForm = document.querySelector('#search-form')
  let selectedNoteID = 0

  NOTES = []

  fetch('http://localhost:3000/api/v1/users/3')
    .then(r => r.json())
    .then(obj => {
      obj.notes.forEach(function(note) {
        NOTES.push(note)
        notesList.innerHTML += `
          <li data-id="${note.id}"> ${note.title} </h3>
        `
      })
    })
  //
  // newNoteBtn.addEventListener('click', (e) => {
  //   showNote.innerHTML = `
  //   <h2>Create New Note: </h2>
  //   <form id="new-form" method="post">
  //     Title: <br><input id="new-note-title" type="text" name="title" value="" ><br>
  //     Body: <br><input id="new-note-body" type="text" name="body" value="" style="height:220px;width:400px"><br>
  //     <input type="submit" value="Submit">
  //   </form>
  //   `
  // })

  newNoteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`http://localhost:3000/api/v1/notes`, {
      method: "POST",
      headers: {
          "Content-Type": 'application/json',
          Accept: 'application/json'
        },
      body: JSON.stringify({
        title: newTitleInput.value,
        body: newBodyInput.value,
        user_id: 3
      })
      })
      .then (r => r.json())
      .then (newObj => {
        NOTES.push(newObj)
        notesList.innerHTML += `
          <li data-id="${newObj.id}"> ${newObj.title} </h3>
        `
      })
  })

  showNote.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
      const clickedNote = NOTES.find(note => parseInt(e.target.parentElement.dataset.id) === note.id)
      console.log(clickedNote)
      if (e.target.innerHTML === "Edit") {
        editForm.style.display = "block"
        noteTitleInput.value = clickedNote.title
        noteBodyInput.value = clickedNote.body
        selectedNoteID = clickedNote.id
        // listElement = document.querySelector(`[data-id="${clickedNote.id}"]`)
        // console.log(listElement)
      } else if (e.target.innerHTML === "Delete") {
        fetch(`http://localhost:3000/api/v1/notes/${clickedNote.id}`, { method: "DELETE" })
        .then(r => {
          if (r.ok) {
            const noteIndex = NOTES.indexOf(clickedNote)
            NOTES.splice(noteIndex, 1)
            showNote.innerHTML = ""
            listElement = document.querySelector(`[data-id="${clickedNote.id}"]`)
            listElement.remove()
            alert('deleted!')
          }
        })
      }
    }
  })

  editForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("submitttted")
    fetch(`http://localhost:3000/api/v1/notes/${selectedNoteID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        title: noteTitleInput.value,
        body: noteBodyInput.value
      })
    })
    .then(r => r.json())
    .then(obj => {
      objIndex = NOTES.findIndex(note => obj.id === note.id)
      NOTES[objIndex].title = noteTitleInput.value
      NOTES[objIndex].body = noteBodyInput.value
      showNote.innerHTML = `
      <div data-id="${obj.id}">
        <h2> ${obj.title} </h2>
        <p> ${obj.body} </p>
        <button type="edit" id="edit-${obj.id}">Edit</button>
        <button type="delete" id="delete-${obj.id}">Delete</button>
      </div>`
      notesList.innerHTML = ""
      NOTES.forEach(note => {
        notesList.innerHTML += `
          <li data-id="${note.id}"> ${note.title} </h3>
        `
      })
      editForm.style.display = "none"
    })
  })

  notesList.addEventListener('click', (e) => {
    if (e.target.tagName = "LI") {
      editForm.style.display = "none"
      const clickedNote = NOTES.find(note => parseInt(e.target.dataset.id) === note.id)
      showNote.innerHTML = `
      <div data-id="${clickedNote.id}">
        <h3> ${clickedNote.title} </h3>
        <p> ${clickedNote.body} </p>
        <button type="edit" id="edit-${clickedNote.id}">Edit</button>
        <button type="delete" id="delete-${clickedNote.id}">Delete</button>
      </div>`
    }
  })

  searchForm.addEventListener('input', (e) => {
    const filteredNotes = NOTES.filter(note => (note.body).includes(e.target.value))
    showNote.innerHTML = "<br><br>"
    filteredNotes.forEach(note => {
      showNote.innerHTML += `
        <li data-id="${note.id}"> ${note.title} </h3>
      `
    })
  })

  showNote.addEventListener('click', (e) => {
    if (e.target.tagName = "LI") {
      editForm.style.display = "none"
      const clickedNote = NOTES.find(note => parseInt(e.target.dataset.id) === note.id)
      showNote.innerHTML = `
      <div data-id="${clickedNote.id}">
        <h3> ${clickedNote.title} </h3>
        <p> ${clickedNote.body} </p>
        <button type="edit" id="edit-${clickedNote.id}">Edit</button>
        <button type="delete" id="delete-${clickedNote.id}">Delete</button>
      </div>`
    }
  })




})
