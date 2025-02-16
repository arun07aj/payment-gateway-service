"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { initiatePhonePePayment } from "@/actions/initiatePhonePePayment";
import { useRouter } from "next/navigation";
import axios from "axios";

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

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transactions");
      console.log("All Transactions:", response.data);
      alert("Check console for transaction data!");
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="flex justify-center">
          <Image
            src="/phonepe.svg"
            alt="PhonePe logo"
            width={360}
            height={76}
            priority
          />
        </div>
        
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
          <a className={styles.primary} onClick={fetchTransactions}>
            Fetch Transactions
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
