import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Onboarding endpoints
  app.post("/api/onboarding/submit", (req, res) => {
    try {
      const onboardingData = req.body;

      // In a real app, this would save to a database
      // For now, just return success with mock insights
      const response = {
        status: "success",
        message: "Onboarding completed successfully",
        onboarding_id: `onboarding_${Date.now()}`,
        insights: [
          "Based on your preferences, we recommend focusing on technology and healthcare sectors.",
          "Your moderate risk tolerance suggests a balanced portfolio approach.",
          "Consider diversifying across different market capitalizations."
        ],
        personalization: {
          recommended_sectors: onboardingData.sector_interests || ['technology'],
          risk_level: onboardingData.risk_tolerance || 5,
          ai_assistance: onboardingData.ai_involvement || 'advisory'
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Onboarding submission error:', error);
      res.status(500).json({
        status: "error",
        message: "Failed to process onboarding data"
      });
    }
  });

  return app;
}
