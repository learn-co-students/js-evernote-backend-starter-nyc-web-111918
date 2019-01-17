document.addEventListener('DOMContentLoaded', () => {
  const userUrl = "http://localhost:3000/api/v1/users/6"
  const username = document.querySelector("#username")
  const noteList = document.querySelector("#note-list")
  const noteDisplay = document.querySelector("#note-display")

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
    if (event.target.innerHTML === "Delete note"){
      //render to the dom that the note has been deleted
      const noteId = event.target.dataset.id
      fetch(`http://localhost:3000/api/v1/notes/${noteId}`,{
        method: "DELETE"
      })
      .then(
        response => fetch(userUrl)
        .then(response => response.json())
        .then(userObj => pageSetUp(userObj))
        .then(console.log("rerender"))
      )

    }
  })


})
