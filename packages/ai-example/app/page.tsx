import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI Chat with OpenRouter</h1>
        <Chat />
      </div>
    </div>
  );
}
