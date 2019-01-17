const BASE_URL = "http://localhost:3000/api/v1"
const USERS_URL = `${BASE_URL}/users/1`
const NOTES_URL = `${BASE_URL}/notes`
let ALLNOTES = []

document.addEventListener('DOMContentLoaded', () => {

  /*****************************************************************************
  * Variables and other data
  *****************************************************************************/

  const noteShowContainer = document.querySelector('#note-show-container')
  const notePreviewContainer = document.querySelector('#note-preview-container')
  const noteForm = document.querySelector('.add-note-form')
  const mainContainer = document.querySelector('.main-container')
  let noteTitleInput = document.querySelector('#input-title')
  let noteBodyInput = document.querySelector('#input-body')

  /*****************************************************************************
  * Fetch Onload
  *****************************************************************************/

  fetch(NOTES_URL)
  .then(r => r.json())
  .then((loadedNoteData) => {
    ALLNOTES = loadedNoteData
    notePreviewContainer.innerHTML = renderAllNotes(ALLNOTES)
  })

  /*****************************************************************************
  * Event Listeners
  *****************************************************************************/

  mainContainer.addEventListener('click', (e) => {
    window.scrollTo(0, 0);
    if (e.target.tagName === "H3") {
      foundNote = ALLNOTES.find(function(note) {
        return e.target.dataset.id == note.id
      })
      noteShowContainer.innerHTML = noteShowHTML(foundNote)
    } else if (e.target.dataset.action === "edit") {
      fetch(`${NOTES_URL}/${event.target.dataset.noteId}`, {method: 'GET'})
      .then(r => r.json())
      .then(noteData => {
        noteForm.dataset.id = noteData.id
        noteTitleInput.value = noteData.title
        noteBodyInput.value = noteData.body
      })
      document.querySelector('.submit').value = `Edit!`
    } else if (e.target.dataset.action === "delete") {
      const noteIdToDelete = event.target.dataset.noteId
      fetch(`${NOTES_URL}/${noteIdToDelete}`, { method: 'DELETE' })
      .then(document.querySelector(`[data-id='${noteIdToDelete}']`).remove())
    }
  })

  noteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (e.target.dataset.id) {
      fetch(`${NOTES_URL}/${e.target.dataset.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Action: 'application/json'
        },
        body: JSON.stringify({
          "title": noteTitleInput.value,
          "body": noteBodyInput.value,
          "user_id": 2
        })
      })
      .then(r=> r.json())
      .then((updatedNote) => {
        const oldNote = ALLNOTES.find(function(note) {
        	return note.id === updatedNote.id
        })
        const oldNoteIndex = ALLNOTES.indexOf(oldNote)
        ALLNOTES[oldNoteIndex] = updatedNote
        notePreviewContainer.innerHTML = renderAllNotes(ALLNOTES)
        document.querySelector('.submit').value = `Create New Note`
        noteForm.reset()
      })
    } else {
      foundUserId = e.target.id
      addNewNote(foundUserId, noteTitleInput, noteBodyInput)
      noteForm.reset()
      window.scrollTo(0,document.body.scrollHeight);
    }
  })

}) //End of DOMLoad

/*******************************************************************************
* Helper Functions (PURE!)
*******************************************************************************/

const renderAllNotes = () => {
  return ALLNOTES.map((note) => notePreviewHTML(note)).join('')
}

const notePreviewHTML = (note) => {
  return `<h3 class="oval-speech" data-id="${note.id}">${note.title}</h3>`
}

const noteShowHTML = function(foundNote) {
  return `<div class="oval-thought-border" data-user-id="${foundNote.user.id}">
    <h1>${foundNote.title}</h1>
    <p>${foundNote.body}<p>
    <button data-note-id="${foundNote.id}" data-id="${foundNote.user.id}" data-action="edit">
      Edit
    </button>
    <button data-note-id="${foundNote.id}" data-user-id="${foundNote.user.id}" data-action="delete">
        Delete
      </button>
  </div>`
}

/*******************************************************************************
* Helper Functions (IMPURE!)
*******************************************************************************/

function addNewNote(foundUserId, noteTitleInput, noteBodyInput) {

  const notePreviewContainer = document.querySelector('#note-preview-container')
  fetch(NOTES_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Action: 'application/json'
    },
    body: JSON.stringify({
      "title": noteTitleInput.value,
      "body": noteBodyInput.value,
      "user_id": 2
    })
  })
  .then(r => r.json())
  .then((newNote) => {
    console.log(newNote)
  ALLNOTES.push(newNote)
  notePreviewContainer.innerHTML = renderAllNotes(ALLNOTES)
  })
}
