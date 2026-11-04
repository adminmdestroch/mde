import { createApp } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import RapportsAnnuels from './components/RapportsAnnuels.vue'

const headerMount = document.getElementById('app-header')
if (headerMount) createApp(Header).mount(headerMount)

const footerMount = document.getElementById('app-footer')
if (footerMount) createApp(Footer).mount(footerMount)

const rapportsMount = document.getElementById('app-rapports')
if (rapportsMount) createApp(RapportsAnnuels).mount(rapportsMount)
