import { HelpCircle, ArrowLeft, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, ExternalLink, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I deposit money?",
    answer: "You can deposit money using Mobile Money (MTN or Airtel). Go to the Deposit page, select your payment method, enter the amount, and follow the instructions. Your balance will be updated instantly.",
    category: "Deposits",
  },
  {
    id: "2",
    question: "How long do withdrawals take?",
    answer: "Withdrawals are typically processed within 24 hours. Mobile Money withdrawals are usually instant. Make sure your account details are correct to avoid delays.",
    category: "Withdrawals",
  },
  {
    id: "3",
    question: "What is the minimum bet amount?",
    answer: "The minimum bet amount is UGX 500. There is no maximum limit for single bets, but accumulator bets may have maximum payout limits.",
    category: "Betting",
  },
  {
    id: "4",
    question: "How do virtual bets work?",
    answer: "Virtual bets are placed on computer-simulated matches that run every 5 minutes. The results are determined by a random number generator (RNG) ensuring fair play.",
    category: "Virtual",
  },
  {
    id: "5",
    question: "What happens if my bet is void?",
    answer: "If a match is cancelled or abandoned, your bet will be voided and the stake returned to your account. For accumulator bets, the void selection is removed and odds are recalculated.",
    category: "Betting",
  },
  {
    id: "6",
    question: "How do I claim bonuses?",
    answer: "Visit the Bonuses & Promotions page to see available offers. Some bonuses require a promo code during deposit, while others are automatically applied.",
    category: "Bonuses",
  },
  {
    id: "7",
    question: "I forgot my password. What do I do?",
    answer: "Click 'Forgot Password' on the login screen and enter your email. You'll receive a password reset link. If you don't receive it, check your spam folder or contact support.",
    category: "Account",
  },
  {
    id: "8",
    question: "How can I verify my account?",
    answer: "Account verification is done through your phone number during registration. For enhanced verification, you may be asked to provide additional documents.",
    category: "Account",
  },
];

const categories = ["All", "Account", "Deposits", "Withdrawals", "Betting", "Virtual", "Bonuses"];

const HelpSupportPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">Help & Support</span>
        <div className="w-5" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href="tel:+256800123456"
              className="bg-card border border-border rounded-xl p-4 text-center hover:bg-secondary/50 transition-colors"
            >
              <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Call Us</p>
              <p className="text-xxs text-muted-foreground">24/7 Support</p>
            </a>
            <a
              href="mailto:support@mollybet.com"
              className="bg-card border border-border rounded-xl p-4 text-center hover:bg-secondary/50 transition-colors"
            >
              <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Email</p>
              <p className="text-xxs text-muted-foreground">Get in touch</p>
            </a>
            <button
              className="bg-card border border-border rounded-xl p-4 text-center hover:bg-secondary/50 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">Live Chat</p>
              <p className="text-xxs text-muted-foreground">Coming soon</p>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Frequently Asked Questions</span>
            </div>
            <div className="divide-y divide-border">
              {filteredFaqs.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">No results found</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id}>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <span className="text-xxs text-primary">{faq.category}</span>
                        <p className="text-sm text-foreground">{faq.question}</p>
                      </div>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-3">
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Additional Resources</h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
                <span className="text-sm text-foreground">Betting Rules & Regulations</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
                <span className="text-sm text-foreground">Responsible Gambling</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
                <span className="text-sm text-foreground">Privacy Policy</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
              <a href="#" className="flex items-center justify-between py-2 hover:text-primary transition-colors">
                <span className="text-sm text-foreground">Terms of Service</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-sm text-foreground mb-1">Still need help?</p>
            <p className="text-xs text-muted-foreground mb-3">
              Our support team is available 24/7
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-sm">
                <Phone className="w-4 h-4 inline mr-2" />
                <a href="tel:+256800123456" className="text-primary">+256 800 123 456</a>
              </p>
              <p className="text-sm">
                <Mail className="w-4 h-4 inline mr-2" />
                <a href="mailto:support@mollybet.com" className="text-primary">support@mollybet.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default HelpSupportPage;