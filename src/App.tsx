import { useState, useEffect } from 'react';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Import the component and the local JSON files
import NotionDashboard from './components/NotionDashboard';
import notionDashboardSchema from '../schemas/notionDashboard.schema.json';
import type { NotionDashboardScene } from './types/notionDashboard';

type SceneData = NotionDashboardScene;

function App() {
  const [sceneData, setSceneData] = useState<SceneData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAndValidate = async () => {
      try {
        const sceneFilePath = `/sceneData/notionDashboard.json`;
        const schema = notionDashboardSchema;

        // 1. Fetch scene data from the public folder
        const sceneResponse = await fetch(sceneFilePath);
        if (!sceneResponse.ok) {
          throw new Error(`Failed to fetch scene data: ${sceneResponse.statusText}`);
        }
        const data: SceneData = await sceneResponse.json();

        // 2. Validate data against the imported schema
        const ajv = new Ajv();
        addFormats(ajv); // Add support for formats like "uri"
        const validate = ajv.compile(schema);
        const isValid = validate(data);

        if (!isValid) {
          // Format errors for display
          const errorMessages = validate.errors?.map(e => e.message).join(', ');
          console.error('Schema validation errors:', validate.errors);
          throw new Error(`Scene data is invalid: ${errorMessages}`);
        }

        // 3. Set the data if valid
        setSceneData(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchDataAndValidate();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="App font-sans bg-gray-50 min-h-screen flex items-center justify-center">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md max-w-lg text-center">
          <strong className="font-bold">Validation Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {sceneData && sceneData.type === 'notionDashboard' && (
        <NotionDashboard scene={sceneData} />
      )}
    </div>
  );
}

export default App;
