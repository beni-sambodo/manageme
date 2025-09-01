import Background from './Components/Background.js'
import Advantages from './Advantages.js'
// import Comments from "./Comments";
import Footer from './Footer.js'
import Header from './Header.js'
import Heading from './Heading.js'
import LastPage from './LastPage.js'
import Opportunities from './Opportunities.js'
import Tariff from './Tariff.js'
import './index.css'
function Home() {
  return (
    <>
      <Background />
      <Header />
      <Heading />
      <Advantages />
      <Opportunities />
      <Tariff />
      <LastPage />
      <Footer />
    </>
  )
}

export default Home
