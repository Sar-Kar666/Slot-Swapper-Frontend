import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Bell, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Notifications() {
  const { token } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [token]);

  const loadRequests = async () => {
    try {
      const [incoming, outgoing] = await Promise.all([
        api.swaps.getIncoming(token),
        api.swaps.getOutgoing(token),
      ]);
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId, accept) => {
    try {
      await api.swaps.respondToSwap(token, requestId, accept);
      await loadRequests();
    } catch (error) {
      console.error('Error responding to swap:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>;
      case 'ACCEPTED':
        return <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Accepted</span>;
      case 'REJECTED':
        return <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Swap Requests</h1>
          </div>
          <p className="text-gray-600">Manage your incoming and outgoing swap requests</p>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading requests...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Incoming Requests</h2>
              {incomingRequests.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl p-6 text-gray-500">
                  No incoming swap requests
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">
                          From: <span className="font-semibold">{request.requestingUserId?.name}</span>
                        </p>
                        <div className="space-y-2">
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-red-700">
                              <span className="font-semibold">They want:</span> {request.theirSlotId?.title}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              {new Date(request.theirSlotId?.startTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-700">
                              <span className="font-semibold">They offer:</span> {request.mySlotId?.title}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              {new Date(request.mySlotId?.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {request.status === 'PENDING' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleResponse(request._id, true)}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition inline-flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleResponse(request._id, false)}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition inline-flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                      {request.status !== 'PENDING' && (
                        <div className="text-center">{getStatusBadge(request.status)}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Outgoing Requests</h2>
              {outgoingRequests.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl p-6 text-gray-500">
                  No outgoing swap requests
                </div>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">
                          To: <span className="font-semibold">{request.respondingUserId?.name}</span>
                        </p>
                        <div className="space-y-2">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">
                              <span className="font-semibold">You offer:</span> {request.mySlotId?.title}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {new Date(request.mySlotId?.startTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-700">
                              <span className="font-semibold">You want:</span> {request.theirSlotId?.title}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                              {new Date(request.theirSlotId?.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
