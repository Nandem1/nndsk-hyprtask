import { Header } from "@/widgets";
import { ConfigPanelWrapper } from "./ConfigPanelWrapper";

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ConfigPanelWrapper />
      </main>
    </div>
  );
}
