import React from "react";
import { Header } from '../../shared/Header'
import { Outlet } from 'react-router-dom'
import { Footer } from '../../shared/Footer'

export const BouquetCreateLayout = () => {
  return (
    <div>
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}
