import Head from 'next/head';
import { useRouter } from 'next/router';
// import Styles from '@/styles/Home.module.css'
// import Styles2 from '@/styles/Home.module.css'
export default function Home() {
  const router=useRouter();
  return (
    <>
    <Head>
      <title>LinkSphere</title>
      <link rel='icon' href='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png' />
    </Head>
    <div className='' >
      <div className=' h-screen flex justify-center items-center' >
        <div className=' h-[50vh] flex flex-col justify-center text-[]   ps-12 left flex-1/2'>
          <p className='text-[2rem] '>Connect with friends without Exaggeration</p>
          <p className='text-xl'>A True social media platform, with stories no blufs !</p>

          <div onClick={()=>{
            router.push('/login');  
          }} className="bg-purple-500 w-max p-2  rounded-[10px] mt-4 cursor-pointer hover:bg-purple-800 transition-all duration-300">
            <p className='text-white font-bold  '>Join Now</p>
          </div>
        </div>
        <div className='right flex-1/2 '>
          <img className='h-[50vh]' src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png' alt=''/>
        </div>
      </div>
    </div>
    </>
  );
}
