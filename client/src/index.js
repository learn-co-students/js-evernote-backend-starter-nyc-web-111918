document.addEventListener('DOMContentLoaded', () => {

  const userHeader= document.querySelector('#user-name')
  const notesContainer = document.querySelector('.notes')
  const display = document.querySelector('.display')
  let userId;
  let allUserNotes = []


  function noteHTMLFormater(note){
    return `
    <div>
      ${note.title}
      <button type="button" data-id ="${note.id}">preview</button>
    </div>
    `
  }

  function noteAdder(notes){
    allUserNotes = []
    notes.forEach(function(note){
      notesContainer.innerHTML += noteHTMLFormater(note)
      allUserNotes.push(note)
    })
  }

  function findNoteById(id){
    return allUserNotes.find(note => note.id == id)
  }

  function noteDisplayer(note){
    display.innerHTML = `
    <h2>${note.title}</h2>
    <p>${note.body}</p>
    <button type="button" name="edit note" data-id="${note.id}">Edit This Bad Boi!</button>
    `

  }

  function formGenerator(noteid){
    const note = findNoteById(noteid)
    display.innerHTML = `
    <form class="" action="index.html" method="patch" aligh="right center">
      <h2>Title</h2>
      <input type="text" id="edit-title" value="${note.title}">
      <p>description</p>
      <input type="text" id="edit-body" value="${note.body}"><br>
      <input id="${note.id}" type="submit" name="" value="Submit Edit">
    </form>
    <button data-id="${note.id}" type="button" name="delete">DELETE!</button>
    `
  }

  notesContainer.addEventListener('click', () => {
    if(event.target.innerHTML === 'preview'){
    const noteToDisplay = findNoteById(event.target.dataset.id)
    noteDisplayer(noteToDisplay)

    }
  })

  notesContainer.addEventListener('click', () => {
    if(event.target.name === 'new'){
      display.innerHTML = `
      <form class="" action="index.html" method="post" aligh="right center">
      <h2>Title</h2>
      <input type="text" id="edit-title" value="">
      <p>description</p>
      <input type="text" id="edit-body" value=""><br>
      <input id="${userId}" type="submit" name="new" value="Make a new Note">
      </form>`

    }
  })

  display.addEventListener('click', () => {
    if(event.target.name === 'edit note'){
      formGenerator(event.target.dataset.id)
    }

    if(event.target.value ==='Submit Edit'){
      event.preventDefault()
      const targetId = +event.target.id
      const editTitle = document.querySelector('#edit-title').value
      const editBody = document.querySelector('#edit-body').value
      

      fetch(`http://localhost:3000/api/v1/notes/${targetId}`, {
        method: 'PATCH',
        headers: {
           "Content-Type": "application/json",
        },
        body:
          JSON.stringify({
            title: editTitle,
            body: editBody
          })
      }).then(() => fetch('http://localhost:3000/api/v1/users/').then(rev => rev.json()).then(
        users => function(user){
          notesContainer.innerHTML = '  <button type="button" name="new">Make a new Note</button>'
          userHeader.innerHTML = users[0].name
          userId =users[0].id
          noteAdder(users[0].notes)
        }()
      ))

    }
    if(event.target.name === 'delete'){
      const targetId = +event.target.dataset.id

      fetch(`http://localhost:3000/api/v1/notes/${targetId}`, {
        method: 'DELETE'
      }).then(() => fetch('http://localhost:3000/api/v1/users/').then(rev => rev.json()).then(
        users => function(user){
          notesContainer.innerHTML = '  <button type="button" name="new">Make a new Note</button>'
          display.innerHTML = ''
          userHeader.innerHTML = users[0].name
          userId =users[0].id
          noteAdder(users[0].notes)
        }()
      ))
    }
    if(event.target.name === 'new'){
      event.preventDefault()
      const targetId = +event.target.id
      const editTitle = document.querySelector('#edit-title').value
      const editBody = document.querySelector('#edit-body').value
      console.log(targetId, editTitle, editBody);

      fetch(`http://localhost:3000/api/v1/notes/`, {
        method: 'POST',
        headers: {
           "Content-Type": "application/json",
        },
        body:
          JSON.stringify({
            title: editTitle,
            body: editBody,
            user_id: targetId
          })
      }).then(() => fetch('http://localhost:3000/api/v1/users/').then(rev => rev.json()).then(
        users => function(user){
          notesContainer.innerHTML = '  <button type="button" name="new">Make a new Note</button>'
          userHeader.innerHTML = users[0].name
          userId =users[0].id
          noteAdder(users[0].notes)
          display.innerHTML = ''
        }()
      ))
    }



  })

  // display.addEventListener






  fetch('http://localhost:3000/api/v1/users/')
  .then(rev => rev.json())
  .then(users => function(user){
    userHeader.innerHTML += users[0].name
    userId =users[0].id
    noteAdder(users[0].notes)
  }())



})
