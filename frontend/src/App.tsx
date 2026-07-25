import { useState, useRef } from 'react';
import { Upload, Activity, AlertCircle, CheckCircle, Loader2, Microscope, Brain } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResultImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const blob = await fetch(selectedImage).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'cell_image.png');

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const resultBlob = await response.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setResultImage(resultUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Microscope className="w-10 h-10 text-white" />
            </div>
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-3">
            AI-Powered Microscopic Cell
            <span className="block text-blue-600 mt-2">Anomaly Detection</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Advanced machine learning system for detecting anomalies in microscopic cell images with precision and speed
          </p>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Upload Image</h2>
            </div>

            {!selectedImage ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Drop your cell image here
                </p>
                <p className="text-sm text-slate-500">
                  or click to browse files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 shadow-md">
                  <img
                    src={selectedImage}
                    alt="Selected cell"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        Detect Anomalies
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-800">Detection Results</h2>
            </div>

            {!resultImage && !loading && (
              <div className="border-3 border-dashed border-slate-300 rounded-xl p-12 text-center">
                <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-500 mb-2">
                  Results will appear here
                </p>
                <p className="text-sm text-slate-400">
                  Upload an image and click "Detect Anomalies" to begin
                </p>
              </div>
            )}

            {loading && (
              <div className="border-3 border-slate-300 rounded-xl p-12 text-center bg-blue-50">
                <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Processing Image
                </p>
                <p className="text-sm text-slate-500">
                  AI is analyzing microscopic cell patterns...
                </p>
              </div>
            )}

            {resultImage && !loading && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">Analysis Complete</h3>
                    <p className="text-emerald-700 text-sm">Anomalies detected and highlighted</p>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200 shadow-md">
                  <img
                    src={resultImage}
                    alt="Detection result"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Upload Image</h4>
              <p className="text-sm text-slate-600">
                Select or drag and drop your microscopic cell image
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">AI Analysis</h4>
              <p className="text-sm text-slate-600">
                Advanced neural networks analyze cellular structures
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">View Results</h4>
              <p className="text-sm text-slate-600">
                Get instant results with highlighted anomalies
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by FastAPI & Advanced Machine Learning</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
