document.addEventListener('DOMContentLoaded', () => {
  const userUrl = "http://localhost:3000/api/v1/users/2"
  const username = document.querySelector("#username")
  const noteList = document.querySelector("#note-list")
  const noteDisplay = document.querySelector("#note-display")
  const newSubmitButton = document.querySelector("#new-submit")
  const newTitleField = document.querySelector("#new-title-field")
  const newNoteField = document.querySelector("#new-note-field")
  const newForm = document.querySelector("#new-note-form")

  fetch(userUrl)
  .then(response => response.json())
  .then(userObj => pageSetUp(userObj))

  function pageSetUp(userObj){
    username.innerHTML = userObj.name
    noteList.innerHTML = addNoteList(userObj)
    noteDisplay.innerHTML = `<p>Please select a note</p>`
  }

  function displayNote(noteObj){
    let display = ``
      display += `<h3>${noteObj.title}</h3>`
      display += `<p>${noteObj.body}</p>`
      display += `<button data-id = ${noteObj.id} type="button" name="button">Edit note</button>`
      display += `<button data-id = ${noteObj.id} type="button" name="button">Delete note</button>`
    return display
  }

  function addNoteList(userObj){
    let noteLi = ``
      userObj.notes.forEach(function(note){
        noteLi += `<li data-note-id= ${note.id}> ${note.title}</li>`
      })
    return noteLi
  }

  noteList.addEventListener("click", function(event){
    if (event.path[0].tagName == "LI"){
      const noteId = event.target.dataset.noteId
      fetch(`http://localhost:3000/api/v1/notes/${noteId}`)
      .then(response => response.json())
      .then(noteObj => noteDisplay.innerHTML = displayNote(noteObj))
    }
  })

  noteDisplay.addEventListener("click", function(event){
    event.preventDefault()
    let noteId = event.target.dataset.id

    if (event.target.innerHTML === "Delete note"){
      fetch(`http://localhost:3000/api/v1/notes/${noteId}`,{
        method: "DELETE"
      })
      .then(
        response => fetch(userUrl)
        .then(response => response.json())
        .then(function(userObj) {
          pageSetUp(userObj)
        })
      )
    }

    if (event.target.innerHTML === "Edit note"){
      noteDisplay.innerHTML = `
      <form action="" id="new-note-form">
        <p>Editing the note</p>
        <input type="text" name="firstname" id="edit-title-field" value="${event.target.parentElement.children[0].innerText}">
        <br>
        Note:<br>
        <textarea placeholder="Add note here.."rows="4" cols="50"id="edit-note-field">${event.target.parentElement.children[1].innerText}</textarea>
        <br><br>
        <input id="edit-submit" data-note-id= "${noteId}" type="submit" value="Update Note">
      </form>
      `
    }
    if (event.target.value === "Update Note"){
      const updatedTitle = event.target.parentElement.children[1].value
      const updatedNote = event.target.parentElement.children[4].value
      noteId = event.target.dataset.noteId
      fetch(`http://localhost:3000/api/v1/notes/${noteId}`,{
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: noteId,
          title: updatedTitle,
          body: updatedNote,
          user_id: 2
        })
      })
      .then(r => r.json())
      .then(function(noteObj) {
        const liList = document.querySelector(`[data-note-id="${noteObj.id}"]`)
        liList.innerText = noteObj.title
        noteDisplay.innerHTML = displayNote(noteObj)

      })

    }
  })


  newSubmitButton.addEventListener("click", function(event){
    event.preventDefault()
    const title = newTitleField.value
    const body = newNoteField.value

    fetch(`http://localhost:3000/api/v1/notes`,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        body : body,
        user_id: 2
      })
    })
    .then(r => r.json())
    .then(function(note){
      noteList.innerHTML += `<li data-note-id= ${note.id}> ${note.title}</li>`
      noteDisplay.innerHTML = displayNote(note)
      newForm.reset()
    })
  })


})
