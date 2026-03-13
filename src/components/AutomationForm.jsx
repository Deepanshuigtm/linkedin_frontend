import { useState } from 'react';
import { Play, Plus, X, Upload, AlertCircle, StopCircle } from 'lucide-react';
import { runScript, stopScript } from '../services/api';

function AutomationForm({ onRunStart, onRunComplete, isRunning }) {
  const [formData, setFormData] = useState({
    loginUrl: 'https://www.linkedin.com/login',
    searchUrls: [''],
    linkedinEmail: '',
    linkedinPassword: '',
    emailSubject: '',
    emailBody: '',
    smtpEmail: '',
    smtpPassword: '',
    outputCsv: 'emails_output.csv',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchUrlChange = (index, value) => {
    const newSearchUrls = [...formData.searchUrls];
    newSearchUrls[index] = value;
    setFormData((prev) => ({
      ...prev,
      searchUrls: newSearchUrls,
    }));
  };

  const addSearchUrl = () => {
    setFormData((prev) => ({
      ...prev,
      searchUrls: [...prev.searchUrls, ''],
    }));
  };

  const removeSearchUrl = (index) => {
    if (formData.searchUrls.length > 1) {
      const newSearchUrls = formData.searchUrls.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        searchUrls: newSearchUrls,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setResumeFile(file);
        setError('');
      } else {
        setError('Please upload a PDF file');
        setResumeFile(null);
      }
    }
  };

  const validateForm = () => {
    if (!formData.linkedinEmail || !formData.linkedinPassword) {
      setError('LinkedIn credentials are required');
      return false;
    }

    if (!formData.emailSubject || !formData.emailBody) {
      setError('Email subject and body are required');
      return false;
    }

    if (!formData.smtpEmail || !formData.smtpPassword) {
      setError('SMTP credentials are required');
      return false;
    }

    if (!resumeFile) {
      setError('Please upload your resume (PDF)');
      return false;
    }

    const validUrls = formData.searchUrls.filter((url) => url.trim() !== '');
    if (validUrls.length === 0) {
      setError('At least one search URL is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    onRunStart();

    try {
      const data = new FormData();
      data.append('login_url', formData.loginUrl);
      data.append('search_urls', JSON.stringify(formData.searchUrls.filter((url) => url.trim() !== '')));
      data.append('linkedin_email', formData.linkedinEmail);
      data.append('linkedin_password', formData.linkedinPassword);
      data.append('email_subject', formData.emailSubject);
      data.append('email_body', formData.emailBody);
      data.append('smtp_email', formData.smtpEmail);
      data.append('smtp_password', formData.smtpPassword);
      data.append('output_csv', formData.outputCsv);
      data.append('resume', resumeFile);

      const response = await runScript(data);
      console.log('Script started:', response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start automation');
      onRunComplete();
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      await stopScript();
      onRunComplete();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to stop automation');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Automation Configuration
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in your details to start the automation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Login URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn Login URL
          </label>
          <input
            type="url"
            name="loginUrl"
            value={formData.loginUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Search URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search URLs
          </label>
          <div className="space-y-2">
            {formData.searchUrls.map((url, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleSearchUrlChange(index, e.target.value)}
                  placeholder="https://www.linkedin.com/search/results/..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.searchUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSearchUrl(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSearchUrl}
            className="mt-2 flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add another URL</span>
          </button>
        </div>

        {/* LinkedIn Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn Email
            </label>
            <input
              type="email"
              name="linkedinEmail"
              value={formData.linkedinEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn Password
            </label>
            <input
              type="password"
              name="linkedinPassword"
              value={formData.linkedinPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Email Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Subject
          </label>
          <input
            type="text"
            name="emailSubject"
            value={formData.emailSubject}
            onChange={handleInputChange}
            placeholder="e.g., Flutter Developer Application"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Body
          </label>
          <textarea
            name="emailBody"
            value={formData.emailBody}
            onChange={handleInputChange}
            rows={6}
            placeholder="Enter your email message..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* SMTP Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Email
            </label>
            <input
              type="email"
              name="smtpEmail"
              value={formData.smtpEmail}
              onChange={handleInputChange}
              placeholder="your.email@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMTP Password / App Password
            </label>
            <input
              type="password"
              name="smtpPassword"
              value={formData.smtpPassword}
              onChange={handleInputChange}
              placeholder="App-specific password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resume (PDF)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {resumeFile ? resumeFile.name : 'Click to upload PDF'}
              </span>
            </label>
          </div>
        </div>

        {/* Output CSV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Output CSV Filename
          </label>
          <input
            type="text"
            name="outputCsv"
            value={formData.outputCsv}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type={isRunning ? 'button' : 'submit'}
          disabled={loading}
          onClick={isRunning ? handleStop : undefined}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isRunning 
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <StopCircle className="w-5 h-5" />
              <span>Stop Automation</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>{loading ? 'Starting...' : 'Run Automation'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AutomationForm;
