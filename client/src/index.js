let notesArray = []

document.addEventListener('DOMContentLoaded', () => {

//***********Constants******************//
  const sideNav = document.querySelector(".sidenav")
  const main = document.querySelector(".main")
  const noteList = document.querySelector("[data-list-id]")
  const noteInfo = document.querySelector(".note-info")
  //create form
  const createNoteForm = document.querySelector(".create-note-form")
  const inputCreateTitle = document.querySelector("#inputCreateTitle")
  const inputCreateBody = document.querySelector("#inputCreateBody")
  //edit form
  const editNoteForm = document.querySelector(".edit-note-form")
  const inputEditTitle = document.querySelector("#inputEditTitle")
  const inputEditBody = document.querySelector("#inputEditBody")
  // console.log('ADD UR CODE HERE!')

  //*************** Fetch User **************/
  function renderNavBar(){
    fetch('http://localhost:3000/api/v1/users/1', {
      method: "GET",
      headers:{
      'Content-Type': 'application/json',
      Accept: 'application/json'
      }
    })//end of fetch
    .then((res) =>{
      return res.json()
    })//end of first then
    .then((user)=>{
      sideNav.innerHTML = `<h1>${user.name}</h1>
      <button data-button-id="create" data-user-id=${user.id}>Create a New Note!</button>`
      //add a create note button
      notesArray = user.notes
      sideNav.innerHTML+= `<ul data-id-note-list=${user.id}>
        ${grabNoteTitles(notesArray)}
      </ul>`
    })//end of 2nd then
  }

  renderNavBar()
//************* Helper Functions *******************

//want to display note titles on side bar
  function grabNoteTitles(notes){
    return notes.map((note)=>{
      return `<li data-note-id=${note.id}>${note.title}</li>`
    }).join("")//end of map
  }//end of grabNoteTitles

//display note details
  function displayNoteDetails(note){
    return `
      <h2>${note.title}</h2>
      <p>${note.body}</p>
      <button data-button-id="edit" data-note-id=${note.id}>Edit</button>
      <button data-button-id="delete" data-note-id=${note.id}>Delete</button>
    `
  }//end of display note details

//******************* Event Listeners ******************
// Side Nav Bar event listener for create button and titles displayed
  sideNav.addEventListener("click", (e)=>{

    //render create form
    if(e.target.dataset.buttonId==="create"){
      createNoteForm.style.display = "block"
      noteInfo.innerHTML = ""
      createNoteForm.dataset.userId = e.target.dataset.userId
    }// end of render create form

    //on title click, display note details
    const foundNote = notesArray.find((note)=>{
      return e.target.dataset.noteId == note.id
    })
    noteInfo.innerHTML=displayNoteDetails(foundNote)
  })//end of side nav event listener

  //Event Listener for Submit on Create Form
  createNoteForm.addEventListener('submit', (e)=>{
    //stop full page refresh
    e.preventDefault()

    //grab the values of the input fields
    const newTitle = inputCreateTitle.value
    const newBody = inputCreateBody.value

    // post to db
    fetch('http://localhost:3000//api/v1/notes', {
      method: 'POST',
      headers:{
      'Content-Type': 'application/json',
      Accept: 'application/json'
      },
      body: JSON.stringify({
        title: newTitle,
        body: newBody,
        "user_id": e.target.dataset.userId
      })//end of stringify
    })//end of fetch
    .then((res)=>{
      return res.json()
    })// end of 1st then
    // display note details and have title show up in side bar
    .then((newNote)=>{
      createNoteForm.reset()
      createNoteForm.style.display = "none"
      noteInfo.innerHTML = displayNoteDetails(newNote)
      renderNavBar()
    })//end of 2nd then
  })// end of event listener for submit on create


//Event Listener for Edit and Delete Buttons
  main.addEventListener("click", (e)=>{
    //Sense Click on Edit Button
    if (e.target.dataset.buttonId === "edit"){
      //show the edit form
      editNoteForm.style.display = "block";
      //get the note you want to edit
      fetch(`http://localhost:3000/api/v1/notes/${e.target.dataset.noteId}`, {
          method: "GET"
      })
      .then((res)=>{
        return res.json()
      })
      .then((noteData)=>{
        //prefills the values of the textbox
        editNoteForm.dataset.id = noteData.id
        inputEditTitle.value = noteData.title
        inputEditBody.value = noteData.body
      })

      // Sense Click On Delete Button
    } else if (e.target.dataset.buttonId==="delete"){
      const foundNote = notesArray.find((note)=>{
          return note.id == e.target.dataset.noteId
      })
      const listElementofNote = document.querySelector(`[data-note-id='${foundNote.id}']`)

      const confirmed = confirm("Are you sure you want to delete this note?")
      if (confirmed === true){
        fetch(`http://localhost:3000/api/v1/notes/${e.target.dataset.noteId}`,{
          method: "DELETE"
        })//end of fetch
        //***** have to remove it from the dom
        noteInfo.innerHTML = ""
        listElementofNote.remove()
      }// end of if "ok"
    }// end of delete

  })

  //Event Listener for Edit Submit
  editNoteForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    const noteToEdit = e.target.dataset.id
    const editedTitle = inputEditTitle.value
    const editedBody = inputEditBody.value

    fetch(`http://localhost:3000/api/v1/notes/${e.target.dataset.id}`, {
      method: 'PATCH',
      headers:{
      'Content-Type': 'application/json',
      Accept: 'application/json'
      },
      body: JSON.stringify({
        title: editedTitle,
        body: editedBody
      })//end of stringify
    })//end of fetch
    .then((res)=>{
      return res.json()
    })
    .then((updatedNote)=>{
      renderNavBar()
      noteInfo.innerHTML = displayNoteDetails(updatedNote)
      editNoteForm.style.display = "none"
    })
  }) // end of edit submit event listener

})// end of dom content loaded


// Things to try or add:
// refactor code/ abstract repeated code
// change body to text areas
// display delete button only after edit
// edit button will toggle the readonly attr of the textfields
