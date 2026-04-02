<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string|max:1000']);

        $apiKey = config('services.groq.key');

        if (! $apiKey) {
            return response()->json(['error' => 'API key not configured'], 500);
        }

        $userMessage = $request->input('message');

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => 'Bearer '.$apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post('https://api.groq.com/openai/v1/chat/completions', [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a helpful assistant for Alliance Builders Ltd, a professional construction and real estate company in Bangladesh. Help clients with questions about services, projects, timelines, hotels, resorts, and general inquiries. Be professional, friendly, and concise.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $userMessage,
                        ],
                    ],
                    'max_tokens' => 500,
                    'temperature' => 0.7,
                ]);

            Log::info('Groq status: '.$response->status());

            if ($response->failed()) {
                Log::error('Groq failed: '.$response->body());

                return response()->json(['error' => 'AI service error'], 503);
            }

            $text = $response->json('choices.0.message.content')
                ?? 'Sorry, I could not process that.';

            return response()->json(['reply' => $text]);

        } catch (\Exception $e) {
            Log::error('Groq exception: '.$e->getMessage());

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
