import { Heart, Globe } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-background shrink-0">
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 px-3 sm:px-4 py-2">
        <p className="flex items-center gap-1 text-[10px] text-muted-foreground text-center sm:text-left">
          &copy; {currentYear} MediaFlow. Built with{" "}
          <Heart className="size-2.5 text-red-500 fill-red-500 shrink-0" /> by{" "}
          <a
            href="https://shahdat.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Shahdat Hossain
          </a>
        </p>
        <nav className="flex items-center gap-2 sm:gap-3">
          <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </a>
          <a
            href="mailto:shahdat.asg@gmail.com"
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
          <a
            href="https://shahdat.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="size-2.5" /> Website
          </a>
        </nav>
      </div>
    </footer>
  );
}
