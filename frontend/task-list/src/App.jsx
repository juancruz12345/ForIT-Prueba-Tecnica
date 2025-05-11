
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { TaskList } from './components/TaskList';
import {TaskForm} from './components/TaskForm'
import {Routes, Route} from 'react-router-dom'
import {Header} from './components/Header'
import TaskItemDetail from './components/TaskItemDetail';

function App() {
 

  return (
   <div>
    <Header></Header>
    <Routes>
      <Route path='/' element={<TaskList/>}/>
      <Route path='/tasksform' element={<TaskForm/>}></Route>
      <Route path='/task/:id' element={<TaskItemDetail/>}></Route>
      
    </Routes>
   </div>
  )
}

export default App
