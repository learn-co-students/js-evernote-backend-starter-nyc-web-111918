document.addEventListener('DOMContentLoaded', () => {
  const navBar = document.querySelector("#navbar")
  const createNoteButton = document.querySelector("#create-note-btn")
  const showNoteArea = document.querySelector("#show-note-area")
  const noteForm = document.querySelector("#note-form")
  const titleInput = document.querySelector("#title-input")
  const bodyInput = document.querySelector("#body-input")
  let isCreate = false
  let currentNoteID = 0

  //Initial Fetch
  fetch("http://localhost:3000/api/v1/notes")
  .then(res => res.json())
  .then(notes => {
    const notesHTML = notes.map(function(note){
      return(`
        <h5 data-id=${note.id} data-action="show-note">${note.title}</h5>
        `)
    }).join("")
    navBar.innerHTML += notesHTML
  })

  //LISTENERS
  navBar.addEventListener("click", function(e){
    if(e.target.dataset.action === "show-note"){
      currentNoteID = e.target.dataset.id
      noteForm.hidden = true
      fetch(`http://localhost:3000/api/v1/notes/${e.target.dataset.id}`)
      .then(res => res.json())
      .then(note => {
        const noteHTML = `
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <button data-id=${note.id} data-action="edit">EDIT NOTE</button>
        <button data-id=${note.id} data-action="delete">DELETE NOTE</button>
        `
        showNoteArea.innerHTML = noteHTML
      })
    } else if (e.target.dataset.action === "create") {
      //CREATE FUNCTIONALITY
      showNoteArea.innerHTML = ""
      noteForm.hidden = false
      isCreate = true
      titleInput.value = ""
      bodyInput.value = ""
    }

  }) // End of navBar NOTES listener

  noteForm.addEventListener("submit", function(e){
    e.preventDefault()
    if (isCreate === true){
      //fetch for new note
      fetch(`http://localhost:3000/api/v1/notes`, {
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "title": titleInput.value,
          "body": bodyInput.value
        })
      })
      .then(res => res.json())
      .then(note => {
        noteForm.hidden = true
        showNoteArea.innerHTML = ""
        navBar.innerHTML += `<h5 data-id=${note.id} data-action="show-note">${note.title}</h5>`
      })

    } else if (isCreate === false){
      //fetch for edit note
      fetch(`http://localhost:3000/api/v1/notes/${currentNoteID}`, {
        method: "PATCH",
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "title": titleInput.value,
          "body": bodyInput.value
        })
      })
      .then(res => res.json())
      .then(note => {
        //Update DOM
        //find the note on navbar
        let currentNote = ""
        navBar.querySelectorAll("h5").forEach(function(n){
          if (n.dataset.id == currentNoteID){
            currentNote = n
          }
        })
        const noteHTML = `
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <button data-id=${note.id} data-action="edit">EDIT NOTE</button>
        <button data-id=${note.id} data-action="delete">DELETE NOTE</button>
        `
        showNoteArea.innerHTML = noteHTML
        currentNote.innerText = note.title
        noteForm.hidden = true
      })
    }
    isCreate = false
  }) // End of Form Listener

  showNoteArea.addEventListener("click", function(e){
    if (e.target.dataset.action === "edit") {
      noteForm.hidden = false
      titleInput.value = e.target.parentElement.children[0].innerText
      bodyInput.value = e.target.parentElement.children[1].innerText

    } else if (e.target.dataset.action === "delete") {
      //DELETE FUNCTIONALITY
      fetch(`http://localhost:3000/api/v1/notes/${currentNoteID}`,{method:"DELETE"})
      // .then(res => res.json())
      .then(() => {
        let currentNote = ""
        navBar.querySelectorAll("h5").forEach(function(note){
          if (note.dataset.id == currentNoteID){
            currentNote = note
          }
        })
        currentNote.remove()
        showNoteArea.innerHTML = ""
        noteForm.hidden = true
      })
    }
  })  // End of note area listener

  //HELPERS

})  // End of DOMContentLoaded
