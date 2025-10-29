import React from 'react';

const HistoryPanel = ({ history, onSelect, onClear, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No history yet</p>
              <p className="text-sm text-gray-400 mt-2">Captured objects will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-all group"
                >
                  <img
                    src={item.image}
                    alt={item.result.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors truncate">
                      {item.result.name || 'Unknown Object'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.result.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClear}
              className="w-full py-3 px-6 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
