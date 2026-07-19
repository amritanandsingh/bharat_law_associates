import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';

const AboutPage = lazy(() => import('./pages/AboutPage'));
const PracticeAreasPage = lazy(() => import('./pages/PracticeAreasPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const JoinUsPage = lazy(() => import('./pages/JoinUsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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
        <Route path="contact-us" element={wrap(<ContactPage />)} />
        <Route path="join-us" element={wrap(<JoinUsPage />)} />
        <Route path="*" element={wrap(<NotFoundPage />)} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
