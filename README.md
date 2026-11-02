# citizen_dash

A real-time Citizen Information Dashboard with a live AI Chatbot!

Built for the public administration, this dashboard displays four unique data feeds:
- Live Weather
- Live Currency Exchanges
- A Random Citizen Profile
- A Random City Fact

It features a smart assistant integration with HuggingFace, letting users probe the currently presented dashboard context live!

---

## Built with [@avkashhhh/smart-fetch](https://www.npmjs.com/package/@avkashhhh/smart-fetch)

All public API integrations in this dashboard are powered by [`@avkashhhh/smart-fetch`](https://www.npmjs.com/package/@avkashhhh/smart-fetch), a tiny, zero-dependency fetch client providing:
- **Resilient retries**: Exponential backoff on network failures and rate limits (429/5xx).
- **In-memory caching**: 10-minute cache for exchange rates and 5-minute cache for weather forecasts to reduce API load.
- **Request deduplication**: Prevents duplicate concurrent in-flight requests.
- **Graceful error handling**: Custom `TimeoutError` and `HttpError` classes surface user-friendly status messages in the dashboard UI.
