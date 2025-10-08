export default defineAppConfig({
  // App metadata
  appName: "AI Resume Analizer",
  appVersion: "1.0.0",

  // Theme configuration
  //   theme: {
  //     defaultTheme: "light",
  //     colors: {
  //       primary: "#1976D2",
  //       secondary: "#424242",
  //       accent: "#82B1FF",
  //       error: "#FF5252",
  //       info: "#2196F3",
  //       success: "#4CAF50",
  //       warning: "#FB8C00",
  //     },
  //   },

  // Feature flags
  features: {
    enableAIAnalysis: true,
    enableDarkMode: true,
    maxUploadSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ["application/pdf"],
  },

  // Pagination
  pagination: {
    itemsPerPage: 12,
    pageSizes: [12, 24, 48, 96],
  },

  // Table settings
  table: {
    itemsPerPage: 10,
    itemsPerPageOptions: [5, 10, 25, 50, 100],
  },
});
