 //interface HomeProps {
  //count: number;
 //}
import Image from 'next/image'
import  appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg  from '../assets/logo.svg'
import usersAvatarExempleImage  from '../assets/users-avatar-example.png'
import iconCheckImage  from '../assets/icon-check.svg'

export default function Home() {

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center" >
      <main>
        <Image src={logoImg} alt="Nlw Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExempleImage} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+12.592</span> pessoas já estão usando
          </strong>

        </div>

        <form className="mt-10 flex">
          <input type="text" 
          className="flex-1"
          required 
          placeholder="Qual o nome do seu bolão?" />
          <button type="submit">Criar meu bolão</button>
        </form>

        <p>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas</p>

        <div>
          <div>
            <Image src={iconCheckImage} alt="" />
            <div>
              <span>+2.034</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div>
          <Image src={iconCheckImage} alt="" />
            <div>
              <span>+2.034</span>
              <span>Bolões criados</span>
            </div>
          </div>
        </div>

      </main>

      <Image src={appPreviewImg} alt="Dois celulares exibindo uma previa da aplicaçao nlw"  quality={100}/>
    </div>
  )
}

//export const getServerSideProps = async () => {
  //const response = await fetch('http://localhost:3333/pools/count')
  //const data = await response.json()

  //return {
    //props: {
      //count:data.count,

    //}
  //}
//}