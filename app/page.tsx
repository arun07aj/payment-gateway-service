"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { initiatePhonePePayment } from "@/actions/initiatePhonePePayment";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  const getRandomIntAmount = () => {
    return Math.floor(Math.random() * (1500 - 10 + 1)) + 10;
  };

  const handlePhonePeTx = async (data: number) => {
    try {
      const result = await initiatePhonePePayment(data);
      if (result) {
        router.push(result.redirectUrl);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          src="/phonepe.svg"
          alt="PhonePe logo"
          width={360}
          height={76}
          priority
        />
        <p style={{ textAlign: "center" }}>
          Payment Integration Testing
        </p>

        <div className={styles.ctas} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <a className={styles.primary} onClick={() => handlePhonePeTx(getRandomIntAmount())} style={{ marginRight: "20px" }}>
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
              Pay (PhonePe)
          </a>
          <a
            href="https://medium.com/@guptagunal/how-to-integrate-the-phonepe-payment-gateway-in-your-next-js-application-046b14c38793"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read Tutorial
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>
          &copy; Arun A J | All rights reserved
        </p>
        <a
          href="https://arunaj.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Internet icon"
            width={16}
            height={16}
          />
          arunaj.co
        </a>
      </footer>
    </div>
  );
}
