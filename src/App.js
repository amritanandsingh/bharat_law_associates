import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const PracticeAreasPage = lazy(() => import('./pages/PracticeAreasPage'));
const CourtsPage = lazy(() => import('./pages/CourtsPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const JoinUsPage = lazy(() => import('./pages/JoinUsPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin area (separate layout, no marketing chrome, Cognito-gated).
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const PostEditor = lazy(() => import('./pages/admin/PostEditor'));
const DocumentsDashboard = lazy(() => import('./pages/admin/DocumentsDashboard'));
const DocumentEditor = lazy(() => import('./pages/admin/DocumentEditor'));
const CourtsDashboard = lazy(() => import('./pages/admin/CourtsDashboard'));
const CourtEditor = lazy(() => import('./pages/admin/CourtEditor'));

const PageFallback = () => <div style={{ minHeight: '60svh' }} aria-hidden="true" />;

const wrap = (node) => <Suspense fallback={<PageFallback />}>{node}</Suspense>;

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about-us" element={wrap(<AboutPage />)} />
        <Route path="practice-areas" element={wrap(<PracticeAreasPage />)} />
        <Route path="practice-areas/:slug" element={wrap(<ServiceDetailPage />)} />
        <Route path="courts-we-practice-in" element={wrap(<CourtsPage />)} />
        <Route path="articles" element={wrap(<ArticlesPage />)} />
        <Route path="articles/:slug" element={wrap(<ArticleDetailPage />)} />
        <Route path="documents" element={wrap(<DocumentsPage />)} />
        <Route path="contact-us" element={wrap(<ContactPage />)} />
        <Route path="join-us" element={wrap(<JoinUsPage />)} />
        <Route path="*" element={wrap(<NotFoundPage />)} />
      </Route>

      <Route path="/admin" element={wrap(<AdminLayout />)}>
        <Route index element={wrap(<AdminDashboard />)} />
        <Route path="new" element={wrap(<PostEditor />)} />
        <Route path="edit/:id" element={wrap(<PostEditor />)} />
        <Route path="documents" element={wrap(<DocumentsDashboard />)} />
        <Route path="documents/new" element={wrap(<DocumentEditor />)} />
        <Route path="documents/edit/:id" element={wrap(<DocumentEditor />)} />
        <Route path="courts" element={wrap(<CourtsDashboard />)} />
        <Route path="courts/new" element={wrap(<CourtEditor />)} />
        <Route path="courts/edit/:id" element={wrap(<CourtEditor />)} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
