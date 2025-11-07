import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir directamente a tasks
  redirect('/tasks');
}
