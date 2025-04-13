import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
// Views
import SingleCourseView from './views/SingleCourseView';
import GPAManagementView from './views/GPAManagementView';
import EstimatorView from './views/EstimatorView';
// Utils & Styles
import { calculateGPA } from './utils/gpaCalculator';
import './App.css';

const LOCAL_STORAGE_KEY = 'vaaGpaSemesters_v3'; // Thay đổi key để tránh xung đột data cũ

function App() {
  const [activeView, setActiveView] = useState('manage'); // Mặc định là quản lý GPA

  // --- State quản lý semesters và nextSemesterId giữ nguyên ---
   const [semesters, setSemesters] = useState(() => {
      const savedSemesters = localStorage.getItem(LOCAL_STORAGE_KEY);
      try {
          const parsed = savedSemesters ? JSON.parse(savedSemesters) : [];
          return Array.isArray(parsed) ? parsed : [];
      } catch (e) { console.error("LS parse error", e); return []; }
  });
   const [nextSemesterId, setNextSemesterId] = useState(() => {
       if (!Array.isArray(semesters) || semesters.length === 0) return 1;
       return Math.max(...semesters.map(s => s?.id || 0), 0) + 1;
   });

  // --- Tính cumulativeResult và useEffect lưu localStorage giữ nguyên ---
  const cumulativeResult = useMemo(() => {
    const allCourses = semesters.reduce((acc, semester) => {
        if (semester && Array.isArray(semester.courses)) {
            return acc.concat(semester.courses);
        } return acc;
    }, []);
    return calculateGPA(allCourses);
  }, [semesters]);

   useEffect(() => {
       try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(semesters)); }
       catch (e) { console.error("LS save error", e); }
   }, [semesters]);

   // --- Các hàm handleAddSemester, handleRemoveSemester, handleUpdateSemester giữ nguyên ---
    const handleAddSemester = useCallback(() => {
        const newSemester = { id: nextSemesterId, name: `Học kỳ ${nextSemesterId}`, courses: [] };
        setSemesters(prev => [...prev, newSemester]);
        setNextSemesterId(prev => prev + 1);
    }, [nextSemesterId]);

    const handleRemoveSemester = useCallback((semesterId) => {
        setSemesters(prev => prev.filter(s => s.id !== semesterId));
    }, []);

    const handleUpdateSemester = useCallback((semesterId, updatedData) => {
        setSemesters(prev => prev.map(s => s.id === semesterId ? updatedData : s));
    }, []);

  // --- Render dựa trên activeView ---
  const renderActiveView = () => {
    switch (activeView) {
      case 'single':
        return <SingleCourseView />;
      case 'manage':
        return (
          <GPAManagementView
            semesters={semesters}
            cumulativeResult={cumulativeResult}
            onAddSemester={handleAddSemester}
            onUpdateSemester={handleUpdateSemester}
            onRemoveSemester={handleRemoveSemester}
          />
        );
      case 'estimator':
        return <EstimatorView cumulativeResult={cumulativeResult} />;
      default:
        return <GPAManagementView // Mặc định hiển thị quản lý
            semesters={semesters}
            cumulativeResult={cumulativeResult}
            onAddSemester={handleAddSemester}
            onUpdateSemester={handleUpdateSemester}
            onRemoveSemester={handleRemoveSemester}
         />;
    }
  };

  return (
    <div className="App modern-app">
      <Header />
      <Navigation activeView={activeView} setActiveView={setActiveView} />
      <main className="app-main-content">
        {renderActiveView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;