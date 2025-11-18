import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main>
      <h1>Home</h1>
    </main>
  );
};

export default Home;