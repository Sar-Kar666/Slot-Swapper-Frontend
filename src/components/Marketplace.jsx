import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Store, MessageSquare } from 'lucide-react';

export default function Marketplace() {
  const { token } = useAuth();
  const [slots, setSlots] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const [slotsData, eventsData] = await Promise.all([
        api.swaps.getSwappableSlots(token),
        api.events.getAll(token),
      ]);
      setSlots(slotsData);
      setUserEvents(eventsData.filter((e) => e.status === 'SWAPPABLE'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const submitSwapRequest = async (mySlotId) => {
    try {
      await api.swaps.createSwapRequest(token, mySlotId, selectedSlot._id);
      setShowModal(false);
      setSelectedSlot(null);
      await loadData();
    } catch (error) {
      console.error('Error creating swap request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Swap Marketplace</h1>
          </div>
          <p className="text-gray-600">Browse available slots from other users</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading available slots...</div>
        ) : slots.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No swappable slots available yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{slot.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Posted by: {slot.userId?.name || 'Unknown'}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {new Date(slot.startTime).toLocaleString()} -{' '}
                      {new Date(slot.endTime).toLocaleTimeString()}
                    </p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Available
                    </span>
                  </div>

                  <button
                    onClick={() => handleRequestSwap(slot)}
                    disabled={userEvents.length === 0}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      userEvents.length === 0
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                    }`}
                  >
                    Request Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Select Your Slot to Swap
              </h2>
              <p className="text-gray-600 mb-6">
                Choose one of your swappable slots to exchange with:
                <span className="block font-semibold text-gray-900 mt-2">{selectedSlot.title}</span>
              </p>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {userEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    You don't have any swappable slots. Create an event and mark it as swappable first.
                  </p>
                ) : (
                  userEvents.map((event) => (
                    <button
                      key={event._id}
                      onClick={() => submitSwapRequest(event._id)}
                      className="w-full text-left p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.startTime).toLocaleString()}
                      </p>
                    </button>
                  ))
                )}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
