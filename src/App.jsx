import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import {
  PrivateRoute,
  PublicOnlyRoute,
} from '@/common/components/routes/ProtectedRoutes';
import { UserProvider } from '@/common/contexts/UserContext';
import NavLayout from '@/common/layouts/NavLayout';
import AuthCallback from '@/pages/account/AuthCallback';
import RequestPasswordReset from '@/pages/account/RequestPasswordReset';
import ResetPassword from '@/pages/account/ResetPassword';
import SignUp from '@/pages/account/SignUp';
import FileUpload from '@/pages/file-upload/FileUpload';
import NotFound from '@/pages/not-found/NotFound';
import PublicView from '@/pages/public-view/PublicView';

import './App.css';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PublicView />} />
          <Route path='/app' element={<NavLayout />}>
            <Route index element={<Navigate to='/' replace />} />
            <Route element={<PrivateRoute />}>
              <Route path='file-upload' element={<FileUpload />} />
            </Route>
            <Route element={<PublicOnlyRoute />}>
              <Route path='signup' element={<SignUp />} />
              <Route
                path='forgot-password'
                element={<RequestPasswordReset />}
              />
            </Route>
            <Route path='auth/callback' element={<AuthCallback />} />
            <Route path='auth/reset-password' element={<ResetPassword />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
