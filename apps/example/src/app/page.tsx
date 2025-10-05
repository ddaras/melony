"use client";

import { useState } from "react";
import { MelonyCard } from "@melony/core";
import { zodSchemaToPrompt } from "@melony/core/zod";
import { z } from "zod";

// Define a weather card schema
const weatherSchema = z.object({
  type: z.literal("weather-card"),
  location: z.string(),
  temperature: z.number(),
  condition: z.string(),
  humidity: z.number().optional(),
});

// Create a weather card component
const WeatherCard: React.FC<z.infer<typeof weatherSchema>> = ({
  location,
  temperature,
  condition,
  humidity,
}) => (
  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 shadow-sm">
    <h3 className="text-lg font-semibold text-blue-800">{location}</h3>
    <div className="flex items-center gap-4 mt-2">
      <span className="text-3xl font-bold text-blue-600">{temperature}°F</span>
      <div>
        <p className="text-blue-700 font-medium">{condition}</p>
        {humidity && <p className="text-sm text-blue-600">Humidity: {humidity}%</p>}
      </div>
    </div>
  </div>
);

// Define a user profile schema
const userProfileSchema = z.object({
  type: z.literal("user-profile"),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url(),
  role: z.string(),
});

// Create a user profile component
const UserProfile: React.FC<z.infer<typeof userProfileSchema>> = ({
  name,
  email,
  avatar,
  role,
}) => (
  <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{email}</p>
        <p className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
          {role}
        </p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [aiResponse, setAiResponse] = useState("");

  // Generate the prompt for AI
  const weatherPrompt = zodSchemaToPrompt({
    type: "weather-card",
    schema: weatherSchema,
    description: "Display current weather information for a location",
    examples: [
      {
        type: "weather-card",
        location: "New York, NY",
        temperature: 72,
        condition: "Partly Cloudy",
        humidity: 65,
      },
    ],
  });

  const userPrompt = zodSchemaToPrompt({
    type: "user-profile",
    schema: userProfileSchema,
    description: "Display user profile information",
    examples: [
      {
        type: "user-profile",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        role: "Software Engineer",
      },
    ],
  });

  const systemPrompt = `You are a helpful assistant. You can use these components:

${weatherPrompt}

${userPrompt}

When users ask about weather, use the weather-card component. When they ask about user information, use the user-profile component.`;

  const simulateAIResponse = () => {
    const responses = [
      "Here's the current weather:\n\n{\"type\": \"weather-card\", \"location\": \"San Francisco, CA\", \"temperature\": 68, \"condition\": \"Sunny\", \"humidity\": 45}",
      "Here's a user profile:\n\n{\"type\": \"user-profile\", \"name\": \"Jane Smith\", \"email\": \"jane@company.com\", \"avatar\": \"https://api.dicebear.com/7.x/avataaars/svg?seed=Jane\", \"role\": \"Product Manager\"}",
      "Current weather in Tokyo:\n\n{\"type\": \"weather-card\", \"location\": \"Tokyo, Japan\", \"temperature\": 75, \"condition\": \"Cloudy\", \"humidity\": 80}\n\nThe weather is quite humid today!",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setAiResponse(randomResponse);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Melony Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Progressive React UI generation from AI responses
          </p>
          <button
            onClick={simulateAIResponse}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Simulate AI Response
          </button>
        </div>

        {aiResponse && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                AI Response:
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {aiResponse}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Rendered Output:
              </h2>
              <MelonyCard
                text={aiResponse}
                components={{
                  "weather-card": WeatherCard,
                  "user-profile": UserProfile,
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            System Prompt:
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
            {systemPrompt}
          </div>
        </div>
      </div>
    </main>
  );
}