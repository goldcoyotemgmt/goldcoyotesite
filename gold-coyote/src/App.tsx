import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  SiSpotify,
  SiApplemusic,
  SiInstagram,
  SiYoutube,
  SiTiktok,
  SiBandcamp,
} from "react-icons/si";
const queryClient = new QueryClient();

const links = [
  { title: "Spotify", url: "https://open.spotify.com/artist/3qH7S6PJ7KdrudT6XxVpYR", icon: <SiSpotify className="w-5 h-5" />, featured: false },
  { title: "Apple Music", url: "https://music.apple.com/us/artist/gold-coyote/1894377717", icon: <SiApplemusic className="w-5 h-5" />, featured: false },
  { title: "YouTube", url: "https://www.youtube.com/channel/UCGcl939j56ECnyxU9A3IroQ", icon: <SiYoutube className="w-5 h-5" />, featured: false },
  { title: "Instagram", url: "https://www.instagram.com/goldcoyotenj", icon: <SiInstagram className="w-5 h-5" />, featured: false },
  { title: "Bandcamp", url: "https://goldcoyote.bandcamp.com/music", icon: <SiBandcamp className="w-5 h-5" />, featured: false },
  { title: "TikTok", url: "https://www.tiktok.com/@goldcoyoteband", icon: <SiTiktok className="w-5 h-5" />, featured: false },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

const STAR_COLORS = [
  "#ffffff", "#ffffff", "#ffffff",
  "#ccd8ff", "#b3c8ff", "#a8d0ff",
  "#ffe8c0", "#ffd59e",
  "#fff4e0", "#e8f0ff",
  "#d0e8ff", "#f0f4ff",
];

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const CLUSTERS = [
  { cx: 20, cy: 15, spread: 6, count: 55 },
  { cx: 75, cy: 30, spread: 5, count: 45 },
  { cx: 55, cy: 70, spread: 7, count: 60 },
  { cx: 10, cy: 60, spread: 4, count: 35 },
  { cx: 85, cy: 80, spread: 5, count: 40 },
];

function Starfield() {
  const stars = useMemo<Star[]>(() => {
    const s: Star[] = [];
    let id = 0;

    // Scattered field stars
    for (let i = 0; i < 320; i++) {
      s.push({
        id: id++,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() < 0.12 ? Math.random() * 2.8 + 1.8 : Math.random() * 1.1 + 0.25,
        duration: Math.random() * 5 + 2,
        delay: Math.random() * 8,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      });
    }

    // Cluster stars
    for (const cluster of CLUSTERS) {
      for (let i = 0; i < cluster.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.5) * cluster.spread;
        s.push({
          id: id++,
          top: `${cluster.cy + Math.sin(angle) * r}%`,
          left: `${cluster.cx + Math.cos(angle) * r}%`,
          size: Math.random() < 0.08 ? Math.random() * 1.8 + 1.2 : Math.random() * 0.8 + 0.2,
          duration: Math.random() * 6 + 2,
          delay: Math.random() * 10,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }

    return s;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Rotating star layer */}
      <div className="starfield-rotate">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              background: star.color,
              boxShadow: `0 0 ${star.size * 1.5}px ${star.color}`,
              "--duration": `${star.duration}s`,
              "--delay": `${star.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

function SignUpModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("https://buttondown.com/api/emails/embed-subscribe/goldcoyote", {
        method: "POST",
        body: data,
        mode: "no-cors",
      });
      onClose();
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-sm border-2 p-8 relative"
        style={{ background: "#0a0a0a", borderColor: "#efbf04" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-lg opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "#efbf04", fontFamily: "Helvetica, Arial, sans-serif" }}
          aria-label="Close"
        >
          ✕
        </button>
        <h2
          className="text-2xl mb-1 text-center"
          style={{ fontFamily: "'Tropical Magic', sans-serif", color: "#efbf04" }}
        >
          Stay in the Loop
        </h2>
        <p className="text-center text-xs tracking-widest uppercase mb-6" style={{ color: "#efbf04", opacity: 0.6 }}>
          Gold Coyote Updates
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            id="bd-email"
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 text-sm bg-transparent border outline-none placeholder:opacity-40 focus:border-[#efbf04] transition-colors"
            style={{
              borderColor: "rgba(239,191,4,0.4)",
              color: "#efbf04",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          />
          {error && (
            <p className="text-xs text-center" style={{ color: "#ff6b6b", fontFamily: "Helvetica, Arial, sans-serif" }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-sm uppercase font-bold tracking-widest transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{
              background: "#efbf04",
              color: "#0a0a0a",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {submitting ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ConfirmationBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed top-6 left-0 right-0 mx-auto z-50 flex items-center gap-3 px-6 py-4 border-2"
      style={{
        background: "#0a0a0a",
        borderColor: "#efbf04",
        fontFamily: "Helvetica, Arial, sans-serif",
        width: "min(90vw, 380px)",
      }}
    >
      <span style={{ color: "#efbf04", fontSize: "1.2rem" }}>✓</span>
      <p className="text-sm tracking-wide flex-1" style={{ color: "#efbf04" }}>
        Check your email to confirm your subscription.
      </p>
      <button
        onClick={onDismiss}
        className="opacity-50 hover:opacity-100 transition-opacity text-base"
        style={{ color: "#efbf04" }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </motion.div>
  );
}

function Home() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <Starfield />
      <div className="min-h-[100dvh] w-full flex flex-col items-center py-12 px-4 relative">

      <div className="w-full max-w-[480px] z-10 flex flex-col items-center">

        {/* Floating door hero */}
        <div className="-mb-12 w-full flex justify-center" style={{ transform: "translateX(-30px)" }}>
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            data-testid="img-door"
          >
            <img
              src="/door-float.png"
              alt="Gold Coyote Studio Door"
              className="w-56 md:w-72 object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)]"
              style={{ filter: "grayscale(100%) contrast(1.05)" }}
            />
          </motion.div>
        </div>

        {/* Band name + tagline */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-center mb-5"
          data-testid="text-header"
        >
          <h1
            className="text-6xl md:text-7xl mb-1"
            style={{
              fontFamily: "'Tropical Magic', sans-serif",
              letterSpacing: "0.02em",
              color: "#efbf04",
            }}
          >
            Gold Coyote
          </h1>
          <p className="text-base md:text-lg tracking-widest uppercase font-medium" style={{ color: "#efbf04" }}>
            Garden State, USA
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col gap-3 mb-16"
        >
          {links.map((link, index) => (
            <motion.a
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.97 }}
              href={link.url}
              target={link.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              data-testid={`link-${link.title.toLowerCase().replace(" ", "-")}`}
              className={`
                gc-link-btn relative flex items-center w-full px-5 py-4 border-2
                transition-colors duration-200 text-sm uppercase
                ${link.featured
                  ? "bg-primary text-primary-foreground border-primary shadow-[4px_4px_0px_hsl(355,58%,6%)] hover:bg-primary/90"
                  : "bg-card/60 text-foreground border-border backdrop-blur-sm shadow-[4px_4px_0px_hsl(355,58%,6%)] hover:bg-card/90 gc-link-border"
                }
              `}
              style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              <div className="absolute left-5 text-current opacity-80">
                {link.icon}
              </div>
              <span className="w-full text-center">{link.title}</span>
            </motion.a>
          ))}

          {/* Sign Up button — part of the list */}
          <motion.button
            variants={itemVariants}
            whileHover={{ opacity: 0.6 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSignUp(true)}
            className="relative flex items-center justify-center w-full px-5 py-4 border-2 text-sm uppercase font-bold tracking-widest mb-16"
            style={{
              background: "#efbf04",
              borderColor: "#efbf04",
              color: "#0a0a0a",
              fontFamily: "Helvetica, Arial, sans-serif",
              letterSpacing: "0.12em",
            }}
          >
            Sign Up For Updates
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showSignUp && (
            <SignUpModal
              onClose={() => setShowSignUp(false)}
              onSuccess={() => setSubscribed(true)}
            />
          )}
          {subscribed && <ConfirmationBanner onDismiss={() => setSubscribed(false)} />}
        </AnimatePresence>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="text-center text-muted-foreground/50 text-xs tracking-widest uppercase pb-8"
          data-testid="text-footer"
        >
          <p>&copy; {new Date().getFullYear()} Gold Coyote. All rights reserved.</p>
        </motion.footer>

      </div>
      </div>
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
