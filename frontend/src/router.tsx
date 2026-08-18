import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProductCenterPage from './pages/ProductCenterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import EnterpriseNewsPage from './pages/EnterpriseNewsPage';
import IndustryNewsPage from './pages/IndustryNewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import SocialRecruitPage from './pages/SocialRecruitPage';
import CampusRecruitPage from './pages/CampusRecruitPage';
import JobDetailPage from './pages/JobDetailPage';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import BrandStoryPage from './pages/BrandStoryPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductCenterPage /> },
      { path: 'products/detail/:id', element: <ProductDetailPage /> },
      { path: 'cases', element: <CasesPage /> },
      { path: 'cases/detail/:id', element: <CaseDetailPage /> },
      { path: 'news/enterprise', element: <EnterpriseNewsPage /> },
      { path: 'news/industry', element: <IndustryNewsPage /> },
      { path: 'news/detail/:id', element: <NewsDetailPage /> },
      { path: 'jobs/social', element: <SocialRecruitPage /> },
      { path: 'jobs/campus', element: <CampusRecruitPage /> },
      { path: 'jobs/detail/:id', element: <JobDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'brand-story', element: <BrandStoryPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;