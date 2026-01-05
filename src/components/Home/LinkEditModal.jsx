import React, { useState, useEffect } from 'react';
import { X, Trash2, Save, Plus } from 'lucide-react';

const LinkEditModal = ({ link, isOpen, onClose, onSave, onDelete }) => {
  if (!isOpen) return null;

  const isEditing = !!link; // האם אנחנו במצב עריכה או יצירה?

  const [formData, setFormData] = useState({
    title: '',
    url: ''
  });

  // טעינת הנתונים כשנפתח המודל (רק אם עורכים)
  useEffect(() => {
    if (link) {
      setFormData({ title: link.title, url: link.url });
    } else {
      setFormData({ title: '', url: '' }); // איפוס ביצירה חדשה
    }
  }, [link, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // אם עורכים - שולחים ID. אם יוצרים - שולחים null כ-ID.
    onSave(link ? link._id : null, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">
            {isEditing ? 'עריכת קישור' : 'הוספת קישור חדש'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כותרת הקישור</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="למשל: דרייב"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כתובת (URL)</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://..."
              required
              dir="ltr"
            />
          </div>

          <div className="flex gap-3 pt-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => onDelete(link._id)}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 size={18} />
                מחק
              </button>
            )}
            
            <div className="flex-1"></div>
            
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200"
            >
              {isEditing ? <Save size={18} /> : <Plus size={18} />}
              {isEditing ? 'שמור שינויים' : 'צור קישור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkEditModal;