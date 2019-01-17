document.addEventListener('DOMContentLoaded', () => {
  const userUrl = "http://localhost:3000/api/v1/users/5"
  const username = document.querySelector("#username")
  const noteList = document.querySelector("#note-list")
  const noteDisplay = document.querySelector("#note-display")

  fetch(userUrl)
  .then(response => response.json())
  .then(userObj => pageSetUp(userObj))

  function pageSetUp(userObj){
    username.innerHTML = userObj.name
    noteList.innerHTML = addNoteList(userObj)
    noteDisplay.innerHTML = displayNote(userObj.notes[0])
  }
  function displayNote(noteObj){
    let display = ``
      display += `<h3>${noteObj.title}</h3>`
      display += `<p>${noteObj.body}</p>`
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


})
