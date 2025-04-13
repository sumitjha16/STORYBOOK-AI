const API_BASE_URL = 'https://harrybackend.onrender.com'; //post cloning change it with your backend URL

export const api = {
  healthCheck: async (): Promise<HealthResponse> => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },

  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },

  summarize: async (request: SummaryRequest): Promise<ChatResponse> => {
    console.log('Summary request payload:', request);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Summary request failed:', response.status, errorData);
        throw new Error(`Failed to generate summary: ${JSON.stringify(errorData)}`);
      }

      return response.json();
    } catch (error) {
      console.error('Summarize API error:', error);
      throw error;
    }
  },

  clearMemory: async (): Promise<{ status: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/clear-memory`);
    if (!response.ok) {
      throw new Error('Failed to clear memory');
    }
    return response.json();
  }
};
