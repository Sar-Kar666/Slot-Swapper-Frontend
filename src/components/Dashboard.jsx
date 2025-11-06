import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Plus, Calendar, Edit2, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    loadEvents();
  }, [token]);

  const loadEvents = async () => {
    try {
      const data = await api.events.getAll(token);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = await api.events.create(token, {
        title: formData.title,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
      });
      setEvents([...events, newEvent]);
      setFormData({ title: '', startTime: '', endTime: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const toggleSwappable = async (event) => {
    try {
      const newStatus = event.status === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
      const updated = await api.events.update(token, event._id, { status: newStatus });
      setEvents(events.map((e) => (e._id === event._id ? updated : e)));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.events.delete(token, id);
      setEvents(events.filter((e) => e._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Calendar</h1>
          <p className="text-gray-600">Manage your events and mark slots as swappable</p>
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Team Meeting"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No events yet. Create your first event!</div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {new Date(event.startTime).toLocaleString()} -{' '}
                      {new Date(event.endTime).toLocaleTimeString()}
                    </p>
                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'BUSY'
                          ? 'bg-red-100 text-red-700'
                          : event.status === 'SWAPPABLE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSwappable(event)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        event.status === 'BUSY'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
