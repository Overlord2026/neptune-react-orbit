
// Ensure warnings include all required properties
const standardizedWarnings = warnings?.map((warning: any) => ({
  id: warning.id || undefined,
  trapType: warning.trapType || warning.type || 'general',
  severity: warning.severity || 'medium',
  title: warning.title || warning.message || 'Warning',
  description: warning.description || warning.message || 'Tax trap detected',
  details: warning.details || warning.description || 'Tax trap detected',
  financial_impact: warning.financial_impact || 0,
  message: warning.message || warning.description || 'Tax trap detected',
})) || [];
