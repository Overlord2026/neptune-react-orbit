
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TaxDocumentAggregatorPage from '@/pages/TaxDocumentAggregatorPage';
import { DocumentProvider } from '@/components/tax/DocumentContext';
import { mockDocuments } from '@/mocks/documentMocks';

// Mock the document context
jest.mock('@/components/tax/DocumentContext', () => ({
  ...jest.requireActual('@/components/tax/DocumentContext'),
  useDocumentContext: () => ({
    documents: mockDocuments,
    filteredDocuments: mockDocuments['2023'],
    years: ['2023', '2022'],
    selectedYear: '2023',
    setSelectedYear: jest.fn(),
    searchQuery: '',
    setSearchQuery: jest.fn(),
    handleArchiveStatusChange: jest.fn(),
    archivedDocCounts: { '2023': 2, '2022': 1 }
  })
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <DocumentProvider>
        {ui}
      </DocumentProvider>
    </BrowserRouter>
  );
};

describe('TaxDocumentAggregatorPage', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders the document header', () => {
    renderWithProviders(<TaxDocumentAggregatorPage />);
    
    expect(screen.getByText('Tax Document Aggregator')).toBeInTheDocument();
    expect(screen.getByText(/Scan, Upload, Archive, and Organize Your Tax Documents by Year/)).toBeInTheDocument();
  });

  test('renders the document overview card', async () => {
    renderWithProviders(<TaxDocumentAggregatorPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText(/Easily store, categorize, archive, and share/)).toBeInTheDocument();
    });
  });

  test('renders the action sidebar', () => {
    renderWithProviders(<TaxDocumentAggregatorPage />);
    
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Documents/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Scan Documents/i })).toBeInTheDocument();
  });

  test('opens and closes upload dialog', async () => {
    renderWithProviders(<TaxDocumentAggregatorPage />);
    
    const uploadButton = screen.getByRole('button', { name: /Upload Documents/i });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByText('Upload Tax Documents')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Upload Tax Documents')).not.toBeInTheDocument();
    });
  });

  test('opens and closes scan sheet', async () => {
    renderWithProviders(<TaxDocumentAggregatorPage />);
    
    const scanButton = screen.getByRole('button', { name: /Scan Documents/i });
    fireEvent.click(scanButton);
    
    await waitFor(() => {
      expect(screen.getByText('Scan Documents')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Scan Documents')).not.toBeInTheDocument();
    });
  });

  test('filters documents with search', async () => {
    renderWithProviders(<TaxDocumentAggregatorPage />);
    
    const searchInput = screen.getByPlaceholderText('Search documents...');
    fireEvent.change(searchInput, { target: { value: 'W-2' } });
    
    await waitFor(() => {
      const documentsTable = screen.getByRole('table');
      expect(documentsTable).toBeInTheDocument();
    });
  });

  test('toggles AI assistant visibility', async () => {
    renderWithProviders(<TaxDocumentAggregatorPage />);
    
    const aiButton = screen.getByRole('button', { name: /AI Assistant/i });
    fireEvent.click(aiButton);
    
    await waitFor(() => {
      expect(screen.getByText(/AI Document Assistant/i)).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/AI Document Assistant/i)).not.toBeInTheDocument();
    });
  });
});
