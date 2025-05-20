import LoginForm from './forms/loginForm';
import Template from './layouts/template';
import { createBrowserRouter } from 'react-router-dom';
import { StudentProfile } from './layouts/studentProfile/studentProfile';
import { Calendar } from './layouts/calendarPage';
import Students from './layouts/students';
import Documents, { CustomDocument, DocumentsList } from './layouts/documents';
import Profile from "./layouts/profile"
import useGlobal from './store';

const paths = [
  {path: '/login', element: <div className='app-body'><LoginForm/></div>},
  {path:`*`, element: <Template/>},
  {path:'student/:id', element: <Template content={<StudentProfile/>}/>},
  {path:'/documents/', element: <Template content={<DocumentsList/>}/>},
  {path: '/documents/custom', element: <Template content={<CustomDocument/>}/>},
  {path:'/calendar/', element: <Template content={<Calendar/>}/>},
  {path:'/students/', element: <Template content={<Students/>}/>},
  {path:'/profile/', element: <Template content={<Profile/>}/>}
]

const router = createBrowserRouter(paths)

export default router