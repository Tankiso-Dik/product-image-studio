import React from 'react';
import type { NotionDashboardScene } from '../types/notionDashboard';

interface NotionDashboardProps {
  scene: NotionDashboardScene;
}

const NotionDashboard: React.FC<NotionDashboardProps> = ({ scene }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f9e8] via-[#e8f5e0] to-[#f5f9f0]">
      {/* Ambient lighting */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-radial-gradient-green top-[-150px] right-[-150px] z-10"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-radial-gradient-yellow bottom-[-200px] left-[-200px] z-10"></div>

      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none bg-grain-texture z-0"></div>

      {/* Main Container */}
      <div className="relative max-w-[900px] w-[90%] text-center z-20">
        {/* Browser Frame */}
        <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-[20px] border border-white border-opacity-30 shadow-xl overflow-hidden mb-10 transform perspective-1000 rotate-x-2 rotate-y--1 hover:rotate-x-1 hover:rotate-y--0.5 hover:scale-102 transition-transform duration-300">
          {/* URL Bar */}
          <div className="flex items-center p-4 md:p-5 bg-gray-50 bg-opacity-80 border-b border-black border-opacity-5">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <input
              type="text"
              className="flex-1 bg-white bg-opacity-80 border border-gray-300 rounded-lg px-4 py-2 font-inter text-sm text-gray-600 font-medium"
              value={scene.browserUrl}
              readOnly
            />
          </div>

          {/* Notion Dashboard Content */}
          <div className="p-8 bg-white min-h-[400px] text-left">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold"></div>
              <div className="text-2xl font-semibold text-gray-900">{scene.dashboardTitle}</div>
            </div>

            <div className="grid gap-6">
              {scene.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-gray-50 bg-opacity-80 rounded-xl p-5 border border-gray-200 border-opacity-80">
                  <div className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="text-lg">{section.emoji}</span>
                    {section.title}
                  </div>
                  <div className="flex flex-col gap-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-lg border border-gray-200 border-opacity-60">
                        <div className={`w-4 h-4 border-2 border-gray-300 rounded-[3px] bg-white ${item.checked ? 'bg-green-500 border-green-500 relative' : ''}`}>
                          {item.checked && <span className="absolute top-[-2px] left-[1px] text-white text-xs font-bold">✓</span>}
                        </div>
                        <div className="text-sm text-gray-700 font-medium">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Typography */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">{scene.mainHeading}</h1>
        <p className="text-xl font-medium text-gray-600 mb-8 leading-relaxed">{scene.subHeading}</p>
      </div>

      {/* Control Buttons (Placeholder - not part of scene data) */}
      <div className="absolute bottom-8 left-8 flex gap-3 z-10">
        <button className="bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-lg px-4 py-2 font-inter text-sm font-medium text-gray-700 shadow-lg transition-all duration-200 hover:bg-white hover:translate-y-[-2px] hover:shadow-xl">Next Scene</button>
        <button className="bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-lg px-4 py-2 font-inter text-sm font-medium text-gray-700 shadow-lg transition-all duration-200 hover:bg-white hover:translate-y-[-2px] hover:shadow-xl">Download JSON</button>
      </div>
    </div>
  );
};

export default NotionDashboard;
