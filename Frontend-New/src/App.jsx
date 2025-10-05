import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./App.css";

// AI Response Generator
const generateAIResponse = (userMessage) => {
  const messageLower = userMessage.toLowerCase();

  // Knowledge base for common student questions
  const responses = {
    // Science
    photosynthesis:
      "Photosynthesis is the process by which plants convert light energy (usually from the sun) into chemical energy stored in glucose. It occurs in chloroplasts using carbon dioxide and water, producing oxygen as a byproduct. The equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.",

    gravity:
      "Gravity is the fundamental force of attraction between objects with mass. On Earth, it gives objects weight and causes them to fall at 9.8 m/s². Newton's law states that gravitational force is proportional to the product of masses and inversely proportional to the square of distance between them.",

    cell: "A cell is the basic unit of life. There are two main types: prokaryotic (no nucleus, like bacteria) and eukaryotic (has nucleus, like animal and plant cells). Cells contain organelles like mitochondria (energy), ribosomes (protein synthesis), and in plants, chloroplasts (photosynthesis).",

    dna: "DNA (Deoxyribonucleic Acid) is the molecule that carries genetic information. It has a double helix structure with base pairs (A-T, G-C). DNA contains genes that code for proteins and is passed from parents to offspring during reproduction.",

    // Math
    calculus:
      "Calculus is the mathematical study of change. It has two main branches: Differential calculus (studies rates of change and slopes) and Integral calculus (studies accumulation and areas). It's fundamental for physics, engineering, and economics.",

    algebra:
      "Algebra is the branch of mathematics dealing with symbols and rules for manipulating them. It involves solving equations, working with variables, and understanding mathematical relationships. Key concepts include functions, polynomials, and linear equations.",

    pythagorean:
      "The Pythagorean theorem states that in a right triangle, a² + b² = c², where c is the hypotenuse and a, b are the other sides. It's used to calculate distances and is fundamental in geometry and trigonometry.",

    // Programming
    python:
      "Python is a high-level, interpreted programming language known for its readability and versatility. It uses indentation for code blocks, supports multiple programming paradigms, and has extensive libraries for web development, data science, AI, and more.",

    javascript:
      "JavaScript is a programming language that runs in web browsers, enabling interactive web pages. It's also used for server-side development (Node.js). Key features include event-driven programming, dynamic typing, and asynchronous operations.",

    algorithm:
      "An algorithm is a step-by-step procedure for solving a problem or performing a task. Good algorithms are efficient (time and space complexity), correct, and clear. Common examples include sorting algorithms, search algorithms, and pathfinding.",

    // History
    "world war":
      "World War II (1939-1945) was a global conflict involving most nations, including the Allied Powers (US, UK, USSR) and Axis Powers (Germany, Italy, Japan). It resulted in 70-85 million deaths and led to major geopolitical changes including the United Nations formation.",

    renaissance:
      "The Renaissance (14th-17th century) was a cultural movement marking the transition from medieval to modern times. It began in Italy and spread throughout Europe, characterized by renewed interest in classical learning, art, science, and humanism.",

    // English/Writing
    essay:
      "A good essay has three main parts: Introduction (thesis statement), Body paragraphs (supporting evidence and analysis), and Conclusion (summary and final thoughts). Always plan your outline, use clear topic sentences, and cite sources properly.",

    grammar:
      "Grammar is the system of rules governing language structure. Key elements include parts of speech (nouns, verbs, adjectives), sentence structure (subject-verb-object), tenses, punctuation, and agreement between subjects and verbs.",

    // General
    study:
      "Effective study techniques include: 1) Active recall (testing yourself), 2) Spaced repetition (reviewing over time), 3) Pomodoro technique (25-min focused sessions), 4) Teaching others, 5) Taking breaks, 6) Getting enough sleep. Quality over quantity!",

    time: "Time management tips: 1) Prioritize tasks (Eisenhower Matrix), 2) Break large tasks into smaller ones, 3) Use a planner or digital calendar, 4) Eliminate distractions, 5) Set specific goals, 6) Take regular breaks. Remember: work smarter, not harder!",
  };

  // Check for matching keywords
  for (const [keyword, response] of Object.entries(responses)) {
    if (messageLower.includes(keyword)) {
      return response;
    }
  }

  // Greeting responses
  if (messageLower.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm your AI study companion. I'm here to help you with your studies. Ask me about science, math, programming, history, or any subject you need help with!";
  }

  if (
    messageLower.includes("help") ||
    messageLower.includes("what can you do")
  ) {
    return "I can help you with: 📚 Science (biology, chemistry, physics), 🧮 Math (calculus, algebra, geometry), 💻 Programming (Python, JavaScript, algorithms), 📖 History, ✍️ Essay writing, and 📝 Study tips. Just ask me anything!";
  }

  if (messageLower.includes("thank")) {
    return "You're welcome! Happy to help with your studies. Feel free to ask more questions anytime! 😊";
  }

  // Default response
  return "That's an interesting question! While I can provide concise answers on many topics, I'd recommend checking academic resources for in-depth information. Try asking about: photosynthesis, calculus, Python programming, essay writing, or study techniques!";
};

function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: "Introduction to Calculus", timestamp: "2 hours ago" },
    { id: 2, title: "Python Programming Help", timestamp: "Yesterday" },
    { id: 3, title: "Essay Writing Tips", timestamp: "2 days ago" },
  ]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleNewChat = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  const handleSelectConversation = (conversationId) => {
    setCurrentConversation(conversationId);
    // Load messages for selected conversation
    setMessages([]);
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar
          conversations={conversations}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          currentConversation={currentConversation}
        />
        <MainContent messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </ThemeProvider>
  );
}

export default App;
