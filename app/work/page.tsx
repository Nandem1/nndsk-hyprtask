import { Header } from "@/widgets";
import { WorkPageWrapper } from "@views/work";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <WorkPageWrapper />
      </main>
    </div>
  );
}
