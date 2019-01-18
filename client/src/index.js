document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM has loaded");
  /******************* VARIABLES **************************/
  const BASE_URL = "http://localhost:3000"
  const USERS_URL = `${BASE_URL}/api/v1/users`
  const NOTES_URL = `${BASE_URL}/api/v1/notes`
  const userContainer = document.querySelector('#user-container')
  const noteContainer = document.querySelector('#note-container')
  let allNotes = []
  let allUsers = []
  /******************* VARIABLES **************************/

  /******************* HELPER **************************/
  function renderSingleUser(user) {
    let userCard =`
      <div id="user-${user.id}" data-id="${user.id}">
        <h2>${user.name}</h2>
          <form id="new-note-form" data-id="${user.id}" class="new-note" action="index.html" method="post">
            <input required id="title-input" type="text" name="title" value="" placeholder="Title...">
            <textarea required id="body-input" rows="4" name="body" form="new-note-form">Enter text here...</textarea>
            <input type="submit" name="submit" value="Create Note" class="submit" data-id="${user.id}" data-action="create">
          </form>
        <p>Notes</p>
        <ul></ul>
      </div>
    `
    return userCard
  }

  function renderSingleNote(note) {
    let noteCard = `
    <div data-id="${note.id}">
      <li id="note-${note.id}">
        ${note.title}
        <br>
        <button class="preview" data-id="${note.id}">Preview</button>
      </li>
    </div>
    `
    return noteCard
  }

  function renderFullNote(note) {
    let notePreview = `
      <h2>${note.title}</h2>
      <p>${note.body}</p>
      <button class="edit" data-id="${note.id}">Edit</button>
      <button class="delete" data-id="${note.id}">Delete</button>
    `
    return notePreview
  }

  function renderEditForm(note) {
    let editForm = `
      <form id="edit-note-form" data-id="${note.id}" class="new-note" action="index.html" method="post">
        <input required id="edit-title-input" type="text" name="title" value="${note.title}">
        <textarea required id="edit-body-input" rows="4" name="body" form="edit-note-form">${note.body}</textarea>
        <input type="submit" name="submit" value="Edit Note" class="submit" data-id="${note.id}" data-action="edit">
      </form>
    `
    return editForm
  }
  /******************* HELPER ***************************/

  /******************* FETCH  *****************************/
  fetch(USERS_URL)
  .then( resp => resp.json())
  .then( userData => {
    userData.forEach( user => {
      allUsers.push(user)
      userContainer.innerHTML += renderSingleUser(user)

      let userDiv = userContainer.querySelector(`#user-${user.id}`)
      user.notes.forEach( note => {
        // console.log(user.notes[0]);
        allNotes.push(note)
        userDiv.innerHTML += renderSingleNote(note)
      })
    })
  })
  /******************* FETCH  *****************************/

  /******************* EVENT LISTENERS *********************/
  userContainer.addEventListener("click", (e) => {
    // preview
    if (e.target.className === "preview") {
      // console.log(e.target.dataset.id);
      const selectedNote = allNotes.find( note => note.id == e.target.dataset.id )
      noteContainer.innerHTML = renderFullNote(selectedNote)

    // create
    } else if (e.target.dataset.action === "create") {
      e.preventDefault()
      // console.log(e.target, "is this working??");
      const newNoteForm = userContainer.querySelector('#new-note-form')
      const newTitle = newNoteForm.querySelector('#title-input').value
      const newBody = newNoteForm.querySelector('#body-input').value
      const selectedUser = allUsers.find( user => user.id == e.target.dataset.id )

      fetch(NOTES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          "title": newTitle,
          "body": newBody
        })
      })
      .then( resp => resp.json() )
      .then( newNoteData => {
        let userDiv = userContainer.querySelector(`#user-${selectedUser.id}`)
        allNotes.push(newNoteData)
        userDiv.innerHTML += renderSingleNote(newNoteData)
      }) //  end of .then function
    } // end of else if "create"
  }) // end of userContainer event listener

  // PATCH
  noteContainer.addEventListener("click", (e) => {
    if (e.target.className === "edit") {
      const selectedNote = allNotes.find( note => note.id == e.target.dataset.id )
      noteContainer.innerHTML = renderEditForm(selectedNote)
      const editNoteForm = noteContainer.querySelector('#edit-note-form')

      editNoteForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const editTitleValue = editNoteForm.querySelector('#edit-title-input').value
        const editBodyValue = editNoteForm.querySelector('#edit-body-input').value
        const sideNote = document.querySelector(`[data-id="${selectedNote.id}"]`)
        fetch(`${NOTES_URL}/${selectedNote.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            "title": editTitleValue,
            "body": editBodyValue
          })
        })
        .then( resp => resp.json() )
        .then( editNoteData => {
            let originalIndex = allNotes.indexOf(editNoteData)
            allNotes[originalIndex] = editNoteData
            noteContainer.innerHTML = renderFullNote(editNoteData)

            sideNote.innerHTML = renderSingleNote(editNoteData)
          })
      }) // end of editNoteForm "submit" event listener

    } else if (e.target.className === "delete") {
      const selectedNote = allNotes.find( note => note.id == e.target.dataset.id )
      const containerDelete = document.querySelector(`[data-id="${selectedNote.id}"]`)
      // console.log(containerDelete);
      fetch(`${NOTES_URL}/${selectedNote.id}`, {method: "DELETE"} )
      containerDelete.remove()
      noteContainer.innerText = ''
      let originalIndex = allNotes.indexOf(selectedNote)
      allNotes.splice(originalIndex, 1)
    }

  }) // end of noteContainer event listener

  /******************* EVENT LISTENERS *********************/
})
