import type { Metadata } from "next";
import "./globals.css";
import { ListsProvider } from "@/contexts/ListsContext";
import { CRMProvider } from "@/contexts/CRMContext";
import { SequencesProvider } from "@/contexts/SequencesContext";

export const metadata: Metadata = {
  title: "End2End - Generación de Leads B2B",
  description: "Plataforma de generación y conversión de leads B2B para PyMEs en Latinoamérica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <CRMProvider>
          <ListsProvider>
            <SequencesProvider>{children}</SequencesProvider>
          </ListsProvider>
        </CRMProvider>
      </body>
    </html>
  );
}
