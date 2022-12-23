import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { useReducer } from 'react'
import { v4 as uuid4 } from 'uuid'
import { useEffect } from 'react'


const ACTIONS = {
  ADD_FOLDER: 'add-folder',
  ADD_TODO: 'add-todo',
  SET_SELECTED_FALSE: 'set-selected-false'
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_FOLDER:
      return [...state, { folderName: action.payload.name, folderId: uuid4(), toDoList: [], selected: true }]
    case ACTIONS.ADD_TODO:
      return state.map(folder => {
        if (folder.folderId == action.payload.folder) {
          return { ...folder, toDoList: [...folder.toDoList, { toDo: action.payload.toDo }] }
        }
        else return folder
      })
    case ACTIONS.SET_SELECTED_FALSE:
      return state.map(f => {
        return { ...f, selected: false }
      })
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, [{ folderName: "default", folderId: uuid4(), toDoList: [{ toDo: "Go to store" }], selected: true }])
  const [inputActive, setInputActive] = useState(false)

  const [userInput, setUserInput] = useState('')

  const [newTodoInput, setNewTodoInput] = useState(false)

  const [selectedFolder, setSelectedFolder] = useState(state[0])

  const [userTodo, setUserTodo] = useState('')

  const newFolderSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SET_SELECTED_FALSE })
    dispatch({ type: ACTIONS.ADD_FOLDER, payload: { name: userInput } })
    setUserInput('')
    setInputActive(false)
  }

  const newTodo = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.ADD_TODO, payload: { toDo: userTodo, folder: selectedFolder.folderId } })

  }

  useEffect(() => {
    const select = state.filter(f => f.selected)
    setSelectedFolder(select[0])
    console.log(state)
  }, [state])

  return (
    <div className="main-container">
      <div className="folder-sidebar">
        <h2>Folders:</h2>
        <button onClick={() => setInputActive(!inputActive)}>Add Folder</button>
        {inputActive &&
          <form onSubmit={(e) => newFolderSubmit(e)}>
            <input type="text" placeholder='Folder Name...' onChange={(e) => setUserInput(e.target.value)} />
          </form>
        }

      </div>
      <div className="toDo-main-container">
        <h2>{selectedFolder.folderName}</h2>
        <div className="todo-contaier">
          <div className="todo-container-top">
            {newTodoInput &&
              <form onSubmit={(e) => newTodo(e)}>
                <input type="text" placeholder='Todo' onChange={(e) => setUserTodo(e.target.value)} />
              </form>
            }
            <button onClick={() => setNewTodoInput(!newTodoInput)}>Create Todo</button>
          </div>
          <div className='todo'>
            {selectedFolder.toDoList.map(toDo => {
              return (
                <p>{toDo.toDo}</p>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
