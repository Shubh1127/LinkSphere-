import UserLayout from '@/layout/UserLayout/UserPage';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import Styles from '@/styles/Home.module.css'
// import Styles2 from '@/styles/Home.module.css'
export default function Home() {
  const router=useRouter();
  return (
    <UserLayout>
    <Head>
      <title>WorkHive</title>
      <link rel='icon' href='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png' />
    </Head>
    <div>
      <div>
        
        <p className='text-[4rem] bg-red-500 w-[40vw]'>Welcome to your professional community</p>
      </div>
      <div>
        <div className='h-max border w-max p-1 rounded-2xl bg-blue-500 text-white '><span>google icon</span>Continue with Google</div>
        <div className='h-max'>Sign in with email</div>
        <p>By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement, Privacy Policy, and Cookie Policy.</p>
      </div>
      <div>
        <button>New to WorkHive? <span className='text-blue-500 font-bold cursor-pointer hover:underline'>Join now</span></button>
      </div>
    </div>

    
    </UserLayout>
  );
}
