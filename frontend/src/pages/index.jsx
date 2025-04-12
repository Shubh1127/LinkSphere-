import Head from 'next/head';
import { useRouter } from 'next/router';
export default function Home() {
  const router=useRouter();
  return (
    <>
    <Head>
      <title>LinkSphere</title>
      <link rel='icon' href='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png' />
    </Head>
    <div className={StyleSheet.container}>
      <div className="main">
        <div className="mainContainer__left">
          <p>Connect with friends without Exaggeration</p>
          <p>A True social media platform, with stories no blufs !</p>

          <div onClick={()=>{
            router.push('/login');  
          }} className="buttonJoin">
            <p>Join Now</p>
          </div>
        </div>
        <div className="mainContainer__right">
          <img src='' alt=''/>
        </div>
      </div>
    </div>
    </>
  );
}
