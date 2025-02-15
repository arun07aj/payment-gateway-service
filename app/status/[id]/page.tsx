"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../page.module.css";

const StatusPage = () => {
  const params = useParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      const response = await axios.post("/api/status", { id: params?.id });
      //console.log("Status API response:\n", response);
      setStatus(response.data.status);

      if (response.data.status === "PAYMENT_SUCCESS") {
        toast.success(`Payment Success for Transaction ID: ${response.data.transactionId}`);
      } else {
        toast.error(`Transaction Failed for Transaction ID: ${response.data.transactionId}`);
      }

    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : 'Something went wrong while fetching payment status.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchStatus();
    }
  }, [params?.id]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="flex justify-center">
          <Image src="/phonepe.svg" alt="PhonePe logo" width={360} height={76} priority />
        </div>

        <p style={{ textAlign: "center" }}>PhonePe Payment Status</p>

        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <p style={{ textAlign: "center" }} className="text-lg text-gray-700">Checking Payment Status...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              className={styles.primary}
              onClick={() => {
                setLoading(true);
                setError(null);
                setStatus(null);
                if (params?.id) {
                  fetchStatus();
                }
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            {status === "PAYMENT_SUCCESS" ? (
              <p style={{ textAlign: "center", fontWeight: "bold" }}>TRANSACTION SUCCESSFUL✅</p>
            ) : (
              <p style={{ textAlign: "center", fontWeight: "bold" }}>TRANSACTION FAILED❌</p>
            )}

            <div className="flex justify-center mt-4">
            <Link href="/" passHref>
              <button className={styles.primary}>Back</button>
            </Link> 
            </div>


          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <p>&copy; Arun A J | All rights reserved</p>
        <a href="https://arunaj.co" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/globe.svg" alt="Internet icon" width={16} height={16} />
          arunaj.co
        </a>
      </footer>
    </div>
  );
};

export default StatusPage;
