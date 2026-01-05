import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Edit2, Check, X, GripVertical, Plus } from 'lucide-react';
import api from '../../services/api';
import LinkEditModal from './LinkEditModal';

const LinksSection = ({ initialLinks, user, onLinksChange }) => {
  const [links, setLinks] = useState(initialLinks);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  
  // Drag & Drop Refs
  const dragItem = useRef();
  const dragOverItem = useRef();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  // --- פונקציות ניהול מודל ---
  const openCreateModal = () => {
    setEditingLink(null);
    setModalOpen(true);
  };

  const openEditModal = (e, link) => {
    if (isEditMode) {
      e.preventDefault();
      setEditingLink(link);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingLink(null);
  };

  // --- לוגיקת שרת (כאן התיקון הגדול - הפעלת הקריאות האמיתיות) ---
  const handleSaveLink = async (id, data) => {
    try {
      if (id) {
        // עדכון קישור קיים בשרת
        await api.updateLink(id, data);
        
        // עדכון מקומי לתצוגה מיידית
        const updatedLinks = links.map(l => l._id === id ? { ...l, ...data } : l);
        setLinks(updatedLinks);
        if (onLinksChange) onLinksChange(updatedLinks);
      } else {
        // יצירת קישור חדש בשרת
        const res = await api.createLink(data);
        const newLink = res.data.data || res.data; // התאמה למבנה התשובה מהשרת
        
        // הוספה לרשימה המקומית
        const newLinksList = [...links, newLink];
        setLinks(newLinksList);
        if (onLinksChange) onLinksChange(newLinksList);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("שגיאה בשמירה. וודא שהשרת מחובר.");
    }
  };

  const handleDeleteLink = async (id) => {
    if(!window.confirm("בטוח שברצונך למחוק?")) return;
    try {
      // מחיקה מהשרת
      await api.deleteLink(id);
      
      // עדכון מקומי
      const updatedLinks = links.filter(l => l._id !== id);
      setLinks(updatedLinks);
      if (onLinksChange) onLinksChange(updatedLinks);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("שגיאה במחיקה");
    }
  };

  // --- לוגיקת גרירה וסידור ---
  const handleDragStart = (e, position) => {
    dragItem.current = position;
    e.target.classList.add('opacity-50'); 
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
    const newLinks = [...links];
    const dragItemContent = newLinks[dragItem.current];
    newLinks.splice(dragItem.current, 1);
    newLinks.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = position;
    setLinks(newLinks);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleSaveOrder = async () => {
    try {
        // שליחת הסדר החדש לשרת
        // אנחנו שולחים רק את ה-IDs או את כל האובייקטים, תלוי איך השרת מצפה לקבל
        const linksIds = links.map(l => l._id);
        await api.updateLinksOrder(linksIds);
        
        setIsEditMode(false);
        if (onLinksChange) onLinksChange(links);
        alert("סדר הקישורים נשמר בהצלחה");
    } catch (err) {
        console.error(err);
        alert("שגיאה בשמירת הסדר");
    }
  };

  const handleCancelEdit = () => {
    setLinks(initialLinks);
    setIsEditMode(false);
  };

  return (
    <section>
      {/* כותרת וכפתורים */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-indigo-500 pr-3">
          קישורים שימושיים
        </h2>
        
        <div className="flex items-center gap-2">
          {isAdmin && !isEditMode && (
            <button 
              onClick={() => setIsEditMode(true)}
              className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors flex items-center gap-2 px-4"
            >
              <span className="text-sm font-medium">עריכה</span>
              <Edit2 size={18} />
            </button>
          )}

          {isAdmin && isEditMode && (
            <div className="flex items-center gap-2 animate-in slide-in-from-right duration-200">
              <button 
                onClick={handleCancelEdit}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center gap-1"
              >
                <X size={16} /> ביטול
              </button>
              <button 
                onClick={handleSaveOrder}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-1 shadow-sm"
              >
                <Check size={16} /> שמור סדר
              </button>
            </div>
          )}
        </div>
      </div>

      {/* גלילה אופקית (Carousel) */}
      <div className="flex overflow-x-auto pb-6 gap-4 custom-scrollbar snap-x">
        
        {/* הצגת הקישורים הקיימים */}
        {links.map((link, index) => (
          <div
            key={link._id || index}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onClick={(e) => openEditModal(e, link)}
            className={`relative group transition-all duration-200 flex-shrink-0 min-w-[280px] w-[280px] snap-start ${
              isEditMode ? 'cursor-grab animate-shake' : 'hover:-translate-y-1'
            }`}
          >
            <a 
              href={isEditMode ? '#' : link.url}
              target={isEditMode ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className={`block h-full p-5 rounded-2xl border transition-all relative overflow-hidden bg-white flex flex-col
                ${isEditMode 
                  ? 'border-indigo-400 shadow-md ring-2 ring-indigo-100' 
                  : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200'
                }`}
            >
              {isEditMode && (
                <>
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg z-10 pointer-events-none">
                        <Edit2 size={12} />
                    </div>
                    <div className="absolute top-2 right-2 text-gray-300 pointer-events-none">
                        <GripVertical size={16} />
                    </div>
                </>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0
                  ${isEditMode ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                  <ExternalLink size={20} />
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 mb-1 truncate w-full" title={link.title}>
                {link.title}
              </h3>
              <p className="text-xs text-gray-400 truncate w-full" dir="ltr">
                {link.url}
              </p>
              
              {isEditMode && (
                <div className="absolute inset-0 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors pointer-events-none" />
              )}
            </a>
          </div>
        ))}

        {/* כפתור הוספה (רק לאדמין) */}
        {isAdmin && (
            <button
                onClick={openCreateModal}
                className="group flex flex-col items-center justify-center min-h-[140px] p-5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer text-gray-400 hover:text-indigo-600 flex-shrink-0 min-w-[280px] w-[280px] snap-start"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                    <Plus size={24} />
                </div>
                <span className="font-medium text-sm">הוסף קישור חדש</span>
            </button>
        )}

      </div>
      
      <LinkEditModal 
        isOpen={modalOpen}
        link={editingLink}
        onClose={closeModal}
        onSave={handleSaveLink}
        onDelete={handleDeleteLink}
      />
    </section>
  );
};

export default LinksSection;