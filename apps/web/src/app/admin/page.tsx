import { cookies } from 'next/headers';

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('palugada-auth-token');
  console.log(token);
  return <div>{token?.value}</div>;
}
