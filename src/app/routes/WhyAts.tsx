import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useMeta } from "@/app/hooks/useMeta";

export default function WhyAts() {
  useMeta({
    title: "Why ATS - nouploadpdf.com",
    description: "How applicant tracking systems read your PDF and why on-device tools matter",
  });
  return (
    <>
      <Header />
      <main className="container">
        <h2>Why ATS-ready PDFs</h2>
        <p>Applicant Tracking Systems (ATS) scan your CV before a human does. They extract text and compare it with job description keywords.</p>
        <p>Most job portals cap uploads at 2MB, some at 1MB. Keep images small and remove unnecessary pages.</p>
        <p>Use common fonts like Arial, Times New Roman, or Roboto. Exotic or unembedded fonts can disappear during parsing.</p>
        <p>Our tools work entirely on your device. Nothing is uploaded, so your private information stays with you.</p>
      </main>
      <Footer />
    </>
  );
}
