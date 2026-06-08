import './App.css';

import {
  Route,
  Routes,
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

import Admin from './pages/Admin';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminCategory from './pages/AdminCategory';
import AdminCourse from './pages/AdminCourse';
import AdminCourseContent from './pages/AdminCourseContent';
import AdminCoidng from './pages/AdminCoidng';
import AdminProject from './pages/AdminProject';
import AdminGYM from './pages/AdminGYM';
import CourseViewer from './pages/CourseViewer';
import AdminAddCodingQuestion from './pages/AdminAddCodin';

function App() {

  return (
    <Routes>


      <Route
        path="/"
        element={
          // <ProtectedRoute>
          <Home />
          // </ProtectedRoute>
        }
      />
      <Route path="/course/:courseId" element={<CourseViewer />} />

      <Route path="/login" element={<Login />} />

      {/* PROTECTED ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          // <ProtectedRoute adminOnly={true}>
          <Admin />
          // </ProtectedRoute>
        }
      >

        {/* /admin */}
        <Route
          index
          element={<>this Dashboard</>}
        />

        {/* /admin/category */}
        <Route
          path="category"
          element={<AdminCategory />}
        />

        {/* /admin/courses */}
        <Route
          path="courses"
          element={<AdminCourse />}
        />


        <Route
          path="courses/:courseId/content"
          element={<AdminCourseContent />}
        />

        {/* /admin/gym */}
        <Route
          path="gym"
          element={<AdminGYM />}
        />
        <Route
          path="coding"
          element={<AdminCoidng />}
        />
        <Route
          path="coding/:questionId"
          element={<AdminAddCodingQuestion />}
        />
        <Route
          path="projects"
          element={<AdminProject />}
        />

      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
