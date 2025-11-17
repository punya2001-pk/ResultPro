import React, { useState } from 'react';
import Header from './Header';
import { mockStudents, mockCourses, mockResults } from '../data/mockData';
import * as XLSX from 'xlsx';

type Section = 'ica' | 'final' | 'other';

const StaffDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('ica');
  const [level, setLevel] = useState<number | 'all'>('all');
  const [semester, setSemester] = useState<number | 'all'>('all');
  const [courseId, setCourseId] = useState<string | 'all'>('all');

  const [results, setResults] = useState(mockResults);

  const filteredStudents = mockStudents.filter(s => 
    (level === 'all' || s.level === level)
  );

  const handleAddMarks = (type: 'ica' | 'final') => {
    // generate XLSX sheet
    const dataToExport = filteredStudents.map(s => {
      return {
        'Reg No': s.registrationNumber,
        ...(type === 'ica' ? { ICA1: '', ICA2: '', ICA3: '' } : { Final: '' })
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MarksTemplate');
    XLSX.writeFile(workbook, `${type.toUpperCase()}_Marks.xlsx`);
  };

  const handleUpdateMarks = (type: 'ica' | 'final', updatedData: any[]) => {
    // Here you can map updatedData to results and update state
    console.log(type, updatedData);
    // Example: setResults([...results]); after processing XLSX
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="p-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-xl font-bold">Welcome, Staff Name</h1>
          <p className="text-gray-600">Role: Staff</p>
        </div>

        {/* Section Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeSection === 'ica' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSection('ica')}
          >
            ICA Marks
          </button>
          <button
            className={`px-4 py-2 rounded ${activeSection === 'final' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSection('final')}
          >
            Final Marks
          </button>
          <button
            className={`px-4 py-2 rounded ${activeSection === 'other' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSection('other')}
          >
            Other
          </button>
        </div>

        {/* Section Content */}
        {activeSection !== 'other' && (
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <div className="flex gap-4 mb-4">
              <select value={level} onChange={e => setLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="border px-3 py-2 rounded">
                <option value="all">All Levels</option>
                <option value={1}>Level 1</option>
                <option value={2}>Level 2</option>
              </select>

              <select value={semester} onChange={e => setSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="border px-3 py-2 rounded">
                <option value="all">All Semesters</option>
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>

              <select value={courseId} onChange={e => setCourseId(e.target.value)} className="border px-3 py-2 rounded">
                <option value="all">All Courses</option>
                {mockCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex gap-4">
              <button onClick={() => handleAddMarks(activeSection)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Add {activeSection === 'ica' ? 'ICA' : 'Final'} Marks
              </button>
              <button onClick={() => handleUpdateMarks(activeSection, [])} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                Update {activeSection === 'ica' ? 'ICA' : 'Final'} Marks
              </button>
            </div>
          </div>
        )}

        {activeSection === 'other' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <p>Other functionalities here...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
