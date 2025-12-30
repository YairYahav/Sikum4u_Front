import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import './AdminPanel.css'; 

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('course'); // course, folder, file, link
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  // States for dynamic folder selection
  const [courseFolders, setCourseFolders] = useState([]);
  const [selectedParentFolder, setSelectedParentFolder] = useState(''); // Empty string = Root folder

  // Form Data States
  const [courseData, setCourseData] = useState({ title: '', description: '', isFeatured: false });
  const [folderName, setFolderName] = useState('');
  const [linkData, setLinkData] = useState({ title: '', url: '' });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileName, setFileName] = useState('');

  // Fetch courses on load
  useEffect(() => {
    fetchCourses();
  }, []);

  // When course changes, fetch its folders
  useEffect(() => {
    if (selectedCourse) {
      fetchFoldersForCourse(selectedCourse);
    } else {
      setCourseFolders([]);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    const res = await axios.get('/courses');
    setCourses(res.data);
  };

  const fetchFoldersForCourse = async (courseId) => {
    // נדרש Endpoint שמביא את כל התיקיות של הקורס (שטוח או עץ)
    const res = await axios.get(`/folders/course/${courseId}`);
    setCourseFolders(res.data);
  };

  // --- Handlers ---

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/courses', courseData);
      alert('Course Created!');
      fetchCourses();
      setCourseData({ title: '', description: '', isFeatured: false });
    } catch (err) { alert('Error creating course'); }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return alert('Select a course');
    try {
      await axios.post('/folders', {
        name: folderName,
        courseId: selectedCourse,
        parentFolder: selectedParentFolder || null
      });
      alert('Folder Created!');
      setFolderName('');
      fetchFoldersForCourse(selectedCourse); // Refresh folders
    } catch (err) { alert('Error creating folder'); }
  };

  const handleCreateFile = async (e) => {
    e.preventDefault();
    if (!fileToUpload || !selectedCourse) return alert('Missing fields');
    
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('name', fileName);
    formData.append('courseId', selectedCourse);
    if (selectedParentFolder) formData.append('folderId', selectedParentFolder);

    try {
      await axios.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File Uploaded!');
      setFileName('');
      setFileToUpload(null);
    } catch (err) { alert('Error uploading file'); }
  };

  const handleCreateLink = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/important-links', linkData);
      alert('Link Added!');
      setLinkData({ title: '', url: '' });
    } catch (err) { alert('Error adding link'); }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      
      <div className="admin-tabs">
        <button onClick={() => setActiveTab('course')} className={activeTab === 'course' ? 'active' : ''}>Add Course</button>
        <button onClick={() => setActiveTab('folder')} className={activeTab === 'folder' ? 'active' : ''}>Add Folder</button>
        <button onClick={() => setActiveTab('file')} className={activeTab === 'file' ? 'active' : ''}>Upload File</button>
        <button onClick={() => setActiveTab('link')} className={activeTab === 'link' ? 'active' : ''}>Add Link</button>
      </div>

      <div className="admin-content">
        {/* ADD COURSE */}
        {activeTab === 'course' && (
          <form onSubmit={handleCreateCourse}>
            <input type="text" placeholder="Course Title" value={courseData.title} onChange={e => setCourseData({...courseData, title: e.target.value})} required />
            <textarea placeholder="Description" value={courseData.description} onChange={e => setCourseData({...courseData, description: e.target.value})} />
            <label>
              <input type="checkbox" checked={courseData.isFeatured} onChange={e => setCourseData({...courseData, isFeatured: e.target.checked})} />
              Mark as Featured?
            </label>
            <button type="submit">Create Course</button>
          </form>
        )}

        {/* ADD FOLDER */}
        {activeTab === 'folder' && (
          <form onSubmit={handleCreateFolder}>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
              <option value="">Select Course...</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>

            <select value={selectedParentFolder} onChange={e => setSelectedParentFolder(e.target.value)} disabled={!selectedCourse}>
              <option value="">-- Root Level (No Parent) --</option>
              {courseFolders.map(f => (
                <option key={f._id} value={f._id}>{f.name} (ID: {f._id.slice(-4)})</option>
              ))}
            </select>

            <input type="text" placeholder="Folder Name" value={folderName} onChange={e => setFolderName(e.target.value)} required />
            <button type="submit">Create Folder</button>
          </form>
        )}

        {/* UPLOAD FILE */}
        {activeTab === 'file' && (
          <form onSubmit={handleCreateFile}>
             <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required>
              <option value="">Select Course...</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>

            <select value={selectedParentFolder} onChange={e => setSelectedParentFolder(e.target.value)} disabled={!selectedCourse}>
              <option value="">-- Upload to Root of Course --</option>
              {courseFolders.map(f => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>

            <input type="text" placeholder="File Display Name" value={fileName} onChange={e => setFileName(e.target.value)} required />
            <input type="file" onChange={e => setFileToUpload(e.target.files[0])} required />
            <button type="submit">Upload PDF</button>
          </form>
        )}

        {/* ADD LINK */}
        {activeTab === 'link' && (
          <form onSubmit={handleCreateLink}>
            <input type="text" placeholder="Link Title" value={linkData.title} onChange={e => setLinkData({...linkData, title: e.target.value})} required />
            <input type="url" placeholder="URL (https://...)" value={linkData.url} onChange={e => setLinkData({...linkData, url: e.target.value})} required />
            <button type="submit">Add Important Link</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;