import Head from 'next/head';
export default function Home() {
  return (
    <>
    <Head>
      <title>LinkSphere</title>
      <link rel='icon' href='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png' />
    </Head>
    <div className='bg-black-500'>
     <h1 className='text-red-500'>Hello</h1>
    </div>
    </>
  );
}
