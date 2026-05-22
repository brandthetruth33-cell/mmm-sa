const quotes = new Map();

// Seed a known quote for testing the GET handler without a prior POST.
quotes.set('quote-123', { quoteId: 'quote-123', status: 'pending', createdAt: new Date().toISOString() });

module.exports = { quotes };
