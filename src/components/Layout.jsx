import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BackgroundMesh from './BackgroundMesh'

export default function Layout() {
  return (
    <>
      <BackgroundMesh />
      <Header />
      <main className="page-wrapper">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
