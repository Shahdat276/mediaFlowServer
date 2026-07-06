import { Heart, Globe } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 py-4">
        <p className="flex items-center gap-1 text-xs text-muted-foreground text-center sm:text-left">
          &copy; {currentYear} MediaFlow. Built with{" "}
          <Heart className="size-3 text-red-500 fill-red-500 shrink-0" /> by{" "}
          <a
            href="https://shahdat.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Shahdat Hossain
          </a>
        </p>
        <nav className="flex items-center gap-3 sm:gap-4">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
          <a
            href="mailto:shahdat.asg@gmail.com"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <a
            href="https://shahdat.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="size-3" /> Website
          </a>
        </nav>
      </div>
    </footer>
  );
}
