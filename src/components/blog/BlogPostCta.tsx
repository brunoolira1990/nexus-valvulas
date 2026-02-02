import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/551142408832";

export function BlogPostCta() {
  return (
    <Card className="border-primary/20 bg-primary/5 overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <p className="text-lg font-medium text-foreground mb-6">
          Precisa de suporte técnico ou cotação para este material? Fale com a Nexus agora no
          WhatsApp.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white shadow-md transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] bg-[#25D366] hover:bg-[#20bd5a]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Abrir WhatsApp
        </a>
      </CardContent>
    </Card>
  );
}
