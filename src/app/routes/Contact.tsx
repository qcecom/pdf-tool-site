import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function Contact(){
  useMeta({title:"Contact - nouploadpdf.com",description:"Get in touch via email"});
  return(
    <>
      <Header/>
      <main className="container">
        <h2>Contact</h2>
        <p>Questions or feedback? Email <a href="mailto:hello@nouploadpdf.com">hello@nouploadpdf.com</a>.</p>
      </main>
      <Footer/>
    </>
  );
}
