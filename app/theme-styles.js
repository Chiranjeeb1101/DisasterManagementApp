// theme-styles.js
export const lightTheme = {
    background: '#f8fafc',
    cardBackground: '#ffffff',
    text: '#1e293b',
    subtext: '#64748b',
    border: '#e2e8f0',
    primary: '#1e40af',
    accent: '#3b82f6',
    error: '#dc2626',
    success: '#16a34a',
    switch: {
      trackActive: '#1e40af',
      trackInactive: '#d1d5db',
      thumbActive: '#ffffff',
      thumbInactive: '#f4f4f5',
    },
    shadow: {
      color: '#000',
      opacity: 0.07,
    },
    statusBar: 'dark-content',
    icon: '#475569',
    divider: '#e2e8f0',
  };
  
  export const darkTheme = {
    background: '#0f172a',
    cardBackground: '#1e293b',
    text: '#f8fafc',
    subtext: '#cbd5e1',
    border: '#334155',
    primary: '#60a5fa',
    accent: '#3b82f6',
    error: '#ef4444',
    success: '#22c55e',
    switch: {
      trackActive: '#3b82f6',
      trackInactive: '#475569',
      thumbActive: '#ffffff',
      thumbInactive: '#94a3b8',
    },
    shadow: {
      color: '#000',
      opacity: 0.2,
    },
    statusBar: 'light-content',
    icon: '#cbd5e1',
    divider: '#334155',
  };
  
  export const getThemeColors = (theme) => {
    if (theme === 'light') {
      return {
        background: '#ffffff',
        text: '#000000',
        subtext: '#6b7280',
        cardBackground: '#f9fafb',
        icon: '#4b5563',
        divider: '#e5e7eb',
        switch: {
          trackInactive: '#d1d5db',
          trackActive: '#dc2626',
          thumbInactive: '#f4f4f5',
          thumbActive: '#ffffff',
        },
        error: '#dc2626',
      };
    } else {
      return {
        background: '#1f2937',
        text: '#ffffff',
        subtext: '#9ca3af',
        cardBackground: '#374151',
        icon: '#d1d5db',
        divider: '#4b5563',
        switch: {
          trackInactive: '#4b5563',
          trackActive: '#dc2626',
          thumbInactive: '#9ca3af',
          thumbActive: '#ffffff',
        },
        error: '#ef4444',
      };
    }
  };