
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TasksProvider } from './context/TasksContext.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
 <QueryClientProvider client={queryClient}>
    
   <TasksProvider>
    <BrowserRouter>
     <App />
   </BrowserRouter>
   </TasksProvider>
 </QueryClientProvider>
 
)
