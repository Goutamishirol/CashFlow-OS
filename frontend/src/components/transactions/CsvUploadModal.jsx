import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UploadCloud, FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { api } from '../../api/client';

export function CsvUploadModal({ isOpen, onClose, businessId, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a valid .csv file.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      setMessage(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Please drop a valid .csv file.');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setMessage(null);
    }
  };

  const handleDownloadSample = () => {
    const sampleCsv = `date,amount,type,description
2026-08-01,15000,EXPENSE,Supplier raw materials
2026-08-05,50000,INCOME,Consulting milestone payment
2026-08-10,3200,EXPENSE,Office utility bill
2026-08-15,18000,INCOME,Software license invoice`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cashflow_sample_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please choose a CSV file first.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setMessage(null);
      const res = await api.uploadTransactionsCsv(selectedFile, businessId);
      setMessage(res || 'Transactions imported successfully');
      setSelectedFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      setError(err.message || 'Failed to import CSV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Transactions (CSV)"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            icon={UploadCloud}
            loading={uploading}
            disabled={!selectedFile}
            onClick={handleUpload}
          >
            Import to Database
          </Button>
        </>
      }
    >
      <div>
        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--rose-bg)',
              color: 'var(--rose-400)',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--emerald-bg)',
              color: 'var(--emerald-400)',
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle size={16} />
            <span>{message}</span>
          </div>
        )}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--border-highlight)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: selectedFile ? 'var(--emerald-bg)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'var(--transition)',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            style={{ display: 'none' }}
          />

          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--indigo-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            <UploadCloud size={24} />
          </div>

          {selectedFile ? (
            <div>
              <div style={{ fontWeight: 600, color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <FileText size={16} />
                {selectedFile.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB — Click to change file
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                Drop your CSV file here, or <span style={{ color: 'var(--cyan-400)' }}>browse</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Supports standard comma-delimited <code>.csv</code> files
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.9rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Required CSV Columns:
            </span>
            <button
              type="button"
              onClick={handleDownloadSample}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--indigo-400)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
              }}
            >
              <Download size={13} />
              Sample CSV
            </button>
          </div>
          <code style={{ fontSize: '0.75rem', color: 'var(--cyan-400)', display: 'block' }}>
            date,amount,type,description
          </code>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
            * Date format: YYYY-MM-DD. Type must be <strong>INCOME</strong> or <strong>EXPENSE</strong>.
          </span>
        </div>
      </div>
    </Modal>
  );
}
